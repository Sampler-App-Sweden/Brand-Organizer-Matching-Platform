/**
 * Image validation and upload helper
 * Validates images before upload and provides user-friendly error messages
 */

import { STORAGE_CONFIG } from '../../supabase/functions/_shared/storage-config'
import { optimizeImage, getRecommendedQuality, getRecommendedDimensions } from './imageOptimizer'

export interface ValidationResult {
  valid: boolean
  error?: string
  file?: File
  originalFile: File
  wasOptimized?: boolean
  optimizationDetails?: {
    originalSize: number
    optimizedSize: number
    savings: number
  }
}

/**
 * Validate and optimize an image for a specific storage bucket
 * Returns the optimized file if successful, or an error message if invalid
 */
export async function validateAndOptimizeImage(
  file: File,
  bucketName: keyof typeof STORAGE_CONFIG.buckets
): Promise<ValidationResult> {
  const config = STORAGE_CONFIG.buckets[bucketName]

  if (!config) {
    return {
      valid: false,
      error: `Unknown storage bucket: ${bucketName}`,
      originalFile: file
    }
  }

  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    return {
      valid: false,
      error: 'Please select an image file',
      originalFile: file
    }
  }

  // Check file type against allowed types
  if (!config.allowedTypes.includes(file.type as any)) {
    const allowedFormats = config.allowedExtensions
      .map(ext => ext.replace('.', '').toUpperCase())
      .join(', ')
    return {
      valid: false,
      error: `Invalid file type. Please use: ${allowedFormats}`,
      originalFile: file
    }
  }

  // Try to optimize the image first
  const quality = getRecommendedQuality(bucketName)
  const dimensions = getRecommendedDimensions(bucketName)

  let optimizedFile = file
  let wasOptimized = false
  let optimizationDetails

  try {
    const result = await optimizeImage(file, {
      quality,
      ...dimensions
    })

    if (result.wasOptimized) {
      optimizedFile = result.file
      wasOptimized = true
      optimizationDetails = {
        originalSize: result.originalSize,
        optimizedSize: result.optimizedSize,
        savings: result.savings
      }
    }
  } catch (error) {
    console.warn('Image optimization failed, using original file:', error)
    // Continue with original file if optimization fails
  }

  // Check file size after optimization
  if (optimizedFile.size > config.maxSize) {
    const maxSizeMB = (config.maxSize / (1024 * 1024)).toFixed(1)
    const fileSizeMB = (optimizedFile.size / (1024 * 1024)).toFixed(1)

    return {
      valid: false,
      error: `Image is too large (${fileSizeMB}MB). Maximum size for ${bucketName} is ${maxSizeMB}MB. Try using a smaller image or reduce its dimensions.`,
      originalFile: file
    }
  }

  return {
    valid: true,
    file: optimizedFile,
    originalFile: file,
    wasOptimized,
    optimizationDetails
  }
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`
}

/**
 * Get user-friendly success message after optimization
 */
export function getOptimizationMessage(result: ValidationResult): string | null {
  if (!result.wasOptimized || !result.optimizationDetails) {
    return null
  }

  const { originalSize, optimizedSize, savings } = result.optimizationDetails

  if (savings < 5) {
    return null // Don't show message if savings are minimal
  }

  return `Image optimized: ${formatFileSize(originalSize)} → ${formatFileSize(optimizedSize)} (${savings.toFixed(0)}% smaller)`
}

/**
 * Validate multiple images for upload
 */
export async function validateAndOptimizeImages(
  files: File[],
  bucketName: keyof typeof STORAGE_CONFIG.buckets
): Promise<ValidationResult[]> {
  return Promise.all(
    files.map(file => validateAndOptimizeImage(file, bucketName))
  )
}

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): boolean {
  const canvas = document.createElement('canvas')
  canvas.width = 1
  canvas.height = 1
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0
}

/**
 * Get bucket configuration for display
 */
export function getBucketInfo(bucketName: keyof typeof STORAGE_CONFIG.buckets) {
  const config = STORAGE_CONFIG.buckets[bucketName]

  if (!config) {
    return null
  }

  return {
    name: config.name,
    maxSize: config.maxSize,
    maxSizeLabel: config.maxSizeLabel,
    allowedTypes: config.allowedTypes,
    allowedExtensions: config.allowedExtensions,
    description: config.description
  }
}
