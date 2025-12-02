import { Star } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { CommunityMember } from '../../types/community'
import { AdminToggle } from './AdminToggle'

interface CommunityCardProps {
  member: CommunityMember
  onFeatureToggle?: (memberId: string, featured: boolean) => void
}
export function CommunityCard({ member, onFeatureToggle }: CommunityCardProps) {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.type === 'admin'
  const navigate = useNavigate()
  const handleCardClick = () => {
    navigate(`/community/${member.id}`)
  }
  return (
    <div
      className='bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all group relative cursor-pointer flex flex-col h-full'
      onClick={handleCardClick}
    >
      {/* Admin toggle for featuring */}
      {isAdmin && onFeatureToggle && (
        <div
          className='absolute top-2 right-2 z-10'
          onClick={(e) => e.stopPropagation()} // Prevent card click when toggling
        >
          <AdminToggle
            memberId={member.id}
            isFeatured={member.featured}
            onToggle={(newStatus) => onFeatureToggle(member.id, newStatus)}
          />
        </div>
      )}
      <div className='p-6'>
        <div className='flex items-start'>
          <div className='relative h-16 w-16 mr-4 flex-shrink-0'>
            {member.logoUrl ? (
              <img
                src={member.logoUrl}
                alt={member.name}
                className='h-full w-full object-contain rounded-md group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all'
              />
            ) : (
              <div
                className={`h-full w-full rounded-md flex items-center justify-center text-white font-bold text-2xl ${
                  member.type === 'brand' ? 'bg-blue-500' : 'bg-purple-500'
                }`}
              >
                {member.name.charAt(0)}
              </div>
            )}
            {member.featured && !isAdmin && (
              <div
                className='absolute -top-1 -right-1 bg-yellow-400 text-yellow-800 rounded-full p-0.5'
                title='Featured'
              >
                <Star className='h-3 w-3 fill-current' />
              </div>
            )}
          </div>
          <div className='flex-grow'>
            <div className='flex items-center justify-between'>
              <h3 className='text-lg font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors'>
                {member.name}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full ${
                  member.type === 'brand'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                {member.type === 'brand' ? 'Brand' : 'Organizer'}
              </span>
            </div>
            <p className='mt-1 text-sm text-gray-600 line-clamp-2'>
              {member.shortDescription}
            </p>
          </div>
        </div>
      </div>
      <div
        className={`px-6 py-3 text-xs text-gray-500 border-t mt-auto ${
          member.type === 'brand'
            ? 'border-blue-50 bg-blue-50'
            : 'border-purple-50 bg-purple-50'
        }`}
      >
        {new Date(member.dateRegistered).toLocaleDateString()} • Click for
        details
      </div>
    </div>
  )
}
