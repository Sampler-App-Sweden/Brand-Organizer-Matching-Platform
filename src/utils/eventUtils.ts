import type { Event, EventDate } from '../types/event'

export function categorizeEventsByDate(events: Event[]): {
  upcoming: Event[]
  past: Event[]
} {
  const now = new Date()
  const upcoming: Event[] = []
  const past: Event[] = []

  events.forEach((event) => {
    const hasFutureDates = event.eventDates.some(
      (d) => new Date(d.date) >= now
    )
    const hasPastDates = event.eventDates.some((d) => new Date(d.date) < now)

    if (hasFutureDates) upcoming.push(event)
    if (hasPastDates) past.push(event)
  })

  return { upcoming, past }
}

export function formatEventDate(date: string): string {
  try {
    const dateObj = new Date(date)
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  } catch {
    return date
  }
}

export function getNextEventDate(event: Event): EventDate | null {
  const now = new Date()
  const futureDates = event.eventDates
    .filter((d) => new Date(d.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return futureDates[0] || null
}
