-- Update script to add assignment_category to uct_assessments and recreate uct_vw_fact_marks
-- Run this in your Supabase SQL Editor:

-- 1. Add assignment_category column to uct_assessments table
ALTER TABLE public.uct_assessments ADD COLUMN IF NOT EXISTS assignment_category TEXT;

-- 2. Re-create the uct_vw_fact_marks view to include the new column
DROP VIEW IF EXISTS public.uct_vw_fact_marks CASCADE;

CREATE OR REPLACE VIEW public.uct_vw_fact_marks AS
SELECT 
    m.id AS mark_id,
    c.code AS college_code,
    b.code AS batch_code,
    bc.semester,
    crs.name AS course_name,
    a.name AS assessment_name,
    atp.name AS assessment_type,
    a.assignment_category,
    st.register_no,
    st.name AS student_name,
    m.mark,
    a.max_mark,
    ROUND((m.mark / NULLIF(a.max_mark, 0)) * 100, 2) AS percentage
FROM public.uct_assessment_marks m
JOIN public.uct_assessments a ON a.id = m.assessment_id
JOIN public.uct_assessment_types atp ON atp.id = a.type_id
JOIN public.uct_batch_courses bc ON bc.id = a.batch_course_id
JOIN public.uct_batches b ON b.id = bc.batch_id
JOIN public.uct_colleges c ON c.id = b.college_id
JOIN public.uct_courses crs ON crs.id = bc.course_id
JOIN public.uct_students st ON st.id = m.student_id;
