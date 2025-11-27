import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import {
  HandshakeIcon,
  LogOutIcon,
  HomeIcon,
  MessageSquareIcon,
  BellIcon,
  UsersIcon,
  LayoutDashboardIcon,
  Menu as MenuIcon,
  X as XIcon
} from 'lucide-react'
import { TechBackground, TechGrid } from '../effects'
interface DashboardLayoutProps {
  children: React.ReactNode
  userType: 'brand' | 'organizer' | 'admin'
}
export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  const navItems = {
    brand: [
      {
        label: 'Home',
        icon: <HomeIcon className='h-5 w-5' />,
        path: '/'
      },
      {
        label: 'Dashboard',
        icon: <LayoutDashboardIcon className='h-5 w-5' />,
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
        label: 'Home',
        icon: <HomeIcon className='h-5 w-5' />,
        path: '/'
      },
      {
        label: 'Dashboard',
        icon: <LayoutDashboardIcon className='h-5 w-5' />,
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
        label: 'Home',
        icon: <HomeIcon className='h-5 w-5' />,
        path: '/'
      },
      {
        label: 'Dashboard',
        icon: <LayoutDashboardIcon className='h-5 w-5' />,
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
  const currentNavItems = navItems[userType]
  return (
    <div className='min-h-screen bg-gray-50 flex relative overflow-hidden'>
      {/* Tech background */}
      <div className='absolute inset-0 z-0'>
        <TechBackground />
      </div>
      {/* Sidebar */}
      <div className='bg-white bg-opacity-95 backdrop-blur-sm w-64 border-r hidden md:block relative z-10'>
        <div className='h-16 flex items-center px-6 border-b'>
          <Link to='/' className='flex items-center space-x-2 group'>
            <div className='bg-blue-600 p-2 rounded-md relative overflow-hidden tech-pulse'>
              <HandshakeIcon className='h-6 w-6 text-white relative z-10' />
            </div>
            <span className='text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors'>
              SponsrAI
            </span>
          </Link>
        </div>
        <div className='p-4'>
          <div className='mb-6'>
            <div className='text-sm font-medium text-gray-400 mb-2'>MENU</div>
            <nav className='space-y-1'>
              {currentNavItems.map((item) => (
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
          <div>
            <div className='text-sm font-medium text-gray-400 mb-2'>
              ACCOUNT
            </div>
            <button
              onClick={handleLogout}
              className='flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors'
            >
              <LogOutIcon className='h-5 w-5' />
              <span className='ml-3'>Log Out</span>
            </button>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className='flex-1 flex flex-col relative z-10'>
        {/* Header */}
        <header className='bg-white bg-opacity-95 backdrop-blur-sm h-16 border-b flex items-center justify-between px-6 relative z-20'>
          <div className='flex items-center'>
            <button
              className='md:hidden mr-4 text-gray-500 hover:text-gray-700'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className='h-6 w-6' />
              ) : (
                <MenuIcon className='h-6 w-6' />
              )}
            </button>
            <span className='text-xl font-bold text-gray-900 md:hidden'>
              SponsrAI
            </span>
          </div>
          <div className='flex items-center space-x-4'>
            <button className='text-gray-500 hover:text-gray-700 relative'>
              <BellIcon className='h-6 w-6' />
              <span className='absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full'></span>
            </button>
            <div className='flex items-center'>
              <div className='bg-blue-100 text-blue-800 rounded-full h-8 w-8 flex items-center justify-center'>
                {currentUser?.name?.charAt(0) || '?'}
              </div>
              <span className='ml-2 text-sm font-medium text-gray-700'>
                {currentUser?.name || 'User'}
              </span>
            </div>
          </div>
        </header>
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className='md:hidden bg-white bg-opacity-95 backdrop-blur-sm border-b relative z-10'>
            <nav className='px-4 py-2'>
              {currentNavItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md ${
                    location.pathname === item.path ||
                    (item.path !== '/' &&
                      location.pathname.startsWith(item.path))
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-3'
                      : ''
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className='ml-3'>{item.label}</span>
                </Link>
              ))}
              <button
                onClick={() => {
                  handleLogout()
                  setMobileMenuOpen(false)
                }}
                className='flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md'
              >
                <LogOutIcon className='h-5 w-5' />
                <span className='ml-3'>Log Out</span>
              </button>
            </nav>
          </div>
        )}
        {/* Content */}
        <main className='flex-1 overflow-auto p-6 relative'>
          <div className='bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 p-6'>
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
