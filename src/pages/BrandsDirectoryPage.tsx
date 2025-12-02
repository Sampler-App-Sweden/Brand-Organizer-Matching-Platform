import { ArrowRightIcon, SparklesIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { DirectoryFilters } from '../components/directory/DirectoryFilters'
import { DirectoryGrid } from '../components/directory/DirectoryGrid'
import { Pagination } from '../components/directory/Pagination'
import { Layout } from '../components/layout'
import { CommunityMember, CommunityQueryParams } from '../types/community'
import { getAllCommunityMembers } from '../services/communityService'

export function BrandsDirectoryPage() {
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [queryParams, setQueryParams] = useState<CommunityQueryParams>({
    page: 1,
    limit: 12,
    type: 'brand'
  })
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true)
      try {
        const { data, totalPages } = await getAllCommunityMembers(queryParams)
        setMembers(data)
        setTotalPages(totalPages)
      } catch (error) {
        console.error('Failed to fetch brands:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMembers()
  }, [queryParams])
  const handleFilterChange = (newParams: Partial<CommunityQueryParams>) => {
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
  return (
    <Layout>
      <div className='bg-white min-h-screen'>
        {/* Hero Section */}
        <section className='bg-gradient-to-r from-indigo-50 to-purple-50 py-12 md:py-20'>
          <div className='container mx-auto px-4'>
            <div className='max-w-4xl mx-auto text-center'>
              <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>
                Discover Innovative Brands
              </h1>
              <p className='text-lg text-gray-600 mb-8'>
                Connect with brands looking for event partnerships and sampling
                opportunities. Find your perfect match based on audience,
                industry, and marketing goals.
              </p>
              <div className='flex flex-wrap justify-center gap-4'>
                <Link
                  to='/register'
                  className='inline-flex items-center px-6 py-3 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors'
                >
                  <SparklesIcon className='h-5 w-5 mr-2' />
                  Register as an Organizer
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
                  memberType='brand'
                />
              </div>
              {/* Main Content */}
              <div className='w-full md:w-3/4'>
                <h2 className='text-2xl font-bold text-gray-900 mb-6'>
                  Browse Brands
                </h2>
                {loading ? (
                  <div className='flex justify-center items-center h-64'>
                    <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600'></div>
                  </div>
                ) : members.length === 0 ? (
                  <div className='bg-gray-50 rounded-lg p-8 text-center'>
                    <h3 className='text-xl font-medium text-gray-900 mb-2'>
                      No brands found
                    </h3>
                    <p className='text-gray-600 mb-4'>
                      Try adjusting your filters or search criteria.
                    </p>
                  </div>
                ) : (
                  <>
                    <DirectoryGrid members={members} />
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
