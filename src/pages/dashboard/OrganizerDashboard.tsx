import {
  AlertCircleIcon,
  CalendarIcon,
  CheckCircleIcon,
  UsersIcon,
  LinkIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { StatsCard } from '../../components/dashboard/StatsCard'
import { DASHBOARD_CLASSES } from '../../constants/dashboardStyles.constants'
import { OrganizerEventsSummary } from '../../components/events/OrganizerEventsSummary'
import { DashboardLayout } from '../../components/layout'
import { OrganizerSponsorshipSummary } from '../../components/sponsorship/OrganizerSponsorshipSummary'
import { Button, LoadingSpinner } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useOrganizerDashboard } from '../../hooks/useOrganizerDashboard'
import { getBrandById, getBrandsByIds } from '../../services/dataService'
import { getConnectionStats, type ConnectionStats } from '../../services/connectionService'
import { Brand, Match } from '../../types'

export function OrganizerDashboard() {
  const { currentUser } = useAuth()
  const { organizer, matches, pendingMatches, acceptedMatches, loading } =
    useOrganizerDashboard(currentUser?.id)
  const [brandsById, setBrandsById] = useState<Record<string, Brand>>({})
  const [connectionStats, setConnectionStats] = useState<ConnectionStats | null>(null)

  // Load connection stats
  useEffect(() => {
    const loadConnectionStats = async () => {
      if (!currentUser?.id) return
      try {
        const stats = await getConnectionStats(currentUser.id)
        setConnectionStats(stats)
      } catch (error) {
        console.error('Failed to load connection stats:', error)
        setConnectionStats(null)
      }
    }

    loadConnectionStats()
  }, [currentUser?.id])

  // Load brand details for all matches
  useEffect(() => {
    const loadBrands = async () => {
      const brandIds = Array.from(new Set(matches.map((m) => m.brandId)))
      if (!brandIds.length) {
        setBrandsById({})
        return
      }
      try {
        const brands = await getBrandsByIds(brandIds)
        const map = brands.reduce<Record<string, Brand>>((acc, brand) => {
          acc[brand.id] = brand
          return acc
        }, {})
        setBrandsById(map)
      } catch (error) {
        console.error('Failed to load brands for matches:', error)
        setBrandsById({})
      }
    }

    loadBrands()
  }, [matches])

  if (loading) {
    return (
      <DashboardLayout userType='organizer'>
        <div className='flex justify-center items-center h-64'>
          <LoadingSpinner size={64} />
        </div>
      </DashboardLayout>
    )
  }
  if (!organizer) {
    return (
      <DashboardLayout userType='organizer'>
        <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Complete Your Profile
          </h2>
          <p className='text-gray-600 mb-4'>
            You need to complete your event organizer profile before you can
            start matching with brands.
          </p>
          <div className='flex gap-3'>
            <Link to='/organizer'>
              <Button variant='primary'>Create Organizer Profile</Button>
            </Link>
            <Link to='/dashboard/account'>
              <Button variant='outline'>Edit Basic Info</Button>
            </Link>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const totalConnections = connectionStats
    ? connectionStats.sent.total + connectionStats.received.total
    : 0
  const mutualConnections = connectionStats?.mutual ?? 0
  const pendingConnections = connectionStats
    ? connectionStats.sent.pending + connectionStats.received.pending
    : 0

  return (
    <DashboardLayout userType='organizer'>
      <div className='mb-6 flex justify-between items-start'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            Organizer Dashboard
          </h1>
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
          label='Total Connections'
          value={totalConnections}
          sublabel='Brand connections found'
        />
        <StatsCard
          icon={LinkIcon}
          iconColor='green'
          label='Mutual Connections'
          value={mutualConnections}
          sublabel='Two-way partnerships'
        />
        <StatsCard
          icon={AlertCircleIcon}
          iconColor='yellow'
          label='Pending Connections'
          value={pendingConnections}
          sublabel='Awaiting response'
        />
      </div>

      {/* Sponsorship Needs Summary */}
      <div className='mb-6'>
        <OrganizerSponsorshipSummary organizerId={organizer.id} />
      </div>

      {/* Events Summary */}
      <div className='mb-6'>
        <OrganizerEventsSummary organizerId={organizer.id} />
      </div>

      {/* Event details */}
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-gray-900'>Event Details</h2>
          <Link
            to='/organizer'
            className='text-sm text-indigo-600 hover:text-indigo-800'
          >
            Edit event
          </Link>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {organizer.eventName}
            </h3>
            <p className='text-gray-600 mb-4'>{organizer.elevatorPitch}</p>
            <div className='flex items-center text-gray-600 mb-2'>
              <CalendarIcon className='h-5 w-5 mr-2' />
              <span>{new Date(organizer.eventDate).toLocaleDateString()}</span>
            </div>
            <div className='flex items-center text-gray-600'>
              <div className='h-5 w-5 mr-2 flex items-center justify-center'>
                📍
              </div>
              <span>{organizer.location}</span>
            </div>
          </div>
          <div className='bg-white rounded-lg shadow-sm p-4'>
            <h4 className='text-sm font-medium text-gray-500 mb-1'>
              Expected Attendance
            </h4>
            <p className='text-gray-900 mb-3'>
              {organizer.attendeeCount === 'under_100'
                ? 'Under 100'
                : organizer.attendeeCount === '100_500'
                ? '100 - 500'
                : organizer.attendeeCount === '500_1000'
                ? '500 - 1,000'
                : organizer.attendeeCount === '1000_5000'
                ? '1,000 - 5,000'
                : organizer.attendeeCount === '5000_plus'
                ? '5,000+'
                : 'Not specified'}
            </p>
            <h4 className='text-sm font-medium text-gray-500 mb-1'>
              Event Type
            </h4>
            <p className='text-gray-900 mb-3'>
              {organizer.eventType.charAt(0).toUpperCase() +
                organizer.eventType.slice(1)}
            </p>
            <h4 className='text-sm font-medium text-gray-500 mb-1'>
              Frequency
            </h4>
            <p className='text-gray-900'>
              {organizer.eventFrequency === 'one_time'
                ? 'One-time Event'
                : organizer.eventFrequency === 'annual'
                ? 'Annual'
                : organizer.eventFrequency === 'bi_annual'
                ? 'Bi-annual'
                : organizer.eventFrequency === 'quarterly'
                ? 'Quarterly'
                : organizer.eventFrequency === 'monthly'
                ? 'Monthly'
                : organizer.eventFrequency === 'weekly'
                ? 'Weekly'
                : 'Other'}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Connections */}
      <div className='mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-bold text-gray-900'>Recent Connections</h2>
          <Link
            to='/dashboard/organizer/matches'
            className='text-sm text-indigo-600 hover:text-indigo-800'
          >
            View all connections
          </Link>
        </div>
        {matches.filter((m) => m.status === 'accepted').length === 0 ? (
          <div className='text-gray-500 text-center py-8'>
            No connections yet. Express interest for brands and/or accept
            connections to start building partnerships.
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
                    Brand
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
                {matches
                  .filter((m) => m.status === 'accepted')
                  .slice(0, 5)
                  .map((match) => (
                    <MatchRow
                      key={match.id}
                      match={match}
                      brand={brandsById[match.brandId]}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

// Component to display a single match row
function MatchRow({
  match,
  brand: brandProp
}: {
  match: Match
  brand?: Brand
}) {
  const [brand, setBrand] = useState<Brand | null>(brandProp ?? null)
  const [isLoading, setIsLoading] = useState(!brandProp)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (brandProp) {
      setBrand(brandProp)
      setIsLoading(false)
      setError(null)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError(null)

    getBrandById(match.brandId)
      .then((brandData) => {
        if (!isMounted) return
        if (!brandData) {
          setError('Brand not found')
          setBrand(null)
          return
        }
        setBrand(brandData)
      })
      .catch((err: unknown) => {
        if (!isMounted) return
        const message =
          err instanceof Error ? err.message : 'Unable to load brand'
        setError(message)
        setBrand(null)
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [brandProp, match.brandId, match.id])

  if (isLoading) {
    return (
      <tr>
        <td className='px-6 py-4 text-sm text-gray-500' colSpan={4}>
          Loading match...
        </td>
      </tr>
    )
  }

  if (error || !brand) {
    return (
      <tr>
        <td className='px-6 py-4 text-sm text-red-600' colSpan={4}>
          {error ?? 'Brand details unavailable'}
        </td>
      </tr>
    )
  }
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
          {brand.companyName}
        </div>
        <div className='text-sm text-gray-500'>{brand.productName}</div>
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
          to={`/dashboard/organizer/matches/${match.id}`}
          className='text-indigo-600 hover:text-indigo-900 mr-4'
        >
          View Details
        </Link>
      </td>
    </tr>
  )
}
