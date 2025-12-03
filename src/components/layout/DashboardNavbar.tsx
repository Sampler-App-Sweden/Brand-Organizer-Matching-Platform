import {
  BellIcon,
  BookmarkIcon,
  HandshakeIcon,
  HomeIcon,
  Menu as MenuIcon,
  SparklesIcon,
  UsersIcon,
  X as XIcon
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'

export function DashboardNavbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const mainNavItems = [
    {
      label: 'Our Community',
      icon: <UsersIcon className='h-5 w-5' />,
      path: '/community'
    },
    {
      label: 'For Brands',
      icon: <HandshakeIcon className='h-5 w-5' />,
      path: '/for-brands'
    },
    {
      label: 'For Organizers',
      icon: <HomeIcon className='h-5 w-5' />,
      path: '/for-organizers'
    },
    {
      label: 'Inspiration',
      icon: <SparklesIcon className='h-5 w-5' />,
      path: '/inspiration'
    }
  ]

  return (
    <header className='bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <Link to='/' className='flex items-center space-x-2 group'>
            <div className='bg-blue-600 p-2 rounded-md relative overflow-hidden tech-pulse'>
              <HandshakeIcon className='h-6 w-6 text-white relative z-10' />
            </div>
            <span className='text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors'>
              SponsrAI
            </span>
          </Link>

          <nav className='hidden md:flex items-center space-x-1'>
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className='flex items-center space-x-4'>
            <button className='relative text-gray-500 hover:text-gray-700 transition-colors'>
              <BellIcon className='h-6 w-6' />
              <span className='absolute top-0 right-0 h-2 w-2 bg-blue-600 rounded-full'></span>
            </button>

            <div className='relative'>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className='flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors'
              >
                <div className='bg-blue-100 text-blue-800 rounded-full h-8 w-8 flex items-center justify-center font-semibold'>
                  {currentUser?.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <span className='hidden sm:block text-sm font-medium'>
                  {currentUser?.name || 'User'}
                </span>
              </button>

              {showUserMenu && (
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1'>
                  <Link
                    to='/profile'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                    onClick={() => setShowUserMenu(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout()
                      setShowUserMenu(false)
                    }}
                    className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>

            <button
              className='md:hidden text-gray-500 hover:text-gray-700'
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <XIcon className='h-6 w-6' />
              ) : (
                <MenuIcon className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className='md:hidden bg-white border-t border-gray-200'>
          <nav className='px-4 py-2 space-y-1'>
            {mainNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}
