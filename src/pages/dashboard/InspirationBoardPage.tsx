import { useEffect, useState } from 'react'
import { DashboardLayout } from '../../components/layout'
import { useAuth } from '../../context/AuthContext'
import {
  getAllCollaborations,
  getSavedCollaborations,
  toggleSavedCollaboration
} from '../../services/collaborationService'
import { Collaboration } from '../../types/collaboration'
import { StarIcon, FilterIcon, XIcon, ExternalLinkIcon } from 'lucide-react'
export function InspirationBoardPage() {
  const { currentUser } = useAuth()
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'saved'>('all')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  useEffect(() => {
    const fetchCollaborations = async () => {
      if (!currentUser) return
      setLoading(true)
      try {
        let data
        if (activeTab === 'all') {
          data = await getAllCollaborations()
        } else {
          data = await getSavedCollaborations(currentUser.id)
        }
        setCollaborations(data)
      } catch (error) {
        console.error('Failed to fetch collaborations:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchCollaborations()
  }, [currentUser, activeTab])
  const handleSaveToggle = (collaborationId: string) => {
    if (!currentUser) return
    toggleSavedCollaboration(currentUser.id, collaborationId)
    // Update UI state
    setCollaborations(
      collaborations.map((collab) => {
        if (collab.id === collaborationId) {
          return {
            ...collab,
            saved: !collab.saved
          }
        }
        return collab
      })
    )
  }
  const filteredCollaborations = activeFilter
    ? collaborations.filter((collab) => collab.type === activeFilter)
    : collaborations
  const userType = currentUser?.type as 'brand' | 'organizer'
  return (
    <DashboardLayout userType={userType}>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>
          Inspiration & Collaborations
        </h1>
        <p className='text-gray-600'>
          Discover successful brand-organizer collaborations and save ideas for
          your future partnerships.
        </p>
      </div>
      {/* Tab Navigation */}
      <div className='mb-6 border-b border-gray-200'>
        <div className='flex justify-between items-center'>
          <nav className='flex -mb-px space-x-8'>
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'all'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Browse All
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'saved'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Saved Ideas
            </button>
          </nav>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className='flex items-center text-gray-500 hover:text-gray-700'
          >
            {showFilters ? (
              <XIcon className='h-5 w-5 mr-1' />
            ) : (
              <FilterIcon className='h-5 w-5 mr-1' />
            )}
            {showFilters ? 'Hide Filters' : 'Filter'}
          </button>
        </div>
      </div>
      {/* Filters */}
      {showFilters && (
        <div className='mb-6 bg-gray-50 p-4 rounded-lg'>
          <div className='flex flex-wrap gap-2'>
            <button
              onClick={() => setActiveFilter(null)}
              className={`px-3 py-1.5 text-sm rounded-full ${
                activeFilter === null
                  ? 'bg-indigo-100 text-indigo-800 font-medium'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setActiveFilter('product_sampling')}
              className={`px-3 py-1.5 text-sm rounded-full ${
                activeFilter === 'product_sampling'
                  ? 'bg-indigo-100 text-indigo-800 font-medium'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Product Sampling
            </button>
            <button
              onClick={() => setActiveFilter('event_sponsorship')}
              className={`px-3 py-1.5 text-sm rounded-full ${
                activeFilter === 'event_sponsorship'
                  ? 'bg-indigo-100 text-indigo-800 font-medium'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Event Sponsorship
            </button>
            <button
              onClick={() => setActiveFilter('digital_campaign')}
              className={`px-3 py-1.5 text-sm rounded-full ${
                activeFilter === 'digital_campaign'
                  ? 'bg-indigo-100 text-indigo-800 font-medium'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Digital Campaigns
            </button>
            <button
              onClick={() => setActiveFilter('merchandise')}
              className={`px-3 py-1.5 text-sm rounded-full ${
                activeFilter === 'merchandise'
                  ? 'bg-indigo-100 text-indigo-800 font-medium'
                  : 'bg-white text-gray-700 border border-gray-300'
              }`}
            >
              Merchandise
            </button>
          </div>
        </div>
      )}
      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600'></div>
        </div>
      ) : filteredCollaborations.length === 0 ? (
        <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4'>
            <StarIcon className='h-8 w-8 text-indigo-600' />
          </div>
          <h3 className='text-xl font-medium text-gray-900 mb-2'>
            {activeTab === 'saved'
              ? 'No saved collaborations'
              : 'No collaborations found'}
          </h3>
          <p className='text-gray-600 mb-6'>
            {activeTab === 'saved'
              ? "You haven't saved any collaborations yet. Browse the inspiration gallery to find and save ideas you like."
              : 'No collaborations match your current filters. Try changing your filter criteria.'}
          </p>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {filteredCollaborations.map((collab) => (
            <CollaborationCard
              key={collab.id}
              collaboration={collab}
              onSaveToggle={handleSaveToggle}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
interface CollaborationCardProps {
  collaboration: Collaboration
  onSaveToggle: (id: string) => void
}
function CollaborationCard({
  collaboration,
  onSaveToggle
}: CollaborationCardProps) {
  return (
    <div className='bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all group relative'>
      {/* Save button */}
      <button
        className='absolute top-2 right-2 z-10 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all'
        onClick={() => onSaveToggle(collaboration.id)}
        title={
          collaboration.saved
            ? 'Remove from saved'
            : 'Save to inspiration board'
        }
      >
        {collaboration.saved ? (
          <StarIcon className='h-5 w-5 text-yellow-500 fill-current' />
        ) : (
          <StarIcon className='h-5 w-5 text-gray-400 hover:text-yellow-500' />
        )}
      </button>
      {/* Image */}
      <div className='h-48 overflow-hidden'>
        <img
          src={collaboration.imageUrl}
          alt={collaboration.title}
          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
        />
      </div>
      {/* Content */}
      <div className='p-5'>
        <div className='flex justify-between items-start mb-2'>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              collaboration.type === 'product_sampling'
                ? 'bg-blue-100 text-blue-800'
                : collaboration.type === 'event_sponsorship'
                ? 'bg-purple-100 text-purple-800'
                : collaboration.type === 'digital_campaign'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {collaboration.type === 'product_sampling'
              ? 'Product Sampling'
              : collaboration.type === 'event_sponsorship'
              ? 'Event Sponsorship'
              : collaboration.type === 'digital_campaign'
              ? 'Digital Campaign'
              : 'Merchandise'}
          </span>
        </div>
        <h3 className='text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-700 transition-colors'>
          {collaboration.title}
        </h3>
        <div className='text-sm text-gray-500 mb-3'>
          <div className='flex items-center'>
            <span className='font-medium text-gray-700'>Brand:</span>
            <span className='ml-1'>{collaboration.brandName}</span>
          </div>
          <div className='flex items-center'>
            <span className='font-medium text-gray-700'>Organizer:</span>
            <span className='ml-1'>{collaboration.organizerName}</span>
          </div>
        </div>
        <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
          {collaboration.description}
        </p>
        {/* Key metrics */}
        <div className='grid grid-cols-2 gap-2 mb-4 text-xs'>
          <div className='bg-gray-50 p-2 rounded'>
            <div className='font-medium text-gray-700'>Attendees</div>
            <div className='text-gray-900'>
              {collaboration.metrics.attendees}
            </div>
          </div>
          <div className='bg-gray-50 p-2 rounded'>
            <div className='font-medium text-gray-700'>Samples</div>
            <div className='text-gray-900'>{collaboration.metrics.samples}</div>
          </div>
        </div>
        <a
          href={`/inspiration/${collaboration.id}`}
          className='inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800'
        >
          Learn More
          <ExternalLinkIcon className='h-4 w-4 ml-1' />
        </a>
      </div>
    </div>
  )
}
