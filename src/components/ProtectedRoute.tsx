import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export const ProtectedRoute = ({
  children,
  requiredType
}: {
  children: React.ReactNode
  requiredType?: 'brand' | 'organizer' | 'admin'
}) => {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return (
      <div className='flex min-h-[200px] items-center justify-center'>
        <div className='inline-block h-10 w-10 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600'></div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to='/login' replace />
  }

  if (requiredType && currentUser.type !== requiredType) {
    if (currentUser.type === 'brand') {
      return <Navigate to='/dashboard/brand' replace />
    } else if (currentUser.type === 'organizer') {
      return <Navigate to='/dashboard/organizer' replace />
    } else {
      return <Navigate to='/admin' replace />
    }
  }

  return <>{children}</>
}
