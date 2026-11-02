-- =====================================================================================
-- Migration: Add Academic Calendar Tables (uct_academic_semesters & uct_academic_activities)
-- Centralized Semester Schedule & Academic Milestone Activity Planner
-- Red badges for Holidays; Super Admin & Trainer editing permissions
-- All objects strictly prefixed with 'uct_'
-- =====================================================================================

CREATE TABLE IF NOT EXISTS public.uct_academic_semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.uct_colleges(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.uct_programs(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL,
    semester_no INT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(college_id, program_id, academic_year, semester_no),
    CONSTRAINT check_semester_dates CHECK (end_date >= start_date)
);

CREATE TABLE IF NOT EXISTS public.uct_academic_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES public.uct_colleges(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES public.uct_batches(id) ON DELETE CASCADE,
    semester_no INT,
    title TEXT NOT NULL,
    description TEXT,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'Exam Window',
        'Marks Deadline',
        'Holiday / Break',
        'Syllabus Milestone',
        'Guest Lecture / Workshop',
        'General Event'
    )),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'Planned' CHECK (status IN ('Planned', 'Completed', 'Cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT check_activity_dates CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_uct_academic_semesters_lookup 
ON public.uct_academic_semesters(college_id, program_id, academic_year);

CREATE INDEX IF NOT EXISTS idx_uct_academic_activities_dates 
ON public.uct_academic_activities(start_date, end_date);

ALTER TABLE public.uct_academic_semesters DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_academic_activities DISABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.uct_academic_semesters TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.uct_academic_activities TO anon, authenticated, service_role;
