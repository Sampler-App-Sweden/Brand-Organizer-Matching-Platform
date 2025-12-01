import { Link } from 'react-router-dom'

interface RegistrationHeaderProps {
  title: string
  subtitle: string
}

export function RegistrationHeader({
  title,
  subtitle
}: RegistrationHeaderProps) {
  return (
    <>
      <h1 className='text-2xl font-bold text-gray-900 mb-2'>{title}</h1>
      <p className='text-gray-600 mb-6'>{subtitle}</p>
    </>
  )
}

interface RegistrationDebugPanelProps {
  debugInfo: string | null
}

export function RegistrationDebugPanel({
  debugInfo
}: RegistrationDebugPanelProps) {
  if (!debugInfo) {
    return null
  }
  return (
    <div className='mt-6 p-3 bg-gray-100 rounded-md border border-gray-300'>
      <h3 className='text-sm font-medium text-gray-700 mb-1'>
        Debug Information:
      </h3>
      <pre className='text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40'>
        {debugInfo}
      </pre>
    </div>
  )
}

interface DraftProfileNoticeProps {
  isVisible: boolean
}

export function DraftProfileNotice({ isVisible }: DraftProfileNoticeProps) {
  if (!isVisible) {
    return null
  }
  return (
    <div className='mt-6 p-3 bg-blue-50 rounded-md border border-blue-200'>
      <h3 className='text-sm font-medium text-blue-700 mb-1'>
        Using information from your draft profile
      </h3>
      <p className='text-xs text-blue-600'>
        We've pre-filled some information based on what you shared earlier. Your
        profile will be completed after registration.
      </p>
    </div>
  )
}

interface LoginPromptProps {
  onNavigate: () => void
}

export function LoginPrompt({ onNavigate }: LoginPromptProps) {
  return (
    <div className='mt-6 text-center'>
      <p className='text-gray-600'>
        Already have an account?{' '}
        <Link
          to='/login'
          className='text-blue-600 hover:text-blue-800 font-medium'
          onClick={onNavigate}
        >
          Log In
        </Link>
      </p>
    </div>
  )
}
