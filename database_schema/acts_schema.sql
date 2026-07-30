-- =====================================================================================
-- Academic Course Tracking System (ACTS) Database Schema
-- Designed for PostgreSQL (Supabase)
-- Prefixed with 'uct_' to isolate from existing application tables
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- 1. ENUMS (Custom Data Types) - Prefixed with uct_
-- -------------------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE uct_user_role AS ENUM ('super_admin', 'trainer', 'student_coordinator');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE uct_course_status AS ENUM ('active', 'completed', 'delayed', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE uct_syllabus_status AS ENUM ('not_started', 'in_progress', 'completed', 'postponed', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE uct_attendance_status AS ENUM ('present', 'absent', 'leave', 'late');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE uct_assignment_status AS ENUM ('pending', 'submitted', 'reviewed', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;


-- -------------------------------------------------------------------------------------
-- 2. MASTER DATA TABLES
-- -------------------------------------------------------------------------------------

-- Assuming colleges already exists from another application (prefixed with uct_).
CREATE TABLE IF NOT EXISTS uct_colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UCT Profiles
CREATE TABLE IF NOT EXISTS uct_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role uct_user_role NOT NULL,
    college_id UUID REFERENCES uct_colleges(id) ON DELETE CASCADE,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uct_academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    college_id UUID REFERENCES uct_colleges(id) ON DELETE CASCADE,
    is_current BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uct_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    college_id UUID REFERENCES uct_colleges(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uct_departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    college_id UUID REFERENCES uct_colleges(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uct_semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(50) NOT NULL,
    program_id UUID REFERENCES uct_programs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uct_batches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    program_id UUID REFERENCES uct_programs(id) ON DELETE CASCADE,
    semester_id UUID REFERENCES uct_semesters(id),
    academic_year_id UUID REFERENCES uct_academic_years(id),
    college_id UUID REFERENCES uct_colleges(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- -------------------------------------------------------------------------------------
-- 3. CORE OPERATIONAL TABLES
-- -------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS uct_students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    register_number VARCHAR(50) UNIQUE NOT NULL,
    roll_number VARCHAR(50),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department_id UUID REFERENCES uct_departments(id),
    program_id UUID REFERENCES uct_programs(id),
    semester_id UUID REFERENCES uct_semesters(id),
    batch_id UUID REFERENCES uct_batches(id) ON DELETE CASCADE,
    academic_year_id UUID REFERENCES uct_academic_years(id),
    college_id UUID REFERENCES uct_colleges(id) ON DELETE CASCADE,
    section VARCHAR(20),
    status VARCHAR(50) DEFAULT 'active',
    guardian_contact VARCHAR(20),
    photo_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uct_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) NOT NULL,
    academic_year_id UUID REFERENCES uct_academic_years(id),
    program_id UUID REFERENCES uct_programs(id),
    semester_id UUID REFERENCES uct_semesters(id),
    trainer_id UUID REFERENCES uct_profiles(id),
    coordinator_id UUID REFERENCES uct_profiles(id),
    college_id UUID REFERENCES uct_colleges(id) ON DELETE CASCADE,
    start_date DATE,
    end_date DATE,
    total_sessions INT DEFAULT 0,
    total_hours INT DEFAULT 0,
    status uct_course_status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uct_course_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES uct_courses(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES uct_batches(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(course_id, batch_id)
);


-- -------------------------------------------------------------------------------------
-- 4. ACADEMIC DELIVERY & ATTENDANCE
-- -------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS uct_syllabus (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES uct_courses(id) ON DELETE CASCADE,
    session_number INT NOT NULL,
    planned_date DATE,
    topic VARCHAR(255) NOT NULL,
    sub_topic TEXT,
    duration_minutes INT,
    trainer_id UUID REFERENCES uct_profiles(id),
    status uct_syllabus_status DEFAULT 'not_started',
    completed_date DATE,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uct_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES uct_courses(id) ON DELETE CASCADE,
    batch_id UUID REFERENCES uct_batches(id),
    session_date DATE NOT NULL,
    syllabus_id UUID REFERENCES uct_syllabus(id),
    marked_by UUID REFERENCES uct_profiles(id),
    is_submitted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uct_attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES uct_sessions(id) ON DELETE CASCADE,
    student_id UUID REFERENCES uct_students(id) ON DELETE CASCADE,
    status uct_attendance_status NOT NULL,
    remarks TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(session_id, student_id)
);


-- -------------------------------------------------------------------------------------
-- 5. ASSIGNMENTS & EXAMS
-- -------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS uct_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES uct_courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMP WITH TIME ZONE,
    max_marks DECIMAL(5,2),
    created_by UUID REFERENCES uct_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uct_assignment_marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID REFERENCES uct_assignments(id) ON DELETE CASCADE,
    student_id UUID REFERENCES uct_students(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5,2),
    status uct_assignment_status DEFAULT 'pending',
    remarks TEXT,
    updated_by UUID REFERENCES uct_profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(assignment_id, student_id)
);

CREATE TABLE IF NOT EXISTS uct_exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES uct_courses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    exam_date DATE,
    max_marks DECIMAL(5,2) NOT NULL,
    passing_marks DECIMAL(5,2) NOT NULL,
    created_by UUID REFERENCES uct_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uct_exam_marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES uct_exams(id) ON DELETE CASCADE,
    student_id UUID REFERENCES uct_students(id) ON DELETE CASCADE,
    marks_obtained DECIMAL(5,2),
    percentage DECIMAL(5,2),
    grade VARCHAR(10),
    result VARCHAR(20),
    updated_by UUID REFERENCES uct_profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(exam_id, student_id)
);


-- -------------------------------------------------------------------------------------
-- 6. SYSTEM LOGS & QUEUES
-- -------------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS uct_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name VARCHAR(100) NOT NULL,
    record_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    performed_by UUID,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS uct_google_sheet_sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES uct_sessions(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'pending',
    retry_count INT DEFAULT 0,
    last_error TEXT,
    google_sheet_row_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);


-- -------------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES EXAMPLES
-- -------------------------------------------------------------------------------------
-- Note: Re-creating policies that exist will throw an error, so we use a DO block to ignore it.

ALTER TABLE uct_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE uct_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE uct_courses ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
    CREATE POLICY "Super Admins have full access to uct_profiles" ON uct_profiles
        FOR ALL USING (
            EXISTS (SELECT 1 FROM uct_profiles WHERE id = auth.uid() AND role = 'super_admin')
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Users can view their own college profiles" ON uct_profiles
        FOR SELECT USING (
            college_id = (SELECT college_id FROM uct_profiles WHERE id = auth.uid())
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE POLICY "Trainers can access their courses" ON uct_courses
        FOR ALL USING (
            trainer_id = auth.uid() OR coordinator_id = auth.uid()
            OR EXISTS (SELECT 1 FROM uct_profiles WHERE id = auth.uid() AND role = 'super_admin')
        );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
