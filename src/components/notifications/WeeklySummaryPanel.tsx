import { useState, useMemo } from 'react';
import { store, generateUUID } from '@/lib/store';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Calendar,
  Send,
  Eye,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Loader2,
  X,
  Sparkles,
  Check,
} from 'lucide-react';
import { sendEmail } from '@/lib/emailService';
import {
  buildWeeklyToolReports,
  formatIsoToDDMMYYYY,
  getReportingWeekRange,
  type WeeklyApprovalMode,
  type WeeklyToolReport,
} from '@/lib/weeklyReportEngine';

interface WeeklySummaryPanelProps {
  onLogCreated?: () => void;
}

export function WeeklySummaryPanel({ onLogCreated }: WeeklySummaryPanelProps) {
  const { profile } = useAuth();
  const isAdmin = profile?.role === 'admin';

  // Active / Deactivated toggle persisted locally + synced to Supabase for Saturday 6 PM Cron
  const [isWeeklyActive, setIsWeeklyActive] = useState<boolean>(() => {
    const remoteActive = store.notificationLogs.find(
      (l: any) => (l as any).notification_type === 'weekly_summary_active'
    ) as any;
    if (remoteActive?.subject === 'inactive') return false;
    if (remoteActive?.subject === 'active') return true;
    const saved = localStorage.getItem('uct_weekly_summary_active');
    return saved === 'inactive' ? false : true;
  });
  const [isSavingActive, setIsSavingActive] = useState(false);

  // Approval mode persisted locally + synced to Supabase uct_notification_log for Saturday 6 PM Cron
  const [approvalMode, setApprovalMode] = useState<WeeklyApprovalMode>(() => {
    const remoteSetting = store.notificationLogs.find(
      (l: any) => (l as any).notification_type === 'weekly_summary_mode'
    ) as any;
    if (remoteSetting?.subject === 'without_approval') return 'without_approval';
    if (remoteSetting?.subject === 'with_approval') return 'with_approval';
    const saved = localStorage.getItem('uct_weekly_approval_mode');
    return saved === 'without_approval' ? 'without_approval' : 'with_approval';
  });
  const [isSavingMode, setIsSavingMode] = useState(false);

  // Reporting week reference date
  const [refDate, setRefDate] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')}`;
  });

  const weekRange = useMemo(() => getReportingWeekRange(refDate), [refDate]);

  // Build active Batch + Tool reports for the selected week
  const reports = useMemo(() => {
    const ceoEmail = localStorage.getItem('uct_ceo_email') || 'ceo@kvjanalytics.com';
    return buildWeeklyToolReports(
      {
        batches: store.batches,
        colleges: store.colleges,
        courses: store.courses,
        batchCourses: store.batchCourses,
        batchCoordinators: store.batchCoordinators,
        profiles: store.profiles,
        students: store.students,
        sessions: store.sessions,
        attendance: store.attendance,
        assessments: store.assessments,
        assessmentMarks: store.assessmentMarks,
        trainerLogs: store.trainerLogs,
        academicSemesters: store.academicSemesters,
        ceoEmail,
      },
      refDate
    );
  }, [
    refDate,
    store.batches.length,
    store.sessions.length,
    store.trainerLogs.length,
    store.assessments.length,
    store.assessmentMarks.length,
  ]);

  // Track sent subjects in this session + from notificationLogs
  const [sentKeys, setSentKeys] = useState<Record<string, boolean>>({});
  const [sendingKey, setSendingKey] = useState<string | null>(null);
  const [isSendingAll, setIsSendingAll] = useState(false);

  // Preview Modal state
  const [previewReport, setPreviewReport] = useState<WeeklyToolReport | null>(null);
  const [editTo, setEditTo] = useState('');
  const [editCc, setEditCc] = useState('');

  const handleToggleActive = async (nextActive: boolean) => {
    setIsWeeklyActive(nextActive);
    localStorage.setItem('uct_weekly_summary_active', nextActive ? 'active' : 'inactive');
    setIsSavingActive(true);
    try {
      await supabase.from('uct_notification_log').insert({
        id: generateUUID(),
        sender_id: profile?.id || null,
        recipient_email: 'system@educore',
        subject: nextActive ? 'active' : 'inactive',
        notification_type: 'weekly_summary_active',
        status: 'sent',
        sent_at: new Date().toISOString(),
      });
      toast.success(
        nextActive
          ? 'Weekly Summary Mail Activated'
          : 'Weekly Summary Mail Deactivated (Saturday 6 PM Cron paused)'
      );
    } catch (err) {
      console.warn('Could not sync weekly active state to DB:', err);
    } finally {
      setIsSavingActive(false);
    }
  };

  const handleModeChange = async (mode: WeeklyApprovalMode) => {
    setApprovalMode(mode);
    localStorage.setItem('uct_weekly_approval_mode', mode);
    setIsSavingMode(true);
    try {
      await supabase.from('uct_notification_log').insert({
        id: generateUUID(),
        sender_id: profile?.id || null,
        recipient_email: 'system@educore',
        subject: mode,
        notification_type: 'weekly_summary_mode',
        status: 'sent',
        sent_at: new Date().toISOString(),
      });
      toast.success(
        mode === 'with_approval'
          ? 'Weekly Mail set to With Approval (Saturday 6:00 PM IST)'
          : 'Weekly Mail set to Without Approval (Auto-Send Saturday 6:00 PM IST)'
      );
    } catch (err) {
      console.warn('Could not sync weekly mode to DB:', err);
    } finally {
      setIsSavingMode(false);
    }
  };

  const getReportStatus = (report: WeeklyToolReport): 'sent' | 'pending_approval' | 'ready' => {
    if (sentKeys[report.key]) return 'sent';
    const matchingLogs = store.notificationLogs.filter((l: any) => l.subject === report.subject);
    if (matchingLogs.some((l) => l.status === 'sent')) return 'sent';
    if (matchingLogs.some((l: any) => l.status === 'pending_approval')) return 'pending_approval';
    return 'ready';
  };

  const dispatchReport = async (report: WeeklyToolReport, customTo?: string, customCc?: string) => {
    const smtpCfg =
      store.emailConfigs.find((c) => c.user_id === profile?.id && c.is_verified) ||
      store.emailConfigs.find((c) => c.is_verified) ||
      store.emailConfigs[0];

    if (!smtpCfg || !smtpCfg.smtp_user) {
      throw new Error('No verified SMTP configuration found. Please verify SMTP settings first.');
    }

    const toStr = customTo !== undefined ? customTo.trim() : report.toRecipients.join(', ');
    const ccStr = customCc !== undefined ? customCc.trim() : report.ccRecipients.join(', ');

    if (!toStr) {
      throw new Error(`No College Coordinator email assigned for batch ${report.batch.code}.`);
    }

    const res = await sendEmail({
      config: smtpCfg,
      to: toStr,
      cc: ccStr || undefined,
      subject: report.subject,
      html: report.html,
    });

    if (!res.success) {
      throw new Error(res.error || 'SMTP dispatch failed');
    }

    await store.saveNotificationLog({
      id: generateUUID(),
      sender_id: profile?.id || smtpCfg.user_id,
      recipient_email: toStr,
      session_date: `${report.weekStart} to ${report.weekEnd}`,
      absentee_count: report.repeatedAbsentees.length,
      status: 'sent',
      sent_at: new Date().toISOString(),
    });

    // Also log subject for cron idempotency
    try {
      await supabase.from('uct_notification_log').insert({
        id: generateUUID(),
        batch_id: report.batch.id,
        sender_id: profile?.id || smtpCfg.user_id,
        recipient_email: toStr,
        subject: report.subject,
        notification_type: 'weekly_summary',
        status: 'sent',
        sent_at: new Date().toISOString(),
      });
    } catch {
      // ignore if schema differs
    }

    setSentKeys((prev) => ({ ...prev, [report.key]: true }));
    onLogCreated?.();
  };

  const handleOpenPreview = (report: WeeklyToolReport) => {
    setPreviewReport(report);
    setEditTo(report.toRecipients.join(', '));
    setEditCc(report.ccRecipients.join(', '));
  };

  const handleSendSingle = async (report: WeeklyToolReport, customTo?: string, customCc?: string) => {
    setSendingKey(report.key);
    try {
      await dispatchReport(report, customTo, customCc);
      toast.success(`Weekly Summary sent for ${report.batch.code} (${report.course.name})!`);
      if (previewReport?.key === report.key) {
        setPreviewReport(null);
      }
    } catch (err: any) {
      toast.error('Failed to send Weekly Summary', { description: err.message });
    } finally {
      setSendingKey(null);
    }
  };

  const handleApproveAndSendAll = async () => {
    const unsent = reports.filter((r) => getReportStatus(r) !== 'sent');
    if (unsent.length === 0) {
      toast.info('All active weekly reports for this week have already been sent.');
      return;
    }

    setIsSendingAll(true);
    let sent = 0;
    let failed = 0;
    for (const r of unsent) {
      try {
        await dispatchReport(r);
        sent++;
      } catch (err: any) {
        failed++;
        console.error(`Failed weekly report for ${r.batch.code} (${r.course.name}):`, err);
      }
    }
    setIsSendingAll(false);
    if (sent > 0) {
      toast.success(`Approved & sent ${sent} Weekly Summary report${sent === 1 ? '' : 's'}!`);
    }
    if (failed > 0) {
      toast.error(`${failed} report(s) failed to send. Check coordinator emails & SMTP settings.`);
    }
  };

  return (
    <div className="card-meridian p-6 space-y-5">
      {/* Header & Schedule Mode Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between border-b border-border pb-4 gap-4">
        <div>
          <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Weekly Summary Mail (Saturday 6:00 PM IST)
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Per-Batch &amp; Per-Active-Tool weekly report (Current Semester, Mon–Sat). Skips tools with no weekly activity.
          </p>
        </div>

        {/* Active/Deactivate + 2-Type Approval Mode Controls */}
        {isAdmin && (
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Activate / Deactivate Toggle */}
            <div className="flex items-center gap-1 bg-sunken p-1.5 rounded-2xl border border-border">
              <button
                type="button"
                disabled={isSavingActive}
                onClick={() => handleToggleActive(true)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isWeeklyActive
                    ? 'bg-success text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Active
              </button>
              <button
                type="button"
                disabled={isSavingActive}
                onClick={() => handleToggleActive(false)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  !isWeeklyActive
                    ? 'bg-destructive text-white shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Deactivated
              </button>
            </div>

            {/* 2-Type Approval Mode Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 bg-sunken p-1.5 rounded-2xl border border-border">
              <span className="text-[11px] font-mono font-semibold text-muted-foreground px-2 uppercase">
                Sat 6 PM Mode:
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={isSavingMode || !isWeeklyActive}
                  onClick={() => handleModeChange('with_approval')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 ${
                    approvalMode === 'with_approval'
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" /> With Approval
                </button>
                <button
                  type="button"
                  disabled={isSavingMode || !isWeeklyActive}
                  onClick={() => handleModeChange('without_approval')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 ${
                    approvalMode === 'without_approval'
                      ? 'bg-accent text-accent-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Send className="h-3.5 w-3.5" /> Without Approval (Auto)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mode Explanation Banner */}
      <div className={`text-xs rounded-xl px-4 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border ${
        !isWeeklyActive
          ? 'bg-destructive/10 border-destructive/30 text-destructive'
          : 'bg-muted/40 border-border/80 text-muted-foreground'
      }`}>
        <span>
          {!isWeeklyActive ? (
            <>
              <strong>Weekly Summary Mail is Deactivated:</strong> Automated Saturday 6:00 PM IST scheduling and sending are paused. Click <strong>Active</strong> above to re-enable.
            </>
          ) : approvalMode === 'with_approval' ? (
            <>
              <strong className="text-foreground">With Approval:</strong> Every Saturday at 6:00 PM IST, active reports are queued for Admin review and you receive an approval alert before they are sent.
            </>
          ) : (
            <>
              <strong className="text-foreground">Without Approval (Auto-Send):</strong> Every Saturday at 6:00 PM IST, active reports are automatically emailed to College Coordinators (CC: Trainer, Admin, CEO).
            </>
          )}
        </span>
      </div>

      {/* Week Selector & Bulk Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-sunken/40 p-3.5 rounded-2xl border border-border/70">
        <div className="flex flex-wrap items-center gap-2.5">
          <Calendar className="h-4 w-4 text-primary" />
          <span className="text-xs font-mono font-semibold text-foreground">Reporting Week:</span>
          <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-bold border border-primary/20">
            Mon {formatIsoToDDMMYYYY(weekRange.weekStart)} &rarr; Sat {formatIsoToDDMMYYYY(weekRange.weekEnd)}
          </span>
          <Input
            type="date"
            value={refDate}
            onChange={(e) => e.target.value && setRefDate(e.target.value)}
            className="w-36 h-8 text-xs font-mono bg-background"
            title="Pick any date inside the desired Mon–Sat week"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => {
              const d = new Date();
              d.setDate(d.getDate() - 7);
              setRefDate(
                `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
                  d.getDate()
                ).padStart(2, '0')}`
              );
            }}
            className="h-8 text-[11px] font-mono rounded-xl"
          >
            Previous Week
          </Button>
        </div>

        {reports.length > 0 && (
          <Button
            size="sm"
            onClick={handleApproveAndSendAll}
            disabled={isSendingAll || !isWeeklyActive}
            className="bg-primary text-primary-foreground text-xs font-semibold shadow-xs"
          >
            {isSendingAll ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Sending All...
              </>
            ) : (
              <>
                <Check className="h-3.5 w-3.5 mr-1.5" /> Approve &amp; Send All ({reports.filter((r) => getReportStatus(r) !== 'sent').length})
              </>
            )}
          </Button>
        )}
      </div>

      {/* Active Batch + Tool Reports List */}
      {reports.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-border rounded-2xl bg-sunken/10 space-y-1.5">
          <Calendar className="h-7 w-7 text-muted-foreground/40 mx-auto" />
          <p className="text-xs font-semibold text-foreground">
            No batch/tool activity recorded for Mon {formatIsoToDDMMYYYY(weekRange.weekStart)} to Sat {formatIsoToDDMMYYYY(weekRange.weekEnd)}.
          </p>
          <p className="text-[11px] text-muted-foreground">
            Per the Activity Gate rule, Weekly Summary emails are only generated for tools with sessions, trainer logs, or assessments during that week.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {reports.map((r) => {
            const status = getReportStatus(r);
            return (
              <div
                key={r.key}
                className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all"
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-heading font-bold text-sm text-foreground">{r.batch.code}</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-primary/10 text-primary font-semibold">
                      Sem {r.semester}
                    </span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-accent/15 text-accent font-semibold">
                      {r.course.name} ({r.course.code})
                    </span>
                    {status === 'sent' ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-success/15 text-success border border-success/25 font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Sent
                      </span>
                    ) : status === 'pending_approval' ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-warning/15 text-warning border border-warning/25 font-bold flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Pending Approval
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
                        Ready to Review
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono flex flex-wrap gap-x-3 gap-y-0.5">
                    <span>Students: <strong className="text-foreground">{r.totalStudents}</strong></span>
                    <span>Week Att: <strong className="text-foreground">{r.currWeekAttendancePct !== null ? `${r.currWeekAttendancePct}%` : '—'}</strong></span>
                    <span>Week Hrs: <strong className="text-foreground">{r.currWeekHoursDelivered} hrs</strong></span>
                    <span>Risk Flagged: <strong className={r.riskRows.length > 0 ? 'text-destructive' : 'text-success'}>{r.riskRows.length}</strong></span>
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    <strong>TO:</strong> {r.toRecipients.join(', ') || 'No College Coordinator email'}
                    {r.ccRecipients.length > 0 && (
                      <> &bull; <strong>CC:</strong> {r.ccRecipients.join(', ')}</>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleOpenPreview(r)}
                    className="h-8 text-xs rounded-xl"
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleSendSingle(r)}
                    disabled={sendingKey === r.key || isSendingAll || !isWeeklyActive}
                    className="h-8 text-xs rounded-xl bg-primary text-primary-foreground"
                  >
                    {sendingKey === r.key ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5 mr-1" /> {status === 'sent' ? 'Resend' : 'Approve & Send'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Email Preview & Approval Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col my-auto overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-card shrink-0">
              <div>
                <h3 className="text-base font-bold font-heading text-foreground">
                  Weekly Summary Preview &mdash; {previewReport.batch.code} ({previewReport.course.name})
                </h3>
                <p className="text-xs text-muted-foreground font-mono">{previewReport.subject}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setPreviewReport(null)} className="h-8 w-8 rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Editable TO / CC */}
            <div className="p-3.5 bg-muted/30 border-b border-border grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs shrink-0">
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">TO (College Coordinator)</label>
                <Input value={editTo} onChange={(e) => setEditTo(e.target.value)} className="mt-1 h-8 text-xs font-mono bg-background" />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase text-muted-foreground font-semibold">CC (Trainer, Admin, CEO)</label>
                <Input value={editCc} onChange={(e) => setEditCc(e.target.value)} className="mt-1 h-8 text-xs font-mono bg-background" />
              </div>
            </div>

            {/* Isolated HTML Preview */}
            <div className="flex-1 overflow-hidden bg-slate-100">
              <iframe
                title="Weekly Summary Email Preview"
                srcDoc={previewReport.html}
                className="w-full h-[58vh] border-0"
              />
            </div>

            {/* Pinned Footer */}
            <div className="p-4 border-t border-border bg-card flex justify-end gap-2 shrink-0">
              <Button variant="outline" onClick={() => setPreviewReport(null)}>
                Close
              </Button>
              <Button
                onClick={() => handleSendSingle(previewReport, editTo, editCc)}
                disabled={sendingKey === previewReport.key}
                className="bg-primary text-primary-foreground font-semibold"
              >
                {sendingKey === previewReport.key ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 mr-1.5" /> Approve &amp; Send Email
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
