import { FilterIcon, StarIcon, XIcon } from 'lucide-react'

import { CollaborationCard } from '../components/inspiration/CollaborationCard'
import { DashboardLayout } from '../components/layout'
import { useAuth } from '../context/AuthContext'
import { useInspirationBoard } from '../hooks/useInspirationBoard'

export function InspirationBoardPage() {
  const { currentUser } = useAuth()
  const {
    loading,
    filteredCollaborations,
    activeTab,
    setActiveTab,
    activeFilter,
    setActiveFilter,
    showFilters,
    toggleFilters,
    handleCollaborationSave,
    handleSaveProfile,
    getProfileSaveMeta
  } = useInspirationBoard({ userId: currentUser?.id ?? null })

  const userType = (currentUser?.type as 'brand' | 'organizer') ?? 'brand'

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
            onClick={toggleFilters}
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
          {filteredCollaborations.map((collaboration) => (
            <CollaborationCard
              key={collaboration.id}
              collaboration={collaboration}
              onToggleCollaborationSave={handleCollaborationSave}
              onSaveBrandProfile={() =>
                handleSaveProfile(collaboration.brandName)
              }
              onSaveOrganizerProfile={() =>
                handleSaveProfile(collaboration.organizerName)
              }
              brandProfileMeta={getProfileSaveMeta(collaboration.brandName)}
              organizerProfileMeta={getProfileSaveMeta(
                collaboration.organizerName
              )}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
