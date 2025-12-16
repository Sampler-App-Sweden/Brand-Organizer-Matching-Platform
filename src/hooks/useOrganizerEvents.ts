import { useEffect, useState } from 'react'
import type { Event, CreateEventInput, UpdateEventInput } from '../types/event'
import {
  fetchOrganizerEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  publishEvent,
  saveDraftEvent
} from '../services/eventsService'

type FeedbackState = { type: 'success' | 'error'; message: string } | null

export function useOrganizerEvents(organizerId?: string) {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [feedback, setFeedback] = useState<FeedbackState>(null)

  useEffect(() => {
    if (!organizerId) {
      setEvents([])
      setLoading(false)
      return
    }

    let isMounted = true

    const loadEvents = async () => {
      setLoading(true)
      try {
        const data = await fetchOrganizerEvents(organizerId)
        if (!isMounted) return
        setEvents(data)
        setFeedback(null)
      } catch (error) {
        console.error(error)
        if (isMounted) {
          setFeedback({
            type: 'error',
            message: 'Failed to load events. Please try again.'
          })
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadEvents()
    return () => {
      isMounted = false
    }
  }, [organizerId])

  const handleCreateEvent = async (
    input: CreateEventInput,
    status: 'draft' | 'published' = 'draft'
  ): Promise<Event | null> => {
    if (!organizerId) return null

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const newEvent = await createEvent(organizerId, input, status)
      setEvents((prev) => [newEvent, ...prev])
      setFeedback({
        type: 'success',
        message:
          status === 'draft'
            ? 'Event saved as draft successfully.'
            : 'Event published successfully.'
      })
      return newEvent
    } catch (error) {
      console.error(error)
      setFeedback({
        type: 'error',
        message: 'Failed to create event. Please try again.'
      })
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateEvent = async (
    eventId: string,
    input: UpdateEventInput
  ): Promise<Event | null> => {
    if (!organizerId) return null

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const updatedEvent = await updateEvent(eventId, organizerId, input)
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? updatedEvent : event))
      )
      setFeedback({
        type: 'success',
        message: 'Event updated successfully.'
      })
      return updatedEvent
    } catch (error) {
      console.error(error)
      setFeedback({
        type: 'error',
        message: 'Failed to update event. Please try again.'
      })
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEvent = async (eventId: string): Promise<boolean> => {
    if (!organizerId) return false

    setIsSubmitting(true)
    setFeedback(null)

    try {
      await deleteEvent(eventId, organizerId)
      setEvents((prev) => prev.filter((event) => event.id !== eventId))
      setFeedback({
        type: 'success',
        message: 'Event deleted successfully.'
      })
      return true
    } catch (error) {
      console.error(error)
      setFeedback({
        type: 'error',
        message: 'Failed to delete event. Please try again.'
      })
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublishEvent = async (eventId: string): Promise<Event | null> => {
    if (!organizerId) return null

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const publishedEvent = await publishEvent(eventId, organizerId)
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? publishedEvent : event))
      )
      setFeedback({
        type: 'success',
        message: 'Event published successfully.'
      })
      return publishedEvent
    } catch (error) {
      console.error(error)
      setFeedback({
        type: 'error',
        message: 'Failed to publish event. Please try again.'
      })
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraftEvent = async (
    eventId: string
  ): Promise<Event | null> => {
    if (!organizerId) return null

    setIsSubmitting(true)
    setFeedback(null)

    try {
      const draftEvent = await saveDraftEvent(eventId, organizerId)
      setEvents((prev) =>
        prev.map((event) => (event.id === eventId ? draftEvent : event))
      )
      setFeedback({
        type: 'success',
        message: 'Event saved as draft successfully.'
      })
      return draftEvent
    } catch (error) {
      console.error(error)
      setFeedback({
        type: 'error',
        message: 'Failed to save event as draft. Please try again.'
      })
      return null
    } finally {
      setIsSubmitting(false)
    }
  }

  const clearFeedback = () => setFeedback(null)

  return {
    events,
    loading,
    isSubmitting,
    feedback,
    handleCreateEvent,
    handleUpdateEvent,
    handleDeleteEvent,
    handlePublishEvent,
    handleSaveDraftEvent,
    clearFeedback
  }
}
