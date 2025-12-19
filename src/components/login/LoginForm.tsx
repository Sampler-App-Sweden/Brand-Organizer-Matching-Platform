import { Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Alert, Button, IconButton, Input } from '../ui'

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
        <Input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
        <Input
          id='password'
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Enter your password'
          required
          rightElement={
            <IconButton
              type='button'
              variant='ghost'
              size='sm'
              colorScheme='gray'
              icon={showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            />
          }
        />
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

      {error && <Alert variant='error' description={error} />}

      <Button type='submit' disabled={isLoading} isLoading={isLoading} fullWidth variant='primary'>
        Sign in
      </Button>
    </form>
  )
}
