import { ReactNode } from 'react'

import { TechBackground, TechDataStream } from '../effects'
import { Navbar } from '../layout'
import { Footer } from './Footer'

interface TechLayoutProps {
  children: ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

export function TechLayout({
  children,
  showHeader = true,
  showFooter = true
}: TechLayoutProps) {
  return (
    <div className='min-h-screen flex flex-col bg-gray-50 relative overflow-hidden'>
      <TechBackground />
      <TechDataStream className='opacity-30' />
      {showHeader && <Navbar />}
      <main className='flex-grow relative z-10'>
        <div className='w-full pb-6'>{children}</div>
      </main>
      {showFooter && (
        <Footer className='bg-opacity-90 backdrop-blur-sm relative z-10' />
      )}
    </div>
  )
}
