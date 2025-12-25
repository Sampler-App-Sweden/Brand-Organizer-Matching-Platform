import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout'
import { DASHBOARD_CLASSES } from '../../constants/dashboardStyles.constants'
import { useAuth } from '../../context/AuthContext'
import {
  getBrandByUserId,
  getMatchesForBrand,
  getOrganizersByIds
} from '../../services/dataService'
import { UsersIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react'
import { Button, LoadingSpinner } from '../../components/ui'
import { ProductSponsorshipSummary } from '../../components/sponsorship/ProductSponsorshipSummary'
import { SponsorshipOfferSummary } from '../../components/sponsorship/SponsorshipOfferSummary'
import { Brand, Organizer, Match } from '../../types'
import { MatchRow } from '../dashboard/MatchRow'
import { StatsCard } from '../../components/dashboard/StatsCard'

export function BrandDashboard() {
  const { currentUser } = useAuth()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [organizersById, setOrganizersById] = useState<
    Record<string, Organizer>
  >({})
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const loadData = async () => {
      if (currentUser) {
        try {
          const brandData = await getBrandByUserId(currentUser.id)
          setBrand(brandData)
          if (brandData) {
            const matchData = await getMatchesForBrand(brandData.id)
            setMatches(matchData)

            const organizerIds = Array.from(
              new Set(matchData.map((m) => m.organizerId))
            )
            if (organizerIds.length) {
              try {
                const organizers = await getOrganizersByIds(organizerIds)
                const map = organizers.reduce<Record<string, Organizer>>(
                  (acc, org) => {
                    acc[org.id] = org
                    return acc
                  },
                  {}
                )
                setOrganizersById(map)
              } catch (organizerError) {
                console.error(
                  'Failed to load organizers for matches:',
                  organizerError
                )
                setOrganizersById({})
              }
            } else {
              setOrganizersById({})
            }
          } else {
            setMatches([])
            setOrganizersById({})
          }
        } catch (error) {
          console.error('Failed to load brand dashboard data:', error)
        }
      }
      setLoading(false)
    }
    loadData()
  }, [currentUser])
  if (loading) {
    return (
      <DashboardLayout userType='brand'>
        <div className='flex justify-center items-center h-64'>
          <LoadingSpinner size={64} />
        </div>
      </DashboardLayout>
    )
  }
  if (!brand) {
    return (
      <DashboardLayout userType='brand'>
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Complete Your Profile
          </h2>
          <p className='text-gray-600 mb-4'>
            You need to complete your brand profile before you can start
            matching with event organizers.
          </p>
          <div className='flex gap-3'>
            <Link to='/brand'>
              <Button variant='primary'>Create Brand Profile</Button>
            </Link>
            <Link to='/dashboard/account'>
              <Button variant='outline'>Edit Basic Info</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }
  const pendingMatches = matches.filter((m) => m.status === 'pending')
  const acceptedMatches = matches.filter((m) => m.status === 'accepted')
  return (
    <DashboardLayout userType='brand'>
      <div className='mb-6 flex justify-between items-start'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Brand Dashboard</h1>
          <p className='text-gray-600'>
            Welcome back, {currentUser?.name}. Here's an overview of your
            sponsorship opportunities.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className={DASHBOARD_CLASSES.statsGrid}>
        <StatsCard
          icon={UsersIcon}
          iconColor='indigo'
          label='Total Matches'
          value={matches.length}
          sublabel='Brand-organizer connections'
        />
        <StatsCard
          icon={AlertCircleIcon}
          iconColor='yellow'
          label='Pending Matches'
          value={pendingMatches.length}
          sublabel='Awaiting response'
        />
        <StatsCard
          icon={CheckCircleIcon}
          iconColor='green'
          label='Active Sponsorships'
          value={acceptedMatches.length}
          sublabel='Confirmed partnerships'
        />
      </div>

      {/* Sponsorship Offer Summary */}
      <div className='mb-6'>
        <SponsorshipOfferSummary brandId={brand.id} />
      </div>

      {/* Product Sponsorship Summary */}
      <div className='mb-6'>
        <ProductSponsorshipSummary brandId={brand.id} />
      </div>

      {/* Recent matches */}
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-gray-900'>Recent Matches</h2>
          <Link
            to='/dashboard/brand/matches'
            className='text-sm text-indigo-600 hover:text-indigo-800'
          >
            View all
          </Link>
        </div>
        {matches.length === 0 ? (
          <div className='text-gray-500 text-center py-8'>
            No matches found yet. Our AI will match you with relevant event
            organizers soon.
          </div>
        ) : (
          <div className='overflow-x-auto bg-white rounded-lg shadow-sm'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Match Score
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Event
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {matches.slice(0, 5).map((match) => (
                  <MatchRow
                    key={match.id}
                    match={match}
                    organizer={organizersById[match.organizerId]}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Profile summary */}
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-gray-900'>Your Profile</h2>
          <Link
            to='/dashboard/account'
            className='text-sm text-indigo-600 hover:text-indigo-800'
          >
            Edit profile
          </Link>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <h3 className='text-sm font-medium text-gray-500 mb-1'>Company</h3>
            <p className='text-gray-900'>{brand.companyName}</p>
          </div>
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <h3 className='text-sm font-medium text-gray-500 mb-1'>Product</h3>
            <p className='text-gray-900'>{brand.productName}</p>
          </div>
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <h3 className='text-sm font-medium text-gray-500 mb-1'>Industry</h3>
            <p className='text-gray-900'>
              {brand.industry === 'food_beverage'
                ? 'Food & Beverage'
                : brand.industry === 'beauty_cosmetics'
                ? 'Beauty & Cosmetics'
                : brand.industry === 'health_wellness'
                ? 'Health & Wellness'
                : brand.industry === 'tech'
                ? 'Technology'
                : brand.industry === 'fashion'
                ? 'Fashion & Apparel'
                : brand.industry === 'home_goods'
                ? 'Home Goods'
                : brand.industry === 'sports_fitness'
                ? 'Sports & Fitness'
                : brand.industry === 'entertainment'
                ? 'Entertainment'
                : 'Other'}
            </p>
          </div>
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <h3 className='text-sm font-medium text-gray-500 mb-1'>
              Budget Range
            </h3>
            <p className='text-gray-900'>
              {brand.budget === 'under_1000'
                ? 'Under $1,000'
                : brand.budget === '1000_5000'
                ? '$1,000 - $5,000'
                : brand.budget === '5000_10000'
                ? '$5,000 - $10,000'
                : brand.budget === '10000_25000'
                ? '$10,000 - $25,000'
                : brand.budget === '25000_plus'
                ? '$25,000+'
                : 'Not specified'}
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
