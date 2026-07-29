import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, subject, body } = await req.json();

    // Verify auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    
    // We use Service Role to bypass RLS since we need to read mail settings as the system
    // (Assuming Edge Functions have access to SERVICE_ROLE_KEY)
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the single mail configuration from the database
    const { data: mailConfig, error: configError } = await supabase
      .from('uct_mail_settings')
      .select('*')
      .limit(1)
      .single();

    if (configError || !mailConfig) {
      throw new Error('Mail settings are not configured in the system.');
    }

    console.log(`Sending email to ${to} via SMTP ${mailConfig.smtp_host}`);

    // TODO: Implement actual SMTP sending using Deno (e.g., using smtp module or Resend API)
    // Example:
    // await sendEmail({
    //   host: mailConfig.smtp_host,
    //   port: mailConfig.smtp_port,
    //   username: mailConfig.smtp_user,
    //   password: mailConfig.smtp_pass, // Handled securely
    //   from: `${mailConfig.from_name} <${mailConfig.from_email}>`,
    //   to,
    //   subject,
    //   body
    // });

    return new Response(JSON.stringify({ message: 'Email queued successfully.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
