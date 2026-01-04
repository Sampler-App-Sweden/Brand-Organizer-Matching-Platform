-- ============================================
-- Supabase Storage Buckets Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- ⚠️ IMPORTANT: These limits are centrally managed in:
-- supabase/functions/_shared/storage-config.ts
-- Update limits there to keep everything in sync!

-- Note: Storage buckets are usually created via the Supabase Dashboard
-- but here's the SQL equivalent if you prefer

-- ============================================
-- Create Storage Buckets
-- ============================================

-- Insert buckets (if they don't exist)
-- See supabase/functions/_shared/storage-config.ts for the source of truth
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'avatars',
    'avatars',
    true,  -- public bucket
    1048576,  -- 1MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  ),
  (
    'brand-logos',
    'brand-logos',
    true,  -- public bucket
    2097152,  -- 2MB limit
    ARRAY['image/jpeg', 'image/png', 'image/svg+xml', 'image/webp']
  ),
  (
    'event-media',
    'event-media',
    true,  -- public bucket
    5242880,  -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  ),
  (
    'support-attachments',
    'support-attachments',
    false,  -- private bucket
    3145728,  -- 3MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain']
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- Storage Policies
-- ============================================

-- Avatars bucket policies
-- Anyone can view avatars (public bucket)
DROP POLICY IF EXISTS "Public can view avatars" ON storage.objects;
CREATE POLICY "Public can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

-- Authenticated users can upload their own avatars
DROP POLICY IF EXISTS "Users can upload own avatar" ON storage.objects;
CREATE POLICY "Users can upload own avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own avatars
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own avatars
DROP POLICY IF EXISTS "Users can delete own avatar" ON storage.objects;
CREATE POLICY "Users can delete own avatar"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'avatars' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Brand Logos bucket policies
-- Anyone can view brand logos (public bucket)
DROP POLICY IF EXISTS "Public can view brand logos" ON storage.objects;
CREATE POLICY "Public can view brand logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'brand-logos');

-- Authenticated users can upload their own brand logos
DROP POLICY IF EXISTS "Users can upload own brand logo" ON storage.objects;
CREATE POLICY "Users can upload own brand logo"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'brand-logos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own brand logos
DROP POLICY IF EXISTS "Users can update own brand logo" ON storage.objects;
CREATE POLICY "Users can update own brand logo"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'brand-logos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own brand logos
DROP POLICY IF EXISTS "Users can delete own brand logo" ON storage.objects;
CREATE POLICY "Users can delete own brand logo"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'brand-logos' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Event Media bucket policies
-- Anyone can view event media (public bucket)
DROP POLICY IF EXISTS "Public can view event media" ON storage.objects;
CREATE POLICY "Public can view event media"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'event-media');

-- Authenticated users can upload their own event media
DROP POLICY IF EXISTS "Users can upload own event media" ON storage.objects;
CREATE POLICY "Users can upload own event media"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'event-media' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own event media
DROP POLICY IF EXISTS "Users can update own event media" ON storage.objects;
CREATE POLICY "Users can update own event media"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'event-media' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own event media
DROP POLICY IF EXISTS "Users can delete own event media" ON storage.objects;
CREATE POLICY "Users can delete own event media"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'event-media' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Support Attachments bucket policies (PRIVATE)
-- Users can only view their own support attachments
DROP POLICY IF EXISTS "Users can view own support attachments" ON storage.objects;
CREATE POLICY "Users can view own support attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'support-attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Admins can view all support attachments
DROP POLICY IF EXISTS "Admins can view all support attachments" ON storage.objects;
CREATE POLICY "Admins can view all support attachments"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'support-attachments' AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'Admin'
    )
  );

-- Users can upload support attachments
DROP POLICY IF EXISTS "Users can upload support attachments" ON storage.objects;
CREATE POLICY "Users can upload support attachments"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'support-attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own support attachments
DROP POLICY IF EXISTS "Users can delete own support attachments" ON storage.objects;
CREATE POLICY "Users can delete own support attachments"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'support-attachments' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- ============================================
-- Verify Storage Setup
-- ============================================

-- Check if all buckets exist
DO $$
DECLARE
  buckets TEXT[] := ARRAY['avatars', 'brand-logos', 'event-media', 'support-attachments'];
  b TEXT;
  missing_buckets TEXT[] := ARRAY[]::TEXT[];
BEGIN
  FOREACH b IN ARRAY buckets
  LOOP
    IF NOT EXISTS (
      SELECT FROM storage.buckets
      WHERE id = b
    ) THEN
      missing_buckets := array_append(missing_buckets, b);
    END IF;
  END LOOP;

  IF array_length(missing_buckets, 1) > 0 THEN
    RAISE NOTICE 'Missing storage buckets: %', array_to_string(missing_buckets, ', ');
    RAISE NOTICE 'You can create them in the Supabase Dashboard: Storage > New Bucket';
  ELSE
    RAISE NOTICE 'All storage buckets created successfully! ✅';
  END IF;
END $$;
