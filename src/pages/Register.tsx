import { CheckCircleIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { TechLayout } from '../components/layout'
import { BasicRegistrationForm, EnhancedRegistrationForm, PasswordStrengthRegistrationForm } from '../components/register/RegisterFormVariants'
import { calculatePasswordErrors, calculatePasswordStrength } from '../components/register/registerUtils'
import { RegistrationSuccess } from '../components/register/RegistrationSuccess'
import { Button, Toast } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useDraftProfile } from '../context/DraftProfileContext'
import { ERROR_TYPES, EVENTS, trackError, trackEvent } from '../services/analyticsService'
import { convertDraftToProfile } from '../services/draftService'
import { EXPERIMENTS, getUserExperimentVariant } from '../services/experimentService'

export function Register() {
  const location = useLocation()
  const navigate = useNavigate()
  const { register, currentUser } = useAuth()
  const { draftProfile, getDraftId } = useDraftProfile()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState<'brand' | 'organizer' | 'community'>(
    'brand'
  )
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [verificationSent, setVerificationSent] = useState(false)
  /**
   * Registration experiment variants:
   *   'A' = BasicRegistrationForm
   *   'B' = PasswordStrengthRegistrationForm
   *   'C' = EnhancedRegistrationForm
   */
  type RegistrationExperimentVariant = 'A' | 'B' | 'C';
  const [experimentVariant, setExperimentVariant] = useState<RegistrationExperimentVariant>('A');
  const [debugInfo, setDebugInfo] = useState<string | null>(null)
  const [toast, setToast] = useState({
    isVisible: false,
    type: 'success' as 'success' | 'error' | 'info' | 'warning',
    message: ''
  })
  // Password strength validation
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [passwordErrors, setPasswordErrors] = useState({
    length: true,
    uppercase: true,
    lowercase: true,
    number: true
  })
  // Get redirect path from location state if available
  const redirectPath = location.state?.from || '/'
  // Get role from query params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const role = params.get('role')
    if (
      role === 'brand' ||
      role === 'organizer' ||
      role === 'community' ||
      role === 'admin'
    ) {
      setUserType(role as 'brand' | 'organizer' | 'community')
    }
    // Pre-fill email from draft profile if available
    if (draftProfile?.email) {
      setEmail(draftProfile.email)
    }
  }, [location.search, draftProfile])
  useEffect(() => {
    // Load experiment variant
    const loadExperiment = async () => {
      try {
        const variant = await getUserExperimentVariant(
          currentUser?.id || '',
          EXPERIMENTS.LOGIN_REGISTRATION
        )
        setExperimentVariant(variant)
        // Track page view
        trackEvent(
          EVENTS.PAGE_VIEW,
          {
            page: 'register'
          },
          currentUser?.id,
          EXPERIMENTS.LOGIN_REGISTRATION,
          variant
        )
      } catch (error) {
        console.error('Error loading experiment variant:', error)
      }
    }
    loadExperiment()
    // Check password strength
    const hasLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    setPasswordErrors({
      length: !hasLength,
      uppercase: !hasUppercase,
      lowercase: !hasLowercase,
      number: !hasNumber
    })
    // Calculate strength (0-4)
    let strength = 0
    if (hasLength) strength++
    if (hasUppercase) strength++
    if (hasLowercase) strength++
    if (hasNumber) strength++
    setPasswordStrength(strength)
    // Cleanup function
    return () => {
      trackEvent(
        EVENTS.PAGE_EXIT,
        {
          page: 'register',
          timeSpent: Date.now() - performance.now()
        },
        currentUser?.id,
        EXPERIMENTS.LOGIN_REGISTRATION,
        experimentVariant
      )
    }
  }, [currentUser, navigate, redirectPath, password, experimentVariant])
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Clear any previous debug info
    setDebugInfo(null)
    trackEvent(
      EVENTS.REGISTRATION_STARTED,
      {
        userType
      },
      undefined,
      EXPERIMENTS.LOGIN_REGISTRATION,
      experimentVariant
    )
    // Validate inputs - make validation less strict for testing
    if (password !== confirmPassword) {
      setToast({
        isVisible: true,
        type: 'error',
        message: 'Passwords do not match'
      })
      trackError(
        ERROR_TYPES.VALIDATION_ERROR,
        'Passwords do not match',
        undefined,
        {
          userType
        },
        undefined,
        EXPERIMENTS.LOGIN_REGISTRATION,
        experimentVariant
      )
      return
    }
    // Reduce password strength requirement for testing
    if (experimentVariant === 'C' && passwordStrength < 3) {
      setToast({
        isVisible: true,
        type: 'error',
        message: 'Password does not meet the strength requirements'
      })
      trackError(
        ERROR_TYPES.VALIDATION_ERROR,
        'Password strength insufficient',
        undefined,
        {
          userType,
          passwordStrength
        },
        undefined,
        EXPERIMENTS.LOGIN_REGISTRATION,
        experimentVariant
      )
      return
    }
    // For other variants, just ensure password is at least 6 characters
    if (experimentVariant !== 'C' && password.length < 6) {
      setToast({
        isVisible: true,
        type: 'error',
        message: 'Password must be at least 6 characters'
      })
      trackError(
        ERROR_TYPES.VALIDATION_ERROR,
        'Password too short',
        undefined,
        {
          userType
        },
        undefined,
        EXPERIMENTS.LOGIN_REGISTRATION,
        experimentVariant
      )
      return
    }
    setIsSubmitting(true)
    try {
      // Log registration attempt for debugging
      console.log(`Attempting to register with: ${email}, type: ${userType}`)
      // Map userType to the correct type for register function
      const actualType =
        userType === 'community'
          ? 'organizer'
          : (userType as 'brand' | 'organizer' | 'admin')
      const user = await register(
        email,
        password,
        actualType,
        email.split('@')[0]
      )
      console.log('Registration successful:', user)
      // If we have a draft profile, convert it to a full profile
      const draftId = getDraftId()
      if (draftId) {
        try {
          await convertDraftToProfile(draftId, user.id)
        } catch (error) {
          console.error('Error converting draft to profile:', error)
          // Continue with registration even if draft conversion fails
        }
      }
      setVerificationSent(true)
      setToast({
        isVisible: true,
        type: 'success',
        message:
          'Account created successfully! Please check your email to verify your account.'
      })
      trackEvent(
        EVENTS.REGISTRATION_COMPLETED,
        {
          userType,
          emailVerificationSent: true
        },
        undefined,
        EXPERIMENTS.LOGIN_REGISTRATION,
        experimentVariant
      )
    } catch (error: unknown) {
      console.error('Registration error:', error)
      const err = error as { message?: string; stack?: string }
      let errorMessage = 'Failed to create account'
      let errorType: string = ERROR_TYPES.UNKNOWN_ERROR
      // Enhanced error handling with more specific messages
      if (err.message && err.message.includes('already')) {
        errorMessage =
          'Email already registered. Please log in or reset your password.'
        errorType = ERROR_TYPES.VALIDATION_ERROR
      } else if (err.message && err.message.includes('valid email')) {
        errorMessage = 'Please enter a valid email address.'
        errorType = ERROR_TYPES.VALIDATION_ERROR
      } else if (err.message && err.message.includes('password')) {
        errorMessage = 'Password is too weak. Please use a stronger password.'
        errorType = ERROR_TYPES.VALIDATION_ERROR
      } else if (err.message && err.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.'
        errorType = ERROR_TYPES.NETWORK_ERROR
      }
      // Set detailed debug info for troubleshooting
      setDebugInfo(
        `Error: ${err.message || 'Unknown error'}\nStack: ${
          err.stack || 'No stack trace'
        }`
      )
      setToast({
        isVisible: true,
        type: 'error',
        message: errorMessage
      })
      trackError(
        errorType,
        errorMessage,
        err.stack,
        {
          userType,
          email
        },
        undefined,
        EXPERIMENTS.LOGIN_REGISTRATION,
        experimentVariant
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  // Render success state after verification sent
  if (verificationSent) {
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
                  <li>
                    Once verified, you can log in and complete your profile
                  </li>
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
                    {
                      source: 'registration_success',
                      action: 'go_to_login'
                    },
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
                  // In a real app, this would resend the verification email
                  setToast({
                    isVisible: true,
                    type: 'info',
                    message:
                      'Verification email resent. Please check your inbox.'
                  })
                  trackEvent(
                    EVENTS.REGISTRATION_COMPLETED,
                    {
                      action: 'resend_verification',
                      userType
                    },
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
  // Render current variant using modular components
  const renderCurrentVariant = () => {
    const sharedProps = {
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
      handleSubmit,
      passwordStrength,
      passwordErrors,
      experimentVariant,
      trackEvent,
      EVENTS,
      EXPERIMENTS
    }
    if (experimentVariant === 'A') {
      return <BasicRegistrationForm {...sharedProps} />
    } else if (experimentVariant === 'B') {
      return <PasswordStrengthRegistrationForm {...sharedProps} />
    } else {
      return <EnhancedRegistrationForm {...sharedProps} />
    }
  }
  return (
    <TechLayout>
      <div className='max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 relative'>
        <h1 className='text-2xl font-bold text-gray-900 mb-2'>
          Create Account
        </h1>
        <p className='text-gray-600 mb-6'>
          Join SponsrAI to connect brands with event organizers
        </p>
        {/* Render the appropriate variant */}
        {renderCurrentVariant()}
        {/* Debug information section */}
        {debugInfo && (
          <div className='mt-6 p-3 bg-gray-100 rounded-md border border-gray-300'>
            <h3 className='text-sm font-medium text-gray-700 mb-1'>
              Debug Information:
            </h3>
            <pre className='text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40'>
              {debugInfo}
            </pre>
          </div>
        )}
        {/* Draft profile information if available */}
        {Object.keys(draftProfile).length > 0 && !verificationSent && (
          <div className='mt-6 p-3 bg-blue-50 rounded-md border border-blue-200'>
            <h3 className='text-sm font-medium text-blue-700 mb-1'>
              Using information from your draft profile
            </h3>
            <p className='text-xs text-blue-600'>
              We've pre-filled some information based on what you shared
              earlier. Your profile will be completed after registration.
            </p>
          </div>
        )}
        <div className='mt-6 text-center'>
          <p className='text-gray-600'>
            Already have an account?{' '}
            <Link
              to='/login'
              className='text-blue-600 hover:text-blue-800 font-medium'
              onClick={() => {
                trackEvent(
                  EVENTS.PAGE_EXIT,
                  {
                    action: 'go_to_login',
                    source: 'register_page'
                  },
                  undefined,
                  EXPERIMENTS.LOGIN_REGISTRATION,
                  experimentVariant
                )
              }}
            >
              Log In
            </Link>
          </p>
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
    </TechLayout>
  )
}
