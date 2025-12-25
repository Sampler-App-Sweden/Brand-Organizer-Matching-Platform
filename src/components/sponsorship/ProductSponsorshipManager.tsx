import React, { useEffect, useRef, useState } from 'react'
import { PackageIcon, PlusIcon } from 'lucide-react'
import { Button } from '../ui'
import { ProductForm } from './ProductForm'
import { ProductCard } from './ProductCard'
import {
  SponsorshipProduct,
  ProductSponsorshipManagerProps
} from '../../types/sponsorship'
import {
  fetchSponsorshipProducts,
  createSponsorshipProduct,
  updateSponsorshipProduct,
  deleteSponsorshipProduct,
  updateProductOrders
} from '../../services/sponsorshipService'

export function ProductSponsorshipManager({
  brandId,
  onSave
}: ProductSponsorshipManagerProps) {
  const [products, setProducts] = useState<SponsorshipProduct[]>([])
  const [editingProduct, setEditingProduct] =
    useState<SponsorshipProduct | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [draggedProduct, setDraggedProduct] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const latestProductsRef = useRef<SponsorshipProduct[]>([])

  useEffect(() => {
    latestProductsRef.current = products
  }, [products])

  useEffect(() => {
    if (!brandId) {
      setLoading(false)
      setProducts([])
      return
    }

    const loadProducts = async () => {
      setLoading(true)
      try {
        const data = await fetchSponsorshipProducts(brandId)
        setProducts(data)
        setError(null)
        onSave?.(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load sponsorship products. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [brandId, onSave])

  // Add or update product
  const handleFormSubmit = async (
    data: Omit<SponsorshipProduct, 'id' | 'order'>
  ) => {
    if (!brandId) return
    setSaving(true)
    try {
      let updatedList: SponsorshipProduct[]
      if (editingProduct) {
        const updated = await updateSponsorshipProduct(editingProduct.id, {
          ...data,
          order: editingProduct.order
        })
        updatedList = products.map((product) =>
          product.id === updated.id ? updated : product
        )
      } else {
        const created = await createSponsorshipProduct(brandId, {
          ...data,
          order: products.length
        })
        updatedList = [...products, created]
      }
      setProducts(updatedList)
      onSave?.(updatedList)
      setIsFormOpen(false)
      setEditingProduct(null)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Failed to save sponsorship product. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (product: SponsorshipProduct) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (!brandId) return
    if (!confirm('Are you sure you want to delete this product?')) return

    try {
      await deleteSponsorshipProduct(productId)
      const updatedProducts = products
        .filter((product) => product.id !== productId)
        .map((product, index) => ({ ...product, order: index }))
      setProducts(updatedProducts)
      onSave?.(updatedProducts)
      await updateProductOrders(
        updatedProducts.map((product, index) => ({
          id: product.id,
          order: index
        }))
      )
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Failed to delete sponsorship product. Please try again.')
    }
  }

  const handleDragStart = (productId: string) => {
    setDraggedProduct(productId)
  }

  const handleDragOver = (e: React.DragEvent, productId: string) => {
    e.preventDefault()
    if (!draggedProduct || draggedProduct === productId) return
    const draggedIndex = products.findIndex((p) => p.id === draggedProduct)
    const targetIndex = products.findIndex((p) => p.id === productId)
    if (draggedIndex === -1 || targetIndex === -1) return
    const updatedProducts = [...products]
    const [draggedItem] = updatedProducts.splice(draggedIndex, 1)
    updatedProducts.splice(targetIndex, 0, draggedItem)
    const reorderedProducts = updatedProducts.map((product, index) => ({
      ...product,
      order: index
    }))
    setProducts(reorderedProducts)
  }

  const handleDragEnd = async () => {
    if (!draggedProduct || !brandId) {
      setDraggedProduct(null)
      return
    }

    try {
      const orderedProducts = latestProductsRef.current
      await updateProductOrders(
        orderedProducts.map((product, index) => ({
          id: product.id,
          order: index
        }))
      )
      onSave?.(orderedProducts)
      setError(null)
    } catch (err) {
      console.error(err)
      setError('Failed to update product order. Please try again.')
    }
    setDraggedProduct(null)
  }

  if (!brandId) {
    return (
      <div className='py-8'>
        <p className='text-gray-600'>
          Complete your brand profile to start adding sponsorship products.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6'>
        <div>
          <h2 className='text-xl font-bold text-gray-900 flex items-center'>
            <PackageIcon className='h-5 w-5 text-indigo-600 mr-2' />
            Your Sponsorship Products
          </h2>
          <p className='text-sm text-gray-600 mt-1'>
            Upload images, set goals, and sample quantities for each item.
          </p>
        </div>
          <Button
            variant='primary'
            className='mt-4 sm:mt-0 flex items-center bg-gradient-to-r from-green-500 to-green-600'
            onClick={() => {
              setIsFormOpen(true)
              setEditingProduct(null)
            }}
            disabled={saving}
          >
            <PlusIcon className='h-4 w-4 mr-1' />
            Add New Product
          </Button>
        </div>

        {error && (
          <div className='mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700'>
            {error}
          </div>
        )}

        {/* Product Form */}
        {isFormOpen && (
          <ProductForm
            initialData={
              editingProduct
                ? {
                    name: editingProduct.name,
                    images: editingProduct.images,
                    goals: editingProduct.goals,
                    quantity: editingProduct.quantity,
                    unit: editingProduct.unit,
                    details: editingProduct.details || '',
                    status: editingProduct.status
                  }
                : undefined
            }
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false)
              setEditingProduct(null)
            }}
            editing={!!editingProduct}
            isSubmitting={saving}
          />
        )}

        {/* Products List */}
        {loading ? (
          <div className='text-center py-12 text-gray-500'>
            Loading your products...
          </div>
        ) : products.length === 0 ? (
          <div className='text-center py-12 bg-gray-50 rounded-lg border border-dashed border-gray-300'>
            <PackageIcon className='h-12 w-12 text-gray-400 mx-auto mb-3' />
            <h3 className='text-lg font-medium text-gray-900 mb-1'>
              No Products Yet
            </h3>
            <p className='text-gray-500 mb-4'>
              Add your first sponsorship product to get started
            </p>
            <Button
              variant='primary'
              className='flex items-center mx-auto'
              onClick={() => {
                setIsFormOpen(true)
                setEditingProduct(null)
              }}
              disabled={saving}
            >
              <PlusIcon className='h-4 w-4 mr-1' />
              Add New Product
            </Button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {products
              .sort((a, b) => a.order - b.order)
              .map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  isDragging={draggedProduct === product.id}
                />
              ))}
          </div>
        )}
    </div>
  )
}
