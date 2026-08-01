-- Migration: Copy all data from legacy flwdsk_ tables into new isolated uct_ tables.
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- This follows the foreign key dependency order to prevent constraint violations.

-- 1. Profiles
INSERT INTO public.uct_profiles 
SELECT * FROM public.flwdsk_profiles 
ON CONFLICT (id) DO NOTHING;

-- 2. User Email Config
INSERT INTO public.uct_user_email_config 
SELECT * FROM public.flwdsk_user_email_config 
ON CONFLICT (id) DO NOTHING;

-- 3. Colleges
INSERT INTO public.uct_colleges 
SELECT * FROM public.flwdsk_colleges 
ON CONFLICT (id) DO NOTHING;

-- 4. Programs
INSERT INTO public.uct_programs 
SELECT * FROM public.flwdsk_programs 
ON CONFLICT (id) DO NOTHING;

-- 5. Courses
INSERT INTO public.uct_courses 
SELECT * FROM public.flwdsk_courses 
ON CONFLICT (id) DO NOTHING;

-- 6. Course Default Syllabus
INSERT INTO public.uct_course_default_syllabus 
SELECT * FROM public.flwdsk_course_default_syllabus 
ON CONFLICT (id) DO NOTHING;

-- 7. Assessment Types
INSERT INTO public.uct_assessment_types 
SELECT * FROM public.flwdsk_assessment_types 
ON CONFLICT (id) DO NOTHING;

-- 8. Batches
INSERT INTO public.uct_batches 
SELECT * FROM public.flwdsk_batches 
ON CONFLICT (id) DO NOTHING;

-- 9. Students
INSERT INTO public.uct_students 
SELECT * FROM public.flwdsk_students 
ON CONFLICT (id) DO NOTHING;

-- 10. Batch Courses
INSERT INTO public.uct_batch_courses 
SELECT * FROM public.flwdsk_batch_courses 
ON CONFLICT (id) DO NOTHING;

-- 11. Batch Course Syllabus
INSERT INTO public.uct_batch_course_syllabus 
SELECT * FROM public.flwdsk_batch_course_syllabus 
ON CONFLICT (id) DO NOTHING;

-- 12. Sessions
INSERT INTO public.uct_sessions 
SELECT * FROM public.flwdsk_sessions 
ON CONFLICT (id) DO NOTHING;

-- 13. Attendance
INSERT INTO public.uct_attendance 
SELECT * FROM public.flwdsk_attendance 
ON CONFLICT (id) DO NOTHING;

-- 14. Assessments
INSERT INTO public.uct_assessments 
SELECT * FROM public.flwdsk_assessments 
ON CONFLICT (id) DO NOTHING;

-- 15. Assessment Marks
INSERT INTO public.uct_assessment_marks 
SELECT * FROM public.flwdsk_assessment_marks 
ON CONFLICT (id) DO NOTHING;

-- 16. Notification Logs
INSERT INTO public.uct_notification_log 
SELECT * FROM public.flwdsk_notification_log 
ON CONFLICT (id) DO NOTHING;

-- 17. Migration Runs
INSERT INTO public.uct_migration_runs 
SELECT * FROM public.flwdsk_migration_runs 
ON CONFLICT (id) DO NOTHING;

-- 18. Migration Mappings
INSERT INTO public.uct_migration_mappings 
SELECT * FROM public.flwdsk_migration_mappings 
ON CONFLICT (id) DO NOTHING;

-- 19. Trainer Logs (Copy if the table exists under flwdsk_)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'flwdsk_trainer_logs') THEN
        INSERT INTO public.uct_trainer_logs (
            id, batch_course_id, trainer_id, trainer_name, log_date, start_time, end_time, duration_minutes, topics_covered, notes, created_at
        )
        SELECT 
            tl.id, 
            tl.batch_course_id, 
            tl.trainer_id, 
            COALESCE(p.full_name, 'Unassigned') AS trainer_name, 
            tl.log_date, 
            tl.start_time, 
            tl.end_time, 
            tl.duration_minutes, 
            tl.topics_covered, 
            tl.notes, 
            tl.created_at
        FROM public.flwdsk_trainer_logs tl
        LEFT JOIN public.flwdsk_profiles p ON p.id = tl.trainer_id
        ON CONFLICT (id) DO NOTHING;
    END IF;
END
$$;
