import { useEffect, useState } from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FormField, Button, Toast } from '../components/ui'
import { TechLayout } from '../components/layout'
import {
  AlertCircleIcon,
  HelpCircleIcon,
  EyeIcon,
  EyeOffIcon,
  UserIcon,
  BuildingIcon,
  CalendarIcon,
  UsersIcon,
  CopyIcon,
  CheckIcon
} from 'lucide-react'
import { getDraftsByEmail } from '../services/draftService'
import { trackEvent, EVENTS } from '../services/analyticsService'

export function Login() {
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)
  const [toast, setToast] = useState({
    isVisible: false,
    type: 'success' as 'success' | 'error' | 'info' | 'warning',
    message: ''
  })
  const { login } = useAuth()
  const navigate = useNavigate()
  const redirectPath = location.state?.from || '/'
  const draftId = location.state?.draftId || null
  const searchParams = new URLSearchParams(location.search)
  const verified = searchParams.get('verified') === 'true'
  useEffect(() => {
    if (verified) {
      setToast({
        isVisible: true,
        type: 'success',
        message: 'Email verified successfully! You can now log in.'
      })
      trackEvent(EVENTS.EMAIL_VERIFIED, {
        source: 'email_link'
      })
    }
  }, [verified])
  const demoAccounts = [
    {
      type: 'brand',
      name: 'Brand Demo',
      email: 'brand@demo.com',
      password: 'demo123',
      description: 'EcoRefresh Beverages - Organic energy drink brand',
      icon: <BuildingIcon className='h-5 w-5' />,
      color: 'blue'
    },
    {
      type: 'organizer',
      name: 'Organizer Demo',
      email: 'organizer@demo.com',
      password: 'demo123',
      description: 'Active Life Events - Stockholm Fitness Festival',
      icon: <CalendarIcon className='h-5 w-5' />,
      color: 'green'
    },
    {
      type: 'community',
      name: 'Community Demo',
      email: 'community@demo.com',
      password: 'demo123',
      description: 'Sarah Johnson - Test panel participant',
      icon: <UsersIcon className='h-5 w-5' />,
      color: 'purple'
    }
  ]
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }
  const quickLogin = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
    // Small delay for visual feedback
    setTimeout(() => {
      const form = document.querySelector('form') as HTMLFormElement
      form?.requestSubmit()
    }, 100)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      const user = await login(email, password, rememberMe)
      trackEvent(EVENTS.LOGIN_SUCCESS, {
        userType: user.type,
        hasDraft: !!draftId
      })
      if (draftId) {
        if (user.type === 'brand') {
          navigate('/brand', {
            state: {
              draftId
            }
          })
        } else if (user.type === 'organizer') {
          navigate('/organizer', {
            state: {
              draftId
            }
          })
        } else if (user.type === 'community') {
          navigate('/community/register', {
            state: {
              draftId
            }
          })
        } else {
          navigate('/dashboard/brand')
        }
      } else {
        const drafts = await getDraftsByEmail(email)
        if (drafts.length > 0) {
          setToast({
            isVisible: true,
            type: 'info',
            message:
              'We found draft profiles associated with your email. You can continue them from your dashboard.'
          })
        }
        if (user.type === 'brand') {
          navigate('/dashboard/brand')
        } else if (user.type === 'organizer') {
          navigate('/dashboard/organizer')
        } else if (user.type === 'community') {
          navigate('/community')
        } else if (user.type === 'admin') {
          navigate('/admin')
        } else {
          navigate(redirectPath)
        }
      }
    } catch (error) {
      console.error('Login error:', error)
      setError('Failed to log in. Please check your credentials.')
      trackEvent(EVENTS.LOGIN_FAILURE, {
        reason: 'invalid_credentials'
      })
    } finally {
      setIsLoading(false)
    }
  }
  return (
    <TechLayout>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        <div className='grid lg:grid-cols-2 gap-8'>
          {/* Demo Accounts Section */}
          <div className='space-y-6'>
            <div>
              <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                Try Demo Accounts
              </h2>
              <p className='text-gray-600'>
                Explore the platform with pre-configured demo accounts
              </p>
            </div>

            <div className='space-y-4'>
              {demoAccounts.map((account) => (
                <div
                  key={account.type}
                  className='bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-all group'
                >
                  <div className='flex items-start justify-between mb-3'>
                    <div className='flex items-center space-x-3'>
                      <div
                        className={`p-2 rounded-lg bg-${account.color}-50 text-${account.color}-600`}
                      >
                        {account.icon}
                      </div>
                      <div>
                        <h3 className='font-semibold text-gray-900'>
                          {account.name}
                        </h3>
                        <p className='text-sm text-gray-500'>
                          {account.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='space-y-2 mb-4'>
                    <div className='flex items-center justify-between bg-gray-50 rounded px-3 py-2'>
                      <div className='flex-1'>
                        <p className='text-xs text-gray-500'>Email</p>
                        <p className='text-sm font-mono text-gray-900'>
                          {account.email}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            account.email,
                            `${account.type}-email`
                          )
                        }
                        className='p-1.5 hover:bg-gray-200 rounded transition-colors'
                        title='Copy email'
                      >
                        {copiedField === `${account.type}-email` ? (
                          <CheckIcon className='h-4 w-4 text-green-600' />
                        ) : (
                          <CopyIcon className='h-4 w-4 text-gray-400' />
                        )}
                      </button>
                    </div>

                    <div className='flex items-center justify-between bg-gray-50 rounded px-3 py-2'>
                      <div className='flex-1'>
                        <p className='text-xs text-gray-500'>Password</p>
                        <p className='text-sm font-mono text-gray-900'>
                          {account.password}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            account.password,
                            `${account.type}-password`
                          )
                        }
                        className='p-1.5 hover:bg-gray-200 rounded transition-colors'
                        title='Copy password'
                      >
                        {copiedField === `${account.type}-password` ? (
                          <CheckIcon className='h-4 w-4 text-green-600' />
                        ) : (
                          <CopyIcon className='h-4 w-4 text-gray-400' />
                        )}
                      </button>
                    </div>
                  </div>

                  <Button
                    variant='outline'
                    className='w-full group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-300 transition-all'
                    onClick={() => quickLogin(account.email, account.password)}
                  >
                    <UserIcon className='h-4 w-4 mr-2' />
                    Quick Login as {account.name}
                  </Button>
                </div>
              ))}
            </div>

            <div className='bg-blue-50 border border-blue-200 rounded-lg p-4'>
              <div className='flex items-start space-x-3'>
                <div className='flex-shrink-0'>
                  <div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center'>
                    <span className='text-blue-600 text-sm font-bold'>i</span>
                  </div>
                </div>
                <div className='flex-1'>
                  <h4 className='text-sm font-semibold text-blue-900 mb-1'>
                    Demo Account Features
                  </h4>
                  <ul className='text-sm text-blue-800 space-y-1'>
                    <li>• Pre-configured profiles with sample data</li>
                    <li>• Explore matching algorithm results</li>
                    <li>• Test messaging and collaboration features</li>
                    <li>• View dashboard analytics and insights</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Login Form Section */}
          <div className='bg-white p-8 rounded-lg shadow-sm border border-gray-100 relative'>
            <h1 className='text-2xl font-bold text-gray-900 mb-6'>
              Log In to Your Account
            </h1>

            {error && (
              <div className='bg-red-50 text-red-700 p-3 rounded-md mb-4 flex items-start'>
                <AlertCircleIcon className='h-5 w-5 mr-2 flex-shrink-0 mt-0.5' />
                <div>
                  <p>{error}</p>
                  <Link
                    to='/login/help'
                    className='text-red-700 underline text-sm font-medium mt-1 inline-block'
                  >
                    Having trouble logging in?
                  </Link>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className='space-y-4'>
                <FormField
                  label='Email Address'
                  id='email'
                  type='email'
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <div className='space-y-1'>
                  <label
                    htmlFor='password'
                    className='block text-sm font-medium text-gray-800'
                  >
                    Password <span className='text-red-500'>*</span>
                  </label>
                  <div className='relative'>
                    <input
                      id='password'
                      type={showPassword ? 'text' : 'password'}
                      className='block w-full rounded-md shadow-sm border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type='button'
                      className='absolute inset-y-0 right-0 pr-3 flex items-center'
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className='h-5 w-5 text-gray-400' />
                      ) : (
                        <EyeIcon className='h-5 w-5 text-gray-400' />
                      )}
                    </button>
                  </div>
                </div>

                <div className='flex items-center justify-between'>
                  <div className='flex items-center'>
                    <input
                      id='remember-me'
                      name='remember-me'
                      type='checkbox'
                      className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <label
                      htmlFor='remember-me'
                      className='ml-2 block text-sm text-gray-700'
                    >
                      Remember me
                    </label>
                  </div>
                  <div className='text-sm'>
                    <Link
                      to='/login/help'
                      className='font-medium text-blue-600 hover:text-blue-500'
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <Button
                  type='submit'
                  variant='primary'
                  className='w-full'
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Log In'}
                </Button>
              </div>
            </form>

            <div className='mt-6 text-center'>
              <p className='text-gray-600'>
                Don't have an account?{' '}
                <Link
                  to='/register'
                  className='text-blue-600 hover:text-blue-800 font-medium'
                >
                  Register
                </Link>
              </p>
              <Link
                to='/login/help'
                className='mt-3 inline-flex items-center text-sm text-blue-600 hover:text-blue-800'
              >
                <HelpCircleIcon className='h-4 w-4 mr-1' />
                Having trouble logging in?
              </Link>
            </div>

            {/* Tech decoration elements */}
            <div
              className='absolute -top-6 -right-6 w-12 h-12 opacity-10 animate-spin-slow'
              style={{
                animationDuration: '15s'
              }}
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
              style={{
                animationDuration: '20s',
                animationDirection: 'reverse'
              }}
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
        </div>
      </div>

      <Toast
        type={toast.type}
        message={toast.message}
        duration={5000}
        onClose={() =>
          setToast({
            ...toast,
            isVisible: false
          })
        }
        isVisible={toast.isVisible}
      />

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow linear infinite;
        }
      `}</style>
    </TechLayout>
  )
}
