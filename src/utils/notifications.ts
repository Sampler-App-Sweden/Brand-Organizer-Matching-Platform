import type { NotificationType } from '../types/notifications'

export function getNotificationLabel(type: NotificationType): string {
  switch (type) {
    case 'match':
      return 'Match'
    case 'message':
      return 'Message'
    case 'profile_update':
      return 'Profile Update'
    case 'system':
    default:
      return 'System'
  }
}

export function getNotificationBadgeClasses(type: NotificationType): string {
  switch (type) {
    case 'match':
      return 'bg-green-100 text-green-800'
    case 'message':
      return 'bg-blue-100 text-blue-800'
    case 'profile_update':
      return 'bg-purple-100 text-purple-800'
    case 'system':
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function getNotificationLink(
  type: NotificationType,
  relatedId?: string,
  userType?: string
): string | null {
  if (!relatedId) return null

  switch (type) {
    case 'match':
      // Link to match details page
      if (userType === 'brand') {
        return `/dashboard/brand/matches/${relatedId}`
      } else if (userType === 'organizer') {
        return `/dashboard/organizer/matches/${relatedId}`
      }
      return null
    case 'message':
      // Link to messages page with conversation ID
      return `/dashboard/messages?conversation=${relatedId}`
    case 'profile_update':
      // Link to the profile detail page
      return `/profiles/${relatedId}`
    case 'system':
    default:
      return null
  }
}
