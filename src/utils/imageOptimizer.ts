/**
 * Client-side image optimization utility
 * Converts images to WebP format before upload
 */

export interface OptimizationOptions {
  quality?: number // 0-1, default 0.85
  maxWidth?: number // Max width in pixels
  maxHeight?: number // Max height in pixels
}

export interface OptimizationResult {
  file: File
  originalSize: number
  optimizedSize: number
  savings: number // Percentage saved
  wasOptimized: boolean
}

/**
 * Optimize image to WebP format
 * Reduces file size by ~25-35% while maintaining quality
 */
export async function optimizeImage(
  file: File,
  options: OptimizationOptions = {}
): Promise<OptimizationResult> {
  const { quality = 0.85, maxWidth = 2048, maxHeight = 2048 } = options

  // Skip optimization for non-image files
  if (!file.type.startsWith('image/')) {
    return {
      file,
      originalSize: file.size,
      optimizedSize: file.size,
      savings: 0,
      wasOptimized: false
    }
  }

  // Skip if already WebP and under size limit
  if (file.type === 'image/webp' && file.size < 1024 * 1024) {
    return {
      file,
      originalSize: file.size,
      optimizedSize: file.size,
      savings: 0,
      wasOptimized: false
    }
  }

  try {
    // Load image
    const img = await loadImage(file)

    // Calculate new dimensions (maintain aspect ratio)
    let { width, height } = img
    if (width > maxWidth || height > maxHeight) {
      const ratio = Math.min(maxWidth / width, maxHeight / height)
      width = Math.round(width * ratio)
      height = Math.round(height * ratio)
    }

    // Create canvas and draw image
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')

    if (!ctx) {
      throw new Error('Failed to get canvas context')
    }

    // Enable image smoothing for better quality
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'

    // Draw image to canvas
    ctx.drawImage(img, 0, 0, width, height)

    // Convert to WebP blob
    const blob = await canvasToBlob(canvas, quality)

    // Create new file with .webp extension
    const originalName = file.name.replace(/\.[^.]+$/, '')

    // Create a proper File object from the blob
    // Use a more explicit approach to ensure the type is preserved
    const optimizedFile = new File([blob], `${originalName}.webp`, {
      type: 'image/webp',
      lastModified: Date.now()
    })

    const savings = ((file.size - optimizedFile.size) / file.size) * 100

    return {
      file: optimizedFile,
      originalSize: file.size,
      optimizedSize: optimizedFile.size,
      savings: Math.max(0, savings),
      wasOptimized: true
    }
  } catch (error) {
    console.error('Image optimization failed:', error)
    // Return original file if optimization fails
    return {
      file,
      originalSize: file.size,
      optimizedSize: file.size,
      savings: 0,
      wasOptimized: false
    }
  }
}

/**
 * Load image from file
 */
function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject

    const reader = new FileReader()
    reader.onload = (e) => {
      img.src = e.target?.result as string
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Convert canvas to blob
 */
function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Failed to convert canvas to blob'))
        }
      },
      'image/webp',
      quality
    )
  })
}

/**
 * Optimize multiple images in parallel
 */
export async function optimizeImages(
  files: File[],
  options: OptimizationOptions = {}
): Promise<OptimizationResult[]> {
  return Promise.all(files.map(file => optimizeImage(file, options)))
}

/**
 * Get recommended quality based on bucket type
 */
export function getRecommendedQuality(bucket: string): number {
  switch (bucket) {
    case 'avatars':
      return 0.85 // High quality for profile pictures
    case 'brand-logos':
      return 0.90 // Very high quality for logos
    case 'event-media':
      return 0.80 // Balanced for event photos
    case 'support-attachments':
      return 0.75 // Lower quality acceptable for support tickets
    default:
      return 0.85
  }
}

/**
 * Get recommended max dimensions based on bucket type
 */
export function getRecommendedDimensions(bucket: string): { maxWidth: number; maxHeight: number } {
  switch (bucket) {
    case 'avatars':
      return { maxWidth: 512, maxHeight: 512 } // Small for avatars
    case 'brand-logos':
      return { maxWidth: 1024, maxHeight: 1024 } // Medium for logos
    case 'event-media':
      return { maxWidth: 2048, maxHeight: 2048 } // Large for event photos
    case 'support-attachments':
      return { maxWidth: 1600, maxHeight: 1600 } // Medium for attachments
    default:
      return { maxWidth: 2048, maxHeight: 2048 }
  }
}
