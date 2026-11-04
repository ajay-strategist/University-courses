-- =====================================================================================
-- Migration: Update uct_vw_course_coverage
-- Computes delivered_hours from Trainer Engaged Logs (uct_trainer_logs conducted duration)
-- rather than syllabus topic planned hours.
-- =====================================================================================

CREATE OR REPLACE VIEW public.uct_vw_course_coverage AS
SELECT 
    bc.id AS batch_course_id,
    c.code AS college_code,
    b.code AS batch_code,
    crs.name AS course_name,
    COALESCE(tr.full_name, 'Unassigned') AS trainer_name,
    COUNT(DISTINCT bcs.id) AS total_topics,
    COUNT(DISTINCT CASE WHEN bcs.is_completed THEN bcs.id END) AS completed_topics,
    ROUND(
        (COUNT(DISTINCT CASE WHEN bcs.is_completed THEN bcs.id END)::NUMERIC / NULLIF(COUNT(DISTINCT bcs.id), 0)) * 100, 
        2
    ) AS coverage_pct,
    bc.planned_hours,
    COALESCE(ROUND(tl.total_delivered_minutes / 60.0, 1), 0) AS delivered_hours,
    CASE 
        WHEN (COUNT(DISTINCT CASE WHEN bcs.is_completed THEN bcs.id END)::NUMERIC / NULLIF(COUNT(DISTINCT bcs.id), 0)) >= 0.75 THEN 'on_track'
        ELSE 'behind'
    END AS status_flag,
    CURRENT_DATE + INTERVAL '14 days' AS projected_completion
FROM public.uct_batch_courses bc
JOIN public.uct_batches b ON b.id = bc.batch_id
JOIN public.uct_colleges c ON c.id = b.college_id
JOIN public.uct_courses crs ON crs.id = bc.course_id
LEFT JOIN public.uct_profiles tr ON tr.id = bc.trainer_id
LEFT JOIN public.uct_batch_course_syllabus bcs ON bcs.batch_course_id = bc.id
LEFT JOIN (
    SELECT batch_course_id, SUM(duration_minutes) AS total_delivered_minutes
    FROM public.uct_trainer_logs
    WHERE (notes IS NULL OR notes NOT LIKE '[MISSED:%')
    GROUP BY batch_course_id
) tl ON tl.batch_course_id = bc.id
GROUP BY bc.id, c.code, b.code, crs.name, tr.full_name, bc.planned_hours, tl.total_delivered_minutes;

