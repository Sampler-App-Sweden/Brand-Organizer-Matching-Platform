import React, { useState, useEffect } from 'react'
import { Sparkles } from 'lucide-react'
import { Button } from '../ui'
import { ProductImage, SponsorshipProduct } from '../../types/sponsorship'
import { ImageUpload } from '../media/ImageUpload'

interface ProductFormProps {
  initialData?: Omit<SponsorshipProduct, 'id' | 'order'>
  onSubmit: (data: Omit<SponsorshipProduct, 'id' | 'order'>) => void
  onCancel: () => void
  editing?: boolean
  isSubmitting?: boolean
}

export function ProductForm({
  initialData,
  onSubmit,
  onCancel,
  editing,
  isSubmitting
}: ProductFormProps) {
  const [formData, setFormData] = useState<
    Omit<SponsorshipProduct, 'id' | 'order'>
  >({
    name: '',
    images: [],
    goals: '',
    quantity: 0,
    unit: 'packs',
    details: '',
    status: 'online',
    ...initialData
  })

  useEffect(() => {
    if (initialData) setFormData((prev) => ({ ...prev, ...initialData }))
    // eslint-disable-next-line
  }, [initialData])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: name === 'quantity' ? parseInt(value) || 0 : value
    })
  }

  const handleImagesChange = (images: ProductImage[]) => {
    setFormData({ ...formData, images })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className='mb-8 bg-gray-50 p-6 rounded-lg border border-gray-200 relative'>
      <div className='absolute -top-3 -left-3 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center'>
        <Sparkles className='h-3 w-3 text-indigo-600' />
      </div>
      <h3 className='text-lg font-medium text-gray-900 mb-4'>
        {editing ? 'Edit Product' : 'Add New Product'}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Product Name*
            </label>
            <input
              type='text'
              name='name'
              required
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Product Images (up to 5)
            </label>
            <ImageUpload
              images={formData.images}
              onImagesChange={handleImagesChange}
              maxImages={5}
            />
          </div>
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Sponsorship Goals*
            </label>
            <textarea
              name='goals'
              rows={3}
              required
              placeholder='e.g. brand awareness, sampling feedback, social media buzz'
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={formData.goals}
              onChange={handleInputChange}
            ></textarea>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Sample Quantity*
            </label>
            <div className='flex'>
              <input
                type='number'
                name='quantity'
                min='1'
                required
                className='block w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                value={formData.quantity}
                onChange={handleInputChange}
              />
              <select
                name='unit'
                className='block rounded-r-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border-l-0'
                value={formData.unit}
                onChange={handleInputChange}
              >
                <option value='packs'>packs</option>
                <option value='boxes'>boxes</option>
                <option value='units'>units</option>
                <option value='bottles'>bottles</option>
                <option value='cans'>cans</option>
                <option value='samples'>samples</option>
                <option value='cups'>cups</option>
              </select>
            </div>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Status
            </label>
            <select
              name='status'
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={formData.status}
              onChange={handleInputChange}
            >
              <option value='online'>Online - Available</option>
              <option value='offline'>Offline - Hidden</option>
            </select>
          </div>
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Additional Details
            </label>
            <textarea
              name='details'
              rows={2}
              placeholder='Optional: shipping constraints, timeline, etc.'
              className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={formData.details}
              onChange={handleInputChange}
            ></textarea>
          </div>
        </div>
        <div className='flex justify-end space-x-3'>
          <Button type='button' variant='outline' onClick={onCancel}>
            Cancel
          </Button>
          <Button
            type='submit'
            variant='primary'
            className='bg-gradient-to-r from-green-500 to-green-600'
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : editing
              ? 'Update Product'
              : 'Save Product'}
          </Button>
        </div>
      </form>
    </div>
  )
}
