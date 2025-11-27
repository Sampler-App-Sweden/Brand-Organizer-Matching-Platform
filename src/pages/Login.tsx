import { Link } from 'react-router-dom'
import { Toast } from '../components/ui'
import { TechLayout } from '../components/layout'
import { HelpCircle, AlertCircle } from 'lucide-react'
import { useLogin } from '../hooks/useLogin'
import { useCopyToClipboard } from '../utils/clipboard'
import { LoginForm, DemoAccountCard } from '../components/login'
import { demoAccounts } from '../constants/demoAccounts'

export function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    isLoading,
    showPassword,
    setShowPassword,
    rememberMe,
    setRememberMe,
    toast,
    setToast,
    quickLogin,
    handleSubmit
  } = useLogin()

  const { copiedId, handleCopy } = useCopyToClipboard()
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
                <DemoAccountCard
                  key={account.type}
                  account={account}
                  copiedId={copiedId}
                  onCopy={handleCopy}
                  onQuickLogin={quickLogin}
                />
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
                <AlertCircle className='h-5 w-5 mr-2 flex-shrink-0 mt-0.5' />
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

            <LoginForm
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              rememberMe={rememberMe}
              setRememberMe={setRememberMe}
              error={error}
              isLoading={isLoading}
              onSubmit={handleSubmit}
            />

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
                <HelpCircle className='h-4 w-4 mr-1' />
                Having trouble logging in?
              </Link>
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
        onClose={() => setToast({ ...toast, isVisible: false })}
        isVisible={toast.isVisible}
      />

      <style>{`
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
