import { Link } from 'react-router-dom'

import { DashboardLayout } from '../../components/layout'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context'
import { getNotificationLink } from '../../utils/notifications'

export function NotificationsPage() {
  const { currentUser } = useAuth()
  const {
    notifications,
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications()

  const unread = notifications.filter((n) => !n.read).length
  const userType =
    (currentUser?.type as 'brand' | 'organizer' | 'admin' | undefined) ??
    'brand'

  return (
    <DashboardLayout userType={userType}>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>Notifications</h1>
            <p className='text-gray-600'>
              Stay on top of updates about your account.
            </p>
          </div>
          <div className='flex gap-3'>
            <button
              type='button'
              onClick={markAllAsRead}
              disabled={unread === 0 || loading}
              className='px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed'
            >
              Mark all as read
            </button>
          </div>
        </div>

        {loading ? (
          <div className='flex justify-center items-center h-48 text-gray-500'>
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className='border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500'>
            No notifications yet.
          </div>
        ) : (
          <div className='space-y-3'>
            {notifications.map((n) => {
              const link = getNotificationLink(n.type, n.relatedId, userType)
              const NotificationWrapper = link ? Link : 'div'
              const wrapperProps = link
                ? {
                    to: link,
                    onClick: () => !n.read && markAsRead(n.id)
                  }
                : {}

              return (
                <div
                  key={n.id}
                  className={`flex items-start justify-between rounded-lg border border-gray-200 bg-white shadow-sm ${
                    n.read ? 'opacity-80' : ''
                  }`}
                >
                  <NotificationWrapper
                    {...wrapperProps}
                    className={`flex-1 p-4 ${link ? 'hover:bg-gray-50 cursor-pointer transition-colors' : ''}`}
                  >
                    <div>
                      <div className='flex items-center gap-2'>
                        {!n.read && (
                          <span className='h-2 w-2 rounded-full bg-indigo-600'></span>
                        )}
                        <p className='text-sm text-gray-500'>
                          {n.createdAt.toLocaleString()}
                        </p>
                      </div>
                      <h3 className='text-base font-semibold text-gray-900'>
                        {n.title}
                      </h3>
                      <p className='text-sm text-gray-700 mt-1'>{n.message}</p>
                      {link && (
                        <p className='text-xs text-indigo-600 mt-2'>
                          Click to view →
                        </p>
                      )}
                    </div>
                  </NotificationWrapper>
                  <div className='flex flex-col gap-2 items-end p-4'>
                    {!n.read && (
                      <button
                        type='button'
                        onClick={() => markAsRead(n.id)}
                        className='text-sm text-indigo-600 hover:text-indigo-800'
                      >
                        Mark read
                      </button>
                    )}
                    <button
                      type='button'
                      onClick={() => deleteNotification(n.id)}
                      className='text-sm text-red-600 hover:text-red-800'
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
