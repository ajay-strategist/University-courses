-- =====================================================================================
-- Migration: Add Missed Sessions Support to Trainer Logs (uct_trainer_logs)
-- Tracks missed class hours due to Trainer Leave, College Programs, Natural Calamities, etc.
-- All objects strictly prefixed with 'uct_'
-- =====================================================================================

ALTER TABLE public.uct_trainer_logs 
ADD COLUMN IF NOT EXISTS log_type TEXT DEFAULT 'conducted' CHECK (log_type IN ('conducted', 'missed')),
ADD COLUMN IF NOT EXISTS missed_reason TEXT CHECK (missed_reason IN ('trainer_leave', 'college_program', 'natural_calamity', 'other'));

-- Index for filtering conducted vs missed sessions
CREATE INDEX IF NOT EXISTS idx_uct_trainer_logs_type ON public.uct_trainer_logs(batch_course_id, log_type);

