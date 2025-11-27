import { Sparkles, UsersIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '../ui'

export function HomeCommunityCTA() {
  return (
    <div className='bg-gradient-to-r from-indigo-50 to-purple-50 py-8 rounded-lg relative overflow-hidden'>
      {/* Mystical decorative elements */}
      <div className='absolute top-0 right-0 w-32 h-32 bg-indigo-100 rounded-full -mr-16 -mt-16 opacity-40'></div>
      <div className='absolute bottom-0 left-0 w-24 h-24 bg-purple-100 rounded-full -ml-12 -mb-12 opacity-40'></div>
      {/* Content */}
      <div className='container mx-auto px-4 relative z-10'>
        <div className='flex flex-col md:flex-row items-center justify-between'>
          <div className='flex items-center mb-4 md:mb-0'>
            <UsersIcon className='h-6 w-6 text-indigo-600 mr-3' />
            <div>
              <h3 className='text-lg font-semibold text-gray-900'>
                Join Our Community
              </h3>
              <p className='text-sm text-gray-600'>
                Connect with brands and event organizers
              </p>
            </div>
          </div>
          <Link to='/community'>
            <Button
              variant='outline'
              className='flex items-center group transition-all hover:bg-indigo-50'
            >
              <span>Explore Community</span>
              <Sparkles className='ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity' />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
