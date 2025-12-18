import { useRef } from 'react'
import { ImageIcon, XIcon } from 'lucide-react'
import { ProductImage } from '../../types/sponsorship'
import { IMAGE_LIMITS, validateImageUpload, getImageLimitText } from '../../utils/imageUploadLimits'

interface ImageUploadProps {
  images: ProductImage[]
  onImagesChange: (images: ProductImage[]) => void
  maxImages?: number
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = IMAGE_LIMITS.PROFILE
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    // Validate upload
    const validation = validateImageUpload(files, images.length, maxImages)
    if (!validation.valid) {
      alert(validation.error)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    const fileArray = Array.from(files)
    const newImages: ProductImage[] = []
    let loadedCount = 0

    fileArray.forEach((file, index) => {
      const reader = new FileReader()
      const uniqueId = `img-${Date.now()}-${index}-${Math.random().toString(36).substring(2, 15)}`

      reader.onloadend = () => {
        const url = reader.result as string
        newImages.push({
          id: uniqueId,
          url,
          file
        })
        loadedCount++

        // Only update once all images are loaded
        if (loadedCount === fileArray.length) {
          onImagesChange([...images, ...newImages])
        }
      }
      reader.readAsDataURL(file)
    })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const removeImage = (imageId: string) => {
    onImagesChange(images.filter((img) => img.id !== imageId))
  }

  return (
    <div>
      <div className='flex flex-wrap gap-3 mb-3'>
        {images.map((image) => (
          <div
            key={image.id}
            className='relative h-24 w-24 rounded-md overflow-hidden border border-gray-200 group'
          >
            <img
              src={image.url}
              alt='Product'
              className='h-full w-full object-cover'
            />
            <button
              type='button'
              onClick={() => removeImage(image.id)}
              className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
            >
              <XIcon className='h-3 w-3' />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <button
            type='button'
            onClick={() => fileInputRef.current?.click()}
            className='h-24 w-24 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md text-gray-400 hover:text-gray-500 hover:border-gray-400 transition-colors'
          >
            <ImageIcon className='h-8 w-8 mb-1' />
            <span className='text-xs'>Add Image</span>
          </button>
        )}
      </div>
      <input
        type='file'
        ref={fileInputRef}
        accept='image/*'
        multiple
        className='hidden'
        onChange={handleImageUpload}
      />
      <p className='text-xs text-gray-500'>
        Accepted formats: JPG, PNG, GIF. {getImageLimitText(maxImages)}
      </p>
    </div>
  )
}
