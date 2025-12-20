-- Migration: Rename interests table to connections
-- Description: Renames the interests table and all related objects to use "connections" terminology
-- Author: Claude
-- Date: 2025-12-20
--
-- IMPORTANT: Run this migration during low-traffic period
-- This migration will lock the table briefly during the rename

-- Step 1: Rename the table
ALTER TABLE IF EXISTS public.interests RENAME TO connections;

-- Step 2: Rename indexes
ALTER INDEX IF EXISTS idx_interests_sender RENAME TO idx_connections_sender;
ALTER INDEX IF EXISTS idx_interests_receiver RENAME TO idx_connections_receiver;
ALTER INDEX IF EXISTS idx_interests_brand_organizer RENAME TO idx_connections_brand_organizer;
ALTER INDEX IF EXISTS idx_interests_created_at RENAME TO idx_connections_created_at;

-- Step 3: Rename constraints
-- Note: Check constraints and unique constraints keep their names automatically
-- We'll rename them explicitly for clarity
ALTER TABLE public.connections RENAME CONSTRAINT no_self_interest TO no_self_connection;
ALTER TABLE public.connections RENAME CONSTRAINT unique_interest TO unique_connection;

-- Step 4: Drop old RLS policies
DROP POLICY IF EXISTS "Users can create interests they send" ON public.connections;
DROP POLICY IF EXISTS "Users can view sent interests" ON public.connections;
DROP POLICY IF EXISTS "Users can view received interests" ON public.connections;
DROP POLICY IF EXISTS "Users can respond to received interests" ON public.connections;
DROP POLICY IF EXISTS "Users can withdraw sent interests" ON public.connections;

-- Step 5: Create new RLS policies with updated names
CREATE POLICY "Users can create connections they send"
ON public.connections
FOR INSERT
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view sent connections"
ON public.connections
FOR SELECT
USING (auth.uid() = sender_id);

CREATE POLICY "Users can view received connections"
ON public.connections
FOR SELECT
USING (auth.uid() = receiver_id);

CREATE POLICY "Users can respond to received connections"
ON public.connections
FOR UPDATE
USING (auth.uid() = receiver_id)
WITH CHECK (auth.uid() = receiver_id);

CREATE POLICY "Users can withdraw sent connections"
ON public.connections
FOR DELETE
USING (auth.uid() = sender_id AND status = 'pending');

-- Step 6: Rename trigger
DROP TRIGGER IF EXISTS update_interests_updated_at_trigger ON public.connections;

CREATE TRIGGER update_connections_updated_at_trigger
BEFORE UPDATE ON public.connections
FOR EACH ROW
EXECUTE FUNCTION public.update_interests_updated_at();

-- Step 7: Rename the function (for clarity, though the old one still works)
DROP FUNCTION IF EXISTS public.update_connections_updated_at();

CREATE OR REPLACE FUNCTION public.update_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Update the trigger to use the new function name
DROP TRIGGER IF EXISTS update_connections_updated_at_trigger ON public.connections;

CREATE TRIGGER update_connections_updated_at_trigger
BEFORE UPDATE ON public.connections
FOR EACH ROW
EXECUTE FUNCTION public.update_connections_updated_at();

-- Step 8: Drop old function
DROP FUNCTION IF EXISTS public.update_interests_updated_at();

-- Step 9: Update table and column comments
COMMENT ON TABLE public.connections IS 'Stores connection expressions between brands and organizers';
COMMENT ON COLUMN public.connections.sender_id IS 'User ID of the person expressing connection interest';
COMMENT ON COLUMN public.connections.receiver_id IS 'User ID of the person receiving the connection interest';
COMMENT ON COLUMN public.connections.status IS 'Status of the connection: pending, accepted, rejected, or withdrawn';

-- Step 10: Verify the migration
-- Run this to check that everything was renamed correctly:
-- SELECT tablename FROM pg_tables WHERE tablename = 'connections';
-- SELECT indexname FROM pg_indexes WHERE tablename = 'connections';
-- SELECT policyname FROM pg_policies WHERE tablename = 'connections';

-- Note: If you need to rollback, create a reverse migration that renames everything back to "interests"
