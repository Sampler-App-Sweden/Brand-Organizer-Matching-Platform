import { supabase } from './supabaseClient'
import type {
  Event,
  CreateEventInput,
  UpdateEventInput,
  EventDate,
  RecurringConcept,
  PhysicalReach,
  DigitalChannel,
  PastEvents,
  EventMedia,
  Partnership
} from '../types/event'
import {
  getUserIdFromOrganizerId,
  notifySystemEvent
} from './notificationService'

// Database row interface (snake_case for Supabase)
interface EventRow {
  id: string
  organizer_id: string
  event_name: string
  slogan: string
  essence: string
  concept: string
  setup: string
  positioning: string
  event_dates: unknown
  recurring_concept: unknown
  core_pillars: string[]
  audience_description: string
  physical_reach: unknown
  digital_channels: unknown
  past_events: unknown
  event_media: unknown
  partnerships: unknown
  application_link: string
  total_event_budget: string
  status: 'draft' | 'published'
  created_at: string
  updated_at: string
}

// Normalization functions
const normalizeEventDates = (dates: unknown): EventDate[] => {
  if (!Array.isArray(dates)) return []
  return dates.map((d) => ({
    date: typeof d.date === 'string' ? d.date : '',
    description: typeof d.description === 'string' ? d.description : undefined
  }))
}

const normalizeRecurringConcept = (concept: unknown): RecurringConcept => {
  if (!concept || typeof concept !== 'object') {
    return { isRecurring: false }
  }
  const obj = concept as Record<string, unknown>
  return {
    isRecurring: typeof obj.isRecurring === 'boolean' ? obj.isRecurring : false,
    frequency: typeof obj.frequency === 'string' ? obj.frequency : undefined,
    time: typeof obj.time === 'string' ? obj.time : undefined,
    format: typeof obj.format === 'string' ? obj.format : undefined
  }
}

const normalizePhysicalReach = (reach: unknown): PhysicalReach => {
  if (!reach || typeof reach !== 'object') {
    return { signups: '', attendees: '', waitlist: '' }
  }
  const obj = reach as Record<string, unknown>
  return {
    signups: typeof obj.signups === 'string' ? obj.signups : '',
    attendees: typeof obj.attendees === 'string' ? obj.attendees : '',
    waitlist: typeof obj.waitlist === 'string' ? obj.waitlist : ''
  }
}

const normalizeDigitalChannels = (channels: unknown): DigitalChannel[] => {
  if (!Array.isArray(channels)) return []
  return channels.map((c) => ({
    platform: typeof c.platform === 'string' ? c.platform : 'Other',
    handle: typeof c.handle === 'string' ? c.handle : '',
    followers: typeof c.followers === 'string' ? c.followers : undefined,
    url: typeof c.url === 'string' ? c.url : undefined
  }))
}

const normalizePastEvents = (past: unknown): PastEvents => {
  if (!past || typeof past !== 'object') {
    return { totalEventsHosted: '' }
  }
  const obj = past as Record<string, unknown>
  return {
    totalEventsHosted:
      typeof obj.totalEventsHosted === 'string' ? obj.totalEventsHosted : '',
    description:
      typeof obj.description === 'string' ? obj.description : undefined
  }
}

const normalizeEventMedia = (media: unknown): EventMedia => {
  if (!media || typeof media !== 'object') {
    return { images: [], description: '' }
  }
  const obj = media as Record<string, unknown>
  return {
    images: Array.isArray(obj.images) ? obj.images : [],
    description: typeof obj.description === 'string' ? obj.description : ''
  }
}

const normalizePartnerships = (partnerships: unknown): Partnership[] => {
  if (!Array.isArray(partnerships)) return []
  return partnerships.map((p) => ({
    name: typeof p.name === 'string' ? p.name : '',
    type: p.type === 'ongoing' || p.type === 'previous' ? p.type : 'previous',
    description: typeof p.description === 'string' ? p.description : undefined
  }))
}

// Mapper function: database row -> application type
const mapEventRow = (row: EventRow): Event => ({
  id: row.id,
  organizerId: row.organizer_id,
  eventName: row.event_name,
  slogan: row.slogan,
  essence: row.essence,
  concept: row.concept,
  setup: row.setup,
  positioning: row.positioning,
  eventDates: normalizeEventDates(row.event_dates),
  recurringConcept: normalizeRecurringConcept(row.recurring_concept),
  corePillars: Array.isArray(row.core_pillars) ? row.core_pillars : [],
  audienceDescription: row.audience_description,
  physicalReach: normalizePhysicalReach(row.physical_reach),
  digitalChannels: normalizeDigitalChannels(row.digital_channels),
  pastEvents: normalizePastEvents(row.past_events),
  eventMedia: normalizeEventMedia(row.event_media),
  partnerships: normalizePartnerships(row.partnerships),
  applicationLink: row.application_link,
  totalEventBudget: row.total_event_budget,
  status: row.status,
  createdAt: row.created_at,
  updatedAt: row.updated_at
})

// Mapper function: application type -> database payload
const mapEventToRow = (
  organizerId: string,
  input: CreateEventInput | UpdateEventInput,
  status: 'draft' | 'published'
) => ({
  organizer_id: organizerId,
  event_name: input.eventName,
  slogan: input.slogan,
  essence: input.essence,
  concept: input.concept,
  setup: input.setup,
  positioning: input.positioning,
  event_dates: input.eventDates,
  recurring_concept: input.recurringConcept,
  core_pillars: input.corePillars,
  audience_description: input.audienceDescription,
  physical_reach: input.physicalReach,
  digital_channels: input.digitalChannels,
  past_events: input.pastEvents,
  event_media: input.eventMedia,
  partnerships: input.partnerships,
  application_link: input.applicationLink,
  total_event_budget: input.totalEventBudget,
  status
})

// CRUD operations
// Note: organizerId here is the organizers.id (not profiles.id/auth.uid)
export async function fetchOrganizerEvents(
  organizerId: string
): Promise<Event[]> {
  const { data, error } = await supabase
    .from('organizer_events')
    .select('*')
    .eq('organizer_id', organizerId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to load events: ${error.message}`)
  }

  return (data as EventRow[]).map(mapEventRow)
}

export async function fetchEventById(eventId: string): Promise<Event | null> {
  const { data, error } = await supabase
    .from('organizer_events')
    .select('*')
    .eq('id', eventId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load event: ${error.message}`)
  }

  return data ? mapEventRow(data as EventRow) : null
}

export async function createEvent(
  organizerId: string,
  input: CreateEventInput,
  status: 'draft' | 'published' = 'draft'
): Promise<Event> {
  const payload = mapEventToRow(organizerId, input, status)

  const { data, error } = await supabase
    .from('organizer_events')
    .insert(payload)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to create event: ${error.message}`)
  }

  return mapEventRow(data as EventRow)
}

export async function updateEvent(
  eventId: string,
  organizerId: string,
  input: UpdateEventInput
): Promise<Event> {
  const payload: Partial<ReturnType<typeof mapEventToRow>> = {}

  if (input.eventName !== undefined) payload.event_name = input.eventName
  if (input.slogan !== undefined) payload.slogan = input.slogan
  if (input.essence !== undefined) payload.essence = input.essence
  if (input.concept !== undefined) payload.concept = input.concept
  if (input.setup !== undefined) payload.setup = input.setup
  if (input.positioning !== undefined) payload.positioning = input.positioning
  if (input.eventDates !== undefined) payload.event_dates = input.eventDates
  if (input.recurringConcept !== undefined)
    payload.recurring_concept = input.recurringConcept
  if (input.corePillars !== undefined) payload.core_pillars = input.corePillars
  if (input.audienceDescription !== undefined)
    payload.audience_description = input.audienceDescription
  if (input.physicalReach !== undefined)
    payload.physical_reach = input.physicalReach
  if (input.digitalChannels !== undefined)
    payload.digital_channels = input.digitalChannels
  if (input.pastEvents !== undefined) payload.past_events = input.pastEvents
  if (input.eventMedia !== undefined) payload.event_media = input.eventMedia
  if (input.partnerships !== undefined) payload.partnerships = input.partnerships
  if (input.applicationLink !== undefined)
    payload.application_link = input.applicationLink
  if (input.totalEventBudget !== undefined)
    payload.total_event_budget = input.totalEventBudget
  if (input.status !== undefined) payload.status = input.status

  const { data, error } = await supabase
    .from('organizer_events')
    .update(payload)
    .eq('id', eventId)
    .eq('organizer_id', organizerId)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to update event: ${error.message}`)
  }

  return mapEventRow(data as EventRow)
}

export async function deleteEvent(
  eventId: string,
  organizerId: string
): Promise<void> {
  const { error } = await supabase
    .from('organizer_events')
    .delete()
    .eq('id', eventId)
    .eq('organizer_id', organizerId)

  if (error) {
    throw new Error(`Failed to delete event: ${error.message}`)
  }
}

export async function publishEvent(
  eventId: string,
  organizerId: string
): Promise<Event> {
  const { data, error } = await supabase
    .from('organizer_events')
    .update({ status: 'published' })
    .eq('id', eventId)
    .eq('organizer_id', organizerId)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to publish event: ${error.message}`)
  }

  const publishedEvent = mapEventRow(data as EventRow)

  // Notify organizer (non-blocking)
  getUserIdFromOrganizerId(organizerId)
    .then((userId) => {
      if (userId) {
        return notifySystemEvent(
          userId,
          'Event Published',
          `Your event "${publishedEvent.eventName}" has been published and is now visible to brands!`,
          publishedEvent.id
        )
      }
    })
    .catch((error) => {
      console.error('Failed to create event publish notification:', error)
    })

  return publishedEvent
}

export async function saveDraftEvent(
  eventId: string,
  organizerId: string
): Promise<Event> {
  const { data, error } = await supabase
    .from('organizer_events')
    .update({ status: 'draft' })
    .eq('id', eventId)
    .eq('organizer_id', organizerId)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to save as draft: ${error.message}`)
  }

  return mapEventRow(data as EventRow)
}
