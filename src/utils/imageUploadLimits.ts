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
