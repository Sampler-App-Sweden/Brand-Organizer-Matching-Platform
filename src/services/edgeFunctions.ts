// Helper service for calling Supabase Edge Functions
import { supabase } from './supabaseClient'

/**
 * Generate matches for a brand or organizer
 */
export const generateMatches = async (
  type: 'brand' | 'organizer',
  entityId: string
): Promise<{ success: boolean; matchCount: number; matches: any[] }> => {
  const { data, error } = await supabase.functions.invoke('generate-matches', {
    body: { type, entityId }
  })

  if (error) {
    console.error('Error calling generate-matches function:', error)
    throw error
  }

  return data
}

/**
 * Send an email using templates
 */
export const sendEmail = async (params: {
  to: string
  subject: string
  template: 'welcome' | 'new_match' | 'match_accepted' | 'support_ticket' | 'custom'
  data?: Record<string, any>
  html?: string
}): Promise<{ success: boolean; emailId?: string; message: string }> => {
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: params
  })

  if (error) {
    console.error('Error calling send-email function:', error)
    throw error
  }

  return data
}

/**
 * Process a payment (Stripe integration)
 */
export const processPayment = async (params: {
  amount: number // in cents
  currency: string
  userId: string
  description: string
  metadata?: Record<string, any>
}): Promise<{
  success: boolean
  paymentIntentId?: string
  clientSecret?: string
  status?: string
  message?: string
}> => {
  const { data, error } = await supabase.functions.invoke('process-payment', {
    body: params
  })

  if (error) {
    console.error('Error calling process-payment function:', error)
    throw error
  }

  return data
}

/**
 * AI Assistant - Detect intent, extract profile info, generate questions
 */
export const callAIAssistant = async (params: {
  type: 'detect-intent' | 'extract-profile' | 'generate-questions' | 'generate-suggestions'
  input: string
  context?: {
    role?: 'brand' | 'organizer' | 'community'
    draftProfile?: any
    conversation?: Array<{ role: string; content: string; timestamp: string }>
  }
}): Promise<{ success: boolean; result: any }> => {
  const { data, error } = await supabase.functions.invoke('ai-assistant', {
    body: params
  })

  if (error) {
    console.error('Error calling ai-assistant function:', error)
    throw error
  }

  return data
}

/**
 * Track analytics event or error
 */
export const trackEvent = async (params: {
  type: 'event' | 'error'
  data: {
    event?: string
    userId?: string
    sessionId?: string
    properties?: Record<string, any>
    // For errors:
    type?: string
    message?: string
    stack?: string
    metadata?: Record<string, any>
  }
}): Promise<{ success: boolean; message: string }> => {
  const { data, error } = await supabase.functions.invoke('track-analytics', {
    body: params
  })

  if (error) {
    console.error('Error calling track-analytics function:', error)
    // Don't throw on analytics errors
    return { success: false, message: error.message }
  }

  return data
}

/**
 * Admin operations (requires admin role)
 */
export const adminOperation = async (params: {
  action: 'get-users' | 'update-user-role' | 'delete-user' | 'ban-user' |
          'bulk-delete' | 'get-stats' | 'purge-old-data'
  data?: Record<string, any>
}): Promise<{ success: boolean; result: any }> => {
  const { data, error } = await supabase.functions.invoke('admin-operations', {
    body: params
  })

  if (error) {
    console.error('Error calling admin-operations function:', error)
    throw error
  }

  return data
}

/**
 * Export user data (GDPR request or admin report)
 */
export const exportData = async (params: {
  type: 'user-data' | 'admin-report' | 'gdpr-request'
  format: 'json' | 'csv'
  userId?: string
  filters?: {
    dateFrom?: string
    dateTo?: string
    includeDeleted?: boolean
    tables?: string[]
  }
}): Promise<Blob> => {
  const { data, error } = await supabase.functions.invoke('export-data', {
    body: params
  })

  if (error) {
    console.error('Error calling export-data function:', error)
    throw error
  }

  // Convert response to blob for download
  return new Blob([JSON.stringify(data)], { type: 'application/json' })
}

/**
 * Get signed URL for file upload
 */
export const getUploadURL = async (params: {
  fileName: string
  fileType: string
  fileSize: number
  bucket: 'avatars' | 'brand-logos' | 'event-media' | 'support-attachments'
}): Promise<{
  success: boolean
  uploadUrl: string
  filePath: string
  publicUrl: string
  expiresIn: number
}> => {
  const { data, error } = await supabase.functions.invoke('upload-file', {
    body: params
  })

  if (error) {
    console.error('Error calling upload-file function:', error)
    throw error
  }

  return data
}

/**
 * Upload a file securely with automatic image optimization
 * Images are converted to WebP format for optimal file size
 * Returns the public URL of the uploaded file
 */
export const uploadFile = async (
  file: File,
  bucket: 'avatars' | 'brand-logos' | 'event-media' | 'support-attachments',
  options?: {
    skipOptimization?: boolean
    onOptimizationComplete?: (result: { originalSize: number; optimizedSize: number; savings: number }) => void
  }
): Promise<string> => {
  let fileToUpload = file

  // Step 1: Optimize image if it's an image file
  if (!options?.skipOptimization && file.type.startsWith('image/')) {
    try {
      const { optimizeImage, getRecommendedQuality, getRecommendedDimensions } = await import('@/utils/imageOptimizer')

      const quality = getRecommendedQuality(bucket)
      const dimensions = getRecommendedDimensions(bucket)

      const result = await optimizeImage(file, {
        quality,
        ...dimensions
      })

      if (result.wasOptimized) {
        console.log(`Image optimized: ${result.originalSize} → ${result.optimizedSize} bytes (${result.savings.toFixed(1)}% saved)`)
        fileToUpload = result.file

        // Notify caller of optimization results
        options?.onOptimizationComplete?.({
          originalSize: result.originalSize,
          optimizedSize: result.optimizedSize,
          savings: result.savings
        })
      }
    } catch (error) {
      console.warn('Image optimization failed, uploading original:', error)
      // Continue with original file if optimization fails
    }
  }

  // Step 2: Get signed upload URL
  const uploadInfo = await getUploadURL({
    fileName: fileToUpload.name,
    fileType: fileToUpload.type,
    fileSize: fileToUpload.size,
    bucket
  })

  // Step 3: Upload file to signed URL
  const uploadResponse = await fetch(uploadInfo.uploadUrl, {
    method: 'PUT',
    body: fileToUpload,
    headers: {
      'Content-Type': fileToUpload.type
    }
  })

  if (!uploadResponse.ok) {
    throw new Error('Failed to upload file')
  }

  // Step 4: Return public URL
  return uploadInfo.publicUrl
}
