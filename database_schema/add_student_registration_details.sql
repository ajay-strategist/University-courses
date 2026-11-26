-- =====================================================================================
-- Migration: Add Extended Student Registration Details to uct_students
-- Safe, non-destructive migration (preserves all existing student rows & IDs)
-- =====================================================================================

ALTER TABLE public.uct_students
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS previous_qualification TEXT,
  ADD COLUMN IF NOT EXISTS laptop_availability TEXT,
  ADD COLUMN IF NOT EXISTS prior_course_knowledge TEXT,
  ADD COLUMN IF NOT EXISTS photo_url TEXT,
  ADD COLUMN IF NOT EXISTS registered_at TEXT;

-- Refresh PostgREST schema cache (for Supabase API)
NOTIFY pgrst, 'reload schema';
