import { BookmarkIcon, ExternalLinkIcon, StarIcon } from 'lucide-react'

import { Collaboration } from '../../types/collaboration'
import { ProfileSaveMeta } from '../../types/inspiration'

interface CollaborationCardProps {
  collaboration: Collaboration
  onToggleCollaborationSave: (id: string) => void
  onSaveBrandProfile: () => void | Promise<void>
  onSaveOrganizerProfile: () => void | Promise<void>
  brandProfileMeta: ProfileSaveMeta
  organizerProfileMeta: ProfileSaveMeta
}

export function CollaborationCard({
  collaboration,
  onToggleCollaborationSave,
  onSaveBrandProfile,
  onSaveOrganizerProfile,
  brandProfileMeta,
  organizerProfileMeta
}: CollaborationCardProps) {
  function renderProfileAction(
    label: string,
    meta: ProfileSaveMeta,
    handler: () => void | Promise<void>
  ) {
    return (
      <button
        type='button'
        onClick={handler}
        disabled={!meta.available || meta.loading || meta.resolving}
        className={`inline-flex items-center px-3 py-1.5 rounded-full border text-xs font-medium transition-colors ${
          meta.saved
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-white text-gray-700 border-gray-200 hover:border-indigo-300'
        } ${
          !meta.available || meta.resolving
            ? 'opacity-60 cursor-not-allowed'
            : ''
        }`}
      >
        {meta.loading || meta.resolving ? (
          <span className='mr-2 h-3 w-3 border-2 border-current border-t-transparent rounded-full animate-spin'></span>
        ) : (
          <BookmarkIcon
            className={`h-4 w-4 mr-1 ${meta.saved ? 'fill-current' : ''}`}
          />
        )}
        {meta.saved ? `${label} Saved` : `Save ${label}`}
      </button>
    )
  }

  return (
    <div className='bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all group relative'>
      <button
        className='absolute top-2 right-2 z-10 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all'
        onClick={() => onToggleCollaborationSave(collaboration.id)}
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
      <div className='h-48 overflow-hidden'>
        <img
          src={collaboration.imageUrl}
          alt={collaboration.title}
          className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
        />
      </div>
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
        <div className='mb-4 flex flex-wrap gap-2 text-xs'>
          {renderProfileAction(
            'Brand Profile',
            brandProfileMeta,
            onSaveBrandProfile
          )}
          {renderProfileAction(
            'Organizer Profile',
            organizerProfileMeta,
            onSaveOrganizerProfile
          )}
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
