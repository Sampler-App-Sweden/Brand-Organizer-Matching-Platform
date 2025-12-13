import { Link, useLocation } from 'react-router-dom'

import { logoutAndRedirect } from '../../services/logoutService'
import { DashboardNavbar } from '../layout'
import { SidebarItem, sidebarItems } from './sidebarItems'

interface DashboardLayoutProps {
  children: React.ReactNode
  userType: 'brand' | 'organizer' | 'admin'
  mainPaddingClassName?: string
  contentPaddingClassName?: string
}

export function DashboardLayout({
  children,
  userType,
  mainPaddingClassName = 'p-0',
  contentPaddingClassName = 'p-4'
}: DashboardLayoutProps) {
  const location = useLocation()
  const currentSidebarItems: SidebarItem[] = sidebarItems[userType]
  const commonItems = sidebarItems.common

  const handleLogout = async () => {
    await logoutAndRedirect()
  }

  return (
    <div className='min-h-screen bg-gray-50 flex flex-col relative overflow-hidden'>
      <DashboardNavbar />

      {/* Dashboard Content Area with Sidebar */}
      <div className='flex-1 flex relative z-10'>
        {/* Sidebar */}
        <div className='hidden md:flex flex-col bg-white bg-opacity-95 backdrop-blur-sm w-64 border-r fixed top-0 left-0 h-screen z-20'>
          <div className='p-4 pt-20 flex flex-col h-full overflow-y-auto'>
            <div className='mb-6'>
              <div className='text-sm font-medium text-gray-400 mb-2'>
                DASHBOARD MENU
              </div>
              <nav className='space-y-1'>
                {currentSidebarItems.map((item) => {
                  const itemPath = item.path ?? ''
                  const isActive = item.matchExact
                    ? location.pathname === itemPath
                    : location.pathname === itemPath ||
                      (itemPath !== '' &&
                        itemPath !== '/' &&
                        location.pathname.startsWith(`${itemPath}/`))
                  return (
                    <Link
                      key={item.path ?? item.label}
                      to={itemPath}
                      className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors ${
                        isActive
                          ? 'bg-blue-50 text-indigo-700 border-l-4 border-indigo-600 pl-3'
                          : ''
                      }`}
                    >
                      {item.icon}
                      <span className='ml-3'>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className='mt-auto pt-4 border-t border-gray-100 space-y-1'>
              {commonItems.map((item) => {
                if (item.action === 'logout') {
                  return (
                    <button
                      key={item.action ?? item.label}
                      onClick={handleLogout}
                      className='w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors text-left'
                    >
                      {item.icon}
                      <span className='ml-3'>{item.label}</span>
                    </button>
                  )
                }

                if (!item.path) {
                  return null
                }

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors ${
                      location.pathname === item.path
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-3'
                        : ''
                    }`}
                  >
                    {item.icon}
                    <span className='ml-3'>{item.label}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main
          className={`flex flex-col flex-1 overflow-hidden relative md:ml-64 ${mainPaddingClassName}`}
        >
          <div
            className={`flex flex-col flex-1 bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-sm border border-gray-100 ${contentPaddingClassName}`}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
