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
DROP VIEW IF EXISTS public.uct_vw_course_coverage CASCADE;
DROP VIEW IF EXISTS public.uct_vw_attendance_summary CASCADE;
DROP VIEW IF EXISTS public.uct_vw_fact_marks CASCADE;
DROP VIEW IF EXISTS public.uct_vw_fact_attendance CASCADE;
DROP VIEW IF EXISTS public.uct_vw_dim_student CASCADE;
DROP VIEW IF EXISTS public.uct_vw_dim_course CASCADE;
DROP VIEW IF EXISTS public.uct_vw_dim_batch CASCADE;
DROP VIEW IF EXISTS public.uct_vw_dim_college CASCADE;

-- Drop uct_ tables if they exist
DROP TABLE IF EXISTS public.uct_migration_mappings CASCADE;
DROP TABLE IF EXISTS public.uct_migration_runs CASCADE;
DROP TABLE IF EXISTS public.uct_trainer_logs CASCADE;
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

-- Drop ENUM types cleanly (prefixed with uct_ to avoid clashes with other applications)
DROP TYPE IF EXISTS public.uct_user_role CASCADE;
DROP TYPE IF EXISTS public.uct_attendance_status CASCADE;
DROP TYPE IF EXISTS public.uct_batch_status CASCADE;

-- -------------------------------------------------------------------------------------
-- 1. ENUMS & TYPES
-- -------------------------------------------------------------------------------------
CREATE TYPE public.uct_user_role AS ENUM ('admin', 'trainer', 'student_coordinator', 'college_coordinator');
CREATE TYPE public.uct_attendance_status AS ENUM ('present', 'absent', 'late');
CREATE TYPE public.uct_batch_status AS ENUM ('Active', 'Completed');

-- -------------------------------------------------------------------------------------
-- 2. USERS & PROFILES
-- -------------------------------------------------------------------------------------
CREATE TABLE public.uct_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role uct_user_role NOT NULL DEFAULT 'trainer',
    must_change_password BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Helper function to fetch the current user's role from uct_profiles
CREATE OR REPLACE FUNCTION public.get_current_role()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text FROM public.uct_profiles WHERE id = auth.uid();
$$;

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
    status uct_batch_status NOT NULL DEFAULT 'Active',
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
    status uct_attendance_status NOT NULL DEFAULT 'present',
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
-- 7.1. TRAINER LOGS
-- -------------------------------------------------------------------------------------
CREATE TABLE public.uct_trainer_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    batch_course_id UUID NOT NULL REFERENCES public.uct_batch_courses(id) ON DELETE CASCADE,
    trainer_id UUID REFERENCES public.uct_profiles(id) ON DELETE SET NULL,
    trainer_name TEXT NOT NULL DEFAULT 'Unassigned',
    log_date DATE NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 0,
    topics_covered UUID[] NOT NULL DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
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
CREATE INDEX idx_uct_trainer_logs_batch_course_id ON public.uct_trainer_logs(batch_course_id);

-- -------------------------------------------------------------------------------------
-- 9. ROW-LEVEL SECURITY (RLS) POLICIES & PERMISSIONS
-- -------------------------------------------------------------------------------------
ALTER TABLE public.uct_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_colleges DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_programs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_course_default_syllabus DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_assessment_types DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_batches DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_students DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_batch_courses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_batch_course_syllabus DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_assessments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_assessment_marks DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_user_email_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_notification_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_trainer_logs DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;



-- User Email Config & Notification Logs:
CREATE POLICY own_email_config ON public.uct_user_email_config FOR ALL USING (user_id = auth.uid() OR public.get_current_role() = 'admin');
CREATE POLICY own_notification_log ON public.uct_notification_log FOR ALL USING (sender_id = auth.uid() OR public.get_current_role() = 'admin');

-- -------------------------------------------------------------------------------------
-- 10. POWER BI REPORTING VIEWS (reporting schema)
-- -------------------------------------------------------------------------------------

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

-- uct_vw_dim_student
CREATE OR REPLACE VIEW public.uct_vw_dim_student AS
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

-- uct_vw_course_coverage
CREATE OR REPLACE VIEW public.uct_vw_course_coverage AS
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
-- 11. SEED DEFAULT ADMIN USER
-- -------------------------------------------------------------------------------------
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- 1) Check if the user already exists in auth.users
  SELECT id INTO v_user_id FROM auth.users WHERE email = 'mail@thestrategist.co.in';
  
  -- 2) If not, insert into auth.users
  IF v_user_id IS NULL THEN
    v_user_id := '6446ace9-79d8-447b-b20a-d905429c6074'::UUID; -- Predictable UUID matching flowdesk's admin
    INSERT INTO auth.users (
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data
    ) VALUES (
      v_user_id,
      'authenticated',
      'authenticated',
      'mail@thestrategist.co.in',
      crypt('AjayThomas@1', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb
    );
  ELSE
    -- If user exists, update their password
    UPDATE auth.users 
    SET encrypted_password = crypt('AjayThomas@1', gen_salt('bf')),
        updated_at = now()
    WHERE id = v_user_id;
  END IF;

  -- 3) Ensure they exist in public.uct_profiles as an admin
  INSERT INTO public.uct_profiles (
    id,
    full_name,
    email,
    phone,
    role,
    must_change_password,
    created_at,
    updated_at
  ) VALUES (
    v_user_id,
    'Ajay Thomas',
    'mail@thestrategist.co.in',
    '+91 98765 43210',
    'admin',
    false, -- Admin doesn't need to change their pre-configured password
    now(),
    now()
  ) ON CONFLICT (id) DO UPDATE SET
    role = 'admin',
    full_name = 'Ajay Thomas',
    email = 'mail@thestrategist.co.in',
    must_change_password = false,
    updated_at = now();
END $$;

-- -------------------------------------------------------------------------------------
-- 12. ADMIN USER MANAGEMENT FUNCTIONS (SECURITY DEFINER)
-- -------------------------------------------------------------------------------------

-- Function 1: Admin Create User
CREATE OR REPLACE FUNCTION public.admin_create_user(
  p_email TEXT,
  p_full_name TEXT,
  p_phone TEXT,
  p_role public.uct_user_role
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_new_user_id UUID;
BEGIN
  -- 1) Verifycaller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.uct_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can create users';
  END IF;

  -- 2) Check if email exists
  IF EXISTS (SELECT 1 FROM auth.users WHERE email = p_email) THEN
    RAISE EXCEPTION 'A user with this email already exists';
  END IF;

  -- 3) Create user in auth.users with default password 'password'
  v_new_user_id := gen_random_uuid();
  INSERT INTO auth.users (
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data
  ) VALUES (
    v_new_user_id,
    'authenticated',
    'authenticated',
    p_email,
    crypt('password', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    '{}'::jsonb
  );

  -- 4) Create profile in public.uct_profiles (forces must_change_password = true)
  INSERT INTO public.uct_profiles (
    id,
    full_name,
    email,
    phone,
    role,
    must_change_password,
    created_at,
    updated_at
  ) VALUES (
    v_new_user_id,
    p_full_name,
    p_email,
    p_phone,
    p_role,
    true,
    now(),
    now()
  );

  RETURN v_new_user_id;
END;
$$;

-- Function 2: Admin Delete User
CREATE OR REPLACE FUNCTION public.admin_delete_user(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 1) Verify caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.uct_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can delete users';
  END IF;

  -- Prevent deleting oneself
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'You cannot delete your own admin account';
  END IF;

  -- 2) Delete user (cascades to uct_profiles)
  DELETE FROM auth.users WHERE id = target_user_id;
END;
$$;

-- Function 3: Admin Reset User Password to 'password'
CREATE OR REPLACE FUNCTION public.reset_user_password(target_user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 1) Verify caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.uct_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can reset passwords';
  END IF;

  -- 2) Update password in auth.users
  UPDATE auth.users
  SET encrypted_password = crypt('password', gen_salt('bf')),
      updated_at = now()
  WHERE id = target_user_id;

  -- 3) Force must_change_password to true in uct_profiles
  UPDATE public.uct_profiles
  SET must_change_password = true,
      updated_at = now()
  WHERE id = target_user_id;
END;
$$;

-- Function 4: Admin Update User Role
CREATE OR REPLACE FUNCTION public.admin_update_user_role(
  target_user_id UUID,
  new_role public.uct_user_role
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 1) Verify caller is an admin
  IF NOT EXISTS (
    SELECT 1 FROM public.uct_profiles
    WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Only administrators can update user roles';
  END IF;

  -- 2) Update role in uct_profiles
  UPDATE public.uct_profiles
  SET role = new_role,
      updated_at = now()
  WHERE id = target_user_id;
END;
$$;

-- Grant permissions to authenticated users to call these functions
GRANT EXECUTE ON FUNCTION public.admin_create_user(TEXT, TEXT, TEXT, public.uct_user_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_user(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.reset_user_password(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_user_role(UUID, public.uct_user_role) TO authenticated;

-- -------------------------------------------------------------------------------------
-- 13. MIGRATION RUNS & COLUMN MAPPINGS
-- -------------------------------------------------------------------------------------

CREATE TABLE public.uct_migration_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    uploaded_by UUID REFERENCES public.uct_profiles(id) ON DELETE SET NULL,
    file_path TEXT NOT NULL,
    mode TEXT NOT NULL CHECK (mode IN ('master', 'mapped')),
    status TEXT NOT NULL CHECK (status IN ('dry_run', 'committed', 'failed')),
    summary JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.uct_migration_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    owner_id UUID REFERENCES public.uct_profiles(id) ON DELETE CASCADE,
    mapping JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE public.uct_migration_runs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.uct_migration_mappings DISABLE ROW LEVEL SECURITY;

GRANT ALL ON public.uct_migration_runs TO anon, authenticated, service_role;
GRANT ALL ON public.uct_migration_mappings TO anon, authenticated, service_role;
