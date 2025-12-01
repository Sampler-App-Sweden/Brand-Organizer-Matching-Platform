import {
  HandshakeIcon,
  HomeIcon,
  MessageSquareIcon,
  UsersIcon
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

import { TechBackground } from '../effects'
import { DashboardNavbar } from './DashboardNavbar'

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: 'brand' | 'organizer' | 'admin'
}

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const location = useLocation()

  // Dashboard sidebar items
  const sidebarItems = {
    brand: [
      {
        label: 'Dashboard',
        icon: <HomeIcon className='h-5 w-5' />,
        path: '/dashboard/brand'
      },
      {
        label: 'Matches',
        icon: <UsersIcon className='h-5 w-5' />,
        path: '/dashboard/matches'
      },
      {
        label: 'Messages',
        icon: <MessageSquareIcon className='h-5 w-5' />,
        path: '/dashboard/messages'
      }
    ],
    organizer: [
      {
        label: 'Dashboard',
        icon: <HomeIcon className='h-5 w-5' />,
        path: '/dashboard/organizer'
      },
      {
        label: 'Matches',
        icon: <UsersIcon className='h-5 w-5' />,
        path: '/dashboard/matches'
      },
      {
        label: 'Messages',
        icon: <MessageSquareIcon className='h-5 w-5' />,
        path: '/dashboard/messages'
      }
    ],
    admin: [
      {
        label: 'Dashboard',
        icon: <HomeIcon className='h-5 w-5' />,
        path: '/admin'
      },
      {
        label: 'Brands',
        icon: <UsersIcon className='h-5 w-5' />,
        path: '/admin/brands'
      },
      {
        label: 'Organizers',
        icon: <UsersIcon className='h-5 w-5' />,
        path: '/admin/organizers'
      },
      {
        label: 'Matches',
        icon: <HandshakeIcon className='h-5 w-5' />,
        path: '/admin/matches'
      }
    ]
  }

  const currentSidebarItems = sidebarItems[userType]

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col relative overflow-hidden'>
      {/* Tech background */}
      <div className='absolute inset-0 z-0'>
        <TechBackground />
      </div>

      <DashboardNavbar />

      {/* Dashboard Content Area with Sidebar */}
      <div className='flex-1 flex relative z-10'>
        {/* Sidebar */}
        <div className='bg-white bg-opacity-95 backdrop-blur-sm w-64 border-r hidden md:block'>
          <div className='p-4'>
            <div className='mb-6'>
              <div className='text-sm font-medium text-gray-400 mb-2'>
                DASHBOARD MENU
              </div>
              <nav className='space-y-1'>
                {currentSidebarItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors ${
                      location.pathname === item.path ||
                      (item.path !== '/' &&
                        location.pathname.startsWith(item.path))
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-3'
                        : ''
                    }`}
                  >
                    {item.icon}
                    <span className='ml-3'>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className='flex-1 overflow-auto p-6 relative'>
          <div className='bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 p-6'>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
