import {
  BuildingIcon,
  CalendarIcon,
  CheckCircleIcon,
  UserIcon
} from 'lucide-react'

import { UserRole } from '../../types/profile'

interface ProgressIndicatorProps {
  percentage: number
  role: UserRole
}
export function ProgressIndicator({
  percentage,
  role
}: ProgressIndicatorProps) {
  const getRoleIcon = () => {
    switch (role) {
      case 'brand':
        return <BuildingIcon className='h-5 w-5 text-indigo-600' />
      case 'organizer':
        return <CalendarIcon className='h-5 w-5 text-indigo-600' />
      case 'community':
        return <UserIcon className='h-5 w-5 text-indigo-600' />
      default:
        return null
    }
  }
  const getRoleLabel = () => {
    switch (role) {
      case 'brand':
        return 'Brand Profile'
      case 'organizer':
        return 'Organizer Profile'
      case 'community':
        return 'Community Profile'
      default:
        return 'Profile'
    }
  }
  const getStatusLabel = () => {
    if (percentage >= 100) {
      return 'Complete'
    } else if (percentage >= 70) {
      return 'Almost complete'
    } else if (percentage >= 40) {
      return 'Good progress'
    } else {
      return 'Just started'
    }
  }
  const getStatusColor = () => {
    if (percentage >= 100) {
      return 'text-green-600'
    } else if (percentage >= 70) {
      return 'text-indigo-600'
    } else if (percentage >= 40) {
      return 'text-amber-600'
    } else {
      return 'text-gray-600'
    }
  }
  return (
    <div className='bg-gray-50 rounded-lg p-4 border border-gray-200'>
      <div className='flex items-center justify-between mb-2'>
        <div className='flex items-center'>
          {getRoleIcon()}
          <span className='ml-2 font-medium text-gray-800'>
            {getRoleLabel()}
          </span>
        </div>
        <div className={`flex items-center ${getStatusColor()}`}>
          {percentage >= 100 && <CheckCircleIcon className='h-4 w-4 mr-1' />}
          <span className='text-sm'>{getStatusLabel()}</span>
        </div>
      </div>
      <div className='w-full bg-gray-200 rounded-full h-2.5'>
        <div
          className={`h-2.5 rounded-full ${
            percentage >= 100
              ? 'bg-green-600'
              : percentage >= 70
              ? 'bg-indigo-600'
              : percentage >= 40
              ? 'bg-amber-500'
              : 'bg-gray-400'
          }`}
          style={{
            width: `${Math.min(percentage, 100)}%`
          }}
        ></div>
      </div>
      <div className='mt-2 text-xs text-gray-500'>
        {percentage < 100 ? (
          <span>
            Keep going! The more you tell us, the better matches we can find.
          </span>
        ) : (
          <span>Your profile is complete and ready to be matched!</span>
        )}
      </div>
    </div>
  )
}
