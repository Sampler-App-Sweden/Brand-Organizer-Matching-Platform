import { HandshakeIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

interface FooterProps {
  className?: string
}

export function Footer({ className = '' }: FooterProps) {
  return (
    <footer
      className={`bg-white border-t border-gray-100 py-4 ${className}`.trim()}
    >
      <div className='container mx-auto px-4'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='flex items-center mb-4 md:mb-0'>
            <div className='bg-indigo-600 p-1.5 rounded-md mr-2 relative overflow-hidden'>
              <HandshakeIcon className='h-4 w-4 text-white relative z-10' />
              <div className='absolute inset-0 bg-gradient-to-r from-blue-500 to-indigo-600 opacity-70'></div>
            </div>
            <span className='text-gray-900 font-medium'>SponsrAI</span>
          </div>
          <div className='flex space-x-6'>
            <Link
              to='/about'
              className='text-sm text-gray-500 hover:text-indigo-600 transition-colors'
            >
              About
            </Link>
            <Link
              to='/privacy'
              className='text-sm text-gray-500 hover:text-indigo-600 transition-colors'
            >
              Privacy
            </Link>
            <Link
              to='/terms'
              className='text-sm text-gray-500 hover:text-indigo-600 transition-colors'
            >
              Terms
            </Link>
            <Link
              to='/contact'
              className='text-sm text-gray-500 hover:text-indigo-600 transition-colors'
            >
              Contact
            </Link>
          </div>
          <div className='text-sm text-gray-400 mt-4 md:mt-0'>
            © {new Date().getFullYear()} SponsrAI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
