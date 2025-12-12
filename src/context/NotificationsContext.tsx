import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import { supabase } from '../services/supabaseClient'
import { useAuth } from './AuthContext'
import type { Notification } from '../types'

interface NotificationsContextType {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
  markAsRead: (id: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  deleteNotification: (id: string) => Promise<void>
  clearAllNotifications: () => Promise<void>
  refreshNotifications: () => Promise<void>
  createNotification: (
    notification: Omit<Notification, 'id' | 'createdAt' | 'read'>
  ) => Promise<void>
}

const NotificationsContext = createContext<
  NotificationsContextType | undefined
>(undefined)

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth()
  const userId = currentUser?.id ?? null
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  const unreadCount = notifications.filter((n) => !n.read).length

  // Fetch notifications from Supabase
  const fetchNotifications = useCallback(async () => {
    setLoading(true)

    if (!userId) {
      setNotifications([])
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      const formattedNotifications: Notification[] = (data ?? []).map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        read: n.read,
        createdAt: new Date(n.created_at),
        type: n.type,
        relatedId: n.related_id
      }))

      setNotifications(formattedNotifications)
    } catch (error) {
      // If the notifications table is missing in this environment, fail soft and warn once.
      const code = (error as { code?: string })?.code
      if (code === 'PGRST205' || code === '404') {
        console.warn(
          'Notifications table not found in Supabase. Add the table or disable notifications for this environment.'
        )
        setNotifications([])
      } else {
        console.error('Error fetching notifications:', error)
      }
    } finally {
      setLoading(false)
    }
  }, [userId])

  // Mark a single notification as read
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)

      if (error) throw error

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      )
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    if (!userId) return

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false)

      if (error) throw error

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch (error) {
      console.error('Error marking all notifications as read:', error)
    }
  }

  // Delete a single notification
  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id)

      if (error) throw error

      setNotifications((prev) => prev.filter((n) => n.id !== id))
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  // Clear all notifications
  const clearAllNotifications = async () => {
    if (!userId) return

    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('user_id', userId)

      if (error) throw error

      setNotifications([])
    } catch (error) {
      console.error('Error clearing all notifications:', error)
    }
  }

  // Refresh notifications
  const refreshNotifications = async () => {
    await fetchNotifications()
  }

  // Create a new notification (useful for testing or system-generated notifications)
  const createNotification = async (
    notification: Omit<Notification, 'id' | 'createdAt' | 'read'>
  ) => {
    if (!userId) return

    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          title: notification.title,
          message: notification.message,
          type: notification.type,
          related_id: notification.relatedId,
          read: false
        })
        .select()
        .single()

      if (error) throw error

      const newNotification: Notification = {
        id: data.id,
        title: data.title,
        message: data.message,
        read: data.read,
        createdAt: new Date(data.created_at),
        type: data.type,
        relatedId: data.related_id
      }

      setNotifications((prev) => [newNotification, ...prev])
    } catch (error) {
      console.error('Error creating notification:', error)
    }
  }

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Subscribe to real-time notification updates
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newNotification: Notification = {
              id: payload.new.id,
              title: payload.new.title,
              message: payload.new.message,
              read: payload.new.read,
              createdAt: new Date(payload.new.created_at),
              type: payload.new.type,
              relatedId: payload.new.related_id
            }
            setNotifications((prev) => {
              const withoutDuplicate = prev.filter(
                (n) => n.id !== newNotification.id
              )
              return [newNotification, ...withoutDuplicate]
            })
          } else if (payload.eventType === 'UPDATE') {
            setNotifications((prev) =>
              prev.map((n) =>
                n.id === payload.new.id
                  ? {
                      ...n,
                      read: payload.new.read,
                      title: payload.new.title,
                      message: payload.new.message
                    }
                  : n
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setNotifications((prev) =>
              prev.filter((n) => n.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId])

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        refreshNotifications,
        createNotification
      }}
    >
      {children}
    </NotificationsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotifications() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error(
      'useNotifications must be used within NotificationsProvider'
    )
  }
  return context
}
