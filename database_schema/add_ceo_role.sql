-- ============================================================================
-- Migration: Add 'ceo' role to uct_user_role enum
-- ============================================================================
-- Allows assigning the 'ceo' role in Users & Role Administration
-- (e.g., info@thestrategist.co.in) so Weekly Summary & Risk emails
-- automatically CC the configured CEO user(s).
-- ============================================================================

ALTER TYPE public.uct_user_role ADD VALUE IF NOT EXISTS 'ceo';
