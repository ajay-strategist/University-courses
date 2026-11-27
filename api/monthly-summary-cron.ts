import { createClient } from '@supabase/supabase-js';
import { handleSendEmail } from './send-email';
import {
  buildMonthlyToolReports,
  formatIsoToDDMMYYYY,
  getMonthRange,
  type WeeklyApprovalMode,
  type WeeklyReportDataset,
} from '../src/lib/weeklyReportEngine';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
    return;
  }

  // ── Last-day-of-month guard ──────────────────────────────────────────────
  // Vercel cron runs daily at 12:30 UTC; we only proceed on the last day.
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(now.getDate() + 1);
  if (tomorrow.getDate() !== 1) {
    res.status(200).json({
      success: true,
      skipped: true,
      reason: 'Not the last day of the month. Monthly Summary cron will proceed on the last calendar day.',
    });
    return;
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    res.status(500).json({ success: false, error: 'Supabase environment variables not configured.' });
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    const [
      { data: batches },
      { data: colleges },
      { data: courses },
      { data: batchCourses },
      { data: batchCoordinators },
      { data: profiles },
      { data: students },
      { data: sessions },
      { data: attendance },
      { data: assessments },
      { data: assessmentMarks },
      { data: trainerLogs },
      { data: academicSemesters },
      { data: emailConfigs },
      { data: notificationLogs },
    ] = await Promise.all([
      supabase.from('uct_batches').select('*'),
      supabase.from('uct_colleges').select('*'),
      supabase.from('uct_courses').select('*'),
      supabase.from('uct_batch_courses').select('*'),
      supabase.from('uct_batch_coordinators').select('*'),
      supabase.from('uct_profiles').select('*'),
      supabase.from('uct_students').select('*'),
      supabase.from('uct_sessions').select('*'),
      supabase.from('uct_attendance').select('*'),
      supabase.from('uct_assessments').select('*'),
      supabase.from('uct_assessment_marks').select('*'),
      supabase.from('uct_trainer_logs').select('*'),
      supabase.from('uct_academic_semesters').select('*'),
      supabase.from('uct_user_email_config').select('*'),
      supabase
        .from('uct_notification_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300),
    ]);

    // Find verified SMTP config
    const smtpCfg =
      (emailConfigs || []).find((c: any) => c.is_verified) || (emailConfigs || [])[0];

    if (!smtpCfg || !smtpCfg.smtp_user || !smtpCfg.smtp_app_password) {
      res.status(200).json({
        success: false,
        message: 'No verified SMTP configuration found in uct_user_email_config.',
      });
      return;
    }

    const ceoProfile = (profiles || []).find((p: any) => p.role === 'ceo' && p.email);
    const ceoSetting = (notificationLogs || []).find(
      (l: any) => l.notification_type === 'ceo_email_setting'
    );

    const dataset: WeeklyReportDataset = {
      batches: (batches || []) as any[],
      colleges: (colleges || []) as any[],
      courses: (courses || []) as any[],
      batchCourses: (batchCourses || []) as any[],
      batchCoordinators: (batchCoordinators || []) as any[],
      profiles: (profiles || []) as any[],
      students: (students || []) as any[],
      sessions: (sessions || []) as any[],
      attendance: (attendance || []) as any[],
      assessments: (assessments || []) as any[],
      assessmentMarks: (assessmentMarks || []) as any[],
      trainerLogs: (trainerLogs || []) as any[],
      academicSemesters: (academicSemesters || []) as any[],
      ceoEmail: ceoProfile?.email || ceoSetting?.recipient_email || 'info@thestrategist.co.in',
    };

    // Use the current month (since we are on its last day)
    const { monthLabel } = getMonthRange(now);
    const reports = buildMonthlyToolReports(dataset, now);

    if (reports.length === 0) {
      res.status(200).json({
        success: true,
        message: `No active batch/course activity recorded for ${monthLabel}.`,
        processed: 0,
      });
      return;
    }

    // De-duplicate: skip already sent/queued subjects
    const existingSubjects = new Set(
      (notificationLogs || [])
        .filter(
          (l: any) =>
            (l.notification_type === 'monthly_summary' ||
              l.notification_type === 'monthly_summary_pending') &&
            (l.status === 'sent' || l.status === 'pending_approval')
        )
        .map((l: any) => l.subject)
    );

    const pendingReports = reports.filter((r) => !existingSubjects.has(r.subject));
    if (pendingReports.length === 0) {
      res.status(200).json({
        success: true,
        message: 'All monthly reports for this month have already been sent or queued.',
        processed: 0,
      });
      return;
    }

    // Per-Batch & Per-Course controls
    const perToolConfigMap = new Map<string, { active: boolean; mode: WeeklyApprovalMode }>();
    for (const l of notificationLogs || []) {
      if (
        (l as any).notification_type === 'monthly_summary_tool_config' &&
        (l as any).recipient_email &&
        !perToolConfigMap.has((l as any).recipient_email)
      ) {
        const [activePart, modePart] = String((l as any).subject || '').split('|');
        perToolConfigMap.set((l as any).recipient_email, {
          active: activePart === 'inactive' ? false : true,
          mode: modePart === 'without_approval' ? 'without_approval' : 'with_approval',
        });
      }
    }

    const activePendingReports = pendingReports.filter((r) => {
      const cfg = perToolConfigMap.get(r.key);
      return cfg ? cfg.active : true;
    });

    const autoSendReports = activePendingReports.filter((r) => {
      const cfg = perToolConfigMap.get(r.key);
      return (cfg ? cfg.mode : 'with_approval') === 'without_approval';
    });

    const approvalReports = activePendingReports.filter((r) => {
      const cfg = perToolConfigMap.get(r.key);
      return (cfg ? cfg.mode : 'with_approval') === 'with_approval';
    });

    let sentCount = 0;
    for (const r of autoSendReports) {
      if (r.toRecipients.length === 0) continue;
      await handleSendEmail({
        smtp_host: smtpCfg.smtp_host,
        smtp_port: smtpCfg.smtp_port,
        smtp_user: smtpCfg.smtp_user,
        smtp_pass: smtpCfg.smtp_app_password,
        from_name: smtpCfg.from_name || 'Team The Strategist',
        to: r.toRecipients.join(', '),
        cc: r.ccRecipients.join(', '),
        subject: r.subject,
        html: r.html,
      });

      await supabase.from('uct_notification_log').insert({
        batch_id: r.batch.id,
        sender_id: smtpCfg.user_id,
        recipient_email: r.toRecipients.join(', '),
        subject: r.subject,
        notification_type: 'monthly_summary',
        status: 'sent',
        sent_at: new Date().toISOString(),
      });
      sentCount++;
    }

    // WITH APPROVAL REPORTS: Queue & notify Admins
    for (const r of approvalReports) {
      await supabase.from('uct_notification_log').insert({
        batch_id: r.batch.id,
        sender_id: smtpCfg.user_id,
        recipient_email: r.toRecipients.join(', '),
        subject: r.subject,
        notification_type: 'monthly_summary_pending',
        status: 'pending_approval',
      });
    }

    const adminEmails = dataset.profiles
      .filter((p) => p.role === 'admin' && p.email)
      .map((p) => p.email);

    if (approvalReports.length > 0 && adminEmails.length > 0) {
      const sample = approvalReports[0];
      const listHtml = approvalReports
        .map(
          (r) =>
            `<li style="margin-bottom:6px;"><strong>${r.batch.code}</strong> &bull; ${r.course.name} (${r.course.code}) &mdash; <em>${r.totalHoursDelivered} hrs total, ${r.overallAttendancePct ?? '—'}% att</em></li>`
        )
        .join('');

      await handleSendEmail({
        smtp_host: smtpCfg.smtp_host,
        smtp_port: smtpCfg.smtp_port,
        smtp_user: smtpCfg.smtp_user,
        smtp_pass: smtpCfg.smtp_app_password,
        from_name: smtpCfg.from_name || 'Team The Strategist',
        to: adminEmails.join(', '),
        subject: `[Action Required] ${approvalReports.length} Monthly Summary Report(s) Pending Approval (${sample.monthLabel})`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">
            <h2 style="margin-top:0;color:#1e1b4b;">Monthly Summary Reports Ready for Approval</h2>
            <p style="font-size:14px;color:#334155;line-height:1.5;">
              The following <strong>${approvalReports.length} Monthly Summary report(s)</strong> for
              <strong>${sample.monthLabel}</strong> are ready for your review:
            </p>
            <ul style="font-size:13px;color:#1e293b;padding-left:20px;">${listHtml}</ul>
            <p style="font-size:13px;color:#475569;margin-top:16px;">
              Please open <strong>Email &amp; Notifications &rarr; Monthly Summary</strong> in EduCore to review and click <strong>Approve &amp; Send</strong>.
            </p>
          </div>
        `,
      });
    }

    res.status(200).json({
      success: true,
      month: monthLabel,
      sentCount,
      queuedForApproval: approvalReports.length,
      skippedDeactivated: pendingReports.length - activePendingReports.length,
    });
  } catch (err: any) {
    console.error('Monthly summary cron error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Cron execution failed' });
  }
}
