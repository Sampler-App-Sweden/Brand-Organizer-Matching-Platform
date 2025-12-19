import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function RegistrationDebugHelper() {
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)
  const [debugInfo, setDebugInfo] = useState<any>({})
  useEffect(() => {
    // Only collect debug info on registration-related pages
    if (
      location.pathname.includes('register') ||
      location.pathname.includes('login')
    ) {
      setDebugInfo({
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        pathname: location.pathname,
        search: location.search,
        referrer: document.referrer,
        screenSize: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        localStorage: {
          hasToken: !!localStorage.getItem('token'),
          hasDraft: !!localStorage.getItem('draftProfile')
        }
      })
    }
  }, [location])
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className='fixed bottom-4 right-4 bg-gray-800 text-white px-3 py-1 rounded-md text-sm opacity-50 hover:opacity-100'
      >
        Debug
      </button>
    )
  }
  return (
    <div className='fixed bottom-4 right-4 max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-sm'>
      <div className='flex justify-between items-center mb-3'>
        <h3 className='font-medium'>Registration Debug Info</h3>
        <button
          onClick={() => setIsVisible(false)}
          className='text-gray-500 hover:text-gray-700'
        >
          Close
        </button>
      </div>
      <pre className='bg-gray-50 p-3 rounded overflow-auto max-h-96 text-xs'>
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  )
}
