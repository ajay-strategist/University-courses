import { createClient } from '@supabase/supabase-js';
import { handleSendEmail } from './send-email';
import {
  buildWeeklyToolReports,
  formatIsoToDDMMYYYY,
  type WeeklyApprovalMode,
  type WeeklyReportDataset,
} from '../src/lib/weeklyReportEngine';

export default async function handler(req: any, res: any) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed' });
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
        .limit(200),
    ]);

    // Determine approval mode from latest weekly_summary_mode log (default: with_approval)
    const modeLog = (notificationLogs || []).find(
      (l: any) => l.notification_type === 'weekly_summary_mode'
    );
    const approvalMode: WeeklyApprovalMode =
      modeLog?.subject === 'without_approval' ? 'without_approval' : 'with_approval';

    // Find verified SMTP config (admin or any verified config)
    const smtpCfg =
      (emailConfigs || []).find((c: any) => c.is_verified) || (emailConfigs || [])[0];

    if (!smtpCfg || !smtpCfg.smtp_user || !smtpCfg.smtp_app_password) {
      res.status(200).json({
        success: false,
        message: 'No verified SMTP configuration found in uct_user_email_config.',
      });
      return;
    }

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
      ceoEmail: ceoSetting?.recipient_email || 'ceo@kvjanalytics.com',
    };

    const reports = buildWeeklyToolReports(dataset);
    if (reports.length === 0) {
      res.status(200).json({
        success: true,
        mode: approvalMode,
        message: 'No active batch/tool activity recorded for this reporting week.',
        processed: 0,
      });
      return;
    }

    const existingSubjects = new Set(
      (notificationLogs || [])
        .filter(
          (l: any) =>
            (l.notification_type === 'weekly_summary' ||
              l.notification_type === 'weekly_summary_pending') &&
            (l.status === 'sent' || l.status === 'pending_approval')
        )
        .map((l: any) => l.subject)
    );

    const pendingReports = reports.filter((r) => !existingSubjects.has(r.subject));
    if (pendingReports.length === 0) {
      res.status(200).json({
        success: true,
        mode: approvalMode,
        message: 'All weekly reports for this week have already been sent or queued.',
        processed: 0,
      });
      return;
    }

    if (approvalMode === 'without_approval') {
      let sentCount = 0;
      for (const r of pendingReports) {
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
          notification_type: 'weekly_summary',
          status: 'sent',
          sent_at: new Date().toISOString(),
        });
        sentCount++;
      }

      res.status(200).json({
        success: true,
        mode: approvalMode,
        sentCount,
      });
      return;
    }

    // WITH APPROVAL MODE: Queue in uct_notification_log & notify Admin(s)
    for (const r of pendingReports) {
      await supabase.from('uct_notification_log').insert({
        batch_id: r.batch.id,
        sender_id: smtpCfg.user_id,
        recipient_email: r.toRecipients.join(', '),
        subject: r.subject,
        notification_type: 'weekly_summary_pending',
        status: 'pending_approval',
      });
    }

    const adminEmails = dataset.profiles
      .filter((p) => p.role === 'admin' && p.email)
      .map((p) => p.email);

    if (adminEmails.length > 0) {
      const sample = pendingReports[0];
      const listHtml = pendingReports
        .map(
          (r) =>
            `<li style="margin-bottom:6px;"><strong>${r.batch.code}</strong> &bull; ${r.course.name} (${r.course.code}) &mdash; <em>${r.currWeekHoursDelivered} hrs, ${r.currWeekAttendancePct ?? '—'}% att</em></li>`
        )
        .join('');

      await handleSendEmail({
        smtp_host: smtpCfg.smtp_host,
        smtp_port: smtpCfg.smtp_port,
        smtp_user: smtpCfg.smtp_user,
        smtp_pass: smtpCfg.smtp_app_password,
        from_name: smtpCfg.from_name || 'Team The Strategist',
        to: adminEmails.join(', '),
        subject: `[Action Required] ${pendingReports.length} Weekly Summary Report(s) Pending Approval (${formatIsoToDDMMYYYY(sample.weekStart)} to ${formatIsoToDDMMYYYY(sample.weekEnd)})`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;">
            <h2 style="margin-top:0;color:#103C35;">Weekly Summary Reports Ready for Approval</h2>
            <p style="font-size:14px;color:#334155;line-height:1.5;">
              The following <strong>${pendingReports.length} Weekly Summary report(s)</strong> for
              <strong>${formatIsoToDDMMYYYY(sample.weekStart)} to ${formatIsoToDDMMYYYY(sample.weekEnd)}</strong>
              are ready for your review:
            </p>
            <ul style="font-size:13px;color:#1e293b;padding-left:20px;">${listHtml}</ul>
            <p style="font-size:13px;color:#475569;margin-top:16px;">
              Please open <strong>Email &amp; Notifications &rarr; Weekly Summary</strong> in EduCore to review and click <strong>Approve &amp; Send</strong>.
            </p>
          </div>
        `,
      });
    }

    res.status(200).json({
      success: true,
      mode: approvalMode,
      queuedForApproval: pendingReports.length,
    });
  } catch (err: any) {
    console.error('Weekly summary cron error:', err);
    res.status(500).json({ success: false, error: err?.message || 'Cron execution failed' });
  }
}
