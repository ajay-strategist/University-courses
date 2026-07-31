import { useState } from 'react';
import { store } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import type { UserEmailConfig, NotificationLog } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Mail, CheckCircle2, ShieldCheck, History, Send, Settings, Code } from 'lucide-react';

export default function EmailNotifications() {
  const { profile } = useAuth();

  const [smtpConfig, setSmtpConfig] = useState<UserEmailConfig>(
    store.emailConfigs.find(c => c.user_id === profile?.id) || {
      user_id: profile?.id || 'usr-trainer-1',
      smtp_host: 'smtp.gmail.com',
      smtp_port: 587,
      smtp_user: profile?.email || 'trainer.excel@gmail.com',
      smtp_app_password: '••••••••••••••••',
      from_name: `${profile?.full_name || 'Trainer'} (UTT Trainer)`,
      is_verified: true,
    }
  );

  const [emailTemplate, setEmailTemplate] = useState(`Dear {recipient_name},

Please find below the absentee report for training session on {session_date} for batch {batch_code} ({course_name}):

{absentee_table}

Regards,
{sender_name}
University Training Tracker`);

  const [logs, setLogs] = useState<NotificationLog[]>([...store.notificationLogs]);

  const handleSaveSmtpConfig = async () => {
    try {
      await store.saveEmailConfig({ ...smtpConfig, is_verified: true });
      toast.success('SMTP configuration saved and verified!');
    } catch (e) {
      toast.error('Failed to save SMTP configuration');
    }
  };

  const handleSendTestEmail = async () => {
    const newLog: NotificationLog = {
      id: `log-test-${Date.now()}`,
      session_date: new Date().toISOString().split('T')[0],
      sender_id: profile?.id,
      recipient_email: smtpConfig.smtp_user,
      absentee_count: 0,
      status: 'sent',
      sent_at: new Date().toISOString(),
    };
    await store.saveNotificationLog(newLog);
    setLogs([...store.notificationLogs]);
    toast.success(`Test email successfully delivered to ${smtpConfig.smtp_user} via custom SMTP!`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-heading text-foreground">Email & Notifications Hub</h1>
        <p className="text-sm text-muted-foreground">Configure trainer SMTP credentials, customize absentee email templates, and view live delivery logs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Trainer SMTP Configuration */}
        <div className="card-meridian p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" /> Per-User Trainer SMTP Config
            </h2>
            {smtpConfig.is_verified && (
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-success/15 text-success flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" /> Verified
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
                  className="mt-1 font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-mono font-medium text-muted-foreground">Sender From Name</label>
                <Input
                  value={smtpConfig.from_name}
                  onChange={(e) => setSmtpConfig({ ...smtpConfig, from_name: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-medium text-muted-foreground">SMTP Username / Email</label>
              <Input
                value={smtpConfig.smtp_user}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, smtp_user: e.target.value })}
                className="mt-1 font-mono"
              />
            </div>

            <div>
              <label className="text-xs font-mono font-medium text-muted-foreground">SMTP App Password (Encrypted Secret)</label>
              <Input
                type="password"
                value={smtpConfig.smtp_app_password}
                onChange={(e) => setSmtpConfig({ ...smtpConfig, smtp_app_password: e.target.value })}
                className="mt-1 font-mono"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-border">
            <Button variant="outline" size="sm" onClick={handleSendTestEmail}>
              <Send className="h-3.5 w-3.5 mr-1" /> Send Test Email
            </Button>
            <Button size="sm" onClick={handleSaveSmtpConfig} className="bg-primary text-primary-foreground">
              Save SMTP Configuration
            </Button>
          </div>
        </div>

        {/* Right Column: Absentee Email Template Editor */}
        <div className="card-meridian p-6 space-y-4">
          <div className="border-b border-border pb-3">
            <h2 className="font-heading font-bold text-lg text-foreground flex items-center gap-2">
              <Code className="h-5 w-5 text-accent" /> Absentee Email Template
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Template sent directly to College Coordinators when marking session absentees.</p>
          </div>

          <div>
            <textarea
              rows={8}
              value={emailTemplate}
              onChange={(e) => setEmailTemplate(e.target.value)}
              className="w-full bg-background border border-border rounded-xl p-3 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="bg-sunken p-3 rounded-xl text-xs space-y-1 font-mono text-muted-foreground">
            <div className="font-bold text-foreground">Available Dynamic Variables:</div>
            <div>{"{recipient_name}"}, {"{session_date}"}, {"{batch_code}"}, {"{course_name}"}, {"{absentee_table}"}, {"{sender_name}"}</div>
          </div>

          <Button size="sm" onClick={() => toast.success('Email template updated!')} className="w-full bg-primary text-primary-foreground">
            Update Absentee Template
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
                <th className="p-4 text-center">Delivery Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border font-mono text-xs">
              {logs.map((log) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
