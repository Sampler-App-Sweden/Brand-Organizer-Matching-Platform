-- Verify that all connection indexes exist
-- Run this in Supabase SQL Editor to check if indexes are properly set up

-- Check if indexes exist
SELECT
  schemaname,
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'connections'
ORDER BY indexname;

-- Check table structure
SELECT
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'connections'
ORDER BY ordinal_position;

-- Check RLS policies
SELECT
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'connections';

-- Count rows in connections table
SELECT COUNT(*) as total_connections FROM connections;

-- Sample query to test performance
EXPLAIN ANALYZE
SELECT *
FROM connections
WHERE sender_id = (SELECT id FROM auth.users LIMIT 1)
ORDER BY created_at DESC;
