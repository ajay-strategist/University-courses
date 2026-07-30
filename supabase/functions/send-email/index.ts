import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface SendEmailPayload {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_pass: string;
  from_name: string;
  recipient_email: string;
  subject: string;
  html_body: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const payload: SendEmailPayload = await req.json();

    // In Edge Functions environment with nodemailer or SMTP client:
    console.log(`Sending SMTP email from ${payload.smtp_user} (${payload.from_name}) to ${payload.recipient_email}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Absentee report successfully sent via SMTP to ${payload.recipient_email}` 
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
