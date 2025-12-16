import { PackageIcon } from 'lucide-react'
import { SponsorshipProduct } from '../../types/sponsorship'

interface ProductDisplayCardProps {
  product: SponsorshipProduct
  onClick: () => void
}

export function ProductDisplayCard({
  product,
  onClick
}: ProductDisplayCardProps) {
  return (
    <div
      className='bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-indigo-200 cursor-pointer'
      onClick={onClick}
    >
      <div className='relative'>
        <div className='h-40 bg-gray-100 relative overflow-hidden'>
          {product.images.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className='w-full h-full object-cover transition-transform hover:scale-105'
            />
          ) : (
            <div className='w-full h-full flex items-center justify-center bg-gray-100 text-gray-400'>
              <PackageIcon className='h-12 w-12' />
            </div>
          )}
          {product.images.length > 1 && (
            <div className='absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-full'>
              {product.images.length} images
            </div>
          )}
        </div>
        <div className='p-4'>
          <h3 className='font-medium text-gray-900 mb-1'>{product.name}</h3>
          <p className='text-sm text-gray-600 line-clamp-2 mb-2'>
            {product.goals}
          </p>
          <div className='flex justify-between items-center'>
            <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
              {product.quantity} {product.unit}
            </span>
          </div>
        </div>
      </div>
      <div className='h-1 w-full bg-gradient-to-r from-transparent via-indigo-200 to-transparent'></div>
    </div>
  )
}
