import { CalendarIcon, Star, StarIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import {
  isMemberSaved,
  toggleSavedMember
} from '../../services/communityService'
import { CommunityMember } from '../../types/community'

interface DirectoryCardProps {
  member: CommunityMember
  matches?: {
    id: string
    name: string
    date: string
  }[]
}
export function DirectoryCard({ member, matches = [] }: DirectoryCardProps) {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [saved, setSaved] = useState<boolean>(
    currentUser ? isMemberSaved(currentUser.id, member.id) : false
  )
  const [showMatches, setShowMatches] = useState(false)
  const handleSaveToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    if (!currentUser) {
      navigate('/login', {
        state: {
          returnUrl: `/community/${member.id}`
        }
      })
      return
    }
    toggleSavedMember(currentUser.id, member.id)
    setSaved(!saved)
  }
  const handleCardClick = () => {
    navigate(`/community/${member.id}`)
  }
  return (
    <div
      className='bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-md hover:border-indigo-100 transition-all group cursor-pointer relative'
      onClick={handleCardClick}
    >
      {/* Save button */}
      <button
        className='absolute top-2 right-2 z-10 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-all'
        onClick={handleSaveToggle}
        title={saved ? 'Remove from saved' : 'Save for later'}
      >
        {saved ? (
          <StarIcon className='h-5 w-5 text-yellow-500 fill-current' />
        ) : (
          <Star className='h-5 w-5 text-gray-400 hover:text-yellow-500' />
        )}
      </button>
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
            {member.featured && (
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

      {/* Match preview section */}
      <div
        className={`px-6 py-3 text-xs border-t ${
          member.type === 'brand'
            ? 'border-blue-50 bg-blue-50'
            : 'border-purple-50 bg-purple-50'
        }`}
      >
        <div
          className='flex justify-between items-center cursor-pointer'
          onClick={(e) => {
            e.stopPropagation()
            setShowMatches(!showMatches)
          }}
        >
          <div className='flex items-center text-gray-700'>
            <SparklesIcon className='h-3.5 w-3.5 mr-1.5' />
            <span>
              {matches.length > 0
                ? `${matches.length} matched ${
                    member.type === 'brand' ? 'events' : 'brands'
                  }`
                : `No matches yet`}
            </span>
          </div>
          <button className='text-indigo-600 hover:text-indigo-800 text-xs'>
            {showMatches ? 'Hide' : 'Show'}
          </button>
        </div>
        {/* Expanded matches list */}
        {showMatches && matches.length > 0 && (
          <div
            className='mt-2 space-y-2 pt-2 border-t border-gray-200 border-opacity-50'
            onClick={(e) => e.stopPropagation()}
          >
            {matches.slice(0, 3).map((match) => (
              <div key={match.id} className='flex items-start'>
                {member.type === 'brand' ? (
                  <CalendarIcon className='h-3.5 w-3.5 text-purple-500 mr-1.5 mt-0.5' />
                ) : (
                  <div className='h-3.5 w-3.5 bg-blue-500 rounded-sm mr-1.5 mt-0.5' />
                )}
                <div>
                  <div className='text-xs font-medium text-gray-900'>
                    {match.name}
                  </div>
                  <div className='text-xs text-gray-500'>{match.date}</div>
                </div>
              </div>
            ))}
            {matches.length > 3 && (
              <div className='text-xs text-indigo-600 hover:text-indigo-800 mt-1'>
                + {matches.length - 3} more matches
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
function SparklesIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z' />
      <path d='M5 3v4' />
      <path d='M19 17v4' />
      <path d='M3 5h4' />
      <path d='M17 19h4' />
    </svg>
  )
}
