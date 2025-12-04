import { BookmarkIcon, ExternalLinkIcon, StarIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { DirectoryCard } from '../../components/directory/DirectoryCard'
import { DashboardLayout } from '../../components/layout'
import { useAuth } from '../../context/AuthContext'
import { getSavedCollaborations } from '../../services/collaborationService'
import { getSavedMembers } from '../../services/communityService'
import { ProfileOverview } from '../../services/profileService'
import { Collaboration } from '../../types/collaboration'
import { CommunityMember } from '../../types/community'

const mapMemberToProfileOverview = (
  member: CommunityMember
): ProfileOverview => ({
  id: member.id,
  role: member.type === 'brand' ? 'Brand' : 'Organizer',
  name: member.name,
  email: member.email,
  logoURL: member.logoUrl,
  description: member.description || member.shortDescription,
  created_at: member.dateRegistered,
  updated_at: member.dateRegistered,
  whatTheySeek: {
    sponsorshipTypes: [],
    budgetRange: null,
    quantity: null,
    eventTypes: member.type === 'organizer' ? [] : undefined,
    audienceTags: member.type === 'brand' ? [] : undefined,
    notes: member.shortDescription || member.description
  }
})

export function SavedItemsPage() {
  const { currentUser } = useAuth()
  const [savedMembers, setSavedMembers] = useState<CommunityMember[]>([])
  const [savedCollaborations, setSavedCollaborations] = useState<
    Collaboration[]
  >([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<
    'all' | 'brands' | 'organizers' | 'inspiration'
  >('all')

  useEffect(() => {
    const fetchSavedItems = async () => {
      if (!currentUser) return
      setLoading(true)
      try {
        const [members, collaborations] = await Promise.all([
          getSavedMembers(currentUser.id),
          getSavedCollaborations(currentUser.id)
        ])
        setSavedMembers(members)
        setSavedCollaborations(collaborations)
      } catch (error) {
        console.error('Failed to fetch saved items:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSavedItems()
  }, [currentUser])

  const filteredMembers =
    activeTab === 'all'
      ? savedMembers
      : savedMembers.filter(
          (member) =>
            member.type === (activeTab === 'brands' ? 'brand' : 'organizer')
        )

  const showMemberSection = activeTab !== 'inspiration'
  const showCollaborationsSection =
    activeTab === 'all' || activeTab === 'inspiration'
  const isEmpty =
    activeTab === 'all'
      ? savedMembers.length + savedCollaborations.length === 0
      : activeTab === 'inspiration'
      ? savedCollaborations.length === 0
      : filteredMembers.length === 0

  const userType = currentUser?.type as 'brand' | 'organizer'

  return (
    <DashboardLayout userType={userType}>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Saved Items</h1>
        <p className='text-gray-600'>
          View and manage your saved brands, organizers, and inspiration.
        </p>
      </div>

      <div className='mb-6 border-b border-gray-200'>
        <nav className='flex -mb-px space-x-8'>
          {['all', 'brands', 'organizers', 'inspiration'].map((tab) => {
            const tabLabels: Record<string, string> = {
              all: 'All Saved',
              brands: 'Brands',
              organizers: 'Organizers',
              inspiration: 'Inspiration'
            }
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as typeof activeTab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  isActive
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tabLabels[tab]}
              </button>
            )
          })}
        </nav>
      </div>

      {loading ? (
        <div className='flex justify-center items-center h-64'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600'></div>
        </div>
      ) : isEmpty ? (
        <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4'>
            <StarIcon className='h-8 w-8 text-indigo-600' />
          </div>
          <h3 className='text-xl font-medium text-gray-900 mb-2'>
            {activeTab === 'brands'
              ? 'No saved brands'
              : activeTab === 'organizers'
              ? 'No saved organizers'
              : activeTab === 'inspiration'
              ? 'No saved inspiration ideas'
              : 'No saved items'}
          </h3>
          <p className='text-gray-600 mb-6'>
            {activeTab === 'brands'
              ? "You haven't saved any brands yet. Browse the community to find ones to connect with."
              : activeTab === 'organizers'
              ? "You haven't saved any organizers yet. Browse the community to find partners."
              : activeTab === 'inspiration'
              ? "You haven't saved any inspiration ideas yet. Save collaborations from the inspiration board."
              : "You haven't saved anything yet. Explore the community and inspiration board to find ideas."}
          </p>
        </div>
      ) : (
        <div className='space-y-6'>
          {showMemberSection && filteredMembers.length > 0 && (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {filteredMembers.map((member) => (
                <DirectoryCard
                  key={member.id}
                  profile={mapMemberToProfileOverview(member)}
                />
              ))}
            </div>
          )}

          {showCollaborationsSection && savedCollaborations.length > 0 && (
            <div>
              {activeTab === 'all' && (
                <h2 className='text-lg font-semibold text-gray-700 mb-3'>
                  Inspiration Ideas
                </h2>
              )}
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                {savedCollaborations.map((collaboration) => (
                  <SavedCollaborationCard
                    key={collaboration.id}
                    collaboration={collaboration}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

interface SavedCollaborationCardProps {
  collaboration: Collaboration
}

function SavedCollaborationCard({
  collaboration
}: SavedCollaborationCardProps) {
  return (
    <div className='bg-white rounded-lg border border-gray-100 shadow-sm overflow-hidden'>
      <div className='h-48 overflow-hidden'>
        <img
          src={collaboration.imageUrl}
          alt={collaboration.title}
          className='w-full h-full object-cover'
        />
      </div>
      <div className='p-5 space-y-3'>
        <div className='flex items-center justify-between text-xs uppercase tracking-wide text-gray-500'>
          <span>
            {collaboration.type === 'product_sampling'
              ? 'Product Sampling'
              : collaboration.type === 'event_sponsorship'
              ? 'Event Sponsorship'
              : collaboration.type === 'digital_campaign'
              ? 'Digital Campaign'
              : 'Merchandise'}
          </span>
          <BookmarkIcon className='h-4 w-4 text-indigo-500' />
        </div>
        <h3 className='text-lg font-semibold text-gray-900'>
          {collaboration.title}
        </h3>
        <p className='text-sm text-gray-600 line-clamp-2'>
          {collaboration.description}
        </p>
        <div className='text-sm text-gray-500 space-y-1'>
          <div>
            <span className='font-medium text-gray-700'>Brand:</span>{' '}
            {collaboration.brandName}
          </div>
          <div>
            <span className='font-medium text-gray-700'>Organizer:</span>{' '}
            {collaboration.organizerName}
          </div>
        </div>
        <a
          href={`/inspiration/${collaboration.id}`}
          className='inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800'
        >
          Learn more
          <ExternalLinkIcon className='h-4 w-4 ml-1' />
        </a>
      </div>
    </div>
  )
}
