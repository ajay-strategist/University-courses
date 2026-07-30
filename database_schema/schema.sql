-- =====================================================================================
-- University Training Tracker (UTT) - Database Schema, RLS & Power BI Reporting Layer
-- Compatible with Supabase Postgres
-- All tables prefixed with 'uct_' as required
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- 0. SCHEMAS & EXTENSIONS
-- -------------------------------------------------------------------------------------
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE SCHEMA IF NOT EXISTS reporting;

-- -------------------------------------------------------------------------------------
-- CLEANUP: DROP EXISTING VIEWS, TABLES & TYPES IN REVERSE DEPENDENCY ORDER
-- (Ensures clean application in Supabase SQL Editor even if legacy schema elements exist)
-- -------------------------------------------------------------------------------------
DROP VIEW IF EXISTS reporting.vw_course_coverage CASCADE;
DROP VIEW IF EXISTS reporting.vw_attendance_summary CASCADE;
DROP VIEW IF EXISTS reporting.vw_fact_marks CASCADE;
DROP VIEW IF EXISTS reporting.vw_fact_attendance CASCADE;
DROP VIEW IF EXISTS reporting.vw_dim_student CASCADE;
DROP VIEW IF EXISTS reporting.vw_dim_course CASCADE;
DROP VIEW IF EXISTS reporting.vw_dim_batch CASCADE;
DROP VIEW IF EXISTS reporting.vw_dim_college CASCADE;

-- Drop uct_ tables if they exist
DROP TABLE IF EXISTS public.uct_notification_log CASCADE;
DROP TABLE IF EXISTS public.uct_assessment_marks CASCADE;
DROP TABLE IF EXISTS public.uct_assessments CASCADE;
DROP TABLE IF EXISTS public.uct_attendance CASCADE;
DROP TABLE IF EXISTS public.uct_sessions CASCADE;
DROP TABLE IF EXISTS public.uct_batch_course_syllabus CASCADE;
DROP TABLE IF EXISTS public.uct_batch_courses CASCADE;
DROP TABLE IF EXISTS public.uct_students CASCADE;
DROP TABLE IF EXISTS public.uct_batches CASCADE;
DROP TABLE IF EXISTS public.uct_assessment_types CASCADE;
DROP TABLE IF EXISTS public.uct_course_default_syllabus CASCADE;
DROP TABLE IF EXISTS public.uct_courses CASCADE;
DROP TABLE IF EXISTS public.uct_programs CASCADE;
DROP TABLE IF EXISTS public.uct_colleges CASCADE;
DROP TABLE IF EXISTS public.uct_user_email_config CASCADE;
DROP TABLE IF EXISTS public.uct_profiles CASCADE;

-- Drop legacy un-prefixed tables if they exist from previous runs
DROP TABLE IF EXISTS public.notification_log CASCADE;
DROP TABLE IF EXISTS public.assessment_marks CASCADE;
DROP TABLE IF EXISTS public.assessments CASCADE;
DROP TABLE IF EXISTS public.attendance CASCADE;
DROP TABLE IF EXISTS public.sessions CASCADE;
DROP TABLE IF EXISTS public.batch_course_syllabus CASCADE;
DROP TABLE IF EXISTS public.batch_courses CASCADE;
DROP TABLE IF EXISTS public.students CASCADE;
DROP TABLE IF EXISTS public.batches CASCADE;
DROP TABLE IF EXISTS public.assessment_types CASCADE;
DROP TABLE IF EXISTS public.course_default_syllabus CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.programs CASCADE;
DROP TABLE IF EXISTS public.colleges CASCADE;
DROP TABLE IF EXISTS public.user_email_config CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Drop ENUM types cleanly
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.attendance_status CASCADE;
DROP TYPE IF EXISTS public.batch_status CASCADE;

-- -------------------------------------------------------------------------------------
-- 1. ENUMS & TYPES
-- -------------------------------------------------------------------------------------
CREATE TYPE public.user_role AS ENUM ('admin', 'trainer', 'student_coordinator', 'college_coordinator');
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE public.batch_status AS ENUM ('Active', 'Completed');

-- -------------------------------------------------------------------------------------
-- 2. USERS & PROFILES
-- -------------------------------------------------------------------------------------
CREATE TABLE public.uct_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'trainer',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.uct_user_email_config (
    user_id UUID PRIMARY KEY REFERENCES public.uct_profiles(id) ON DELETE CASCADE,
    smtp_host TEXT NOT NULL DEFAULT 'smtp.gmail.com',
    smtp_port INT NOT NULL DEFAULT 587,
    smtp_user TEXT NOT NULL,
    smtp_app_password TEXT NOT NULL,
    from_name TEXT NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------------------
-- 3. MASTERS
-- -------------------------------------------------------------------------------------
CREATE TABLE public.uct_colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL, -- Short code e.g. MIM
    name TEXT NOT NULL,
    location TEXT,
    logo_url TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.uct_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL, -- e.g. BBA
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.uct_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL, -- e.g. XL, PBI, R, PY, SQL
    name TEXT NOT NULL, -- Excel, Power BI, R, Python, SQL
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.uct_course_default_syllabus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES public.uct_courses(id) ON DELETE CASCADE,
    topic_no INT NOT NULL,
    topic_name TEXT NOT NULL,
    planned_hours NUMERIC(5,2) NOT NULL DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(course_id, topic_no)
);

CREATE TABLE public.uct_assessment_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL, -- e.g. Assignment, Exam
    default_max_mark NUMERIC(5,2) NOT NULL DEFAULT 100.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------------------
-- 4. BATCH STRUCTURE
-- -------------------------------------------------------------------------------------
CREATE TABLE public.uct_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL, -- Auto built: college.code - program.code - academic_year (e.g. MIM-BBA-2026-29)
    college_id UUID NOT NULL REFERENCES public.uct_colleges(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.uct_programs(id) ON DELETE CASCADE,
    academic_year TEXT NOT NULL, -- e.g. 2026-29
    current_semester INT NOT NULL DEFAULT 1,
    college_coordinator_id UUID REFERENCES public.uct_profiles(id) ON DELETE SET NULL,
    student_coordinator_id UUID REFERENCES public.uct_profiles(id) ON DELETE SET NULL,
    status batch_status NOT NULL DEFAULT 'Active',
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.uct_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES public.uct_batches(id) ON DELETE CASCADE,
    register_no TEXT NOT NULL, -- Primary import key, unique within batch
    name TEXT NOT NULL,
    class TEXT NOT NULL, -- Division e.g. Division A
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(batch_id, register_no)
);

CREATE TABLE public.uct_batch_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_id UUID NOT NULL REFERENCES public.uct_batches(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES public.uct_courses(id) ON DELETE CASCADE,
    trainer_id UUID REFERENCES public.uct_profiles(id) ON DELETE SET NULL,
    semester INT NOT NULL DEFAULT 1,
    planned_hours NUMERIC(5,2) NOT NULL DEFAULT 30.0,
    start_date DATE,
    end_date DATE,
    status TEXT NOT NULL DEFAULT 'Active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(batch_id, course_id, semester)
);

CREATE TABLE public.uct_batch_course_syllabus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_course_id UUID NOT NULL REFERENCES public.uct_batch_courses(id) ON DELETE CASCADE,
    topic_no INT NOT NULL,
    topic_name TEXT NOT NULL,
    planned_hours NUMERIC(5,2) NOT NULL DEFAULT 1.0,
    is_completed BOOLEAN NOT NULL DEFAULT false,
    completed_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(batch_course_id, topic_no)
);

-- -------------------------------------------------------------------------------------
-- 5. ATTENDANCE
-- -------------------------------------------------------------------------------------
CREATE TABLE public.uct_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_course_id UUID NOT NULL REFERENCES public.uct_batch_courses(id) ON DELETE CASCADE,
    session_date DATE NOT NULL,
    hour_no INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(batch_course_id, session_date, hour_no)
);

CREATE TABLE public.uct_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.uct_sessions(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.uct_students(id) ON DELETE CASCADE,
    status attendance_status NOT NULL DEFAULT 'present',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(session_id, student_id)
);

-- -------------------------------------------------------------------------------------
-- 6. ASSESSMENTS & MARKS
-- -------------------------------------------------------------------------------------
CREATE TABLE public.uct_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_course_id UUID NOT NULL REFERENCES public.uct_batch_courses(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type_id UUID NOT NULL REFERENCES public.uct_assessment_types(id) ON DELETE RESTRICT,
    max_mark NUMERIC(5,2) NOT NULL,
    assessment_date DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.uct_assessment_marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID NOT NULL REFERENCES public.uct_assessments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.uct_students(id) ON DELETE CASCADE,
    mark NUMERIC(5,2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assessment_id, student_id),
    CONSTRAINT check_mark_valid CHECK (mark >= 0)
);

-- -------------------------------------------------------------------------------------
-- 7. NOTIFICATIONS LOG
-- -------------------------------------------------------------------------------------
CREATE TABLE public.uct_notification_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_course_id UUID REFERENCES public.uct_batch_courses(id) ON DELETE SET NULL,
    session_date DATE NOT NULL,
    sender_id UUID REFERENCES public.uct_profiles(id) ON DELETE SET NULL,
    recipient_email TEXT NOT NULL,
    absentee_count INT NOT NULL DEFAULT 0,
    status TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
    error TEXT,
    sent_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------------------
-- 8. INDEXES
-- -------------------------------------------------------------------------------------
CREATE INDEX idx_uct_students_batch_id ON public.uct_students(batch_id);
CREATE INDEX idx_uct_students_register_no ON public.uct_students(register_no);
CREATE INDEX idx_uct_batch_courses_batch_id ON public.uct_batch_courses(batch_id);
CREATE INDEX idx_uct_batch_courses_trainer_id ON public.uct_batch_courses(trainer_id);
CREATE INDEX idx_uct_sessions_batch_course_id ON public.uct_sessions(batch_course_id);
CREATE INDEX idx_uct_sessions_date ON public.uct_sessions(session_date);
CREATE INDEX idx_uct_attendance_session_id ON public.uct_attendance(session_id);
CREATE INDEX idx_uct_attendance_student_id ON public.uct_attendance(student_id);
CREATE INDEX idx_uct_assessments_batch_course_id ON public.uct_assessments(batch_course_id);
CREATE INDEX idx_uct_assessment_marks_assessment_id ON public.uct_assessment_marks(assessment_id);

-- -------------------------------------------------------------------------------------
-- 9. ROW-LEVEL SECURITY (RLS) POLICIES
-- -------------------------------------------------------------------------------------
ALTER TABLE public.uct_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_course_default_syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_assessment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_batch_courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_batch_course_syllabus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_assessment_marks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_user_email_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_notification_log ENABLE ROW LEVEL SECURITY;

-- Helper function to check role
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS user_role AS $$
  SELECT role FROM public.uct_profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- Master tables: Admin full access; Everyone read-only
CREATE POLICY admin_full_colleges ON public.uct_colleges FOR ALL USING (public.get_current_role() = 'admin');
CREATE POLICY read_all_colleges ON public.uct_colleges FOR SELECT USING (true);

CREATE POLICY admin_full_programs ON public.uct_programs FOR ALL USING (public.get_current_role() = 'admin');
CREATE POLICY read_all_programs ON public.uct_programs FOR SELECT USING (true);

CREATE POLICY admin_full_courses ON public.uct_courses FOR ALL USING (public.get_current_role() = 'admin');
CREATE POLICY read_all_courses ON public.uct_courses FOR SELECT USING (true);

CREATE POLICY admin_full_course_default_syllabus ON public.uct_course_default_syllabus FOR ALL USING (public.get_current_role() = 'admin');
CREATE POLICY read_all_course_default_syllabus ON public.uct_course_default_syllabus FOR SELECT USING (true);

CREATE POLICY admin_full_assessment_types ON public.uct_assessment_types FOR ALL USING (public.get_current_role() = 'admin');
CREATE POLICY read_all_assessment_types ON public.uct_assessment_types FOR SELECT USING (true);

-- Profiles: Admin full; Users read/edit their own
CREATE POLICY admin_full_profiles ON public.uct_profiles FOR ALL USING (public.get_current_role() = 'admin');
CREATE POLICY users_view_profiles ON public.uct_profiles FOR SELECT USING (true);
CREATE POLICY users_update_own_profile ON public.uct_profiles FOR UPDATE USING (id = auth.uid());

-- Batches: RLS by role
CREATE POLICY admin_full_batches ON public.uct_batches FOR ALL USING (public.get_current_role() = 'admin');
CREATE POLICY view_relevant_batches ON public.uct_batches FOR SELECT USING (
    public.get_current_role() = 'admin' OR
    college_coordinator_id = auth.uid() OR
    student_coordinator_id = auth.uid() OR
    EXISTS (SELECT 1 FROM public.uct_batch_courses bc WHERE bc.batch_id = uct_batches.id AND bc.trainer_id = auth.uid())
);

-- Batch Courses:
CREATE POLICY admin_full_batch_courses ON public.uct_batch_courses FOR ALL USING (public.get_current_role() = 'admin');
CREATE POLICY view_batch_courses ON public.uct_batch_courses FOR SELECT USING (
    public.get_current_role() = 'admin' OR
    trainer_id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.uct_batches b 
        WHERE b.id = uct_batch_courses.batch_id 
        AND (b.college_coordinator_id = auth.uid() OR b.student_coordinator_id = auth.uid())
    )
);
CREATE POLICY trainer_update_batch_courses ON public.uct_batch_courses FOR UPDATE USING (trainer_id = auth.uid());

-- Students:
CREATE POLICY admin_full_students ON public.uct_students FOR ALL USING (public.get_current_role() = 'admin');
CREATE POLICY view_students ON public.uct_students FOR SELECT USING (true);

-- Attendance & Sessions:
CREATE POLICY admin_full_sessions ON public.uct_sessions FOR ALL USING (public.get_current_role() = 'admin');
CREATE POLICY coordinator_trainer_sessions ON public.uct_sessions FOR ALL USING (
    public.get_current_role() = 'admin' OR
    EXISTS (
        SELECT 1 FROM public.uct_batch_courses bc
        JOIN public.uct_batches b ON b.id = bc.batch_id
        WHERE bc.id = uct_sessions.batch_course_id
        AND (bc.trainer_id = auth.uid() OR b.student_coordinator_id = auth.uid())
    )
);
CREATE POLICY view_sessions ON public.uct_sessions FOR SELECT USING (true);

CREATE POLICY admin_full_attendance ON public.uct_attendance FOR ALL USING (public.get_current_role() = 'admin');
CREATE POLICY mark_attendance ON public.uct_attendance FOR ALL USING (
    public.get_current_role() = 'admin' OR
    EXISTS (
        SELECT 1 FROM public.uct_sessions s
        JOIN public.uct_batch_courses bc ON bc.id = s.batch_course_id
        JOIN public.uct_batches b ON b.id = bc.batch_id
        WHERE s.id = uct_attendance.session_id
        AND (bc.trainer_id = auth.uid() OR b.student_coordinator_id = auth.uid())
    )
);
CREATE POLICY view_attendance ON public.uct_attendance FOR SELECT USING (true);

-- Assessments & Marks:
CREATE POLICY trainer_admin_assessments ON public.uct_assessments FOR ALL USING (
    public.get_current_role() = 'admin' OR
    EXISTS (
        SELECT 1 FROM public.uct_batch_courses bc
        WHERE bc.id = uct_assessments.batch_course_id AND bc.trainer_id = auth.uid()
    )
);
CREATE POLICY view_assessments ON public.uct_assessments FOR SELECT USING (true);

CREATE POLICY trainer_admin_marks ON public.uct_assessment_marks FOR ALL USING (
    public.get_current_role() = 'admin' OR
    EXISTS (
        SELECT 1 FROM public.uct_assessments a
        JOIN public.uct_batch_courses bc ON bc.id = a.batch_course_id
        WHERE a.id = uct_assessment_marks.assessment_id AND bc.trainer_id = auth.uid()
    )
);
CREATE POLICY view_marks ON public.uct_assessment_marks FOR SELECT USING (true);

-- User Email Config & Notification Logs:
CREATE POLICY own_email_config ON public.uct_user_email_config FOR ALL USING (user_id = auth.uid() OR public.get_current_role() = 'admin');
CREATE POLICY own_notification_log ON public.uct_notification_log FOR ALL USING (sender_id = auth.uid() OR public.get_current_role() = 'admin');

-- -------------------------------------------------------------------------------------
-- 10. POWER BI REPORTING VIEWS (reporting schema)
-- -------------------------------------------------------------------------------------

-- vw_dim_college
CREATE OR REPLACE VIEW reporting.vw_dim_college AS
SELECT 
    c.id AS college_id,
    c.code AS college_code,
    c.name AS college_name,
    c.location,
    c.logo_url,
    c.image_url
FROM public.uct_colleges c;

-- vw_dim_batch
CREATE OR REPLACE VIEW reporting.vw_dim_batch AS
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

-- vw_dim_course
CREATE OR REPLACE VIEW reporting.vw_dim_course AS
SELECT 
    id AS course_id,
    code AS course_code,
    name AS course_name
FROM public.uct_courses;

-- vw_dim_student
CREATE OR REPLACE VIEW reporting.vw_dim_student AS
SELECT 
    s.id AS student_id,
    s.register_no,
    s.name AS student_name,
    s.class,
    b.code AS batch_code,
    c.name AS college_name
FROM public.uct_students s
JOIN public.uct_batches b ON b.id = s.batch_id
JOIN public.uct_colleges c ON c.id = b.college_id;

-- vw_fact_attendance
CREATE OR REPLACE VIEW reporting.vw_fact_attendance AS
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

-- vw_fact_marks
CREATE OR REPLACE VIEW reporting.vw_fact_marks AS
SELECT 
    m.id AS mark_id,
    c.code AS college_code,
    b.code AS batch_code,
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

-- vw_attendance_summary
CREATE OR REPLACE VIEW reporting.vw_attendance_summary AS
SELECT 
    st.id AS student_id,
    st.register_no,
    st.name AS student_name,
    b.code AS batch_code,
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
GROUP BY st.id, st.register_no, st.name, b.code, crs.name;

-- vw_course_coverage
CREATE OR REPLACE VIEW reporting.vw_course_coverage AS
SELECT 
    bc.id AS batch_course_id,
    c.code AS college_code,
    b.code AS batch_code,
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
GROUP BY bc.id, c.code, b.code, crs.name, tr.full_name, bc.planned_hours;

-- -------------------------------------------------------------------------------------
-- 11. SEED DEFAULT MASTER DATA
-- -------------------------------------------------------------------------------------
INSERT INTO public.uct_courses (code, name) VALUES
('XL', 'Excel'),
('PBI', 'Power BI'),
('R', 'R'),
('PY', 'Python'),
('SQL', 'SQL')
ON CONFLICT (code) DO UPDATE SET name = EXCLUDED.name;

INSERT INTO public.uct_assessment_types (name, default_max_mark) VALUES
('Assignment', 50.0),
('Exam', 100.0),
('Internal Series', 40.0)
ON CONFLICT DO NOTHING;

INSERT INTO public.uct_programs (code, name) VALUES
('BBA', 'Bachelor of Business Administration'),
('BCOM', 'Bachelor of Commerce'),
('BCA', 'Bachelor of Computer Applications')
ON CONFLICT (code) DO NOTHING;
