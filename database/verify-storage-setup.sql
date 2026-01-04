-- ============================================
-- Verify Storage Bucket Configuration
-- Run this in Supabase SQL Editor to check your setup
-- ============================================

-- Check if all required buckets exist
SELECT
  'Bucket Status' as check_type,
  id as bucket_name,
  public as is_public,
  file_size_limit,
  CASE
    WHEN file_size_limit = 1048576 THEN '1MB'
    WHEN file_size_limit = 2097152 THEN '2MB'
    WHEN file_size_limit = 3145728 THEN '3MB'
    WHEN file_size_limit = 5242880 THEN '5MB'
    ELSE file_size_limit::text || ' bytes'
  END as size_limit_readable,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE id IN ('avatars', 'brand-logos', 'event-media', 'support-attachments')
ORDER BY id;

-- Check storage policies for brand-logos bucket
SELECT
  'Brand Logos Policies' as check_type,
  policyname as policy_name,
  cmd as command_type,
  roles,
  qual as using_expression,
  with_check as check_expression
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
  AND policyname LIKE '%brand%'
ORDER BY policyname;

-- Check for any recent upload errors (requires storage.objects access)
SELECT
  'Recent Brand Logo Uploads' as check_type,
  name as file_path,
  bucket_id,
  owner,
  created_at,
  updated_at,
  CASE
    WHEN metadata->>'size' IS NOT NULL
    THEN (metadata->>'size')::bigint
    ELSE NULL
  END as file_size_bytes,
  CASE
    WHEN (metadata->>'size')::bigint > 2097152
    THEN 'TOO LARGE (>2MB)'
    ELSE 'OK'
  END as size_check
FROM storage.objects
WHERE bucket_id = 'brand-logos'
ORDER BY created_at DESC
LIMIT 10;

-- Summary check
DO $$
DECLARE
  bucket_count INTEGER;
  policy_count INTEGER;
  expected_buckets TEXT[] := ARRAY['avatars', 'brand-logos', 'event-media', 'support-attachments'];
  expected_policies INTEGER := 16; -- 4 policies per bucket (SELECT, INSERT, UPDATE, DELETE)
BEGIN
  -- Check buckets
  SELECT COUNT(*) INTO bucket_count
  FROM storage.buckets
  WHERE id = ANY(expected_buckets);

  -- Check policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'objects'
    AND schemaname = 'storage';

  RAISE NOTICE '========================================';
  RAISE NOTICE 'STORAGE SETUP VERIFICATION';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Buckets: % / % configured', bucket_count, array_length(expected_buckets, 1);

  IF bucket_count < array_length(expected_buckets, 1) THEN
    RAISE WARNING 'Missing buckets! Expected 4, found %', bucket_count;
    RAISE NOTICE 'Run setup-storage-buckets.sql to create missing buckets';
  ELSE
    RAISE NOTICE '✅ All buckets configured';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE 'Policies: % configured', policy_count;

  IF policy_count < expected_policies THEN
    RAISE WARNING 'Missing storage policies! Expected at least %, found %', expected_policies, policy_count;
    RAISE NOTICE 'Run setup-storage-buckets.sql to create missing policies';
  ELSE
    RAISE NOTICE '✅ Storage policies configured';
  END IF;

  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;
