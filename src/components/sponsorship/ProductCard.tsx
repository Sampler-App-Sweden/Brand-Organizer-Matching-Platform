import React from 'react'
import { EditIcon, TrashIcon, GripIcon, PackageIcon } from 'lucide-react'
import { SponsorshipProduct } from '../../types/sponsorship'

interface ProductCardProps {
  product: SponsorshipProduct
  onEdit: (product: SponsorshipProduct) => void
  onDelete: (productId: string) => void
  onDragStart: (productId: string) => void
  onDragOver: (e: React.DragEvent, productId: string) => void
  onDragEnd: () => void
  isDragging: boolean
}

export function ProductCard({
  product,
  onEdit,
  onDelete,
  onDragStart,
  onDragOver,
  onDragEnd,
  isDragging
}: ProductCardProps) {
  return (
    <div
      className={`bg-white rounded-lg border overflow-hidden shadow-sm transition-all flex flex-col relative ${
        isDragging ? 'opacity-50 border-indigo-300' : 'border-gray-200'
      } hover:shadow-md hover:border-indigo-100 group`}
      draggable
      onDragStart={() => onDragStart(product.id)}
      onDragOver={(e) => onDragOver(e, product.id)}
      onDragEnd={onDragEnd}
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      <div className='flex flex-col flex-1 relative'>
        {/* Drag handle and status */}
        <div
          className='absolute top-2 left-2 cursor-move text-gray-400 hover:text-gray-600 z-10'
          title='Drag to reorder'
        >
          <GripIcon className='h-5 w-5' />
        </div>
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs z-10 ${
            product.status === 'online'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {product.status === 'online' ? 'Online' : 'Hidden'}
        </div>
        {/* Image */}
        <div className='h-40 bg-gray-100 relative overflow-hidden rounded-t-lg'>
          {product.images.length > 0 ? (
            <img
              src={product.images[0].url}
              alt={product.name}
              className='w-full h-full object-cover transition-transform group-hover:scale-105'
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
        {/* Main content */}
        <div className='p-4 flex flex-col flex-1'>
          <h3 className='font-medium text-gray-900 mb-1'>{product.name}</h3>
          <p className='text-sm text-gray-600 line-clamp-2 mb-2'>
            {product.goals}
          </p>
          <div className='flex-1' />
        </div>
        {/* Bottom row: quantity, edit/delete, border */}
        <div className='px-4 pb-2 pt-0 w-full flex items-center justify-between'>
          <span className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800'>
            {product.quantity} {product.unit}
          </span>
          <div className='flex space-x-1'>
            <button
              onClick={() => onEdit(product)}
              className='p-1 text-gray-500 hover:text-indigo-600 transition-colors'
              title='Edit'
            >
              <EditIcon className='h-4 w-4' />
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className='p-1 text-gray-500 hover:text-red-600 transition-colors'
              title='Delete'
            >
              <TrashIcon className='h-4 w-4' />
            </button>
          </div>
        </div>
        <div className='w-full h-1 bg-gradient-to-r from-indigo-500 to-purple-500' />
      </div>
    </div>
  )
}
