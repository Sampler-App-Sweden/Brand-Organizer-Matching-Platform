import { CheckCircleIcon } from 'lucide-react'

import { TechLayout } from '../layout'
import { Button, Toast } from '../ui'

interface RegistrationSuccessProps {
  email: string
  experimentVariant: string
  userType: string
  toast: {
    isVisible: boolean
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
  }
  setToast: (t: {
    isVisible: boolean
    type: 'success' | 'error' | 'info' | 'warning'
    message: string
  }) => void
  navigate: (path: string) => void
  trackEvent: (
    event: string,
    data?: Record<string, unknown>,
    userId?: string,
    experimentId?: string,
    variant?: string
  ) => void
  EVENTS: Record<string, string>
  EXPERIMENTS: Record<string, string>
}

export function RegistrationSuccess({
  email,
  experimentVariant,
  userType,
  toast,
  setToast,
  navigate,
  trackEvent,
  EVENTS,
  EXPERIMENTS
}: RegistrationSuccessProps) {
  return (
    <TechLayout>
      <div className='max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 relative'>
        <div className='text-center'>
          <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4'>
            <CheckCircleIcon className='h-8 w-8 text-green-600' />
          </div>
          <h1 className='text-2xl font-bold text-gray-900 mb-2'>
            Verify Your Email
          </h1>
          <p className='text-gray-600 mb-6'>
            We've sent a verification link to <strong>{email}</strong>. Please
            check your inbox and click the link to verify your account.
          </p>
          <div className='bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-left'>
            <p className='text-sm text-blue-800'>
              <strong>Next steps:</strong>
              <ol className='list-decimal pl-5 mt-2 space-y-1'>
                <li>Check your email (including spam folder)</li>
                <li>Click the verification link</li>
                <li>Once verified, you can log in and complete your profile</li>
              </ol>
            </p>
          </div>
          <div className='space-y-3'>
            <Button
              variant='primary'
              className='w-full'
              techEffect={true}
              onClick={() => {
                navigate('/login')
                trackEvent(
                  EVENTS.PAGE_VIEW,
                  { source: 'registration_success', action: 'go_to_login' },
                  undefined,
                  EXPERIMENTS.LOGIN_REGISTRATION,
                  experimentVariant
                )
              }}
            >
              Go to Login
            </Button>
            <Button
              variant='outline'
              className='w-full'
              onClick={() => {
                setToast({
                  isVisible: true,
                  type: 'info',
                  message: 'Verification email resent. Please check your inbox.'
                })
                trackEvent(
                  EVENTS.REGISTRATION_COMPLETED,
                  { action: 'resend_verification', userType },
                  undefined,
                  EXPERIMENTS.LOGIN_REGISTRATION,
                  experimentVariant
                )
              }}
            >
              Resend Verification Email
            </Button>
          </div>
        </div>
        {/* Tech decoration elements */}
        <div
          className='absolute -top-6 -right-6 w-12 h-12 opacity-10 animate-spin-slow'
          style={{ animationDuration: '15s' }}
        >
          <svg
            viewBox='0 0 100 100'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle
              cx='50'
              cy='50'
              r='45'
              stroke='currentColor'
              strokeWidth='2'
              strokeDasharray='10 5'
            />
          </svg>
        </div>
        <div
          className='absolute -bottom-6 -left-6 w-12 h-12 opacity-10 animate-spin-slow'
          style={{ animationDuration: '20s', animationDirection: 'reverse' }}
        >
          <svg
            viewBox='0 0 100 100'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <circle
              cx='50'
              cy='50'
              r='45'
              stroke='currentColor'
              strokeWidth='2'
              strokeDasharray='8 4'
            />
          </svg>
        </div>
      </div>
      <Toast
        type={toast.type}
        message={toast.message}
        duration={5000}
        onClose={() => setToast({ ...toast, isVisible: false })}
        isVisible={toast.isVisible}
      />
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow linear infinite; }
      `}</style>
    </TechLayout>
  )
}
