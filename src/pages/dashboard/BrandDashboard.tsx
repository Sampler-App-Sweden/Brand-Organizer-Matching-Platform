import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout'
import { useAuth } from '../../context/AuthContext'
import {
  getBrandByUserId,
  getMatchesForBrand
} from '../../services/dataService'
import { Match } from '../../services/matchingService'
import { TrendingUpIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react'
import { Button } from '../../components/ui'
import { BrandSponsorshipPanel } from '../../components/sponsorship/BrandSponsorshipPanel'
import { ProductSponsorshipManager } from '../../components/sponsorship/ProductSponsorshipManager'
import { Brand, Organizer } from '../../types'

export function BrandDashboard() {
  const { currentUser } = useAuth()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
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
          } else {
            setMatches([])
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
          <div className='text-gray-500'>Loading...</div>
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
            <Link to='/dashboard/edit-profile'>
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
        <Link to='/dashboard/edit-profile'>
          <Button variant='outline'>Edit Profile</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <div className='flex items-center'>
            <div className='bg-indigo-100 rounded-md p-3'>
              <TrendingUpIcon className='h-6 w-6 text-indigo-600' />
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Total Matches
              </h3>
              <p className='text-2xl font-bold text-gray-900'>
                {matches.length}
              </p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <div className='flex items-center'>
            <div className='bg-yellow-100 rounded-md p-3'>
              <AlertCircleIcon className='h-6 w-6 text-yellow-600' />
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Pending</h3>
              <p className='text-2xl font-bold text-gray-900'>
                {pendingMatches.length}
              </p>
            </div>
          </div>
        </div>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <div className='flex items-center'>
            <div className='bg-green-100 rounded-md p-3'>
              <CheckCircleIcon className='h-6 w-6 text-green-600' />
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Accepted</h3>
              <p className='text-2xl font-bold text-gray-900'>
                {acceptedMatches.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Product Sponsorship Manager */}
      <div className='mb-8'>
        <ProductSponsorshipManager />
      </div>

      {/* Brand Sponsorship Panel */}
      <div className='mb-8'>
        <BrandSponsorshipPanel />
      </div>

      {/* Recent matches */}
      <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold text-gray-900'>
            Recent Matches
          </h2>
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
          <div className='overflow-x-auto'>
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
                  <MatchRow key={match.id} match={match} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Profile summary */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-lg font-semibold text-gray-900'>Your Profile</h2>
          <Link
            to='/brand'
            className='text-sm text-indigo-600 hover:text-indigo-800'
          >
            Edit profile
          </Link>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Company</h3>
            <p className='text-gray-900'>{brand.companyName}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Product</h3>
            <p className='text-gray-900'>{brand.productName}</p>
          </div>
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Industry</h3>
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
          <div>
            <h3 className='text-sm font-medium text-gray-500'>Budget Range</h3>
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
function MatchRow({ match }: { match: Match }) {
  const [organizer, setOrganizer] = useState<any>(null)
  useEffect(() => {
    // In a real app, this would be an API call
    const organizerData = JSON.parse(localStorage.getItem('organizers') || '[]')
    const found = organizerData.find((o: any) => o.id === match.organizerId)
    setOrganizer(found || null)
  }, [match])
  if (!organizer) return null
  return (
    <tr>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              match.score >= 80
                ? 'bg-green-100 text-green-800'
                : match.score >= 60
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {match.score}%
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm font-medium text-gray-900'>
          {organizer.eventName}
        </div>
        <div className='text-sm text-gray-500'>{organizer.eventType}</div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            match.status === 'accepted'
              ? 'bg-green-100 text-green-800'
              : match.status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
        <Link
          to={`/dashboard/brand/matches/${match.id}`}
          className='text-indigo-600 hover:text-indigo-900 mr-4'
        >
          View Details
        </Link>
      </td>
    </tr>
  )
}
