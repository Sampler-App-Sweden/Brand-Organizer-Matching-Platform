-- Debug script to check profile creation

-- 1. Check if trigger exists
SELECT routine_name, routine_definition
FROM information_schema.routines
WHERE routine_name = 'handle_new_user';

-- 2. Check if trigger is attached
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- 3. Check auth users (requires service_role key or run in dashboard)
-- Go to Authentication → Users in dashboard to see these

-- 4. Check profiles table
SELECT id, role, name, email, created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 10;

-- 5. If profiles are empty but users exist, manually create profiles:
-- (Replace with actual user IDs from Authentication → Users)
/*
INSERT INTO public.profiles (id, role, name, email)
SELECT 
  id,
  'Brand' as role,
  COALESCE(raw_user_meta_data->>'name', split_part(email, '@', 1)) as name,
  email
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);
*/
