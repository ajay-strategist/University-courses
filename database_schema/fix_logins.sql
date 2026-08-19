-- =====================================================================================
-- FIX LOGINS SCRIPT (Copy and run this in Supabase SQL Editor)
-- =====================================================================================

-- 1) Create or update the trigger function to populate email_confirmed_at
CREATE OR REPLACE FUNCTION public.uct_tg_sync_profile_to_auth()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if the user ID already exists in auth.users
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = NEW.id) THEN
    -- Check if email is already taken in auth.users (to avoid duplicate email key violation)
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = NEW.email) THEN
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
        NEW.id,
        'authenticated',
        'authenticated',
        NEW.email,
        crypt('password', gen_salt('bf', 10)), -- default password: 'password'
        now(),
        now(),
        now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        '{"iss":"supabase"}'::jsonb
      );
    END IF;
  ELSE
    -- If user exists, confirm their email and update email if changed
    UPDATE auth.users
    SET email = NEW.email,
        email_confirmed_at = COALESCE(email_confirmed_at, now()),
        updated_at = now()
      WHERE id = NEW.id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2) Re-bind the trigger
DROP TRIGGER IF EXISTS uct_trg_sync_profile_to_auth ON public.uct_profiles;
CREATE TRIGGER uct_trg_sync_profile_to_auth
AFTER INSERT OR UPDATE ON public.uct_profiles
FOR EACH ROW EXECUTE FUNCTION public.uct_tg_sync_profile_to_auth();

-- 3) Run a one-time sync to confirm all existing profiles and reset admin password to 'password'
DO $$
DECLARE
  v_rec RECORD;
BEGIN
  -- Reset admin password and confirmation
  UPDATE auth.users 
  SET encrypted_password = crypt('password', gen_salt('bf', 10)),
      email_confirmed_at = COALESCE(email_confirmed_at, now()),
      updated_at = now()
  WHERE email = 'mail@thestrategist.co.in';

  FOR v_rec IN SELECT * FROM public.uct_profiles LOOP
    -- Check if user ID already exists in auth.users
    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_rec.id) THEN
      -- Check if email is already taken in auth.users
      IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = v_rec.email) THEN
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
          crypt('password', gen_salt('bf', 10)),
          now(),
          now(),
          now(),
          '{"provider":"email","providers":["email"]}'::jsonb,
          '{"iss":"supabase"}'::jsonb
        );
      END IF;
    ELSE
      -- Confirm email of existing user
      UPDATE auth.users
      SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
          updated_at = now()
      WHERE id = v_rec.id;
    END IF;
  END LOOP;
END;
$$;
