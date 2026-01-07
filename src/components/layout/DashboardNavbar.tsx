import {
  BellIcon,
  HandshakeIcon,
  Menu as MenuIcon,
  X as XIcon
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { MAIN_NAV_ITEMS } from '../../constants/navigationLinks'
import { useNotifications } from '../../context'
import { useAuth } from '../../context/AuthContext'
import { HamburgerMenu } from './HamburgerMenu'

export function DashboardNavbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const { unreadCount } = useNotifications()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className='bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50'>
      <div className='w-full'>
        <div className='flex items-center h-16 px-4'>
          {/* Left: Logo */}
          <Link to='/' className='flex items-center space-x-2 group'>
            <div className='bg-brand-primary p-2 rounded-md relative overflow-hidden tech-pulse'>
              <HandshakeIcon className='h-6 w-6 text-white relative z-10' />
            </div>
            <span className='text-xl font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors'>
              SponsrAI
            </span>
          </Link>

          {/* Center: Nav */}
          <div className='flex-1 flex justify-center'>
            <nav className='hidden md:flex items-center space-x-1'>
              {MAIN_NAV_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === item.path
                      ? 'bg-blue-50 text-indigo-600'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-indigo-600'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          {/* Right: Bell & Avatar */}
          <div className='flex items-center space-x-3'>
            <button
              className='relative text-gray-500 hover:text-gray-700 transition-colors'
              onClick={() => navigate('/dashboard/notifications')}
              aria-label='View notifications'
            >
              <BellIcon className='h-6 w-6' />
              {unreadCount > 0 && (
                <span className='absolute -top-1 -right-1 min-h-[1rem] min-w-[1rem] rounded-full bg-indigo-600 text-white text-[10px] font-semibold flex items-center justify-center px-1'>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <div className='relative'>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className='flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors'
              >
                {currentUser?.logoUrl ? (
                  <img
                    src={currentUser.logoUrl}
                    alt={currentUser.name}
                    className='h-8 w-8 rounded-full object-cover border border-gray-200'
                    onError={(e) => {
                      console.error('Failed to load logo:', currentUser.logoUrl)
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                ) : (
                  <div className='bg-blue-100 text-indigo-800 rounded-full h-8 w-8 flex items-center justify-center font-semibold'>
                    {currentUser?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                )}
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

            {/* Mobile Menu Button */}
            <button
              className='md:hidden text-gray-700 hover:text-indigo-600 transition-colors'
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

      <HamburgerMenu
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        showDashboardActions={true}
        handleLogout={handleLogout}
        currentUser={currentUser}
      />
    </header>
  )
}
