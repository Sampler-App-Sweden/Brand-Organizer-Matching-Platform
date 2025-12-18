/**
 * Centralized image upload limits for different contexts
 */

export const IMAGE_LIMITS = {
  // File size limits (in bytes)
  MAX_FILE_SIZE: 2 * 1024 * 1024, // 2MB

  // Maximum number of images by context
  PRODUCT: 3,
  EVENT: 3,
  PROFILE: 5,

  // WebP conversion quality (0-1, where 1 is highest quality)
  WEBP_QUALITY: 0.85,
} as const

/**
 * Validates uploaded files against size and count limits
 */
export function validateImageUpload(
  files: FileList | File[],
  currentImageCount: number,
  maxImages: number
): { valid: boolean; error?: string } {
  const fileArray = Array.isArray(files) ? files : Array.from(files)

  // Check total count
  if (currentImageCount + fileArray.length > maxImages) {
    return {
      valid: false,
      error: `You can only upload up to ${maxImages} images.`,
    }
  }

  // Check file sizes
  const oversizedFiles = fileArray.filter(
    (file) => file.size > IMAGE_LIMITS.MAX_FILE_SIZE
  )
  if (oversizedFiles.length > 0) {
    const fileNames = oversizedFiles.map((f) => f.name).join(', ')
    const sizeMB = IMAGE_LIMITS.MAX_FILE_SIZE / (1024 * 1024)
    return {
      valid: false,
      error: `The following files exceed the ${sizeMB}MB limit: ${fileNames}`,
    }
  }

  return { valid: true }
}

/**
 * Gets human-readable limit text for UI display
 */
export function getImageLimitText(maxImages: number): string {
  const sizeMB = IMAGE_LIMITS.MAX_FILE_SIZE / (1024 * 1024)
  return `MAX. ${sizeMB}MB each, ${maxImages} images total`
}

/**
 * Converts an image file to WebP format using Canvas API
 */
export function convertToWebP(
  file: File
): Promise<{ dataUrl: string; blob: Blob }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        // Create canvas and draw image
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          reject(new Error('Could not get canvas context'))
          return
        }

        ctx.drawImage(img, 0, 0)

        // Convert to WebP
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to convert image to WebP'))
              return
            }

            // Convert blob to data URL for preview
            const blobReader = new FileReader()
            blobReader.onloadend = () => {
              resolve({
                dataUrl: blobReader.result as string,
                blob,
              })
            }
            blobReader.readAsDataURL(blob)
          },
          'image/webp',
          IMAGE_LIMITS.WEBP_QUALITY
        )
      }

      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = e.target?.result as string
    }

    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })
}
