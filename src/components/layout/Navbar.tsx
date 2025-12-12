import {
  BellIcon,
  CalendarIcon,
  HandshakeIcon,
  LogIn,
  Menu,
  PackageIcon,
  SparklesIcon,
  UsersIcon,
  X
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { logoutAndRedirect } from '../../services/logoutService'
import { useEffect, useRef } from 'react'
import { useNotifications } from '../../context'

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)
  // Close user menu when clicking outside
  useEffect(() => {
    if (!showUserMenu) return
    function handleClick(e: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setShowUserMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showUserMenu])
  const { currentUser } = useAuth()
  const { unreadCount } = useNotifications()
  const location = useLocation()
  const isOnDashboard = location.pathname.startsWith('/dashboard')
  const isAuthenticated = Boolean(currentUser)

  // Determine dashboard link based on user type
  const getDashboardLink = () => {
    if (!currentUser) return '/login'
    const userType = currentUser.type?.toLowerCase()
    switch (userType) {
      case 'brand':
        return '/dashboard/brand'
      case 'organizer':
        return '/dashboard/organizer'
      case 'admin':
        return '/admin'
      default:
        // Fallback to brand dashboard if type is unclear
        return '/dashboard/brand'
    }
  }
  const marketingLinks = useMemo(
    () => [
      {
        label: 'Community',
        path: '/community',
        icon: <UsersIcon className='h-4 w-4 mr-1' />
      },
      {
        label: 'Brands',
        path: '/brands',
        icon: <PackageIcon className='h-4 w-4 mr-1' />
      },
      {
        label: 'Organizers',
        path: '/organizers',
        icon: <CalendarIcon className='h-4 w-4 mr-1' />
      }
    ],
    []
  )

  const dashboardLinks = useMemo(
    () => [
      {
        label: 'Community',
        path: '/community'
      },
      {
        label: 'Brands',
        path: '/brands'
      },
      {
        label: 'Organizers',
        path: '/organizers'
      },
      {
        label: 'Inspiration',
        path: '/dashboard/inspiration',
        icon: <SparklesIcon className='h-4 w-4 mr-0.5' />
      }
    ],
    []
  )

  const linksToRender = isAuthenticated ? dashboardLinks : marketingLinks

  const showDashboardActions = isAuthenticated && isOnDashboard

  const navLinkBaseClass =
    'px-3 py-2 rounded-md text-sm font-medium flex items-center relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-white after:transition-all hover:after:w-full transition-colors'

  const getLinkClass = (path: string) =>
    `${navLinkBaseClass} ${
      location.pathname === path
        ? 'text-indigo-200 bg-indigo-700'
        : 'text-white hover:text-indigo-200 hover:bg-indigo-700'
    }`

  const handleLogout = async () => {
    try {
      await logoutAndRedirect()
    } finally {
      setShowUserMenu(false)
      setMobileMenuOpen(false)
    }
  }

  return (
    <header className='bg-indigo-800 backdrop-blur-sm shadow-sm border-b border-gray-100 sticky top-0 z-30'>
      <div className='w-full'>
        <div className='flex justify-between items-center h-16'>
          <Link to='/' className='flex items-center space-x-2 group'>
            <div className='bg-indigo-600 p-2 rounded-md relative overflow-hidden tech-pulse'>
              <HandshakeIcon className='h-6 w-6 text-white relative z-10' />
            </div>
            <span className='text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors'>
              SponsrAI
            </span>
          </Link>
          <nav className='hidden md:flex items-center space-x-4'>
            {linksToRender.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={getLinkClass(item.path)}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}

            {showDashboardActions ? (
              <div className='flex items-center space-x-4'>
                {/* Notifications */}
                <button className='relative text-white hover:text-indigo-200 transition-colors'>
                  <BellIcon className='h-5 w-5' />
                  {unreadCount > 0 && (
                    <span className='absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-semibold'>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                <div className='relative flex items-center space-x-2'>
                  <span className='hidden sm:block text-sm font-medium text-white'>
                    {currentUser?.name || 'User'}
                  </span>
                  <button
                    onClick={() => setShowUserMenu((prev) => !prev)}
                    className='text-gray-700 hover:text-indigo-400 transition-colors'
                  >
                    <div className='bg-indigo-100 text-indigo-800 rounded-full h-8 w-8 flex items-center justify-center font-semibold'>
                      {currentUser?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                  </button>

                  {showUserMenu && (
                    <div
                      ref={userMenuRef}
                      className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1'
                    >
                      <Link
                        to='/dashboard/edit-profile'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                        onClick={() => setShowUserMenu(false)}
                      >
                        Profile Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className='w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50'
                      >
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : isAuthenticated ? (
              <Link
                to={getDashboardLink()}
                className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center relative overflow-hidden group'
              >
                <span className='relative z-10 flex items-center'>
                  Dashboard
                </span>
                <span className='absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity'></span>
              </Link>
            ) : (
              <Link
                to='/login'
                className='bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center relative overflow-hidden group'
              >
                <span className='relative z-10 flex items-center'>
                  <LogIn className='h-4 w-4 mr-1' />
                  Login
                </span>
                <span className='absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity'></span>
              </Link>
            )}
          </nav>

          <div className='md:hidden'>
            <button
              className='p-2 rounded-md text-gray-700 hover:bg-gray-100'
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className='md:hidden bg-white border-t border-gray-200'>
          <nav className='px-4 py-2 space-y-1'>
            {linksToRender.map((item) => (
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

            {showDashboardActions ? (
              <div className='border-t border-gray-200 pt-2 mt-2'>
                <Link
                  to='/dashboard/edit-profile'
                  className='flex items-center justify-between px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg'
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile Settings
                  <span className='text-xs text-gray-400'>
                    {currentUser?.name || 'User'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className='w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg'
                >
                  Log Out
                </button>
              </div>
            ) : isAuthenticated ? (
              <Link
                to={getDashboardLink()}
                className='block px-4 py-2 text-center text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                onClick={() => setMobileMenuOpen(false)}
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to='/login'
                className='block px-4 py-2 text-center text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700'
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
