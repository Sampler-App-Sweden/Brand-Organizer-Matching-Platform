import React from 'react'
import { Navbar } from './Navbar'
import { useLocation } from 'react-router-dom'
import { HandshakeIcon } from 'lucide-react'
import { DashboardListingsBar } from './DashboardListingsBar'
import { TechBackground, TechGrid, TechParticles, TechGlow } from '../effects'
interface LayoutProps {
  children: React.ReactNode
}
export function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const isHomePage = location.pathname === '/'
  return (
    <div className='min-h-screen flex flex-col bg-gray-50 relative overflow-hidden'>
      {/* Tech background effects */}
      <div className='absolute inset-0 z-0'>
        <TechBackground />
        <TechGrid className='absolute inset-0 opacity-10' />
      </div>
      {/* Main content */}
      <div className='relative z-10 flex flex-col min-h-screen'>
        <div className='sticky top-0 left-0 right-0 z-50'>
          <Navbar />
          {/* Dashboard listings panel - shows when user is logged in */}
          {location.pathname.includes('/dashboard') && (
            <div className='bg-white border-b border-gray-200 py-2 bg-opacity-90 backdrop-blur-sm'>
              <div className='container mx-auto px-4'>
                <DashboardListingsBar />
              </div>
            </div>
          )}
        </div>
        <main className='flex-grow relative'>{children}</main>
        <footer className='bg-white bg-opacity-90 backdrop-blur-sm border-t border-gray-100 py-8 relative z-10'>
          <div className='container mx-auto px-4 text-center md:text-left'>
            <div className='flex flex-col md:flex-row justify-between items-center'>
              <div className='flex items-center mb-4 md:mb-0'>
                <div className='bg-blue-600 p-1.5 rounded-md mr-2 relative overflow-hidden tech-pulse'>
                  <HandshakeIcon className='h-4 w-4 text-white relative z-10' />
                  <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-70'></div>
                </div>
                <span className='text-gray-900 font-medium'>SponsrAI</span>
              </div>
              <div className='flex space-x-6'>
                <a
                  href='/about'
                  className='text-sm text-gray-500 hover:text-blue-600 transition-colors'
                >
                  About
                </a>
                <a
                  href='/privacy'
                  className='text-sm text-gray-500 hover:text-blue-600 transition-colors'
                >
                  Privacy
                </a>
                <a
                  href='/terms'
                  className='text-sm text-gray-500 hover:text-blue-600 transition-colors'
                >
                  Terms
                </a>
                <a
                  href='/contact'
                  className='text-sm text-gray-500 hover:text-blue-600 transition-colors'
                >
                  Contact
                </a>
              </div>
              <div className='text-sm text-gray-400 mt-4 md:mt-0'>
                © {new Date().getFullYear()} SponsrAI. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}
