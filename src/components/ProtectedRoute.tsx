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
  const { currentUser } = useAuth()
  
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