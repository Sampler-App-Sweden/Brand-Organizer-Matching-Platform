import { CalendarIcon, TagIcon } from 'lucide-react'
import { Event } from '../../types/event'
import { formatEventDate } from '../../utils/eventUtils'

interface EventDisplayCardProps {
  event: Event
  onClick: () => void
  label?: string
}

export function EventDisplayCard({
  event,
  onClick,
  label
}: EventDisplayCardProps) {
  const firstDate = event.eventDates[0]
  const displayPillars = event.corePillars.slice(0, 3)

  return (
    <div
      className='bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm transition-all hover:shadow-md hover:border-indigo-200 cursor-pointer'
      onClick={onClick}
    >
      <div className='relative'>
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs z-10 ${
            label === 'Upcoming'
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {label || 'Published'}
        </div>
        <div className='h-40 bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden flex items-center justify-center'>
          <div className='text-center p-6'>
            <CalendarIcon className='h-12 w-12 text-indigo-400 mx-auto mb-2' />
            {event.recurringConcept.isRecurring ? (
              <span className='text-sm font-medium text-indigo-600'>
                Recurring Event
              </span>
            ) : firstDate ? (
              <span className='text-sm font-medium text-indigo-600'>
                {formatEventDate(firstDate.date)}
              </span>
            ) : (
              <span className='text-sm font-medium text-gray-500'>
                Date TBD
              </span>
            )}
          </div>
        </div>
        <div className='p-4'>
          <h3 className='font-medium text-gray-900 mb-1'>{event.eventName}</h3>
          <p className='text-sm text-gray-600 line-clamp-2 mb-3'>
            {event.slogan}
          </p>
          {displayPillars.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {displayPillars.map((pillar, index) => (
                <span
                  key={index}
                  className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-700'
                >
                  <TagIcon className='h-3 w-3 mr-1' />
                  {pillar}
                </span>
              ))}
              {event.corePillars.length > 3 && (
                <span className='inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600'>
                  +{event.corePillars.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
      <div className='h-1 w-full bg-gradient-to-r from-transparent via-purple-200 to-transparent'></div>
    </div>
  )
}
