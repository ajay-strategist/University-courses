-- ==========================================
-- ACTS Mail Settings Table
-- ==========================================

CREATE TABLE public.uct_mail_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    smtp_host TEXT NOT NULL,
    smtp_port INTEGER NOT NULL,
    smtp_user TEXT NOT NULL,
    smtp_pass TEXT NOT NULL, -- In production, this should ideally be encrypted or stored in Supabase Vault
    from_email TEXT NOT NULL,
    from_name TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES public.uct_profiles(id)
);

-- Ensure only one active mail setting exists
CREATE UNIQUE INDEX uct_mail_settings_single_row ON public.uct_mail_settings((1));

-- Enable RLS
ALTER TABLE public.uct_mail_settings ENABLE ROW LEVEL SECURITY;

-- Policies
-- Only Super Admins can view and update the mail settings
CREATE POLICY "Super Admins can view mail settings"
ON public.uct_mail_settings FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.uct_profiles
    WHERE uct_profiles.id = auth.uid() AND uct_profiles.role = 'super_admin'
  )
);

CREATE POLICY "Super Admins can insert mail settings"
ON public.uct_mail_settings FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.uct_profiles
    WHERE uct_profiles.id = auth.uid() AND uct_profiles.role = 'super_admin'
  )
);

CREATE POLICY "Super Admins can update mail settings"
ON public.uct_mail_settings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.uct_profiles
    WHERE uct_profiles.id = auth.uid() AND uct_profiles.role = 'super_admin'
  )
);
