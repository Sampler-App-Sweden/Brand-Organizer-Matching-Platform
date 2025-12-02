import { useRef } from 'react'
import { ImageIcon, XIcon } from 'lucide-react'
import { ProductImage } from '../../types/sponsorship'

interface ImageUploadProps {
  images: ProductImage[]
  onImagesChange: (images: ProductImage[]) => void
  maxImages?: number
}

export function ImageUpload({
  images,
  onImagesChange,
  maxImages = 5
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    let newImages = [...images]
    Array.from(files).forEach((file) => {
      // Validate file type and size in parent
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        newImages.push({
          id: `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          url,
          file
        })
        if (newImages.length > maxImages)
          newImages = newImages.slice(0, maxImages)
        onImagesChange([...newImages])
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
        Accepted formats: JPG, PNG, GIF. Max size: 2MB per image.
      </p>
    </div>
  )
}
