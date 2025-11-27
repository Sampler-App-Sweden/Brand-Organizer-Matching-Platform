import {
  ArrowRightIcon,
  FlaskConicalIcon,
  RotateCwIcon,
  Sparkles
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getCommunityMembers } from '../../services/communityService'
import { CommunityMember } from '../../types/community'
import { Button } from '../ui'
import { CommunityCard } from './CommunityCard'

export function CommunityShowcase() {
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const fetchMembers = async (pageNum: number, replace = false) => {
    try {
      setLoading(true)
      const data = await getCommunityMembers({
        page: pageNum,
        limit: 6,
        featured: true
      })
      if (replace) {
        setMembers(data)
      } else {
        setMembers((prev) => [...prev, ...data])
      }
      setHasMore(data.length === 6) // If we got fewer than 6, we've reached the end
      setLoading(false)
    } catch (error) {
      console.error('Failed to fetch community members:', error)
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchMembers(1, true)
  }, [])
  const loadMore = () => {
    const nextPage = page + 1
    setPage(nextPage)
    fetchMembers(nextPage)
  }
  const refreshOrder = () => {
    setPage(1)
    fetchMembers(1, true)
  }
  return (
    <section className='py-16 relative overflow-hidden'>
      {/* Mystical background elements */}
      <div className='absolute inset-0 bg-gradient-to-b from-indigo-50 via-purple-50 to-transparent opacity-70'></div>
      <div className='absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full -mr-32 -mt-32 opacity-30'></div>
      <div className='absolute bottom-0 left-0 w-48 h-48 bg-purple-100 rounded-full -ml-24 -mb-24 opacity-30'></div>
      {/* Subtle star pattern */}
      <div className='absolute inset-0 opacity-10'>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className='absolute h-1 w-1 bg-white rounded-full'
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              boxShadow: '0 0 4px 2px rgba(255, 255, 255, 0.3)'
            }}
          ></div>
        ))}
      </div>
      <div className='container mx-auto px-4 relative z-10'>
        <div className='flex flex-col md:flex-row md:items-center md:justify-between mb-12'>
          <div>
            <div className='flex items-center mb-2'>
              <FlaskConicalIcon className='h-6 w-6 text-indigo-600 mr-2' />
              <h2 className='text-3xl font-bold text-gray-900'>
                Featured Brands & Organizers
              </h2>
            </div>
            <p className='text-lg text-gray-600'>
              Discover the vibrant members of our sponsorship community
            </p>
          </div>
          <button
            onClick={refreshOrder}
            className='mt-4 md:mt-0 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors'
          >
            <RotateCwIcon className='h-4 w-4 mr-1' />
            <span className='text-sm font-medium'>Refresh Order</span>
          </button>
        </div>
        {loading && members.length === 0 ? (
          <div className='flex justify-center items-center py-12'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600'></div>
          </div>
        ) : (
          <>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {members.map((member) => (
                <CommunityCard key={member.id} member={member} />
              ))}
            </div>
            {members.length === 0 && (
              <div className='text-center py-12 bg-white rounded-lg shadow-sm'>
                <Sparkles className='h-12 w-12 text-indigo-300 mx-auto mb-4' />
                <h3 className='text-xl font-medium text-gray-900 mb-2'>
                  Our Community is Growing
                </h3>
                <p className='text-gray-600 mb-6'>
                  Be one of the first to join our network of brands and event
                  organizers.
                </p>
                <Link to='/community/register'>
                  <Button variant='primary'>Join the Community</Button>
                </Link>
              </div>
            )}
          </>
        )}
        <div className='mt-12 flex flex-col items-center'>
          {hasMore && (
            <Button
              variant='outline'
              className='flex items-center'
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className='animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent mr-2'></div>
                  Loading...
                </>
              ) : (
                <>
                  Load More
                  <ArrowRightIcon className='ml-2 h-4 w-4' />
                </>
              )}
            </Button>
          )}
          <Link to='/community/register' className='mt-8'>
            <Button variant='primary' className='flex items-center'>
              <Sparkles className='mr-2 h-4 w-4' />
              Join the Community
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
