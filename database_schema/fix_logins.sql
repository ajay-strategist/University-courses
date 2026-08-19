-- =====================================================================================
-- TARGETED FIX - Paste and run in Supabase SQL Editor
-- Directly resets/creates auth records for Jomon & Anoop by email
-- =====================================================================================

DO $$
DECLARE
  v_emails TEXT[] := ARRAY['info@thestrategist.co.in', 'baijuanoop810@gmail.com'];
  v_names  TEXT[] := ARRAY['Jomon Joseph', 'Anoop Baiju'];
  v_email  TEXT;
  v_name   TEXT;
  v_auth_id UUID;
  v_profile_id UUID;
  i INT;
BEGIN
  FOR i IN 1..array_length(v_emails, 1) LOOP
    v_email := v_emails[i];
    v_name  := v_names[i];

    -- Find what ID this email has in auth.users (if any)
    SELECT id INTO v_auth_id FROM auth.users WHERE email = v_email;

    -- Find what ID this email has in uct_profiles (if any)
    SELECT id INTO v_profile_id FROM public.uct_profiles WHERE email = v_email;

    RAISE NOTICE '--- % ---', v_email;
    RAISE NOTICE '  auth.users id:    %', COALESCE(v_auth_id::text, 'MISSING');
    RAISE NOTICE '  uct_profiles id:  %', COALESCE(v_profile_id::text, 'MISSING');

    -- If no auth.users record, create one using profile ID (or new UUID)
    IF v_auth_id IS NULL THEN
      v_auth_id := COALESCE(v_profile_id, gen_random_uuid());
      INSERT INTO auth.users (id, aud, role, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data)
      VALUES (v_auth_id, 'authenticated', 'authenticated', v_email, crypt('password', gen_salt('bf', 10)), now(), now(), now(),
        '{"provider":"email","providers":["email"]}'::jsonb, '{"iss":"supabase"}'::jsonb);
      RAISE NOTICE '  Created auth.users with id=%', v_auth_id;
    ELSE
      -- Auth record exists — reset the password and confirm email
      UPDATE auth.users
      SET encrypted_password = crypt('password', gen_salt('bf', 10)),
          email_confirmed_at = now(),
          updated_at = now()
      WHERE id = v_auth_id;
      RAISE NOTICE '  Reset password for existing auth.users id=%', v_auth_id;
    END IF;

    -- Wipe stale identities and insert a clean one
    DELETE FROM auth.identities WHERE user_id = v_auth_id;
    INSERT INTO auth.identities (provider_id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    VALUES (v_auth_id::text, v_auth_id, jsonb_build_object('sub', v_auth_id::text, 'email', v_email), 'email', now(), now(), now());
    RAISE NOTICE '  Identity record created for id=%', v_auth_id;

    -- Ensure uct_profiles row exists and has the correct id
    IF v_profile_id IS NULL THEN
      INSERT INTO public.uct_profiles (id, full_name, email, role, must_change_password)
      VALUES (v_auth_id, v_name, v_email, 'trainer', true);
      RAISE NOTICE '  Created uct_profiles row';
    ELSIF v_profile_id <> v_auth_id THEN
      -- Profile has a different ID — update it to match auth.users
      RAISE NOTICE '  Aligning profile id % -> %', v_profile_id, v_auth_id;
      UPDATE public.uct_batches SET student_coordinator_id = v_auth_id WHERE student_coordinator_id = v_profile_id;
      UPDATE public.uct_batch_courses SET trainer_id = v_auth_id WHERE trainer_id = v_profile_id;
      UPDATE public.uct_trainer_logs SET trainer_id = v_auth_id WHERE trainer_id = v_profile_id;
      UPDATE public.uct_profiles SET id = v_auth_id WHERE id = v_profile_id;
    END IF;

    RAISE NOTICE '  ✓ Done for %', v_email;
  END LOOP;
END;
$$;
