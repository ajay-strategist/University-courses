-- =====================================================================================
-- FIX LOGINS SCRIPT (Copy and run this in Supabase SQL Editor)
-- =====================================================================================

DO $$
DECLARE
  v_rec RECORD;
  v_auth_id UUID;
BEGIN
  -- 1) Fix any ID mismatches between public.uct_profiles and auth.users
  FOR v_rec IN SELECT * FROM public.uct_profiles LOOP
    -- Check if the email exists in auth.users under a DIFFERENT ID
    SELECT id INTO v_auth_id FROM auth.users WHERE email = v_rec.email;
    
    IF v_auth_id IS NOT NULL AND v_auth_id <> v_rec.id THEN
      RAISE NOTICE 'ID Mismatch for email %: profile ID %, auth ID %. Aligning profile ID to match auth ID.', v_rec.email, v_rec.id, v_auth_id;
      
      -- Update referencing tables to prevent foreign key violations before updating uct_profiles
      UPDATE public.uct_batches SET student_coordinator_id = v_auth_id WHERE student_coordinator_id = v_rec.id;
      UPDATE public.uct_batch_courses SET trainer_id = v_auth_id WHERE trainer_id = v_rec.id;
      UPDATE public.uct_trainer_logs SET trainer_id = v_auth_id WHERE trainer_id = v_rec.id;
      UPDATE public.uct_migration_runs SET uploaded_by = v_auth_id WHERE uploaded_by = v_rec.id;
      UPDATE public.uct_migration_mappings SET owner_id = v_auth_id WHERE owner_id = v_rec.id;
      
      -- Update uct_profiles primary key to match auth.users ID
      UPDATE public.uct_profiles SET id = v_auth_id WHERE id = v_rec.id;
    END IF;
  END LOOP;

  -- 2) Ensure all profiles have a login account in auth.users with password 'password' and confirmed email
  FOR v_rec IN SELECT * FROM public.uct_profiles LOOP
    -- Check if they exist in auth.users (now they have the same ID if they existed)
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_rec.id) THEN
      RAISE NOTICE 'Creating missing auth user for: % (%)', v_rec.full_name, v_rec.email;
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
        v_rec.id,
        'authenticated',
        'authenticated',
        v_rec.email,
        crypt('password', gen_salt('bf', 10)), -- default password: 'password'
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"iss":"supabase"}'::jsonb
      );

      -- Insert identity
      INSERT INTO auth.identities (
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        v_rec.id::text,
        v_rec.id,
        jsonb_build_object('sub', v_rec.id::text, 'email', v_rec.email),
        'email',
        now(),
        now(),
        now()
      ) ON CONFLICT DO NOTHING;
    ELSE
      -- Reset password and confirm email
      RAISE NOTICE 'Resetting password and confirming email for: % (%)', v_rec.full_name, v_rec.email;
      UPDATE auth.users
      SET encrypted_password = crypt('password', gen_salt('bf', 10)),
          email_confirmed_at = COALESCE(email_confirmed_at, now()),
          updated_at = now()
      WHERE id = v_rec.id;

      -- Ensure identity exists
      INSERT INTO auth.identities (
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
      ) VALUES (
        v_rec.id::text,
        v_rec.id,
        jsonb_build_object('sub', v_rec.id::text, 'email', v_rec.email),
        'email',
        now(),
        now(),
        now()
      ) ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;
END;
$$;
