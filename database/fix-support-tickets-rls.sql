-- Fix Support Tickets RLS Policy to allow both anonymous and authenticated users
-- Run this in your Supabase SQL Editor

-- Drop any existing INSERT policies
DROP POLICY IF EXISTS "Allow anyone to create support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Allow authenticated users to create support tickets" ON public.support_tickets;

-- Create new policy that allows both anonymous and authenticated users
CREATE POLICY "Allow anyone to create support tickets"
  ON public.support_tickets FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Verify the policy was created
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
WHERE tablename = 'support_tickets';
