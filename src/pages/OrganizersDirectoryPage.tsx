import { ArrowRightIcon, SparklesIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { DirectoryFilters } from '../components/directory/DirectoryFilters'
import { DirectoryFilterParams } from '../components/directory/directoryFilterTypes'
import { DirectoryGrid } from '../components/directory/DirectoryGrid'
import { Pagination, LoadingSpinner } from '../components/ui'
import { filterProfilesByRole } from '../components/directory/profileDirectoryUtils'
import { Layout } from '../components/layout'
import { getProfiles, ProfileOverview } from '../services/profileService'
import {
  getBatchConnectionStatuses,
  expressConnection
} from '../services/connectionService'
import { useAuth } from '../context/AuthContext'

type InterestStatus = 'none' | 'sent' | 'received' | 'mutual'

export function OrganizersDirectoryPage() {
  const { currentUser } = useAuth()
  const [profiles, setProfiles] = useState<ProfileOverview[]>([])
  const [visibleProfiles, setVisibleProfiles] = useState<ProfileOverview[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [interestStatuses, setInterestStatuses] = useState<
    Map<string, InterestStatus>
  >(new Map())
  const [expressingInterest, setExpressingInterest] = useState<string | null>(
    null
  )
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
    const filtered = filterProfilesByRole(profiles, queryParams, 'Organizer')
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
        const profileUserIds = visibleProfiles.map((p) => p.id)
        const statuses = await getBatchConnectionStatuses(
          currentUser.id,
          profileUserIds
        )
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

    // Check if user is a brand
    if (currentUser.type !== 'brand') {
      alert(
        'Only brands can express interest in organizers. Please create a brand profile first.'
      )
      return
    }

    // Prevent multiple simultaneous requests
    if (expressingInterest) {
      return
    }

    try {
      setExpressingInterest(profileId)
      const profile = visibleProfiles.find((p) => p.id === profileId)
      if (!profile) return

      // Current user must be a brand to express interest in organizers
      await expressConnection(currentUser.id, 'brand', profile.id, 'organizer')

      // Refresh interest statuses
      const profileUserIds = visibleProfiles.map((p) => p.id)
      const statuses = await getBatchConnectionStatuses(
        currentUser.id,
        profileUserIds
      )
      setInterestStatuses(statuses)
    } catch (error: unknown) {
      console.error('Failed to express interest:', error)

      // Provide helpful error messages
      if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof (error as { message?: string }).message === 'string'
      ) {
        const message = (error as { message: string }).message
        if (message.includes('Brand profile not found')) {
          alert(
            'Please create your brand profile before expressing interest. You can do this from your dashboard.'
          )
        } else if (message.includes('Organizer profile not found')) {
          alert('This organizer profile is not available.')
        } else if (message.includes('Connection already expressed')) {
          alert('You have already expressed interest in this organizer.')
        } else {
          alert(message || 'Failed to express interest. Please try again.')
        }
      } else {
        alert('Failed to express interest. Please try again.')
      }
    } finally {
      setExpressingInterest(null)
    }
  }
  return (
    <Layout>
      <div className='bg-white min-h-screen'>
        {/* Hero Section */}
        <section className='relative py-20 bg-gradient-to-br from-white via-indigo-50 to-blue-100 overflow-hidden'>
          <div className='absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-indigo-300/20 rounded-full blur-3xl animate-float1' />
          <div className='absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-tr from-indigo-400/30 to-purple-300/20 rounded-full blur-3xl animate-float2' />
          <div className='container mx-auto px-4 relative z-10'>
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
                  className='bg-brand-primary text-white px-6 py-3 rounded-md font-medium flex items-center justify-center transition-all duration-300 shadow-[0_4px_24px_0_rgba(30,41,59,0.18)] hover:shadow-[0_8px_32px_0_rgba(30,41,59,0.32)] hover:-translate-y-1 border border-indigo-700/30 hover:bg-indigo-800 group relative overflow-hidden backdrop-blur-sm'
                >
                  <span className='relative z-10 flex items-center'>
                    <SparklesIcon className='h-5 w-5 mr-2' />
                    Register as a Brand
                  </span>
                  <span className='absolute inset-0 bg-gradient-to-br from-indigo-600 to-indigo-400 opacity-0 group-hover:opacity-20 transition-opacity'></span>
                </Link>
                <Link
                  to='/community'
                  className='bg-white text-indigo-700 px-6 py-3 rounded-md font-medium transition-all duration-300 shadow-sm hover:shadow-2xl hover:-translate-y-1 border border-indigo-100 hover:bg-indigo-50 group relative overflow-hidden'
                >
                  <span className='relative z-10 flex items-center'>
                    View Community
                    <ArrowRightIcon className='h-4 w-4 ml-2' />
                  </span>
                  <span className='absolute inset-0 bg-gradient-to-br from-indigo-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity'></span>
                </Link>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes float1 {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(-20px) scale(1.05); }
            }
            @keyframes float2 {
              0%, 100% { transform: translateY(0) scale(1); }
              50% { transform: translateY(20px) scale(1.07); }
            }
            .animate-float1 { animation: float1 8s ease-in-out infinite; }
            .animate-float2 { animation: float2 10s ease-in-out infinite; }
          `}</style>
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
                    <LoadingSpinner size={64} />
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
                      showInterestAction={
                        !!currentUser && currentUser.type === 'brand'
                      }
                      interestStatuses={interestStatuses}
                      onExpressInterest={handleExpressInterest}
                      expressingInterestId={expressingInterest}
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
