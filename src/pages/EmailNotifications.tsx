import { useState } from 'react';
import { store, generateUUID } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import type { UserEmailConfig, NotificationLog } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { ShieldCheck, History, Send, Settings, Code, Loader2, AlertCircle, Info, RefreshCw } from 'lucide-react';
import { sendEmail, verifySmtpConfig, DEFAULT_ABSENTEE_TEMPLATE } from '@/lib/emailService';

export default function EmailNotifications() {
  const { profile } = useAuth();

  const [smtpConfig, setSmtpConfig] = useState<UserEmailConfig>(() => {
    const existing = store.emailConfigs.find(c => c.user_id === profile?.id) || store.emailConfigs[0];
    if (existing) return existing;
    return {
      user_id: profile?.id || store.profiles[0]?.id || '',
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_user: profile?.email || '',
      smtp_app_password: '',
      from_name: `${profile?.full_name || 'Trainer'} (UTT Trainer)`,
      is_verified: false,
    };
  });

  const [emailTemplate, setEmailTemplate] = useState<string>(() => {
    const saved = localStorage.getItem('uct_absentee_template');
    if (!saved || saved.includes('University Training Tracker') || saved.includes('training session on {session_date}')) {
      localStorage.setItem('uct_absentee_template', DEFAULT_ABSENTEE_TEMPLATE);
      return DEFAULT_ABSENTEE_TEMPLATE;
    }
    return saved;
  });

  const [logs, setLogs] = useState<NotificationLog[]>([...store.notificationLogs]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendingTest, setIsSendingTest] = useState(false);

  const handleSaveSmtpConfig = async () => {
    if (!smtpConfig.smtp_user.trim() || !smtpConfig.smtp_app_password?.trim()) {
      toast.error('Please enter both SMTP Username / Email and App Password.');
      return;
    }

    setIsVerifying(true);
    try {
      const verifyResult = await verifySmtpConfig(smtpConfig);
      if (verifyResult.success) {
        const verifiedConfig = { ...smtpConfig, is_verified: true };
        await store.saveEmailConfig(verifiedConfig);
        setSmtpConfig(verifiedConfig);
        toast.success('SMTP configuration verified and saved successfully!');
      } else {
        const unverifiedConfig = { ...smtpConfig, is_verified: false };
        await store.saveEmailConfig(unverifiedConfig);
        setSmtpConfig(unverifiedConfig);
        toast.error(`SMTP Verification Failed: ${verifyResult.error}`);
      }
    } catch (e: any) {
      toast.error(`Failed to save SMTP configuration: ${e.message}`);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!smtpConfig.smtp_user.trim() || !smtpConfig.smtp_app_password?.trim()) {
      toast.error('Please configure your SMTP Username and App Password first.');
      return;
    }

    setIsSendingTest(true);
    const testLogId = generateUUID();

    try {
      const result = await sendEmail({
        to: smtpConfig.smtp_user,
        subject: `[Test] University Training Tracker SMTP Verification (${new Date().toLocaleTimeString()})`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 24px; background-color: #f8fafc; border: 1px solid #0f766e; border-radius: 12px; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0f766e; margin-top: 0; font-size: 20px;">✓ Test Email Delivered Successfully!</h2>
            <p style="color: #334155; font-size: 14px; line-height: 1.5;">
              Your SMTP credentials configured in <strong>University Training Tracker</strong> are connected and functioning properly.
            </p>
            <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0; font-size: 13px; color: #475569;">
              <p style="margin: 4px 0;"><strong>SMTP Host:</strong> ${smtpConfig.smtp_host}</p>
              <p style="margin: 4px 0;"><strong>SMTP Port:</strong> ${smtpConfig.smtp_port}</p>
              <p style="margin: 4px 0;"><strong>Sender Name:</strong> ${smtpConfig.from_name}</p>
              <p style="margin: 4px 0;"><strong>Sender Account:</strong> ${smtpConfig.smtp_user}</p>
              <p style="margin: 4px 0;"><strong>Sent Timestamp:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 0;">University Training Tracker &bull; Automated Absentee Notification System</p>
          </div>
        `,
        config: smtpConfig,
      });

      const newLog: NotificationLog = {
        id: testLogId,
        session_date: new Date().toISOString().split('T')[0],
        sender_id: profile?.id,
        recipient_email: smtpConfig.smtp_user,
        absentee_count: 0,
        status: result.success ? 'sent' : 'failed',
        error: result.error,
        sent_at: new Date().toISOString(),
      };

      await store.saveNotificationLog(newLog);
      setLogs([...store.notificationLogs]);

      if (result.success) {
        toast.success(`Test email successfully delivered to ${smtpConfig.smtp_user}!`);
      } else {
        toast.error(`SMTP Send Failed: ${result.error}`);
      }
    } catch (err: any) {
      toast.error(`Error sending test email: ${err.message}`);
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleSaveTemplate = () => {
    localStorage.setItem('uct_absentee_template', emailTemplate);
    toast.success('Absentee email template updated and saved!');
  };

  const handleResetTemplate = () => {
    setEmailTemplate(DEFAULT_ABSENTEE_TEMPLATE);
    localStorage.setItem('uct_absentee_template', DEFAULT_ABSENTEE_TEMPLATE);
    toast.success('Template reset to default.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Email & Notifications Hub</h1>
        <p className="text-sm text-muted-foreground">Configure trainer SMTP credentials, customize absentee email templates, and view live delivery audit logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Trainer SMTP Configuration */}
        <div className="card-meridian p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" /> Per-User Trainer SMTP Config
            </h2>
            {smtpConfig.is_verified ? (
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-success/15 text-success flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified
              </span>
            ) : (
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-warning/15 text-warning flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> Unverified
              </span>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono font-medium text-muted-foreground">SMTP Host Server</label>
              <Input
                value={smtpConfig.smtp_host}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, smtp_host: e.target.value })}
                placeholder="smtp.gmail.com"
                className="mt-1 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">SMTP Port</label>
                <Input
                  type="number"
                  value={smtpConfig.smtp_port}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, smtp_port: Number(e.target.value) })}
                  placeholder="587"
                  className="mt-1 font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Sender From Name</label>
                <Input
                  value={smtpConfig.from_name}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, from_name: e.target.value })}
                  placeholder="Trainer Name (UTT)"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-medium text-muted-foreground">SMTP Username / Email</label>
              <Input
                type="email"
                value={smtpConfig.smtp_user}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, smtp_user: e.target.value })}
                placeholder="trainer@gmail.com"
                className="mt-1 font-mono"
              />
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono font-medium text-muted-foreground">SMTP App Password</label>
                <span className="text-[10px] text-muted-foreground font-mono">16-character App Password</span>
              </div>
              <Input
                type="password"
                value={smtpConfig.smtp_app_password || ''}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, smtp_app_password: e.target.value })}
                placeholder="e.g. abcd efgh ijkl mnop"
                className="mt-1 font-mono"
              />
            </div>
          </div>

          <div className="bg-muted/40 border border-border/80 rounded-xl p-3 text-xs text-muted-foreground flex items-start gap-2">
            <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Gmail Tip:</strong> Use your Google <strong>App Password</strong> (from Google Account &gt; Security &gt; 2-Step Verification &gt; App Passwords) with port <strong>587</strong> (STARTTLS) or <strong>465</strong> (SSL).
            </p>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-border">
            <Button variant="outline" size="sm" onClick={handleSendTestEmail} disabled={isSendingTest || isVerifying}>
              {isSendingTest ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Sending...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5 mr-1" /> Send Test Email
                </>
              )}
            </Button>
            <Button size="sm" onClick={handleSaveSmtpConfig} disabled={isVerifying || isSendingTest} className="bg-primary text-primary-foreground">
              {isVerifying ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> Verifying...
                </>
              ) : (
                'Save & Verify SMTP'
              )}
            </Button>
          </div>
        </div>

        {/* Right Column: Absentee Email Template Editor */}
        <div className="card-meridian p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div>
              <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
                <Code className="h-5 w-5 text-accent" /> Absentee Email Template
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Dispatched to College Coordinators when reporting session absentees.</p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleResetTemplate} className="text-xs h-7">
              <RefreshCw className="h-3 w-3 mr-1" /> Reset
            </Button>
          </div>

          <div>
            <textarea
              rows={9}
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              className="w-full bg-background border border-border rounded-xl p-3 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
            />
          </div>

          <div className="bg-sunken p-3 rounded-xl text-xs space-y-1 font-mono text-muted-foreground">
            <div className="font-bold text-foreground">Available Dynamic Variables:</div>
            <div className="text-[11px] leading-relaxed">
              {"{recipient_name}"}, {"{session_date}"}, {"{batch_code}"}, {"{course_name}"}, {"{absentee_table}"}, {"{sender_name}"}
            </div>
          </div>

          <Button size="sm" onClick={handleSaveTemplate} className="w-full bg-primary text-primary-foreground">
            Save Absentee Template
          </Button>
        </div>
      </div>

      {/* Notification Log Table */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold font-heading flex items-center gap-2">
          <History className="h-5 w-5 text-primary" /> Delivery Audit Log (`notification_log`)
        </h2>

        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-mono text-xs uppercase">
              <tr>
                <th className="p-4">Sent Timestamp</th>
                <th className="p-4">Session Date</th>
                <th className="p-4">Recipient Email</th>
                <th className="p-4 text-center">Absentee Count</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4">Details / Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-xs">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-muted-foreground">
                    No emails dispatched yet.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30">
                    <td className="p-4 text-muted-foreground">{new Date(log.sent_at).toLocaleString()}</td>
                    <td className="p-4 font-bold text-foreground">{log.session_date}</td>
                    <td className="p-4 font-bold text-accent">{log.recipient_email}</td>
                    <td className="p-4 text-center font-bold">{log.absentee_count}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full font-bold uppercase ${
                        log.status === 'sent' ? 'bg-success/15 text-success' : 'bg-destructive/15 text-destructive'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground text-[11px] max-w-xs truncate" title={log.error || ''}>
                      {log.error ? (
                        <span className="text-destructive">{log.error}</span>
                      ) : (
                        <span className="text-success">Delivered successfully via SMTP</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
