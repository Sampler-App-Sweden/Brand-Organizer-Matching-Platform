-- Run this in Supabase SQL Editor to diagnose the login issue

-- Check if all triggers exist
SELECT
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY trigger_name;

-- Check if profiles exist for demo accounts
SELECT
  p.id,
  p.email,
  p.role,
  p.name,
  au.email as auth_email,
  au.email_confirmed_at
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE au.email IN ('brand@demo.com', 'organizer@demo.com');

-- Check for any failed function definitions
SELECT
  proname as function_name,
  prosrc as function_body
FROM pg_proc
WHERE pronamespace = 'public'::regnamespace
  AND proname IN ('handle_new_user', 'sync_profile_to_related');

-- Check RLS policies on profiles table
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';
