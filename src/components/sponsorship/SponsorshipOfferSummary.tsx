import { Link } from 'react-router-dom'
import { PackageIcon, ArrowRight } from 'lucide-react'
import { Button } from '../ui'
import { useBrandSponsorship } from '../../hooks/useBrandSponsorship'
import { SPONSORSHIP_TYPE_CONFIGS } from '../../constants/brandSponsorship.constants'

interface SponsorshipOfferSummaryProps {
  brandId: string
}

export function SponsorshipOfferSummary({ brandId }: SponsorshipOfferSummaryProps) {
  const { selectedTypes, status, loading } = useBrandSponsorship(brandId)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-gray-500">Loading sponsorship information...</div>
      </div>
    )
  }

  // Show summary only if published and has types selected
  if (status === 'published' && selectedTypes.length > 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Sponsorship Offerings</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Active sponsorship types visible to organizers
            </p>
          </div>
          <Link
            to="/dashboard/account?tab=sponsorship"
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            Edit <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {selectedTypes.map((typeId) => {
            const config = SPONSORSHIP_TYPE_CONFIGS.find((t) => t.id === typeId)
            if (!config) return null

            const Icon = config.icon

            return (
              <div
                key={typeId}
                className="flex items-start gap-3 p-3 border-l-4 border-indigo-500 bg-indigo-50/50 sm:bg-indigo-50 sm:border-l-0 sm:border sm:border-indigo-200 sm:rounded-lg"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {config.name}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">
                    {config.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  // Show link to configure if not published or no types selected
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-dashed border-gray-300">
      <div className="text-center">
        <PackageIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-semibold text-gray-900">
          Configure Your Sponsorship Offerings
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          {status === 'draft'
            ? 'You have a draft sponsorship offer. Publish it to make it visible to organizers.'
            : 'Set up your sponsorship types to start matching with event organizers.'}
        </p>
        <div className="mt-4">
          <Link to="/dashboard/account?tab=sponsorship">
            <Button variant="primary">
              {status === 'draft' ? 'Continue Setup' : 'Get Started'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
