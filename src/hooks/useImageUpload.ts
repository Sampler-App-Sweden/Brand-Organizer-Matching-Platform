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
      // Upload original files without WebP conversion (temporary fix for Supabase issue)
      for (let index = 0; index < fileArray.length; index++) {
        const file = fileArray[index]
        try {
          // Ensure unique ID by using baseTimestamp + index + random string
          const uniqueId = `img-${baseTimestamp}-${index}-${Math.random().toString(36).substring(2, 15)}`

          // Create data URL for preview
          const dataUrl = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => resolve(reader.result as string)
            reader.onerror = reject
            reader.readAsDataURL(file)
          })

          const newImage: ProductImage = {
            id: uniqueId,
            url: dataUrl,
            file: file // Use original file instead of WebP
          }

          newImages.push(newImage)
        } catch (error) {
          console.error('Failed to process image:', error)
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
