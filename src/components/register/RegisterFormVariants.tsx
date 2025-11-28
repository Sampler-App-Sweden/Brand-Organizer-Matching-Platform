import { CheckCircleIcon, EyeIcon, EyeOffIcon, XCircleIcon } from 'lucide-react'
import React from 'react'

import { Button, FormField } from '../../components/ui'
import { UserType } from './registerTypes'

interface VariantFormProps {
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
  passwordStrength: number
  passwordErrors: {
    length: boolean
    uppercase: boolean
    lowercase: boolean
    number: boolean
  }
  experimentVariant?: string
  trackEvent?: (...args: any[]) => void
  EVENTS?: any
  EXPERIMENTS?: any
}

export function BasicRegistrationForm(props: VariantFormProps) {
  return (
    <form onSubmit={props.handleSubmit}>
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
          value={props.userType}
          onChange={(e) => props.setUserType(e.target.value as UserType)}
        />
        <FormField
          label='Email Address'
          id='email'
          type='email'
          required
          value={props.email}
          onChange={(e) => props.setEmail(e.target.value)}
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
              type={props.showPassword ? 'text' : 'password'}
              className='block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              value={props.password}
              onChange={(e) => props.setPassword(e.target.value)}
              required
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
              onClick={() => props.setShowPassword(!props.showPassword)}
            >
              {props.showPassword ? (
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
              type={props.showConfirmPassword ? 'text' : 'password'}
              className={`block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                props.confirmPassword &&
                props.password !== props.confirmPassword
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : ''
              }`}
              value={props.confirmPassword}
              onChange={(e) => props.setConfirmPassword(e.target.value)}
              required
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
              onClick={() =>
                props.setShowConfirmPassword(!props.showConfirmPassword)
              }
            >
              {props.showConfirmPassword ? (
                <EyeOffIcon className='h-5 w-5 text-gray-400' />
              ) : (
                <EyeIcon className='h-5 w-5 text-gray-400' />
              )}
            </button>
          </div>
          {props.confirmPassword &&
            props.password !== props.confirmPassword && (
              <p className='mt-1 text-xs text-red-600'>
                Passwords do not match
              </p>
            )}
        </div>
        <div className='pt-2'>
          <Button
            type='submit'
            variant='primary'
            className='w-full'
            disabled={props.isSubmitting}
          >
            {props.isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export function PasswordStrengthRegistrationForm(props: VariantFormProps) {
  return (
    <form onSubmit={props.handleSubmit}>
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
          value={props.userType}
          onChange={(e) => props.setUserType(e.target.value as UserType)}
        />
        <FormField
          label='Email Address'
          id='email'
          type='email'
          required
          value={props.email}
          onChange={(e) => props.setEmail(e.target.value)}
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
              type={props.showPassword ? 'text' : 'password'}
              className='block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              value={props.password}
              onChange={(e) => props.setPassword(e.target.value)}
              required
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
              onClick={() => props.setShowPassword(!props.showPassword)}
            >
              {props.showPassword ? (
                <EyeOffIcon className='h-5 w-5 text-gray-400' />
              ) : (
                <EyeIcon className='h-5 w-5 text-gray-400' />
              )}
            </button>
          </div>
          {/* Password strength meter */}
          <div className='mt-2'>
            <div className='flex space-x-1 mb-1'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i < props.passwordStrength
                      ? props.passwordStrength === 1
                        ? 'bg-red-500'
                        : props.passwordStrength === 2
                        ? 'bg-yellow-500'
                        : props.passwordStrength === 3
                        ? 'bg-green-400'
                        : 'bg-green-600'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className='text-xs text-gray-500'>
              {props.passwordStrength === 0 && 'Very weak'}
              {props.passwordStrength === 1 && 'Weak'}
              {props.passwordStrength === 2 && 'Medium'}
              {props.passwordStrength === 3 && 'Strong'}
              {props.passwordStrength === 4 && 'Very strong'}
            </p>
          </div>
          {/* Password requirements */}
          <div className='mt-2 space-y-1'>
            <p className='text-xs text-gray-500 mb-1'>Password must have:</p>
            <ul className='space-y-1'>
              <li className='flex items-center text-xs'>
                {props.passwordErrors.length ? (
                  <XCircleIcon className='h-3.5 w-3.5 text-red-500 mr-1.5' />
                ) : (
                  <CheckCircleIcon className='h-3.5 w-3.5 text-green-500 mr-1.5' />
                )}
                <span
                  className={
                    props.passwordErrors.length
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  At least 8 characters
                </span>
              </li>
              <li className='flex items-center text-xs'>
                {props.passwordErrors.uppercase ? (
                  <XCircleIcon className='h-3.5 w-3.5 text-red-500 mr-1.5' />
                ) : (
                  <CheckCircleIcon className='h-3.5 w-3.5 text-green-500 mr-1.5' />
                )}
                <span
                  className={
                    props.passwordErrors.uppercase
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  At least one uppercase letter
                </span>
              </li>
              <li className='flex items-center text-xs'>
                {props.passwordErrors.lowercase ? (
                  <XCircleIcon className='h-3.5 w-3.5 text-red-500 mr-1.5' />
                ) : (
                  <CheckCircleIcon className='h-3.5 w-3.5 text-green-500 mr-1.5' />
                )}
                <span
                  className={
                    props.passwordErrors.lowercase
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  At least one lowercase letter
                </span>
              </li>
              <li className='flex items-center text-xs'>
                {props.passwordErrors.number ? (
                  <XCircleIcon className='h-3.5 w-3.5 text-red-500 mr-1.5' />
                ) : (
                  <CheckCircleIcon className='h-3.5 w-3.5 text-green-500 mr-1.5' />
                )}
                <span
                  className={
                    props.passwordErrors.number
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  At least one number
                </span>
              </li>
            </ul>
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
              type={props.showConfirmPassword ? 'text' : 'password'}
              className={`block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                props.confirmPassword &&
                props.password !== props.confirmPassword
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : ''
              }`}
              value={props.confirmPassword}
              onChange={(e) => props.setConfirmPassword(e.target.value)}
              required
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
              onClick={() =>
                props.setShowConfirmPassword(!props.showConfirmPassword)
              }
            >
              {props.showConfirmPassword ? (
                <EyeOffIcon className='h-5 w-5 text-gray-400' />
              ) : (
                <EyeIcon className='h-5 w-5 text-gray-400' />
              )}
            </button>
          </div>
          {props.confirmPassword &&
            props.password !== props.confirmPassword && (
              <p className='mt-1 text-xs text-red-600'>
                Passwords do not match
              </p>
            )}
        </div>
        <div className='pt-2'>
          <Button
            type='submit'
            variant='primary'
            className='w-full'
            disabled={props.isSubmitting}
          >
            {props.isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>
      </div>
    </form>
  )
}

export function EnhancedRegistrationForm(props: VariantFormProps) {
  return (
    <form onSubmit={props.handleSubmit}>
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
          value={props.userType}
          onChange={(e) => {
            props.setUserType(e.target.value as UserType)
            if (
              props.trackEvent &&
              props.EVENTS &&
              props.EXPERIMENTS &&
              props.experimentVariant
            ) {
              props.trackEvent(
                props.EVENTS.FORM_SUBMITTED,
                {
                  field: 'userType',
                  value: e.target.value
                },
                undefined,
                props.EXPERIMENTS.LOGIN_REGISTRATION,
                props.experimentVariant
              )
            }
          }}
        />
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2'>
          <p className='text-sm text-blue-800'>
            <strong>
              {props.userType === 'brand'
                ? 'Brand / Sponsor'
                : props.userType === 'organizer'
                ? 'Event Organizer'
                : 'Community Member'}
            </strong>
            :
            {props.userType === 'brand'
              ? ' Perfect for companies looking to promote products or services through events.'
              : props.userType === 'organizer'
              ? ' Ideal for those organizing events and seeking brand partnerships.'
              : ' Join our community to participate in events and test panels.'}
          </p>
        </div>
        <FormField
          label='Email Address'
          id='email'
          type='email'
          required
          value={props.email}
          onChange={(e) => props.setEmail(e.target.value)}
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
              type={props.showPassword ? 'text' : 'password'}
              className='block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
              value={props.password}
              onChange={(e) => props.setPassword(e.target.value)}
              required
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
              onClick={() => {
                props.setShowPassword(!props.showPassword)
                if (
                  props.trackEvent &&
                  props.EVENTS &&
                  props.EXPERIMENTS &&
                  props.experimentVariant
                ) {
                  props.trackEvent(
                    props.EVENTS.FORM_SUBMITTED,
                    {
                      field: 'showPassword',
                      value: !props.showPassword
                    },
                    undefined,
                    props.EXPERIMENTS.LOGIN_REGISTRATION,
                    props.experimentVariant
                  )
                }
              }}
            >
              {props.showPassword ? (
                <EyeOffIcon className='h-5 w-5 text-gray-400' />
              ) : (
                <EyeIcon className='h-5 w-5 text-gray-400' />
              )}
            </button>
          </div>
          {/* Password strength meter */}
          <div className='mt-2'>
            <div className='flex space-x-1 mb-1'>
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full ${
                    i < props.passwordStrength
                      ? props.passwordStrength === 1
                        ? 'bg-red-500'
                        : props.passwordStrength === 2
                        ? 'bg-yellow-500'
                        : props.passwordStrength === 3
                        ? 'bg-green-400'
                        : 'bg-green-600'
                      : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
            <p className='text-xs text-gray-500'>
              {props.passwordStrength === 0 && 'Very weak'}
              {props.passwordStrength === 1 && 'Weak'}
              {props.passwordStrength === 2 && 'Medium'}
              {props.passwordStrength === 3 && 'Strong'}
              {props.passwordStrength === 4 && 'Very strong'}
            </p>
          </div>
          {/* Password requirements */}
          <div className='mt-2 space-y-1'>
            <p className='text-xs text-gray-500 mb-1'>Password must have:</p>
            <ul className='space-y-1'>
              <li className='flex items-center text-xs'>
                {props.passwordErrors.length ? (
                  <XCircleIcon className='h-3.5 w-3.5 text-red-500 mr-1.5' />
                ) : (
                  <CheckCircleIcon className='h-3.5 w-3.5 text-green-500 mr-1.5' />
                )}
                <span
                  className={
                    props.passwordErrors.length
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  At least 8 characters
                </span>
              </li>
              <li className='flex items-center text-xs'>
                {props.passwordErrors.uppercase ? (
                  <XCircleIcon className='h-3.5 w-3.5 text-red-500 mr-1.5' />
                ) : (
                  <CheckCircleIcon className='h-3.5 w-3.5 text-green-500 mr-1.5' />
                )}
                <span
                  className={
                    props.passwordErrors.uppercase
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  At least one uppercase letter
                </span>
              </li>
              <li className='flex items-center text-xs'>
                {props.passwordErrors.lowercase ? (
                  <XCircleIcon className='h-3.5 w-3.5 text-red-500 mr-1.5' />
                ) : (
                  <CheckCircleIcon className='h-3.5 w-3.5 text-green-500 mr-1.5' />
                )}
                <span
                  className={
                    props.passwordErrors.lowercase
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  At least one lowercase letter
                </span>
              </li>
              <li className='flex items-center text-xs'>
                {props.passwordErrors.number ? (
                  <XCircleIcon className='h-3.5 w-3.5 text-red-500 mr-1.5' />
                ) : (
                  <CheckCircleIcon className='h-3.5 w-3.5 text-green-500 mr-1.5' />
                )}
                <span
                  className={
                    props.passwordErrors.number
                      ? 'text-red-600'
                      : 'text-green-600'
                  }
                >
                  At least one number
                </span>
              </li>
            </ul>
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
              type={props.showConfirmPassword ? 'text' : 'password'}
              className={`block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${
                props.confirmPassword &&
                props.password !== props.confirmPassword
                  ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                  : ''
              }`}
              value={props.confirmPassword}
              onChange={(e) => props.setConfirmPassword(e.target.value)}
              required
            />
            <button
              type='button'
              className='absolute inset-y-0 right-0 pr-3 flex items-center'
              onClick={() => {
                props.setShowConfirmPassword(!props.showConfirmPassword)
                if (
                  props.trackEvent &&
                  props.EVENTS &&
                  props.EXPERIMENTS &&
                  props.experimentVariant
                ) {
                  props.trackEvent(
                    props.EVENTS.FORM_SUBMITTED,
                    {
                      field: 'showConfirmPassword',
                      value: !props.showConfirmPassword
                    },
                    undefined,
                    props.EXPERIMENTS.LOGIN_REGISTRATION,
                    props.experimentVariant
                  )
                }
              }}
            >
              {props.showConfirmPassword ? (
                <EyeOffIcon className='h-5 w-5 text-gray-400' />
              ) : (
                <EyeIcon className='h-5 w-5 text-gray-400' />
              )}
            </button>
          </div>
          {props.confirmPassword &&
            props.password !== props.confirmPassword && (
              <p className='mt-1 text-xs text-red-600'>
                Passwords do not match
              </p>
            )}
        </div>
        <div className='pt-2'>
          <Button
            type='submit'
            variant='primary'
            className='w-full'
            disabled={props.isSubmitting}
          >
            {props.isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>
      </div>
    </form>
  )
}
