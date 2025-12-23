import { useState } from 'react'
import { Plus, Calendar, Trash2, Edit2, Save, Send } from 'lucide-react'
import { useOrganizerEvents } from '../../hooks/useOrganizerEvents'
import { Button } from '../ui'
import type {
  CreateEventInput,
  EventDate,
  DigitalChannel,
  Partnership
} from '../../types/event'

type ViewMode = 'list' | 'create' | 'edit'

interface EventsManagerProps {
  organizerId: string
  showHeader?: boolean
}

export function EventsManager({ organizerId, showHeader = true }: EventsManagerProps) {
  const {
    events,
    loading,
    isSubmitting,
    feedback,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    clearFeedback
  } = useOrganizerEvents(organizerId)

  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null)

  // Form state
  const [eventName, setEventName] = useState('')
  const [slogan, setSlogan] = useState('')
  const [essence, setEssence] = useState('')
  const [concept, setConcept] = useState('')
  const [setup, setSetup] = useState('')
  const [positioning, setPositioning] = useState('')
  const [eventDates, setEventDates] = useState<EventDate[]>([
    { date: '', description: '' }
  ])
  const [isRecurring, setIsRecurring] = useState(false)
  const [frequency, setFrequency] = useState('')
  const [time, setTime] = useState('')
  const [format, setFormat] = useState('')
  const [corePillars, setCorePillars] = useState<string[]>([''])
  const [audienceDescription, setAudienceDescription] = useState('')
  const [signups, setSignups] = useState('')
  const [attendees, setAttendees] = useState('')
  const [waitlist, setWaitlist] = useState('')
  const [digitalChannels, setDigitalChannels] = useState<DigitalChannel[]>([
    { platform: 'Instagram', handle: '', followers: '', url: '' }
  ])
  const [totalEventsHosted, setTotalEventsHosted] = useState('')
  const [pastEventsDescription, setPastEventsDescription] = useState('')
  const [mediaDescription, setMediaDescription] = useState('')
  const [partnerships, setPartnerships] = useState<Partnership[]>([
    { name: '', type: 'ongoing', description: '' }
  ])
  const [applicationLink, setApplicationLink] = useState('')
  const [totalEventBudget, setTotalEventBudget] = useState('')

  const resetForm = () => {
    setEventName('')
    setSlogan('')
    setEssence('')
    setConcept('')
    setSetup('')
    setPositioning('')
    setEventDates([{ date: '', description: '' }])
    setIsRecurring(false)
    setFrequency('')
    setTime('')
    setFormat('')
    setCorePillars([''])
    setAudienceDescription('')
    setSignups('')
    setAttendees('')
    setWaitlist('')
    setDigitalChannels([
      { platform: 'Instagram', handle: '', followers: '', url: '' }
    ])
    setTotalEventsHosted('')
    setPastEventsDescription('')
    setMediaDescription('')
    setPartnerships([{ name: '', type: 'ongoing', description: '' }])
    setApplicationLink('')
    setTotalEventBudget('')
  }

  const loadEventForEdit = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (!event) return

    setEventName(event.eventName)
    setSlogan(event.slogan)
    setEssence(event.essence)
    setConcept(event.concept)
    setSetup(event.setup)
    setPositioning(event.positioning)
    setEventDates(event.eventDates.length > 0 ? event.eventDates : [{ date: '' }])
    setIsRecurring(event.recurringConcept.isRecurring)
    setFrequency(event.recurringConcept.frequency || '')
    setTime(event.recurringConcept.time || '')
    setFormat(event.recurringConcept.format || '')
    setCorePillars(event.corePillars.length > 0 ? event.corePillars : [''])
    setAudienceDescription(event.audienceDescription)
    setSignups(event.physicalReach.signups)
    setAttendees(event.physicalReach.attendees)
    setWaitlist(event.physicalReach.waitlist)
    setDigitalChannels(
      event.digitalChannels.length > 0
        ? event.digitalChannels
        : [{ platform: 'Instagram', handle: '' }]
    )
    setTotalEventsHosted(event.pastEvents.totalEventsHosted)
    setPastEventsDescription(event.pastEvents.description || '')
    setMediaDescription(event.eventMedia.description)
    setPartnerships(
      event.partnerships.length > 0
        ? event.partnerships
        : [{ name: '', type: 'ongoing' }]
    )
    setApplicationLink(event.applicationLink)
    setTotalEventBudget(event.totalEventBudget)

    setSelectedEventId(eventId)
    setViewMode('edit')
  }

  const handleSubmit = async (status: 'draft' | 'published') => {
    const input: CreateEventInput = {
      eventName,
      slogan,
      essence,
      concept,
      setup,
      positioning,
      eventDates: eventDates.filter((d) => d.date),
      recurringConcept: {
        isRecurring,
        frequency: isRecurring ? frequency : undefined,
        time: isRecurring ? time : undefined,
        format: isRecurring ? format : undefined
      },
      corePillars: corePillars.filter((p) => p.trim()),
      audienceDescription,
      physicalReach: { signups, attendees, waitlist },
      digitalChannels: digitalChannels.filter((c) => c.handle),
      pastEvents: { totalEventsHosted, description: pastEventsDescription },
      eventMedia: { images: [], description: mediaDescription },
      partnerships: partnerships.filter((p) => p.name),
      applicationLink,
      totalEventBudget
    }

    if (viewMode === 'edit' && selectedEventId) {
      const result = await handleUpdateEvent(selectedEventId, { ...input, status })
      if (result) {
        resetForm()
        setViewMode('list')
        setSelectedEventId(null)
      }
    } else {
      const result = await handleCreateEvent(input, status)
      if (result) {
        resetForm()
        setViewMode('list')
      }
    }
  }

  const handleCancel = () => {
    resetForm()
    setViewMode('list')
    setSelectedEventId(null)
    clearFeedback()
  }

  const handleDelete = async (eventId: string) => {
    if (
      window.confirm(
        'Are you sure you want to delete this event? This action cannot be undone.'
      )
    ) {
      await handleDeleteEvent(eventId)
    }
  }

  if (loading) {
    return (
      <div className='flex items-center justify-center py-12'>
        <div className='text-gray-500'>Loading events...</div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      {showHeader && (
        <div className='mb-6 flex items-center justify-between'>
          <div>
            <h2 className='text-xl font-semibold text-gray-900'>Event Management</h2>
            <p className='text-gray-600'>
              Manage your event profiles and showcase them to brands
            </p>
          </div>
          {viewMode === 'list' && (
            <Button
              variant='primary'
              onClick={() => {
                resetForm()
                setViewMode('create')
              }}
            >
              <Plus className='h-5 w-5 mr-2' />
              Create Event
            </Button>
          )}
        </div>
      )}

      {/* Feedback Messages */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div>
          {events.length === 0 ? (
            <div className='bg-white rounded-lg shadow-sm p-12 text-center'>
              <Calendar className='h-16 w-16 mx-auto mb-4 text-gray-400' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>
                No events yet
              </h3>
              <p className='text-gray-600 mb-6'>
                Create your first event profile to showcase to brands
              </p>
              <Button
                variant='primary'
                onClick={() => {
                  resetForm()
                  setViewMode('create')
                }}
              >
                <Plus className='h-5 w-5 mr-2' />
                Create Event
              </Button>
            </div>
          ) : (
            <div className='space-y-4'>
              {events.map((event) => (
                <div
                  key={event.id}
                  className='bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1'>
                      <div className='flex items-center gap-3 mb-2'>
                        <h3 className='text-xl font-semibold text-gray-900'>
                          {event.eventName}
                        </h3>
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full ${
                            event.status === 'published'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {event.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <p className='text-sm text-gray-600 italic mb-3'>
                        {event.slogan}
                      </p>
                      <p className='text-gray-700 mb-4 line-clamp-2'>
                        {event.essence}
                      </p>
                      <div className='flex items-center gap-4 text-sm text-gray-500'>
                        {event.eventDates.length > 0 && (
                          <span>
                            {event.eventDates.length} event date
                            {event.eventDates.length > 1 ? 's' : ''}
                          </span>
                        )}
                        {event.recurringConcept.isRecurring && (
                          <span className='text-indigo-600 font-medium'>
                            Recurring
                          </span>
                        )}
                        {event.totalEventBudget && (
                          <span>Budget: {event.totalEventBudget}</span>
                        )}
                      </div>
                    </div>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => loadEventForEdit(event.id)}
                        className='p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors'
                        title='Edit'
                      >
                        <Edit2 className='h-5 w-5' />
                      </button>
                      <button
                        onClick={() => handleDelete(event.id)}
                        className='p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                        title='Delete'
                      >
                        <Trash2 className='h-5 w-5' />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Form - Condensed version showing just the basic structure */}
      {(viewMode === 'create' || viewMode === 'edit') && (
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-xl font-semibold text-gray-900 mb-6'>
            {viewMode === 'create' ? 'Create New Event' : 'Edit Event'}
          </h2>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit('published')
            }}
            className='space-y-8'
          >
            {/* Basic Information */}
            <section>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Basic Information
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Event Name *
                  </label>
                  <input
                    type='text'
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    required
                    placeholder='e.g., The Coffee Party Stockholm'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Slogan *
                  </label>
                  <input
                    type='text'
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    required
                    placeholder='e.g., Bringing amazing nightlife vibes to the A.M.'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  />
                </div>
              </div>
            </section>

            {/* Story & Identity */}
            <section>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Story & Identity
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Essence / Story / Identity *
                  </label>
                  <textarea
                    value={essence}
                    onChange={(e) => setEssence(e.target.value)}
                    required
                    rows={4}
                    placeholder='Tell your story...'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    The Concept *
                  </label>
                  <textarea
                    value={concept}
                    onChange={(e) => setConcept(e.target.value)}
                    required
                    rows={4}
                    placeholder='Describe your event concept...'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    The Setup *
                  </label>
                  <textarea
                    value={setup}
                    onChange={(e) => setSetup(e.target.value)}
                    required
                    rows={4}
                    placeholder='Describe your event setup...'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Positioning
                  </label>
                  <textarea
                    value={positioning}
                    onChange={(e) => setPositioning(e.target.value)}
                    rows={4}
                    placeholder='How do you position your event?'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  />
                </div>
              </div>
            </section>

            {/* Event Dates */}
            <section>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Event Dates
              </h3>
              <div className='space-y-3'>
                {eventDates.map((eventDate, index) => (
                  <div key={index} className='flex gap-3'>
                    <input
                      type='date'
                      value={eventDate.date}
                      onChange={(e) => {
                        const newDates = [...eventDates]
                        newDates[index].date = e.target.value
                        setEventDates(newDates)
                      }}
                      className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                    />
                    <input
                      type='text'
                      value={eventDate.description || ''}
                      onChange={(e) => {
                        const newDates = [...eventDates]
                        newDates[index].description = e.target.value
                        setEventDates(newDates)
                      }}
                      placeholder='Optional description'
                      className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                    />
                    {eventDates.length > 1 && (
                      <button
                        type='button'
                        onClick={() => {
                          setEventDates(eventDates.filter((_, i) => i !== index))
                        }}
                        className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                      >
                        <Trash2 className='h-5 w-5' />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type='button'
                  onClick={() =>
                    setEventDates([...eventDates, { date: '', description: '' }])
                  }
                  className='text-sm text-indigo-600 hover:text-indigo-700 font-medium'
                >
                  + Add Another Date
                </button>
              </div>
            </section>

            {/* Recurring Concept */}
            <section>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Recurring Concept
              </h3>
              <div className='space-y-4'>
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
                  />
                  <span className='text-sm font-medium text-gray-700'>
                    This is a recurring event
                  </span>
                </label>

                {isRecurring && (
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 pl-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Frequency
                      </label>
                      <input
                        type='text'
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        placeholder='e.g., Once per month'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Time
                      </label>
                      <input
                        type='text'
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        placeholder='e.g., Sundays, 11:00–15:00'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Format
                      </label>
                      <input
                        type='text'
                        value={format}
                        onChange={(e) => setFormat(e.target.value)}
                        placeholder='e.g., Limited-capacity'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Core Pillars */}
            <section>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Core Concept Pillars
              </h3>
              <div className='space-y-3'>
                {corePillars.map((pillar, index) => (
                  <div key={index} className='flex gap-3'>
                    <input
                      type='text'
                      value={pillar}
                      onChange={(e) => {
                        const newPillars = [...corePillars]
                        newPillars[index] = e.target.value
                        setCorePillars(newPillars)
                      }}
                      placeholder='e.g., Coffee, Music, Community'
                      className='flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                    />
                    {corePillars.length > 1 && (
                      <button
                        type='button'
                        onClick={() => {
                          setCorePillars(corePillars.filter((_, i) => i !== index))
                        }}
                        className='p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors'
                      >
                        <Trash2 className='h-5 w-5' />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type='button'
                  onClick={() => setCorePillars([...corePillars, ''])}
                  className='text-sm text-indigo-600 hover:text-indigo-700 font-medium'
                >
                  + Add Another Pillar
                </button>
              </div>
            </section>

            {/* Audience & Reach */}
            <section>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                Audience & Reach
              </h3>
              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Audience Description *
                  </label>
                  <textarea
                    value={audienceDescription}
                    onChange={(e) => setAudienceDescription(e.target.value)}
                    required
                    rows={4}
                    placeholder='Describe your target audience...'
                    className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Physical Reach (Per Event)
                  </label>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                    <div>
                      <label className='block text-xs text-gray-600 mb-1'>
                        Signups
                      </label>
                      <input
                        type='text'
                        value={signups}
                        onChange={(e) => setSignups(e.target.value)}
                        placeholder='e.g., 500–600'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-xs text-gray-600 mb-1'>
                        Attendees
                      </label>
                      <input
                        type='text'
                        value={attendees}
                        onChange={(e) => setAttendees(e.target.value)}
                        placeholder='e.g., 300–400'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      />
                    </div>
                    <div>
                      <label className='block text-xs text-gray-600 mb-1'>
                        Waitlist
                      </label>
                      <input
                        type='text'
                        value={waitlist}
                        onChange={(e) => setWaitlist(e.target.value)}
                        placeholder='e.g., ~100'
                        className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Additional sections truncated for brevity - include digital channels, past events, media, partnerships, budget in the actual implementation */}

            {/* Form Actions */}
            <div className='flex gap-3 pt-6 border-t'>
              <Button
                type='button'
                variant='outline'
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => handleSubmit('draft')}
                disabled={isSubmitting}
              >
                <Save className='h-5 w-5 mr-2' />
                Save as Draft
              </Button>
              <Button
                type='submit'
                variant='primary'
                disabled={isSubmitting}
              >
                <Send className='h-5 w-5 mr-2' />
                {isSubmitting ? 'Publishing...' : 'Publish Event'}
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
