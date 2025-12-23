import { Link } from 'react-router-dom'
import { Calendar, ArrowRight, MapPin, Users } from 'lucide-react'
import { Button } from '../ui'
import { useOrganizerEvents } from '../../hooks/useOrganizerEvents'

interface OrganizerEventsSummaryProps {
  organizerId: string
}

export function OrganizerEventsSummary({ organizerId }: OrganizerEventsSummaryProps) {
  const { events, loading } = useOrganizerEvents(organizerId)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-gray-500">Loading events...</div>
      </div>
    )
  }

  // Filter published events
  const publishedEvents = events.filter(e => e.status === 'published')

  // Show summary if published events exist
  if (publishedEvents.length > 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Your Events</h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {publishedEvents.length} {publishedEvents.length === 1 ? 'event' : 'events'} published
            </p>
          </div>
          <Link
            to="/dashboard/account?tab=events"
            className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto"
          >
            Manage <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="space-y-3 sm:space-y-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {publishedEvents.slice(0, 6).map((event) => {
            // Get the first event date
            const firstDate = event.eventDates.length > 0 ? event.eventDates[0].date : null
            const formattedDate = firstDate
              ? new Date(firstDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'Date TBD'

            return (
              <div
                key={event.id}
                className="flex flex-col gap-2 p-3 border-l-4 border-green-500 bg-green-50/50 sm:bg-gray-50 sm:border-l-0 sm:border sm:border-gray-200 sm:rounded-lg"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {event.eventName}
                    </h3>
                    <p className="text-xs text-gray-600 italic mt-1 line-clamp-1">
                      {event.slogan}
                    </p>
                  </div>
                  {event.recurringConcept.isRecurring && (
                    <span className="flex-shrink-0 px-2 py-0.5 text-xs font-medium bg-indigo-100 text-indigo-700 rounded-full">
                      Recurring
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{formattedDate}</span>
                </div>

                {event.physicalReach.attendees && (
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{event.physicalReach.attendees} attendees</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {publishedEvents.length > 6 && (
          <div className="mt-4 text-center">
            <Link
              to="/dashboard/account?tab=events"
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              View all {publishedEvents.length} events →
            </Link>
          </div>
        )}
      </div>
    )
  }

  // Show link to create events if none exist
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border-2 border-dashed border-gray-300">
      <div className="text-center">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-semibold text-gray-900">
          Create Your Event Profiles
        </h3>
        <p className="mt-2 text-sm text-gray-600">
          Showcase your events to attract brand sponsors and partnerships.
        </p>
        <div className="mt-4">
          <Link to="/dashboard/account?tab=events">
            <Button variant="primary">
              Create Your First Event
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
