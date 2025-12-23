import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PackageIcon, ArrowRight } from 'lucide-react'
import { Button } from '../ui'
import { fetchSponsorshipProducts } from '../../services/sponsorshipService'
import { SponsorshipProduct } from '../../types/sponsorship'

interface ProductSponsorshipSummaryProps {
  brandId: string
}

export function ProductSponsorshipSummary({ brandId }: ProductSponsorshipSummaryProps) {
  const [products, setProducts] = useState<SponsorshipProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProducts = async () => {
      if (!brandId) return

      setLoading(true)
      try {
        const data = await fetchSponsorshipProducts(brandId)
        setProducts(data)
      } catch (error) {
        console.error('Failed to load sponsorship products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [brandId])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-gray-500">Loading products...</div>
      </div>
    )
  }

  // Show summary if products exist
  if (products.length > 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Product Catalog</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {products.length} {products.length === 1 ? 'product' : 'products'} available for sponsorship
            </p>
          </div>
          <Link
            to="/dashboard/account?tab=products"
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            Manage <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {products.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="flex items-start gap-3 p-3 border-l-4 border-indigo-500 bg-indigo-50/50 sm:bg-gray-50 sm:border-l-0 sm:border sm:border-gray-200 sm:rounded-lg"
            >
              <div className="flex-shrink-0 mt-0.5">
                <PackageIcon className="h-5 w-5 text-indigo-600 sm:text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm truncate">
                  {product.name}
                </h3>
                {product.details && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {product.details}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-500">
                    {product.quantity} {product.unit}
                  </span>
                  {product.goals && (
                    <>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500 truncate">
                        {product.goals}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length > 6 && (
          <div className="mt-4 text-center">
            <Link
              to="/dashboard/account?tab=products"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View all {products.length} products →
            </Link>
          </div>
        )}
      </div>
    )
  }

  // Show link to add products if none exist
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-dashed border-gray-300">
      <div className="text-center">
        <PackageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-semibold text-gray-900">
          Add Products to Your Catalog
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Showcase specific products you can offer as sponsorships to event organizers.
        </p>
        <div className="mt-4">
          <Link to="/dashboard/account?tab=products">
            <Button variant="primary">
              Add Your First Product
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
