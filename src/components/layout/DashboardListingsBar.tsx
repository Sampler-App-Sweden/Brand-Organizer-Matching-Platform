import {
  ChevronLeftIcon,
  ChevronRightIcon,
  HeartIcon,
  StarIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

// This component displays relevant listings in the dashboard header
// Brands will see organizers, and organizers will see brands
export function DashboardListingsBar() {
  const { currentUser } = useAuth()
  const [listings, setListings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 3
  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true)
      try {
        // Fetch listings based on user type
        if (currentUser?.type === 'brand') {
          // Brands see organizers
          const organizers = JSON.parse(
            localStorage.getItem('organizers') || '[]'
          )
          setListings(organizers)
        } else if (currentUser?.type === 'organizer') {
          // Organizers see brands
          const brands = JSON.parse(localStorage.getItem('brands') || '[]')
          setListings(brands)
        }
      } catch (error) {
        console.error('Error fetching listings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchListings()
  }, [currentUser])
  // Skip rendering if not logged in or no listings
  if (!currentUser || listings.length === 0) {
    return null
  }
  const totalPages = Math.ceil(listings.length / itemsPerPage)
  const displayListings = listings.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  )
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }
  if (loading) {
    return (
      <div className='flex justify-center items-center h-12'>
        <div className='animate-spin h-5 w-5 border-2 border-indigo-500 rounded-full border-t-transparent'></div>
      </div>
    )
  }
  return (
    <div className='flex items-center justify-between'>
      <div className='flex-shrink-0 mr-4'>
        <button
          onClick={prevPage}
          disabled={currentPage === 0}
          className={`p-1 rounded-full ${
            currentPage === 0
              ? 'text-gray-300'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <ChevronLeftIcon className='h-5 w-5' />
        </button>
      </div>
      <div className='flex-1 overflow-hidden'>
        <div className='flex space-x-4'>
          {displayListings.map((item) => {
            const isBrand = 'companyName' in item
            const name = isBrand ? item.companyName : item.organizerName
            const description = isBrand
              ? (item.productDescription || '').substring(0, 60) + '...'
              : (item.elevatorPitch || '').substring(0, 60) + '...'
            return (
              <div
                key={item.id}
                className='flex-shrink-0 w-64 border rounded-lg p-3 bg-white shadow-sm'
              >
                <div className='flex justify-between items-start mb-2'>
                  <h3 className='font-medium text-gray-900 truncate'>{name}</h3>
                  <div className='flex space-x-1'>
                    <button
                      className='p-1 rounded-full text-gray-400 hover:text-yellow-500'
                      title='Save for later'
                    >
                      <StarIcon className='h-4 w-4' />
                    </button>
                    <button
                      className='p-1 rounded-full text-gray-400 hover:text-red-500'
                      title='Show interest'
                    >
                      <HeartIcon className='h-4 w-4' />
                    </button>
                  </div>
                </div>
                <p className='text-sm text-gray-600 mb-3 line-clamp-2'>
                  {description}
                </p>
                <div className='text-right'>
                  <Link
                    to={
                      isBrand ? `/brands/${item.id}` : `/organizers/${item.id}`
                    }
                    className='text-xs text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center'
                  >
                    View details
                    <ChevronRightIcon className='h-3 w-3 ml-1' />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </div>
      <div className='flex-shrink-0 ml-4'>
        <button
          onClick={nextPage}
          disabled={currentPage >= totalPages - 1}
          className={`p-1 rounded-full ${
            currentPage >= totalPages - 1
              ? 'text-gray-300'
              : 'text-gray-500 hover:bg-gray-100'
          }`}
        >
          <ChevronRightIcon className='h-5 w-5' />
        </button>
      </div>
      <div className='ml-4 border-l pl-4'>
        <Link
          to={currentUser?.type === 'brand' ? '/organizers' : '/brands'}
          className='text-sm text-indigo-600 hover:text-indigo-800 font-medium'
        >
          View all
        </Link>
      </div>
    </div>
  )
}
