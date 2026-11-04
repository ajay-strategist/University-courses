import type { UserEmailConfig, AbsenteePreview } from '@/types';
import { supabase } from '@/lib/supabase';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  config?: UserEmailConfig;
  sender_name?: string;
  sender_email?: string;
  reply_to?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface VerifySmtpResult {
  success: boolean;
  message?: string;
  error?: string;
}

export const DEFAULT_ABSENTEE_TEMPLATE = `Dear {recipient_name},

Please find below the absentee report

<b>Batch:</b> <b>{batch_code}</b>
<b>Date:</b> <b>{session_date}</b>

{absentee_table}

Regards,
Team The Strategist`;

/**
 * Formats a date string (YYYY-MM-DD) to DD-MM-YYYY format
 */
export function formatDateToDDMMYYYY(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.includes(' to ')) {
    return dateStr.split(' to ').map(formatDateToDDMMYYYY).join(' to ');
  }
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (match) {
    return `${match[3]}-${match[2]}-${match[1]}`;
  }
  return dateStr;
}

/**
 * Sends a real email via the backend / serverless function with nodemailer fallback.
 * Checks /api/send-email first, and if 404/unavailable falls back to Supabase Edge Function send-email.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const payload = {
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    smtp_host: options.config?.smtp_host,
    smtp_port: options.config?.smtp_port,
    smtp_user: options.config?.smtp_user,
    smtp_pass: options.config?.smtp_app_password,
    from_name: options.config?.from_name,
    sender_name: options.sender_name,
    sender_email: options.sender_email,
    reply_to: options.reply_to || options.sender_email,
  };

  // 1. Try local dev / Vercel API endpoint
  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        return { success: true, messageId: data.messageId };
      }
      return { success: false, error: data.error || 'Failed to send email' };
    }

    // If 404 (e.g. running on static preview without serverless function)
    if (res.status === 404) {
      console.warn('/api/send-email not found (404), attempting Supabase Edge Function fallback...');
    } else {
      const errData = await res.json().catch(() => ({}));
      return { success: false, error: errData.error || `HTTP ${res.status}: Failed to send email` };
    }
  } catch (err: any) {
    console.warn('Direct /api/send-email call failed:', err.message);
  }

  // 2. Fallback to Supabase Edge Function
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: payload,
    });
    if (error) {
      return { success: false, error: error.message || 'Edge function error' };
    }
    if (data && data.success) {
      return { success: true, messageId: data.messageId };
    }
    return { success: false, error: data?.error || 'Failed to send email via edge function' };
  } catch (err: any) {
    return { success: false, error: err.message || 'Network error while attempting to send email' };
  }
}

/**
 * Verifies SMTP configuration by connecting and authenticating against the mail server.
 */
export async function verifySmtpConfig(config: UserEmailConfig): Promise<VerifySmtpResult> {
  const payload = {
    verify_only: true,
    smtp_host: config.smtp_host,
    smtp_port: config.smtp_port,
    smtp_user: config.smtp_user,
    smtp_pass: config.smtp_app_password,
    from_name: config.from_name,
  };

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.ok && data.success) {
      return { success: true, message: data.message || 'SMTP verified successfully!' };
    }
    return { success: false, error: data.error || 'SMTP verification failed' };
  } catch (err: any) {
    // Try edge function fallback
    try {
      const { data, error } = await supabase.functions.invoke('send-email', {
        body: payload,
      });
      if (error) return { success: false, error: error.message };
      if (data && data.success) return { success: true, message: data.message };
      return { success: false, error: data?.error || 'Verification failed' };
    } catch (e: any) {
      return { success: false, error: err.message || 'Unable to connect to email verification service' };
    }
  }
}

/**
 * Builds HTML table and content for Absentee Report email.
 */
export function buildAbsenteeReportHtml(params: {
  preview: AbsenteePreview;
  sessionHeaders: string[];
  template?: string;
}): { html: string; text: string } {
  const { preview, sessionHeaders, template } = params;

  // Build clean HTML table
  const tableHeadersHtml = `
    <tr style="background-color: #f1f5f9; color: #475569; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em;">
      <th style="padding: 10px 12px; text-align: left; border-bottom: 2px solid #cbd5e1;">Register No</th>
      <th style="padding: 10px 12px; text-align: left; border-bottom: 2px solid #cbd5e1;">Student Name</th>
      <th style="padding: 10px 12px; text-align: left; border-bottom: 2px solid #cbd5e1;">Class</th>
      ${sessionHeaders.map(h => `<th style="padding: 10px 8px; text-align: center; border-bottom: 2px solid #cbd5e1;">${h}</th>`).join('')}
    </tr>
  `;

  const tableRowsHtml = preview.absentees.map((stu, idx) => {
    const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
    const hourCells = sessionHeaders.map((_, hIdx) => {
      const isAbsent = stu.hours_absent.includes(hIdx);
      if (isAbsent) {
        return `<td style="padding: 8px; text-align: center; border-bottom: 1px solid #e2e8f0;">
          <span style="background-color: #fee2e2; color: #dc2626; font-weight: bold; font-size: 11px; padding: 2px 8px; border-radius: 9999px;">Absent</span>
        </td>`;
      }
      return `<td style="padding: 8px; text-align: center; border-bottom: 1px solid #e2e8f0;">
        <span style="background-color: #dcfce7; color: #16a34a; font-weight: 500; font-size: 11px; padding: 2px 8px; border-radius: 9999px;">Present</span>
      </td>`;
    }).join('');

    return `
      <tr style="background-color: ${bg}; font-size: 13px; color: #1e293b;">
        <td style="padding: 10px 12px; font-family: monospace; font-weight: bold; color: #0284c7; border-bottom: 1px solid #e2e8f0;">${stu.register_no}</td>
        <td style="padding: 10px 12px; font-weight: 500; border-bottom: 1px solid #e2e8f0;">${stu.name}</td>
        <td style="padding: 10px 12px; color: #64748b; border-bottom: 1px solid #e2e8f0;">${stu.class}</td>
        ${hourCells}
      </tr>
    `;
  }).join('');

  const tableHtml = preview.absentees.length > 0 ? `
    <div style="margin: 20px 0; overflow-x: auto; border: 1px solid #cbd5e1; border-radius: 8px;">
      <table style="width: 100%; border-collapse: collapse; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
        <thead>${tableHeadersHtml}</thead>
        <tbody>${tableRowsHtml}</tbody>
      </table>
    </div>
  ` : `<p style="padding: 12px; background-color: #f0fdf4; color: #16a34a; border-radius: 6px; font-weight: bold;">No absentees reported for this session.</p>`;

  // Default template if not supplied
  const rawTemplate = template || DEFAULT_ABSENTEE_TEMPLATE;
  const formattedDate = formatDateToDDMMYYYY(preview.session_date);

  let processedBody = rawTemplate
    .replace(/{recipient_name}|{Coordinator Name}|{coordinator_name}/g, preview.recipient_name || 'College Coordinator')
    .replace(/{session_date}|{DD-MM-YYYY}|{date}/g, formattedDate)
    .replace(/{batch_code}/g, preview.batch_code)
    .replace(/{course_name}/g, preview.course_name)
    .replace(/{sender_name}/g, 'Team The Strategist')
    .replace(/{absentee_table}/g, tableHtml);

  // Convert markdown bold **text** to <b>text</b>
  processedBody = processedBody.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

  // Auto-bold Batch: and Date: if plain
  processedBody = processedBody
    .replace(/(?<!<b>|<strong>)Batch:(?!<\/b>|<\/strong>)/gi, '<b>Batch:</b>')
    .replace(/(?<!<b>|<strong>)Date:(?!<\/b>|<\/strong>)/gi, '<b>Date:</b>');

  // Wrap in clean HTML email container with "Absentees Report" title only
  const fullHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Absentees Report - ${preview.batch_code}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <div style="max-width: 680px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 32px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
    <div style="border-bottom: 2px solid #0f766e; padding-bottom: 12px; margin-bottom: 24px;">
      <h2 style="margin: 0; color: #0f766e; font-size: 22px; font-weight: 700;">Absentees Report</h2>
    </div>

    <div style="font-size: 14px; line-height: 1.6; color: #334155; white-space: pre-line;">
      ${processedBody}
    </div>
  </div>
</body>
</html>
  `.trim();

  // Plain text fallback
  const textTable = preview.absentees.map(
    a => `${a.register_no.padEnd(14)} | ${a.name.padEnd(25)} | ${a.class.padEnd(8)} | Hours: ${a.hours_absent.map(h => sessionHeaders[h] || `H${h}`).join(', ')}`
  ).join('\n');

  const textBody = rawTemplate
    .replace(/<\/?(b|strong)>/gi, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/{recipient_name}|{Coordinator Name}|{coordinator_name}/g, preview.recipient_name || 'College Coordinator')
    .replace(/{session_date}|{DD-MM-YYYY}|{date}/g, formattedDate)
    .replace(/{batch_code}/g, preview.batch_code)
    .replace(/{course_name}/g, preview.course_name)
    .replace(/{sender_name}/g, 'Team The Strategist')
    .replace(/{absentee_table}/g, textTable);

  return { html: fullHtml, text: textBody };
}
