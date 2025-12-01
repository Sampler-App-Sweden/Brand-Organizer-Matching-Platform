import React, { useState } from 'react'
import { PackageIcon, PlusIcon } from 'lucide-react'
import { Button } from '../ui'
import { ProductForm } from './ProductForm'
import { ProductCard } from './ProductCard'
import {
  SponsorshipProduct,
  ProductSponsorshipManagerProps
} from './sponsorshipTypes'

export function ProductSponsorshipManager({
  initialProducts = [],
  onSave
}: ProductSponsorshipManagerProps) {
  const [products, setProducts] =
    useState<SponsorshipProduct[]>(initialProducts)
  const [editingProduct, setEditingProduct] =
    useState<SponsorshipProduct | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [draggedProduct, setDraggedProduct] = useState<string | null>(null)

  // Add or update product
  const handleFormSubmit = (data: Omit<SponsorshipProduct, 'id' | 'order'>) => {
    let updatedProducts: SponsorshipProduct[]
    if (editingProduct) {
      updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? {
              ...p,
              ...data
            }
          : p
      )
    } else {
      const newProduct: SponsorshipProduct = {
        ...data,
        id: `prod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        order: products.length
      }
      updatedProducts = [...products, newProduct]
    }
    setProducts(updatedProducts)
    setIsFormOpen(false)
    setEditingProduct(null)
    if (onSave) onSave(updatedProducts)
  }

  const handleEdit = (product: SponsorshipProduct) => {
    setEditingProduct(product)
    setIsFormOpen(true)
  }

  const handleDelete = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const updatedProducts = products
        .filter((p) => p.id !== productId)
        .map((p, index) => ({
          ...p,
          order: index
        }))
      setProducts(updatedProducts)
      if (onSave) onSave(updatedProducts)
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
    const reorderedProducts = updatedProducts.map((p, index) => ({
      ...p,
      order: index
    }))
    setProducts(reorderedProducts)
  }

  const handleDragEnd = () => {
    if (draggedProduct && onSave) {
      onSave(products)
    }
    setDraggedProduct(null)
  }

  return (
    <div className='bg-white rounded-lg shadow-sm p-6 border border-gray-200 relative overflow-hidden'>
      {/* Mystical decorative elements */}
      <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-100 via-purple-200 to-indigo-100'></div>
      <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mr-16 -mt-16 opacity-30'></div>
      <div className='absolute bottom-0 left-0 w-24 h-24 bg-purple-50 rounded-full -ml-12 -mb-12 opacity-30'></div>
      <div className='relative z-10'>
        {/* Header */}
        <div className='flex flex-col sm:flex-row sm:items-center justify-between mb-6'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900 flex items-center'>
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
          >
            <PlusIcon className='h-4 w-4 mr-1' />
            Add New Product
          </Button>
        </div>

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
          />
        )}

        {/* Products List */}
        {products.length === 0 ? (
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
    </div>
  )
}
