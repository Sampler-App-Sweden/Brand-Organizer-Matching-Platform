import { useEffect } from 'react'
import {
  XIcon,
  CalendarIcon,
  UsersIcon,
  TrendingUpIcon,
  LinkIcon,
  DollarSignIcon,
  RepeatIcon,
  TagIcon
} from 'lucide-react'
import { Event } from '../../types/event'
import { formatEventDate } from '../../utils/eventUtils'

interface EventDetailModalProps {
  event: Event | null
  onClose: () => void
}

export function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (event) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [event, onClose])

  if (!event) return null

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4'
      onClick={onClose}
    >
      <div
        className='bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-start z-10'>
          <div>
            <div className='flex items-center gap-2 mb-2'>
              <h2 className='text-3xl font-bold text-gray-900'>
                {event.eventName}
              </h2>
              <span className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800'>
                Published
              </span>
            </div>
            <p className='text-lg text-gray-600 italic'>{event.slogan}</p>
          </div>
          <button
            onClick={onClose}
            className='p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0'
          >
            <XIcon className='h-6 w-6 text-gray-600' />
          </button>
        </div>

        <div className='p-6 space-y-8'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                  <CalendarIcon className='h-5 w-5 text-indigo-500' />
                  Event Dates
                </h3>
                {event.eventDates.length > 0 ? (
                  <div className='space-y-2'>
                    {event.eventDates.map((eventDate, index) => (
                      <div
                        key={index}
                        className='bg-gray-50 rounded-lg p-3 border border-gray-200'
                      >
                        <p className='font-medium text-gray-900'>
                          {formatEventDate(eventDate.date)}
                        </p>
                        {eventDate.description && (
                          <p className='text-sm text-gray-600 mt-1'>
                            {eventDate.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className='text-gray-600'>No specific dates set</p>
                )}
              </div>

              {event.recurringConcept.isRecurring && (
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                    <RepeatIcon className='h-5 w-5 text-purple-500' />
                    Recurring Event
                  </h3>
                  <div className='bg-purple-50 rounded-lg p-4 border border-purple-200 space-y-2'>
                    {event.recurringConcept.frequency && (
                      <p className='text-gray-700'>
                        <span className='font-medium'>Frequency:</span>{' '}
                        {event.recurringConcept.frequency}
                      </p>
                    )}
                    {event.recurringConcept.time && (
                      <p className='text-gray-700'>
                        <span className='font-medium'>Time:</span>{' '}
                        {event.recurringConcept.time}
                      </p>
                    )}
                    {event.recurringConcept.format && (
                      <p className='text-gray-700'>
                        <span className='font-medium'>Format:</span>{' '}
                        {event.recurringConcept.format}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {event.corePillars.length > 0 && (
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                    <TagIcon className='h-5 w-5 text-indigo-500' />
                    Core Concept Pillars
                  </h3>
                  <div className='flex flex-wrap gap-2'>
                    {event.corePillars.map((pillar, index) => (
                      <span
                        key={index}
                        className='inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800'
                      >
                        {pillar}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className='space-y-6'>
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                  <TrendingUpIcon className='h-5 w-5 text-green-500' />
                  Physical Reach
                </h3>
                <div className='bg-green-50 rounded-lg p-4 border border-green-200 space-y-2'>
                  {event.physicalReach.signups && (
                    <p className='text-gray-700'>
                      <span className='font-medium'>Signups:</span>{' '}
                      {event.physicalReach.signups}
                    </p>
                  )}
                  {event.physicalReach.attendees && (
                    <p className='text-gray-700'>
                      <span className='font-medium'>Attendees:</span>{' '}
                      {event.physicalReach.attendees}
                    </p>
                  )}
                  {event.physicalReach.waitlist && (
                    <p className='text-gray-700'>
                      <span className='font-medium'>Waitlist:</span>{' '}
                      {event.physicalReach.waitlist}
                    </p>
                  )}
                </div>
              </div>

              {event.digitalChannels.length > 0 && (
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                    Digital Channels
                  </h3>
                  <div className='space-y-2'>
                    {event.digitalChannels.map((channel, index) => (
                      <div
                        key={index}
                        className='bg-gray-50 rounded-lg p-3 border border-gray-200'
                      >
                        <div className='flex justify-between items-start'>
                          <div>
                            <p className='font-medium text-gray-900'>
                              {channel.platform}
                            </p>
                            <p className='text-sm text-gray-600'>
                              @{channel.handle}
                            </p>
                          </div>
                          {channel.followers && (
                            <span className='text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full'>
                              {channel.followers} followers
                            </span>
                          )}
                        </div>
                        {channel.url && (
                          <a
                            href={channel.url}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-xs text-indigo-600 hover:text-indigo-800 mt-1 inline-block'
                          >
                            Visit profile →
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {event.totalEventBudget && (
                <div>
                  <h3 className='text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                    <DollarSignIcon className='h-5 w-5 text-amber-500' />
                    Total Event Budget
                  </h3>
                  <p className='text-2xl font-bold text-gray-900'>
                    {event.totalEventBudget}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className='border-t border-gray-200 pt-6 space-y-6'>
            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                Event Essence
              </h3>
              <p className='text-gray-700 leading-relaxed'>{event.essence}</p>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                Concept
              </h3>
              <p className='text-gray-700 leading-relaxed'>{event.concept}</p>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                Setup
              </h3>
              <p className='text-gray-700 leading-relaxed'>{event.setup}</p>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                Positioning
              </h3>
              <p className='text-gray-700 leading-relaxed'>
                {event.positioning}
              </p>
            </div>

            <div>
              <h3 className='text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                <UsersIcon className='h-5 w-5 text-blue-500' />
                Audience Description
              </h3>
              <p className='text-gray-700 leading-relaxed'>
                {event.audienceDescription}
              </p>
            </div>

            {event.pastEvents.totalEventsHosted && (
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  Past Events History
                </h3>
                <div className='bg-blue-50 rounded-lg p-4 border border-blue-200'>
                  <p className='text-gray-700 mb-2'>
                    <span className='font-medium'>Total Events Hosted:</span>{' '}
                    {event.pastEvents.totalEventsHosted}
                  </p>
                  {event.pastEvents.description && (
                    <p className='text-gray-700'>
                      {event.pastEvents.description}
                    </p>
                  )}
                </div>
              </div>
            )}

            {event.partnerships.length > 0 && (
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  Partnerships
                </h3>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {event.partnerships.map((partnership, index) => (
                    <div
                      key={index}
                      className='bg-gray-50 rounded-lg p-4 border border-gray-200'
                    >
                      <div className='flex justify-between items-start mb-2'>
                        <p className='font-medium text-gray-900'>
                          {partnership.name}
                        </p>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            partnership.type === 'ongoing'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-200 text-gray-700'
                          }`}
                        >
                          {partnership.type}
                        </span>
                      </div>
                      {partnership.description && (
                        <p className='text-sm text-gray-600'>
                          {partnership.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {event.applicationLink && (
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2'>
                  <LinkIcon className='h-5 w-5 text-indigo-500' />
                  Application / Sign-up
                </h3>
                <a
                  href={event.applicationLink}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors'
                >
                  Visit Application Link →
                </a>
              </div>
            )}

            {event.eventMedia.description && (
              <div>
                <h3 className='text-lg font-semibold text-gray-900 mb-3'>
                  Event Media
                </h3>
                <p className='text-gray-700 leading-relaxed'>
                  {event.eventMedia.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
