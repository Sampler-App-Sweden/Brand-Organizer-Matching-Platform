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
      <div className="bg-white rounded-lg shadow-sm">
        <div className="text-gray-500">Loading products...</div>
      </div>
    )
  }

  // Show summary if products exist
  if (products.length > 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Your Product Catalog</h2>
            <p className="text-sm text-gray-600 mt-1">
              {products.length} {products.length === 1 ? 'product' : 'products'} available for sponsorship
            </p>
          </div>
          <Link
            to="/dashboard/account?tab=products"
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            Manage <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="flex items-start gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg"
            >
              <div className="flex-shrink-0 mt-0.5">
                <PackageIcon className="h-5 w-5 text-gray-600" />
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
                <div className="text-xs text-gray-500 mt-2">
                  {product.quantity} {product.unit}
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
    <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300">
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
