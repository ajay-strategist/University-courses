-- Migration: Add trainer_duration column to uct_batch_course_syllabus
-- Run this in the Supabase SQL Editor (Dashboard → SQL Editor → New Query)

ALTER TABLE uct_batch_course_syllabus
  ADD COLUMN IF NOT EXISTS trainer_duration numeric;

-- This stores the actual duration delivered by the trainer per topic
-- (can be in minutes or hours — consistent usage is key)
