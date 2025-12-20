import { Link, useLocation } from 'react-router-dom'

import { getMobileNavLinks } from '../../constants/navigationLinks'

import type { User } from '../../services/authService'

interface HamburgerMenuProps {
  open: boolean
  onClose: () => void
  showDashboardActions: boolean
  handleLogout: () => void
  currentUser: User | null
}

export function HamburgerMenu({
  open,
  onClose,
  showDashboardActions,
  handleLogout,
  currentUser
}: HamburgerMenuProps) {
  const location = useLocation()

  if (!open) return null

  const userRole = currentUser?.type?.toLowerCase()
  let mobileLinks = getMobileNavLinks(userRole)

  // Filter out dashboard links if user is not logged in
  if (!currentUser) {
    mobileLinks = mobileLinks.filter(
      (item) =>
        !item.path.startsWith('/dashboard') && !item.path.startsWith('/admin')
    )
  }

  // Separate main links from dashboard/admin links
  const mainLinks = mobileLinks.filter(
    (item) =>
      !item.path.startsWith('/dashboard') && !item.path.startsWith('/admin')
  )
  const dashboardLinks = mobileLinks.filter(
    (item) =>
      item.path.startsWith('/dashboard') || item.path.startsWith('/admin')
  )

  return (
    <div className='md:hidden bg-white border-t border-gray-200'>
      <nav className='px-4 py-2 space-y-1'>
        {mainLinks.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium ${
              location.pathname === item.path
                ? 'bg-blue-50 text-indigo-600'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
            onClick={onClose}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}

        {dashboardLinks.length > 0 && (
          <>
            <div className='border-t border-gray-200 my-2'></div>
            {dashboardLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium ${
                  location.pathname === item.path
                    ? 'bg-blue-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={onClose}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </>
        )}

        {showDashboardActions ? (
          <div className='border-t border-gray-200 pt-2 mt-2'>
            <Link
              to='/dashboard/account'
              className='flex items-center justify-between px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg'
              onClick={onClose}
            >
              Account Settings
              <span className='text-xs text-gray-400'>
                {currentUser?.name || 'User'}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className='w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg'
            >
              Log Out
            </button>
          </div>
        ) : currentUser ? (
          <Link
            to={getDashboardLink(currentUser)}
            className='block px-4 py-3 text-center text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700'
            onClick={onClose}
          >
            Go to Dashboard
          </Link>
        ) : (
          <Link
            to='/login'
            className='block px-4 py-3 text-center text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700'
            onClick={onClose}
          >
            Login
          </Link>
        )}
      </nav>
    </div>
  )
}

// Helper to get dashboard link for a user
function getDashboardLink(user: User | null) {
  if (!user) return '/login'
  const userType = user.type?.toLowerCase()
  switch (userType) {
    case 'brand':
      return '/dashboard/brand'
    case 'organizer':
      return '/dashboard/organizer'
    case 'admin':
      return '/admin'
    default:
      return '/dashboard/brand'
  }
}
