import { AlertCircleIcon, CheckCircleIcon, InfoIcon, XIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

interface ToastProps {
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
  onClose: () => void
  isVisible: boolean
}

export function Toast({
  type = 'info',
  message,
  duration = 5000,
  onClose,
  isVisible
}: ToastProps) {
  const [isClosing, setIsClosing] = useState(false)
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsClosing(true)
        setTimeout(() => {
          onClose()
          setIsClosing(false)
        }, 300) // Animation duration
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])
  if (!isVisible) return null
  const typeStyles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }
  const iconStyles = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
    info: 'text-blue-500'
  }
  const Icon = () => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className={`h-5 w-5 ${iconStyles[type]}`} />
      case 'error':
        return <AlertCircleIcon className={`h-5 w-5 ${iconStyles[type]}`} />
      case 'warning':
        return <AlertCircleIcon className={`h-5 w-5 ${iconStyles[type]}`} />
      case 'info':
      default:
        return <InfoIcon className={`h-5 w-5 ${iconStyles[type]}`} />
    }
  }
  return (
    <div
      className={`fixed top-4 right-4 z-50 max-w-md transform transition-all duration-300 ease-in-out ${
        isClosing ? 'translate-x-full opacity-0' : 'translate-x-0 opacity-100'
      }`}
    >
      <div className={`rounded-lg border p-4 shadow-lg ${typeStyles[type]}`}>
        <div className='flex items-start'>
          <div className='flex-shrink-0'>
            <Icon />
          </div>
          <div className='ml-3 flex-1'>
            <p className='text-sm font-medium'>{message}</p>
          </div>
          <div className='ml-4 flex-shrink-0 flex'>
            <button
              type='button'
              className={`inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${iconStyles[type]}`}
              onClick={() => {
                setIsClosing(true)
                setTimeout(() => {
                  onClose()
                  setIsClosing(false)
                }, 300)
              }}
            >
              <span className='sr-only'>Close</span>
              <XIcon className='h-5 w-5' />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
