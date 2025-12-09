export type NotificationType = 'match' | 'message' | 'system' | 'profile_update'

export interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: Date
  type: NotificationType
  relatedId?: string
}
