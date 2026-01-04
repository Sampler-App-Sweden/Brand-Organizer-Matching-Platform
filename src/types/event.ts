export interface EventDate {
  date: string
  description?: string
}

export interface RecurringConcept {
  isRecurring: boolean
  frequency?: string
  time?: string
  format?: string
}

export interface PhysicalReach {
  signups: string
  attendees: string
  waitlist: string
}

export interface DigitalChannel {
  platform: 'Instagram' | 'TikTok' | 'X' | 'LinkedIn' | 'Facebook' | 'YouTube' | 'Other'
  handle: string
  followers?: string
  url?: string
}

export interface PastEvents {
  totalEventsHosted: string
  description?: string
}

export interface EventMedia {
  images: string[]
  description: string
}

export interface Partnership {
  name: string
  type: 'ongoing' | 'previous'
  description?: string
}

export interface Event {
  id: string
  organizerId: string

  // Basic Info
  eventName: string
  eventType: string
  customEventType: string
  slogan: string

  // Story & Identity
  essence: string
  concept: string
  setup: string
  positioning: string

  // Event Details
  eventDates: EventDate[]
  recurringConcept: RecurringConcept
  corePillars: string[]

  // Audience & Reach
  audienceDescription: string
  physicalReach: PhysicalReach
  digitalChannels: DigitalChannel[]

  // History & Media
  pastEvents: PastEvents
  eventMedia: EventMedia

  // Partnerships & Budget
  partnerships: Partnership[]
  applicationLink: string
  totalEventBudget: string

  // Metadata
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export interface CreateEventInput {
  eventName: string
  eventType: string
  customEventType: string
  slogan: string
  essence: string
  concept: string
  setup: string
  positioning: string
  eventDates: EventDate[]
  recurringConcept: RecurringConcept
  corePillars: string[]
  audienceDescription: string
  physicalReach: PhysicalReach
  digitalChannels: DigitalChannel[]
  pastEvents: PastEvents
  eventMedia: EventMedia
  partnerships: Partnership[]
  applicationLink: string
  totalEventBudget: string
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  status?: 'draft' | 'published'
}
