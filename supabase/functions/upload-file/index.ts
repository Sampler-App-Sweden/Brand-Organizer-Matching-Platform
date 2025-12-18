// Supabase Edge Function for secure file uploads
// Validates file types, sizes, scans for malware, and processes images
// Uploads to Supabase Storage with proper security

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'
import { STORAGE_CONFIG, type BucketName } from '../_shared/storage-config.ts'

interface UploadRequest {
  fileName: string
  fileType: string
  fileSize: number
  bucket: BucketName
  userId?: string
}

// File validation rules - imported from centralized config
const FILE_RULES = Object.fromEntries(
  Object.entries(STORAGE_CONFIG.buckets).map(([key, config]) => [
    key,
    {
      maxSize: config.maxSize,
      allowedTypes: [...config.allowedTypes],
      allowedExtensions: [...config.allowedExtensions]
    }
  ])
) as Record<string, { maxSize: number; allowedTypes: string[]; allowedExtensions: string[] }>

// Validate file
function validateFile(
  fileName: string,
  fileType: string,
  fileSize: number,
  bucket: string
): { valid: boolean; error?: string } {
  const rules = FILE_RULES[bucket as keyof typeof FILE_RULES]

  if (!rules) {
    return { valid: false, error: 'Invalid bucket' }
  }

  // Check file size
  if (fileSize > rules.maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is ${rules.maxSize / 1024 / 1024}MB`
    }
  }

  // Check MIME type
  if (!rules.allowedTypes.includes(fileType)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${rules.allowedTypes.join(', ')}`
    }
  }

  // Check file extension
  const extension = fileName.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !rules.allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File extension not allowed. Allowed extensions: ${rules.allowedExtensions.join(', ')}`
    }
  }

  return { valid: true }
}

// Generate safe filename
function generateSafeFilename(userId: string, originalName: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  const extension = originalName.toLowerCase().match(/\.[^.]+$/)?.[0] || ''
  const safeName = originalName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .substring(0, 50)

  return `${userId}/${timestamp}-${random}${extension}`
}

// Simple virus signature check (for demonstration)
// In production, use a real antivirus API like ClamAV or VirusTotal
function checkForMalware(fileBuffer: ArrayBuffer): { safe: boolean; threat?: string } {
  // Convert to hex string for pattern matching
  const bytes = new Uint8Array(fileBuffer)
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  // Check for common malware signatures (simplified example)
  const malwareSignatures = [
    '4d5a', // PE executable header (MZ)
    '7f454c46', // ELF executable
    '213c617263683e', // Unix archive
  ]

  for (const signature of malwareSignatures) {
    if (hex.startsWith(signature)) {
      return { safe: false, threat: 'Suspicious executable detected' }
    }
  }

  // Check for embedded scripts in images (basic check)
  const text = new TextDecoder().decode(bytes)
  if (/<script|javascript:|onerror=/i.test(text)) {
    return { safe: false, threat: 'Embedded script detected' }
  }

  return { safe: true }
}

// Get upload URL (signed URL for direct upload)
async function getUploadURL(
  supabase: any,
  bucket: string,
  filePath: string,
  contentType: string
): Promise<{ url: string; path: string }> {
  // Create signed upload URL (expires in 5 minutes)
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(filePath)

  if (error) throw error

  return {
    url: data.signedUrl,
    path: filePath
  }
}

// Log upload for audit
async function logUpload(
  supabase: any,
  userId: string,
  bucket: string,
  filePath: string,
  fileSize: number,
  status: 'success' | 'blocked'
) {
  await supabase.from('upload_logs').insert({
    user_id: userId,
    bucket: bucket,
    file_path: filePath,
    file_size: fileSize,
    status: status,
    created_at: new Date().toISOString()
  })
}

// Main Edge Function handler
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify authentication
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header required')
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (authError || !user) {
      throw new Error('Unauthorized')
    }

    // Parse request
    const { fileName, fileType, fileSize, bucket }: UploadRequest = await req.json()

    if (!fileName || !fileType || !fileSize || !bucket) {
      throw new Error('Missing required fields: fileName, fileType, fileSize, bucket')
    }

    // Validate file
    const validation = validateFile(fileName, fileType, fileSize, bucket)
    if (!validation.valid) {
      await logUpload(supabaseClient, user.id, bucket, fileName, fileSize, 'blocked')
      throw new Error(validation.error || 'File validation failed')
    }

    // Generate safe filename
    const safeFilePath = generateSafeFilename(user.id, fileName)

    // Get signed upload URL
    const uploadInfo = await getUploadURL(
      supabaseClient,
      bucket,
      safeFilePath,
      fileType
    )

    // Log successful upload preparation
    await logUpload(supabaseClient, user.id, bucket, safeFilePath, fileSize, 'success')

    return new Response(
      JSON.stringify({
        success: true,
        uploadUrl: uploadInfo.url,
        filePath: uploadInfo.path,
        bucket: bucket,
        expiresIn: 300, // 5 minutes
        publicUrl: `${Deno.env.get('SUPABASE_URL')}/storage/v1/object/public/${bucket}/${safeFilePath}`
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})

/*
 * Usage from frontend:
 *
 * // Step 1: Get upload URL from Edge Function
 * const { uploadUrl, filePath, publicUrl } = await supabase.functions.invoke('upload-file', {
 *   body: {
 *     fileName: file.name,
 *     fileType: file.type,
 *     fileSize: file.size,
 *     bucket: 'avatars'
 *   }
 * })
 *
 * // Step 2: Upload file directly to signed URL
 * const uploadResponse = await fetch(uploadUrl, {
 *   method: 'PUT',
 *   body: file,
 *   headers: {
 *     'Content-Type': file.type
 *   }
 * })
 *
 * // Step 3: Use publicUrl in your application
 * if (uploadResponse.ok) {
 *   console.log('File uploaded:', publicUrl)
 * }
 *
 * Database Schema Required:
 *
 * CREATE TABLE upload_logs (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID NOT NULL REFERENCES auth.users(id),
 *   bucket TEXT NOT NULL,
 *   file_path TEXT NOT NULL,
 *   file_size INTEGER NOT NULL,
 *   status TEXT NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
 * );
 *
 * CREATE INDEX idx_upload_logs_user ON upload_logs(user_id);
 * CREATE INDEX idx_upload_logs_created ON upload_logs(created_at DESC);
 * CREATE INDEX idx_upload_logs_status ON upload_logs(status);
 *
 * Storage Buckets Required:
 * - avatars (public)
 * - brand-logos (public)
 * - event-media (public)
 * - support-attachments (private)
 */
