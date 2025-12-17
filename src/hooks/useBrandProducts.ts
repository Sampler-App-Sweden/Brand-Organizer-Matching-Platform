import { useEffect, useState } from 'react'
import type { SponsorshipProduct } from '../types/sponsorship'
import {
  fetchSponsorshipProducts,
  createSponsorshipProduct,
  updateSponsorshipProduct,
  deleteSponsorshipProduct
} from '../services/sponsorshipService'

type FeedbackState = { type: 'success' | 'error'; message: string } | null

export function useBrandProducts(brandId?: string) {
  const [products, setProducts] = useState<SponsorshipProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState>(null)

  useEffect(() => {
    if (!brandId) {
      setProducts([])
      setLoading(false)
      return
    }

    let isMounted = true

    const loadProducts = async () => {
      setLoading(true)
      try {
        const data = await fetchSponsorshipProducts(brandId)
        if (!isMounted) return
        setProducts(data)
        setFeedback(null)
      } catch (error) {
        console.error(error)
        if (isMounted) {
          setFeedback({
            type: 'error',
            message: 'Failed to load products. Please try again.'
          })
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadProducts()
    return () => {
      isMounted = false
    }
  }, [brandId])

  const handleCreateProduct = async (
    product: Omit<SponsorshipProduct, 'id'>
  ): Promise<SponsorshipProduct | null> => {
    if (!brandId) return null

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const newProduct = await createSponsorshipProduct(brandId, product)
      setProducts((prev) => [newProduct, ...prev])
      setFeedback({
        type: 'success',
        message: 'Product created successfully.'
      })
      return newProduct
    } catch (error) {
      console.error(error)
      setFeedback({
        type: 'error',
        message: 'Failed to create product. Please try again.'
      })
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateProduct = async (
    productId: string,
    product: Omit<SponsorshipProduct, 'id'>
  ): Promise<SponsorshipProduct | null> => {
    setIsSubmitting(true)
    setFeedback(null)

    try {
      const updatedProduct = await updateSponsorshipProduct(productId, product)
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? updatedProduct : p))
      )
      setFeedback({
        type: 'success',
        message: 'Product updated successfully.'
      })
      return updatedProduct
    } catch (error) {
      console.error(error)
      setFeedback({
        type: 'error',
        message: 'Failed to update product. Please try again.'
      })
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (productId: string): Promise<boolean> => {
    setIsSubmitting(true)
    setFeedback(null)

    try {
      await deleteSponsorshipProduct(productId)
      setProducts((prev) => prev.filter((p) => p.id !== productId))
      setFeedback({
        type: 'success',
        message: 'Product deleted successfully.'
      })
      return true
    } catch (error) {
      console.error(error)
      setFeedback({
        type: 'error',
        message: 'Failed to delete product. Please try again.'
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async (
    productId: string,
    currentStatus: 'online' | 'offline'
  ): Promise<SponsorshipProduct | null> => {
    const product = products.find((p) => p.id === productId)
    if (!product) return null

    const newStatus: 'online' | 'offline' =
      currentStatus === 'online' ? 'offline' : 'online'

    return handleUpdateProduct(productId, {
      ...product,
      status: newStatus
    })
  }

  const clearFeedback = () => setFeedback(null)

  return {
    products,
    loading,
    isSubmitting,
    feedback,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleToggleStatus,
    clearFeedback
  }
}
