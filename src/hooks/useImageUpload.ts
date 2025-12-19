import { useState } from 'react'
import { ProductImage } from '../types/sponsorship'
import { validateImageUpload, convertToWebP } from '../utils/imageUploadLimits'

export interface UseImageUploadOptions {
  maxImages: number
  onError?: (error: string) => void
}

export function useImageUpload({ maxImages, onError }: UseImageUploadOptions) {
  const [isProcessing, setIsProcessing] = useState(false)

  const processImageUpload = async (
    files: FileList | null,
    currentImages: ProductImage[]
  ): Promise<ProductImage[]> => {
    if (!files) return []

    // Validate upload
    const validation = validateImageUpload(files, currentImages.length, maxImages)
    if (!validation.valid) {
      const error = validation.error || 'Invalid image upload'
      if (onError) {
        onError(error)
      } else {
        alert(error)
      }
      return []
    }

    setIsProcessing(true)
    const fileArray = Array.from(files)
    const baseTimestamp = Date.now()
    const newImages: ProductImage[] = []

    try {
      // Convert all images to WebP
      for (let index = 0; index < fileArray.length; index++) {
        const file = fileArray[index]
        try {
          // Ensure unique ID by using baseTimestamp + index + random string
          const uniqueId = `img-${baseTimestamp}-${index}-${Math.random().toString(36).substring(2, 15)}`
          const { dataUrl, blob } = await convertToWebP(file)

          // Create a new File object from the blob with .webp extension
          const webpFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
            type: 'image/webp'
          })

          const newImage: ProductImage = {
            id: uniqueId,
            url: dataUrl,
            file: webpFile
          }

          newImages.push(newImage)
        } catch (error) {
          console.error('Failed to convert image to WebP:', error)
          const errorMsg = `Failed to process image: ${file.name}`
          if (onError) {
            onError(errorMsg)
          } else {
            alert(errorMsg)
          }
        }
      }
    } finally {
      setIsProcessing(false)
    }

    return newImages
  }

  return {
    processImageUpload,
    isProcessing
  }
}
