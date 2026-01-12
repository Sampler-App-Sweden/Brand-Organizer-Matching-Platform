import { useState, useEffect } from 'react'
import { Plus, Package, Trash2, Edit2, Save, Eye, EyeOff, Upload, X } from 'lucide-react'
import { DashboardLayout } from '../../components/layout'
import { useAuth } from '../../context/AuthContext'
import { useBrandProducts } from '../../hooks/useBrandProducts'
import { useImageUpload } from '../../hooks/useImageUpload'
import { getBrandByUserId } from '../../services/dataService'
import { Button } from '../../components/ui'
import type { SponsorshipProduct, SponsorshipStatus, ProductImage } from '../../types/sponsorship'
import { IMAGE_LIMITS, getImageLimitText } from '../../utils/imageUploadLimits'

type ViewMode = 'list' | 'create' | 'edit'

export function ProductsPage() {
  const { currentUser } = useAuth()
  const userType = currentUser?.type

  const [brandId, setBrandId] = useState<string | undefined>()
  const [loadingBrand, setLoadingBrand] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchBrandId = async () => {
      if (!currentUser?.id) {
        setLoadingBrand(false)
        return
      }

      try {
        const brand = await getBrandByUserId(currentUser.id)
        if (isMounted && brand) {
          setBrandId(brand.id)
        }
      } catch (error) {
        console.error('Failed to fetch brand:', error)
      } finally {
        if (isMounted) {
          setLoadingBrand(false)
        }
      }
    }

    fetchBrandId()
    return () => {
      isMounted = false
    }
  }, [currentUser?.id])

  const {
    products,
    loading,
    isSubmitting,
    feedback,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleToggleStatus,
    clearFeedback
  } = useBrandProducts(brandId)

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

  const [name, setName] = useState('')
  const [goals, setGoals] = useState('')
  const [quantity, setQuantity] = useState(0)
  const [unit, setUnit] = useState('')
  const [details, setDetails] = useState('')
  const [status, setStatus] = useState<SponsorshipStatus>('online')
  const [images, setImages] = useState<ProductImage[]>([])

  const { processImageUpload } = useImageUpload({
    maxImages: IMAGE_LIMITS.PRODUCT
  })

  const resetForm = () => {
    setName('')
    setGoals('')
    setQuantity(0)
    setUnit('')
    setDetails('')
    setStatus('online')
    setImages([])
  }

  const loadProductForEdit = (productId: string) => {
    const product = products.find((p) => p.id === productId)
    if (!product) return

    setName(product.name)
    setGoals(product.goals)
    setQuantity(product.quantity)
    setUnit(product.unit)
    setDetails(product.details || '')
    setStatus(product.status)
    setImages(product.images || [])

    setSelectedProductId(productId)
    setViewMode('edit')
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files

    const newImages = await processImageUpload(files, images)
    if (newImages.length > 0) {
      setImages((prev) => [...prev, ...newImages])
    }

    // Reset the input so the same file can be uploaded again if needed
    e.target.value = ''
  }

  const handleRemoveImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!brandId) return

    const productData: Omit<SponsorshipProduct, 'id'> = {
      name,
      goals,
      quantity,
      unit,
      details: details || undefined,
      status,
      images,
      order: products.length
    }

    if (viewMode === 'edit' && selectedProductId) {
      const result = await handleUpdateProduct(selectedProductId, productData)
      if (result) {
        resetForm()
        setViewMode('list')
        setSelectedProductId(null)
      }
    } else {
      const result = await handleCreateProduct(productData)
      if (result) {
        resetForm()
        setViewMode('list')
      }
    }
  }

  const handleCancel = () => {
    resetForm()
    setViewMode('list')
    setSelectedProductId(null)
    clearFeedback()
  }

  const handleDelete = async (productId: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this product? This action cannot be undone.'
      )
    ) {
      await handleDeleteProduct(productId)
    }
  }

  if (loadingBrand || loading) {
    return (
      <DashboardLayout userType={userType || 'brand'}>
        <div className='flex items-center justify-center h-64'>
          <div className='text-gray-500'>Loading products...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType={userType || 'brand'}>
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Products</h1>
          <p className='text-gray-600'>
            Manage your sponsorship products and showcase them to organizers
          </p>
        </div>
        {viewMode === 'list' && (
          <Button
            variant='primary'
            onClick={() => {
              resetForm()
              setViewMode('create')
            }}
          >
            <Plus className='h-5 w-5 mr-2' />
            Create Product
          </Button>
        )}
      </div>

      {feedback && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {viewMode === 'list' && (
        <div>
          {products.length === 0 ? (
            <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
              <Package className='h-16 w-16 mx-auto mb-4 text-gray-400' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No products yet
              </h3>
              <p className='text-gray-600 mb-6'>
                Create your first sponsorship product to showcase to organizers
              </p>
              <Button
                variant='primary'
                onClick={() => {
                  resetForm()
                  setViewMode('create')
                }}
              >
                <Plus className='h-5 w-5 mr-2' />
                Create Product
              </Button>
            </div>
          ) : (
            <div className='space-y-4'>
              {products.map((product) => (
                <div
                  key={product.id}
                  className='bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <h3 className='text-xl font-semibold text-gray-900'>
                          {product.name}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            product.status === 'online'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {product.status === 'online' ? 'Online' : 'Offline'}
                        </span>
                      </div>
                      <p className='text-gray-700 mb-3'>{product.goals}</p>
                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        <span>
                          Quantity: {product.quantity} {product.unit}
                        </span>
                        {product.images.length > 0 && (
                          <span>{product.images.length} image{product.images.length > 1 ? 's' : ''}</span>
                        )}
                      </div>
                      {product.details && (
                        <p className='text-sm text-gray-600 mt-2'>
                          {product.details}
                        </p>
                      )}
                      {product.images.length > 0 && (
                        <div className='flex gap-2 mt-3 flex-wrap'>
                          {product.images.slice(0, 3).map((image, index) => (
                            <img
                              key={image.id || `${product.id}-img-${index}`}
                              src={image.url}
                              alt='Product'
                              className='w-16 h-16 object-cover rounded border border-gray-200'
                            />
                          ))}
                          {product.images.length > 3 && (
                            <div className='w-16 h-16 flex items-center justify-center bg-gray-100 rounded border border-gray-200 text-xs text-gray-600'>
                              +{product.images.length - 3} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() =>
                          handleToggleStatus(product.id, product.status)
                        }
                        className='p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors'
                        title={
                          product.status === 'online'
                            ? 'Set offline'
                            : 'Set online'
                        }
                      >
                        {product.status === 'online' ? (
                          <EyeOff className='h-5 w-5' />
                        ) : (
                          <Eye className='h-5 w-5' />
                        )}
                      </button>
                      <button
                        onClick={() => loadProductForEdit(product.id)}
                        className='p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors'
                        title='Edit'
                      >
                        <Edit2 className='h-5 w-5' />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className='p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                        title='Delete'
                      >
                        <Trash2 className='h-5 w-5' />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {(viewMode === 'create' || viewMode === 'edit') && (
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-6'>
            {viewMode === 'create' ? 'Create New Product' : 'Edit Product'}
          </h2>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Product Name *
              </label>
              <input
                type='text'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder='e.g., Energy Drink Sample Packs'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Goals *
              </label>
              <textarea
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
                required
                rows={4}
                placeholder='What are the goals for this sponsorship product?'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Quantity *
                </label>
                <input
                  type='number'
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                  required
                  min='0'
                  placeholder='e.g., 500'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Unit *
                </label>
                <input
                  type='text'
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                  placeholder='e.g., units, packs, bottles'
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Additional Details
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
                placeholder='Any additional information about this product...'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Product Images
              </label>
              <div className='space-y-3'>
                {images.length > 0 && (
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    {images.map((image, index) => (
                      <div key={image.id || `form-img-${index}`} className='relative group'>
                        <img
                          src={image.url}
                          alt='Product'
                          className='w-full h-32 object-cover rounded-lg border border-gray-300'
                        />
                        <button
                          type='button'
                          onClick={() => handleRemoveImage(image.id)}
                          className='absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                        >
                          <X className='h-4 w-4' />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className='flex items-center justify-center w-full'>
                  <label className='flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors'>
                    <div className='flex flex-col items-center justify-center pt-5 pb-6'>
                      <Upload className='h-8 w-8 mb-2 text-gray-500' />
                      <p className='mb-2 text-sm text-gray-500'>
                        <span className='font-semibold'>Click to upload</span> or drag and drop
                      </p>
                      <p className='text-xs text-gray-500'>PNG, JPG, SVG (auto-converted to WebP, {getImageLimitText(IMAGE_LIMITS.PRODUCT)})</p>
                    </div>
                    <input
                      type='file'
                      className='hidden'
                      accept='image/*'
                      multiple
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Status *
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as SponsorshipStatus)}
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
              >
                <option value='online'>Online (Visible to organizers)</option>
                <option value='offline'>Offline (Hidden from organizers)</option>
              </select>
            </div>

            <div className='flex gap-3 pt-6 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type='submit' variant='primary' disabled={isSubmitting}>
                <Save className='h-5 w-5 mr-2' />
                {isSubmitting
                  ? 'Saving...'
                  : viewMode === 'create'
                  ? 'Create Product'
                  : 'Update Product'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </DashboardLayout>
  )
}
