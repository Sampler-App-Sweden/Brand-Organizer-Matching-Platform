import { useEffect, useState } from 'react'
import { XIcon, ChevronLeftIcon, ChevronRightIcon, PackageIcon } from 'lucide-react'
import { SponsorshipProduct } from '../../types/sponsorship'

interface ProductDetailModalProps {
  product: SponsorshipProduct | null
  onClose: () => void
}

export function ProductDetailModal({
  product,
  onClose
}: ProductDetailModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (product) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [product, onClose])

  useEffect(() => {
    setCurrentImageIndex(0)
  }, [product])

  if (!product) return null

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center z-10'>
          <h2 className='text-2xl font-bold text-gray-900'>{product.name}</h2>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors'
          >
            <XIcon className='h-6 w-6 text-gray-600' />
          </button>
        </div>

        <div className='p-6 space-y-6'>
          <div className='relative'>
            {product.images.length > 0 ? (
              <>
                <div className='bg-gray-100 rounded-xl overflow-hidden h-96 flex items-center justify-center'>
                  <img
                    src={product.images[currentImageIndex].url}
                    alt={`${product.name} - Image ${currentImageIndex + 1}`}
                    className='max-w-full max-h-full object-contain'
                  />
                </div>
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className='absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all'
                    >
                      <ChevronLeftIcon className='h-6 w-6 text-gray-800' />
                    </button>
                    <button
                      onClick={nextImage}
                      className='absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full p-2 shadow-lg transition-all'
                    >
                      <ChevronRightIcon className='h-6 w-6 text-gray-800' />
                    </button>
                    <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-60 text-white text-sm px-3 py-1 rounded-full'>
                      {currentImageIndex + 1} / {product.images.length}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className='bg-gray-100 rounded-xl h-96 flex items-center justify-center'>
                <PackageIcon className='h-24 w-24 text-gray-400' />
              </div>
            )}
          </div>

          <div className='flex items-center gap-2'>
            <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800'>
              {product.quantity} {product.unit}
            </span>
          </div>

          <div>
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              Sponsorship Goals
            </h3>
            <p className='text-gray-700 leading-relaxed'>{product.goals}</p>
          </div>

          {product.details && (
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                Additional Details
              </h3>
              <p className='text-gray-700 leading-relaxed'>{product.details}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
