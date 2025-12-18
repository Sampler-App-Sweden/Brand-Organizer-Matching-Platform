#!/usr/bin/env -S deno run --allow-read --allow-write

// Script to sync storage config to SQL file
// Run this whenever you update storage-config.ts

import { STORAGE_CONFIG } from '../functions/_shared/storage-config.ts'

const SQL_FILE_PATH = '../database/setup-storage-buckets.sql'

function generateBucketInserts(): string {
  const buckets = Object.values(STORAGE_CONFIG.buckets)

  const values = buckets.map(bucket => {
    const mimeTypes = bucket.allowedTypes.map(t => `'${t}'`).join(', ')
    return `  (
    '${bucket.name}',
    '${bucket.name}',
    ${bucket.public},  -- ${bucket.public ? 'public' : 'private'} bucket
    ${bucket.maxSize},  -- ${bucket.maxSizeLabel} limit
    ARRAY[${mimeTypes}]
  )`
  }).join(',\n')

  return `INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
${values}
ON CONFLICT (id) DO NOTHING;`
}

function generateFullSQL(): string {
  const bucketInserts = generateBucketInserts()
  const bucketList = Object.keys(STORAGE_CONFIG.buckets).map(k => `'${k}'`).join(', ')

  return `-- ============================================
-- Supabase Storage Buckets Setup
-- Run this in Supabase SQL Editor
-- ============================================

-- ⚠️ IMPORTANT: This file is AUTO-GENERATED from:
-- supabase/functions/_shared/storage-config.ts
--
-- To update limits:
-- 1. Edit storage-config.ts
-- 2. Run: deno run --allow-read --allow-write supabase/scripts/sync-storage-config.ts
-- 3. Or run: npm run sync-storage-config

-- Note: Storage buckets are usually created via the Supabase Dashboard
-- but here's the SQL equivalent if you prefer

-- ============================================
-- Create Storage Buckets
-- ============================================

-- Insert buckets (if they don't exist)
-- See supabase/functions/_shared/storage-config.ts for the source of truth
${bucketInserts}

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
  buckets TEXT[] := ARRAY[${bucketList}];
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
`
}

// Main execution
async function main() {
  console.log('🔄 Syncing storage config to SQL file...\n')

  // Show current config
  console.log('📦 Current Storage Configuration:')
  Object.entries(STORAGE_CONFIG.buckets).forEach(([key, config]) => {
    console.log(`  ${key.padEnd(20)} ${config.maxSizeLabel.padEnd(8)} ${config.public ? 'Public' : 'Private'}`)
  })

  // Generate SQL
  const sql = generateFullSQL()

  // Get file path relative to script location
  const scriptDir = new URL('.', import.meta.url).pathname
  const sqlFilePath = new URL(SQL_FILE_PATH, import.meta.url).pathname

  // Write to file
  await Deno.writeTextFile(sqlFilePath, sql)

  console.log(`\n✅ SQL file updated: ${SQL_FILE_PATH}`)
  console.log('\nNext steps:')
  console.log('1. Review the generated SQL file')
  console.log('2. Run it in Supabase SQL Editor')
  console.log('3. Or update existing buckets via Dashboard > Storage')
}

if (import.meta.main) {
  main()
}
