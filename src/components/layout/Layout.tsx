import React from 'react'
import { useLocation } from 'react-router-dom'

import { TechBackground, TechGrid } from '../effects'
import { DashboardListingsBar } from './DashboardListingsBar'
import { Footer } from './Footer'
import { Navbar } from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}
export function Layout({ children }: LayoutProps) {
  const location = useLocation()
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
        <main className='flex-grow relative'>
          <div className='max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6'>
            {children}
          </div>
        </main>
        <Footer className='bg-opacity-90 backdrop-blur-sm relative z-10' />
      </div>
    </div>
  )
}
