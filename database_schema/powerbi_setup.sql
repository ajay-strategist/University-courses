-- =====================================================================================
-- Power BI Reporting Layer Setup for Supabase / PostgreSQL
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- =====================================================================================

-- 1. Create the dedicated read-only role for Power BI
-- (Supabase roles require LOGIN and a secure password. Change 'SecurePassword123!' to a strong password)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'pbi_reporting_role') THEN
        CREATE ROLE pbi_reporting_role WITH LOGIN PASSWORD 'SecurePassword123!';
    END IF;
END
$$;

-- Ensure the role has connection permission to the database
GRANT CONNECT ON DATABASE postgres TO pbi_reporting_role;

-- 2. Drop existing views to prevent conflict during creation
DROP VIEW IF EXISTS public.uct_vw_trainer_logs CASCADE;
DROP VIEW IF EXISTS public.uct_vw_trainer_log_topics CASCADE;
DROP VIEW IF EXISTS public.uct_vw_course_coverage CASCADE;
DROP VIEW IF EXISTS public.uct_vw_attendance_summary CASCADE;
DROP VIEW IF EXISTS public.uct_vw_fact_marks CASCADE;
DROP VIEW IF EXISTS public.uct_vw_fact_attendance CASCADE;
DROP VIEW IF EXISTS public.uct_vw_dim_student CASCADE;
DROP VIEW IF EXISTS public.uct_vw_dim_batch_course CASCADE;
DROP VIEW IF EXISTS public.uct_vw_dim_course CASCADE;
DROP VIEW IF EXISTS public.uct_vw_dim_batch CASCADE;
DROP VIEW IF EXISTS public.uct_vw_dim_college CASCADE;

-- 3. Create reporting views in public schema
-- (Views are owned by the creator, e.g., postgres, meaning the read-only role doesn't need select permission on the underlying public.uct_ tables)

-- uct_vw_dim_college
CREATE OR REPLACE VIEW public.uct_vw_dim_college AS
SELECT 
    c.id AS college_id,
    c.code AS college_code,
    c.name AS college_name,
    c.location,
    c.logo_url,
    c.image_url
FROM public.uct_colleges c;

-- uct_vw_dim_batch
CREATE OR REPLACE VIEW public.uct_vw_dim_batch AS
SELECT 
    b.id AS batch_id,
    b.code AS batch_code,
    c.code AS college_code,
    c.name AS college_name,
    p.code AS program_code,
    p.name AS program_name,
    b.academic_year,
    b.current_semester,
    b.status,
    COALESCE(cc.full_name, 'Unassigned') AS college_coordinator,
    COALESCE(sc.full_name, 'Unassigned') AS student_coordinator,
    (SELECT COUNT(*) FROM public.uct_students s WHERE s.batch_id = b.id) AS student_count
FROM public.uct_batches b
JOIN public.uct_colleges c ON c.id = b.college_id
JOIN public.uct_programs p ON p.id = b.program_id
LEFT JOIN public.uct_profiles cc ON cc.id = b.college_coordinator_id
LEFT JOIN public.uct_profiles sc ON sc.id = b.student_coordinator_id;

-- uct_vw_dim_course
CREATE OR REPLACE VIEW public.uct_vw_dim_course AS
SELECT 
    id AS course_id,
    code AS course_code,
    name AS course_name
FROM public.uct_courses;

-- uct_vw_dim_batch_course
CREATE OR REPLACE VIEW public.uct_vw_dim_batch_course AS
SELECT 
    bc.id AS batch_course_id,
    b.code AS batch_code,
    crs.code AS course_code,
    crs.name AS course_name,
    bc.semester,
    bc.planned_hours,
    bc.status
FROM public.uct_batch_courses bc
JOIN public.uct_batches b ON b.id = bc.batch_id
JOIN public.uct_courses crs ON crs.id = bc.course_id;

-- uct_vw_dim_student
CREATE OR REPLACE VIEW public.uct_vw_dim_student AS
SELECT 
    s.id AS student_id,
    s.register_no,
    s.name AS student_name,
    s.class,
    s.phone,
    b.code AS batch_code,
    c.name AS college_name
FROM public.uct_students s
JOIN public.uct_batches b ON b.id = s.batch_id
JOIN public.uct_colleges c ON c.id = b.college_id;

-- uct_vw_fact_attendance
CREATE OR REPLACE VIEW public.uct_vw_fact_attendance AS
SELECT 
    att.id AS attendance_id,
    c.code AS college_code,
    p.code AS program_code,
    b.code AS batch_code,
    b.academic_year,
    bc.semester,
    crs.name AS course_name,
    st.register_no,
    st.name AS student_name,
    st.class,
    s.session_date,
    s.hour_no,
    att.status AS attendance_status
FROM public.uct_attendance att
JOIN public.uct_sessions s ON s.id = att.session_id
JOIN public.uct_batch_courses bc ON bc.id = s.batch_course_id
JOIN public.uct_batches b ON b.id = bc.batch_id
JOIN public.uct_colleges c ON c.id = b.college_id
JOIN public.uct_programs p ON p.id = b.program_id
JOIN public.uct_courses crs ON crs.id = bc.course_id
JOIN public.uct_students st ON st.id = att.student_id;

-- uct_vw_fact_marks
CREATE OR REPLACE VIEW public.uct_vw_fact_marks AS
SELECT 
    m.id AS mark_id,
    c.code AS college_code,
    b.code AS batch_code,
    bc.semester,
    crs.name AS course_name,
    a.name AS assessment_name,
    atp.name AS assessment_type,
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

-- uct_vw_attendance_summary
CREATE OR REPLACE VIEW public.uct_vw_attendance_summary AS
SELECT 
    st.id AS student_id,
    st.register_no,
    st.name AS student_name,
    b.code AS batch_code,
    bc.semester,
    crs.name AS course_name,
    COUNT(att.id) AS sessions_held,
    COUNT(CASE WHEN att.status = 'present' THEN 1 END) AS present_count,
    COUNT(CASE WHEN att.status = 'absent' THEN 1 END) AS absent_count,
    COUNT(CASE WHEN att.status = 'late' THEN 1 END) AS late_count,
    ROUND(
        (COUNT(CASE WHEN att.status = 'present' OR att.status = 'late' THEN 1 END)::NUMERIC / NULLIF(COUNT(att.id), 0)) * 100, 
        2
    ) AS attendance_pct
FROM public.uct_students st
JOIN public.uct_batches b ON b.id = st.batch_id
CROSS JOIN public.uct_courses crs
LEFT JOIN public.uct_batch_courses bc ON bc.batch_id = b.id AND bc.course_id = crs.id
LEFT JOIN public.uct_sessions s ON s.batch_course_id = bc.id
LEFT JOIN public.uct_attendance att ON att.session_id = s.id AND att.student_id = st.id
GROUP BY st.id, st.register_no, st.name, b.code, bc.semester, crs.name;

-- uct_vw_course_coverage
CREATE OR REPLACE VIEW public.uct_vw_course_coverage AS
SELECT 
    bc.id AS batch_course_id,
    c.code AS college_code,
    b.code AS batch_code,
    bc.semester,
    crs.name AS course_name,
    COALESCE(tr.full_name, 'Unassigned') AS trainer_name,
    COUNT(bcs.id) AS total_topics,
    COUNT(CASE WHEN bcs.is_completed THEN 1 END) AS completed_topics,
    ROUND(
        (COUNT(CASE WHEN bcs.is_completed THEN 1 END)::NUMERIC / NULLIF(COUNT(bcs.id), 0)) * 100, 
        2
    ) AS coverage_pct,
    bc.planned_hours,
    COALESCE(SUM(CASE WHEN bcs.is_completed THEN bcs.planned_hours ELSE 0 END), 0) AS delivered_hours,
    CASE 
        WHEN (COUNT(CASE WHEN bcs.is_completed THEN 1 END)::NUMERIC / NULLIF(COUNT(bcs.id), 0)) >= 0.75 THEN 'on_track'
        ELSE 'behind'
    END AS status_flag,
    CURRENT_DATE + INTERVAL '14 days' AS projected_completion
FROM public.uct_batch_courses bc
JOIN public.uct_batches b ON b.id = bc.batch_id
JOIN public.uct_colleges c ON c.id = b.college_id
JOIN public.uct_courses crs ON crs.id = bc.course_id
LEFT JOIN public.uct_profiles tr ON tr.id = bc.trainer_id
LEFT JOIN public.uct_batch_course_syllabus bcs ON bcs.batch_course_id = bc.id
GROUP BY bc.id, c.code, b.code, bc.semester, crs.name, tr.full_name, bc.planned_hours;

-- uct_vw_trainer_logs (Parent View - Grain: one row per trainer log)
CREATE OR REPLACE VIEW public.uct_vw_trainer_logs AS
SELECT 
    tl.id AS log_id,
    c.code AS college_code,
    c.name AS college_name,
    b.code AS batch_code,
    b.academic_year,
    bc.semester,
    crs.code AS course_code,
    crs.name AS course_name,
    tl.trainer_name, -- directly sourced from the table's text column
    tl.log_date,
    tl.start_time,
    tl.end_time,
    tl.duration_minutes,
    tl.notes
FROM public.uct_trainer_logs tl
JOIN public.uct_batch_courses bc ON bc.id = tl.batch_course_id
JOIN public.uct_batches b ON b.id = bc.batch_id
JOIN public.uct_colleges c ON c.id = b.college_id
JOIN public.uct_courses crs ON crs.id = bc.course_id;

-- uct_vw_trainer_log_topics (Child View - Grain: one row per topic covered in a log)
CREATE OR REPLACE VIEW public.uct_vw_trainer_log_topics AS
SELECT 
    tl.id AS trainer_log_id,
    syl.topic_no,
    syl.topic_name,
    syl.planned_hours
FROM public.uct_trainer_logs tl
CROSS JOIN LATERAL unnest(tl.topics_covered) AS covered_topic_id
JOIN public.uct_batch_course_syllabus syl ON syl.id = covered_topic_id;

-- 4. Grant permissions to the read-only role
-- Grant usage on the public schema
GRANT USAGE ON SCHEMA public TO pbi_reporting_role;

-- Grant select specifically on the Power BI views only (protects underlying tables)
GRANT SELECT ON public.uct_vw_dim_college TO pbi_reporting_role;
GRANT SELECT ON public.uct_vw_dim_batch TO pbi_reporting_role;
GRANT SELECT ON public.uct_vw_dim_course TO pbi_reporting_role;
GRANT SELECT ON public.uct_vw_dim_batch_course TO pbi_reporting_role;
GRANT SELECT ON public.uct_vw_dim_student TO pbi_reporting_role;
GRANT SELECT ON public.uct_vw_fact_attendance TO pbi_reporting_role;
GRANT SELECT ON public.uct_vw_fact_marks TO pbi_reporting_role;
GRANT SELECT ON public.uct_vw_attendance_summary TO pbi_reporting_role;
GRANT SELECT ON public.uct_vw_course_coverage TO pbi_reporting_role;
GRANT SELECT ON public.uct_vw_trainer_logs TO pbi_reporting_role;
GRANT SELECT ON public.uct_vw_trainer_log_topics TO pbi_reporting_role;
