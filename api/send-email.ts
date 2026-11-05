import nodemailer from 'nodemailer';

export interface SendEmailPayload {
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_pass?: string;
  from_name?: string;
  sender_name?: string;
  sender_email?: string;
  reply_to?: string;
  to?: string;
  subject?: string;
  html?: string;
  text?: string;
  verify_only?: boolean;
}

export async function handleSendEmail(payload: SendEmailPayload) {
  const host = payload.smtp_host || process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = Number(payload.smtp_port || process.env.SMTP_PORT || 587);
  const user = payload.smtp_user || process.env.SMTP_USER;
  const pass = payload.smtp_pass || process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error('SMTP Username and App Password are required. Please configure them in Email & Notifications settings.');
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for 587 and others
    auth: {
      user,
      pass,
    },
    tls: {
      // Avoid failing on local self-signed or institutional certs
      rejectUnauthorized: false,
    },
  });

  if (payload.verify_only) {
    await transporter.verify();
    return { success: true, message: 'SMTP credentials verified successfully!' };
  }

  if (!payload.to) {
    throw new Error('Recipient email address is required.');
  }

  if (!payload.subject) {
    throw new Error('Email subject is required.');
  }

  const senderDisplayName = payload.sender_name || payload.from_name || process.env.SMTP_FROM_NAME || 'Team The Strategist';
  const replyToAddress = payload.reply_to || payload.sender_email || user;

  const mailOptions = {
    from: `"${senderDisplayName}" <${user}>`,
    replyTo: replyToAddress,
    to: payload.to,
    subject: payload.subject,
    text: payload.text || (payload.html ? payload.html.replace(/<[^>]*>?/gm, '') : ''),
    html: payload.html || payload.text,
  };

  const info = await transporter.sendMail(mailOptions);

  return {
    success: true,
    messageId: info.messageId,
    response: info.response,
  };
}

// Vercel Serverless Function Handler
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ success: false, error: 'Method not allowed. Use POST.' });
    return;
  }

  try {
    const payload: SendEmailPayload = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const result = await handleSendEmail(payload);
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Serverless send-email error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to send email via SMTP',
    });
  }
}
