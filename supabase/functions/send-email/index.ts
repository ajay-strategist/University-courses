import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer@^6.9.16";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendEmailPayload {
  smtp_host?: string;
  smtp_port?: number;
  smtp_user?: string;
  smtp_pass?: string;
  from_name?: string;
  to?: string;
  recipient_email?: string;
  subject?: string;
  html?: string;
  html_body?: string;
  text?: string;
  verify_only?: boolean;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: SendEmailPayload = await req.json();

    const host = payload.smtp_host || Deno.env.get("SMTP_HOST") || "smtp.gmail.com";
    const port = Number(payload.smtp_port || Deno.env.get("SMTP_PORT") || 587);
    const user = payload.smtp_user || Deno.env.get("SMTP_USER");
    const pass = payload.smtp_pass || Deno.env.get("SMTP_PASS");
    const fromName = payload.from_name || Deno.env.get("SMTP_FROM_NAME") || "University Training Tracker";

    if (!user || !pass) {
      throw new Error("SMTP user and password (or App Password) are required.");
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    if (payload.verify_only) {
      await transporter.verify();
      return new Response(
        JSON.stringify({ success: true, message: "SMTP credentials verified successfully!" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const recipient = payload.to || payload.recipient_email;
    if (!recipient) {
      throw new Error("Recipient email is required.");
    }

    const info = await transporter.sendMail({
      from: `"${fromName}" <${user}>`,
      to: recipient,
      subject: payload.subject || "University Training Tracker Notification",
      text: payload.text,
      html: payload.html || payload.html_body || payload.text,
    });

    return new Response(
      JSON.stringify({
        success: true,
        messageId: info.messageId,
        message: `Email successfully sent to ${recipient}`,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error("send-email edge function error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message || "Failed to send email" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
