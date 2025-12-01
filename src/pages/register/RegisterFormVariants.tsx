import { EyeIcon, EyeOffIcon } from 'lucide-react'
import React from 'react'

import { Button, FormField } from '../../components/ui'
import { UserType } from './registerTypes'

interface VariantAFormProps {
  userType: UserType
  setUserType: (type: UserType) => void
  email: string
  setEmail: (email: string) => void
  password: string
  setPassword: (pw: string) => void
  confirmPassword: string
  setConfirmPassword: (pw: string) => void
  showPassword: boolean
  setShowPassword: (show: boolean) => void
  showConfirmPassword: boolean
  setShowConfirmPassword: (show: boolean) => void
  isSubmitting: boolean
  handleSubmit: (e: React.FormEvent) => void
}

export function VariantAForm({
  userType,
  setUserType,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isSubmitting,
  handleSubmit
}: VariantAFormProps) {
  return (
    <form onSubmit={handleSubmit}>
      <div className='space-y-4'>
        <FormField
          label='I am a'
          id='userType'
          type='select'
          options={[
            { value: 'brand', label: 'Brand / Sponsor' },
            { value: 'organizer', label: 'Event Organizer' },
            { value: 'community', label: 'Community Member' }
          ]}
          value={userType}
          onChange={(e) => setUserType(e.target.value as UserType)}
        />
        <FormField
          label='Email Address'
          id='email'
          type='email'
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='your@email.com'
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
              className='block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
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
        <div className='space-y-1'>
          <label
            htmlFor='confirmPassword'
            className='block text-sm font-medium text-gray-800'
          >
            Confirm Password <span className='text-red-500'>*</span>
          </label>
          <div className='relative'>
            <input
              id='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              className={`block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                confirmPassword && password !== confirmPassword
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : ''
              }`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOffIcon className='h-5 w-5 text-gray-400' />
              ) : (
                <EyeIcon className='h-5 w-5 text-gray-400' />
              )}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && (
            <p className='mt-1 text-xs text-red-600'>Passwords do not match</p>
          )}
        </div>
        <div className='pt-2'>
          <Button
            type='submit'
            variant='primary'
            className='w-full'
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>
      </div>
    </form>
  )
}
