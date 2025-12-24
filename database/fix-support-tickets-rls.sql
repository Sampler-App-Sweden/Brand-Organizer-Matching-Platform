-- Fix Support Tickets RLS Policy to only allow authenticated users
-- Run this in your Supabase SQL Editor

-- Drop any existing INSERT policies
DROP POLICY IF EXISTS "Allow anyone to create support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Allow authenticated users to create support tickets" ON public.support_tickets;

-- Create new policy that only allows authenticated users
CREATE POLICY "Allow authenticated users to create support tickets"
  ON public.support_tickets FOR INSERT
  TO authenticated
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
