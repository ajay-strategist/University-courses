-- =====================================================================================
-- Migration: Add Batch Tasks Table (uct_batch_tasks)
-- Supports dual-scope task tracking: (1) Semester-Specific and (2) Common to Course
-- Bound to Batch + Tool Course with optional due date
-- All objects strictly prefixed with 'uct_'
-- =====================================================================================

CREATE TABLE IF NOT EXISTS public.uct_batch_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES public.uct_batches(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.uct_courses(id) ON DELETE CASCADE,
    semester INT, -- NULL = Common across all semesters; 1, 2, 3... = Specific Semester
    title TEXT NOT NULL,
    due_date DATE, -- Optional deadline
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance index for batch + course + semester queries
CREATE INDEX IF NOT EXISTS idx_uct_batch_tasks_lookup 
ON public.uct_batch_tasks(batch_id, course_id, semester);

-- Match current schema security conventions
ALTER TABLE public.uct_batch_tasks DISABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.uct_batch_tasks TO anon, authenticated, service_role;
