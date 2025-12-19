import { ArrowRightIcon, SparklesIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { DirectoryFilters } from '../components/directory/DirectoryFilters'
import { DirectoryFilterParams } from '../components/directory/directoryFilterTypes'
import { DirectoryGrid } from '../components/directory/DirectoryGrid'
import { Pagination } from '../components/directory/Pagination'
import { filterProfilesByRole } from '../components/directory/profileDirectoryUtils'
import { Layout } from '../components/layout'
import { getProfiles, ProfileOverview } from '../services/profileService'
import { getBatchInterestStatuses, expressInterest } from '../services/interestService'
import { useAuth } from '../context/AuthContext'

type InterestStatus = 'none' | 'sent' | 'received' | 'mutual'

export function OrganizersDirectoryPage() {
  const { currentUser } = useAuth()
  const [profiles, setProfiles] = useState<ProfileOverview[]>([])
  const [visibleProfiles, setVisibleProfiles] = useState<ProfileOverview[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [interestStatuses, setInterestStatuses] = useState<Map<string, InterestStatus>>(new Map())
  const [queryParams, setQueryParams] = useState<DirectoryFilterParams>({
    page: 1,
    limit: 12,
    type: 'organizer'
  })

  useEffect(() => {
    const fetchProfiles = async () => {
      setLoading(true)
      try {
        const data = await getProfiles()
        setProfiles(data)
      } catch (error) {
        console.error('Failed to fetch profiles:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProfiles()
  }, [])

  useEffect(() => {
    const limit = queryParams.limit ?? 12
    const filtered = filterProfilesByRole(
      profiles,
      queryParams,
      'Organizer'
    )
    setTotalPages(Math.max(1, Math.ceil(filtered.length / limit)))
    const page = queryParams.page ?? 1
    const start = (page - 1) * limit
    setVisibleProfiles(filtered.slice(start, start + limit))
  }, [profiles, queryParams])

  // Fetch interest statuses for visible profiles
  useEffect(() => {
    const fetchInterestStatuses = async () => {
      if (!currentUser || visibleProfiles.length === 0) {
        setInterestStatuses(new Map())
        return
      }

      try {
        const profileUserIds = visibleProfiles.map(p => p.userId)
        const statuses = await getBatchInterestStatuses(currentUser.id, profileUserIds)
        setInterestStatuses(statuses)
      } catch (error) {
        console.error('Failed to fetch interest statuses:', error)
      }
    }

    fetchInterestStatuses()
  }, [currentUser, visibleProfiles])

  const handleFilterChange = (newParams: Partial<DirectoryFilterParams>) => {
    setQueryParams((prev) => ({
      ...prev,
      ...newParams,
      page: 1
    }))
  }

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page
    }))
  }

  const handleExpressInterest = async (profileId: string) => {
    if (!currentUser) {
      alert('Please sign in to express interest')
      return
    }

    try {
      const profile = visibleProfiles.find(p => p.id === profileId)
      if (!profile) return

      // Current user must be a brand to express interest in organizers
      await expressInterest(
        currentUser.id,
        'brand',
        profile.userId,
        'organizer'
      )

      // Refresh interest statuses
      const profileUserIds = visibleProfiles.map(p => p.userId)
      const statuses = await getBatchInterestStatuses(currentUser.id, profileUserIds)
      setInterestStatuses(statuses)
    } catch (error: any) {
      console.error('Failed to express interest:', error)
      alert(error.message || 'Failed to express interest. Please try again.')
    }
  }
  return (
    <Layout>
      <div className='bg-white min-h-screen'>
        {/* Hero Section */}
        <section className='bg-gradient-to-r from-indigo-50 to-purple-50 py-12 md:py-20'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl mx-auto text-center'>
              <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                Discover Event Organizers
              </h1>
              <p className='text-lg text-gray-600 mb-8'>
                Connect with event organizers looking for brand partnerships and
                sponsorships. Find your perfect match based on event type,
                audience, and marketing opportunities.
              </p>
              <div className='flex flex-wrap justify-center gap-4'>
                <Link
                  to='/register'
                  className='inline-flex items-center px-6 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors'
                >
                  <SparklesIcon className='h-5 w-5 mr-2' />
                  Register as a Brand
                </Link>
                <Link
                  to='/community'
                  className='inline-flex items-center px-6 py-3 rounded-md bg-white text-indigo-600 font-medium border border-indigo-200 hover:bg-indigo-50 transition-colors'
                >
                  View Community
                  <ArrowRightIcon className='h-4 w-4 ml-2' />
                </Link>
              </div>
            </div>
          </div>
        </section>
        {/* Directory Section */}
        <section className='py-12'>
          <div className='container mx-auto px-4'>
            <div className='flex flex-col md:flex-row gap-6'>
              {/* Filters */}
              <div className='w-full md:w-1/4'>
                <DirectoryFilters
                  onFilterChange={handleFilterChange}
                  currentFilters={queryParams}
                  memberType='organizer'
                />
              </div>
              {/* Main Content */}
              <div className='w-full md:w-3/4'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  Browse Event Organizers
                </h2>
                {loading ? (
                  <div className='flex justify-center items-center h-64'>
                    <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600'></div>
                  </div>
                ) : visibleProfiles.length === 0 ? (
                  <div className='bg-gray-50 rounded-lg p-8 text-center'>
                    <h3 className='text-xl font-medium text-gray-900 mb-2'>
                      No organizers found
                    </h3>
                    <p className='text-gray-600 mb-4'>
                      Try adjusting your filters or search criteria.
                    </p>
                  </div>
                ) : (
                  <>
                    <DirectoryGrid
                      profiles={visibleProfiles}
                      showInterestAction={!!currentUser}
                      interestStatuses={interestStatuses}
                      onExpressInterest={handleExpressInterest}
                    />
                    <div className='mt-8'>
                      <Pagination
                        currentPage={queryParams.page || 1}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
