import { FlaskConicalIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { getCommunityMembers } from '../../services/communityService'
import { CommunityMember } from '../../types/community'

interface CommunityDropdownProps {
  isMobile?: boolean
}
export function CommunityDropdown({
  isMobile = false
}: CommunityDropdownProps) {
  const [members, setMembers] = useState<CommunityMember[]>([])
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getCommunityMembers({
          limit: 8,
          featured: true
        })
        setMembers(data)
        setLoading(false)
      } catch (error) {
        console.error('Failed to fetch community members:', error)
        setLoading(false)
      }
    }
    fetchMembers()
  }, [])
  return (
    <div
      className={`bg-white rounded-md shadow-lg overflow-hidden ${
        isMobile ? 'w-full' : 'w-[600px]'
      }`}
    >
      <div className='p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100'>
        <div className='flex items-center'>
          <FlaskConicalIcon className='h-5 w-5 text-indigo-500 mr-2' />
          <h3 className='text-lg font-medium text-indigo-900'>Our Community</h3>
        </div>
        <p className='text-sm text-gray-600 mt-1'>
          Discover the brands and organizers that make our community special
        </p>
      </div>
      {loading ? (
        <div className='p-8 text-center'>
          <div className='inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-200 border-t-indigo-600'></div>
          <p className='mt-2 text-gray-500'>Loading community...</p>
        </div>
      ) : (
        <>
          <div
            className={`grid ${
              isMobile ? 'grid-cols-2' : 'grid-cols-4'
            } gap-4 p-4`}
          >
            {members.map((member) => (
              <div key={member.id} className='group relative'>
                <Link
                  to={`/community/${member.id}`}
                  className='block p-3 rounded-md transition-all hover:bg-indigo-50'
                >
                  <div className='h-12 w-12 mx-auto mb-2 relative'>
                    {member.logoUrl ? (
                      <img
                        src={member.logoUrl}
                        alt={member.name}
                        className='h-full w-full object-contain rounded-md group-hover:shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all'
                      />
                    ) : (
                      <div
                        className={`h-full w-full rounded-md flex items-center justify-center text-white font-bold text-xl ${
                          member.type === 'brand'
                            ? 'bg-blue-500'
                            : 'bg-purple-500'
                        }`}
                      >
                        {member.name.charAt(0)}
                      </div>
                    )}
                    <div
                      className={`absolute -top-1 -right-1 h-3 w-3 rounded-full ${
                        member.type === 'brand'
                          ? 'bg-blue-500'
                          : 'bg-purple-500'
                      }`}
                    ></div>
                  </div>
                  <h4 className='text-sm font-medium text-gray-900 text-center truncate'>
                    {member.name}
                  </h4>
                  <p className='text-xs text-gray-500 text-center line-clamp-1'>
                    {member.shortDescription}
                  </p>
                  {/* Tooltip on hover */}
                  <div className='absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity z-10'>
                    <div className='absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-xs rounded p-2'>
                      <div className='font-bold mb-1'>{member.name}</div>
                      <p>{member.description}</p>
                      <div className='absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-900'></div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className='p-3 bg-gray-50 text-center border-t border-gray-100'>
            <Link
              to='/community'
              className='text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center justify-center'
            >
              View all community members
              <svg
                className='h-4 w-4 ml-1'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 5l7 7-7 7'
                />
              </svg>
            </Link>
          </div>
        </>
      )}
    </div>
  )
}
