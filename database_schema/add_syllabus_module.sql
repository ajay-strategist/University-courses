-- ============================================================================
-- Migration: Add module_name to uct_course_default_syllabus
-- ============================================================================
-- Allows categorizing syllabus topics into modules (e.g., Module 1, Module 2)
-- for both Topic List and Module Summary views in Master Data Directory.
-- ============================================================================

ALTER TABLE public.uct_course_default_syllabus
  ADD COLUMN IF NOT EXISTS module_name TEXT;
