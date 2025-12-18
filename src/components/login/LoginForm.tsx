import { Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LoginFormProps {
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (password: string) => void
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  rememberMe: boolean
  setRememberMe: (remember: boolean) => void
  error: string
  isLoading: boolean
  onSubmit: (e: React.FormEvent) => void
}

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  rememberMe,
  setRememberMe,
  error,
  isLoading,
  onSubmit
}: LoginFormProps) {
  return (
    <form onSubmit={onSubmit} className='space-y-6'>
      <div>
        <label
          htmlFor='email'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Email
        </label>
        <input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
          placeholder='Enter your email'
          required
        />
      </div>

      <div>
        <label
          htmlFor='password'
          className='block text-sm font-medium text-gray-700 mb-1'
        >
          Password
        </label>
        <div className='relative'>
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full h-10 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500'
            placeholder='Enter your password'
            required
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700'
          >
            {showPassword ? (
              <EyeOff className='h-4 w-4' />
            ) : (
              <Eye className='h-4 w-4' />
            )}
          </button>
        </div>
      </div>

      <div className='flex items-center justify-between'>
        <div className='flex items-center'>
          <input
            id='remember-me'
            type='checkbox'
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className='h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded'
          />
          <label
            htmlFor='remember-me'
            className='ml-2 block text-sm text-gray-700'
          >
            Remember me
          </label>
        </div>
        <Link
          to='/forgot-password'
          className='text-sm font-medium text-indigo-600 hover:text-indigo-500'
        >
          Forgot password?
        </Link>
      </div>

      {error && (
        <div className='p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm'>
          {error}
        </div>
      )}

      <button
        type='submit'
        disabled={isLoading}
        className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200'
      >
        {isLoading ? 'Signing in...' : 'Sign in'}
      </button>
    </form>
  )
}
