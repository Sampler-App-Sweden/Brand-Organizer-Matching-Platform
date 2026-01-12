import { useCallback, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { TechLayout } from '../../components/layout'
import {
  BasicRegistrationForm,
  EnhancedRegistrationForm,
  PasswordStrengthRegistrationForm
} from '../../components/register/RegisterFormVariants'
import {
  calculatePasswordErrors,
  calculatePasswordStrength
} from '../../components/register/registerUtils'
import {
  DraftProfileNotice,
  LoginPrompt,
  RegistrationDebugPanel,
  RegistrationHeader
} from '../../components/register/RegistrationPageSections'
import { RegistrationSuccess } from '../../components/register/RegistrationSuccess'
import { Toast } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { useDraftProfile } from '../../context/DraftProfileContext'
import {
  ERROR_TYPES,
  EVENTS,
  trackError,
  trackEvent
} from '../../services/analyticsService'
import { convertDraftToProfile } from '../../services/draftService'
import {
  EXPERIMENTS,
  getUserExperimentVariant
} from '../../services/experimentService'

type RegistrationExperimentVariant = 'A' | 'B' | 'C'
type AnalyticsEventData = Record<string, unknown>
type TrackEventFn = (
  event: string,
  data?: AnalyticsEventData,
  userId?: string,
  experimentId?: string,
  variant?: string
) => void

const REGISTRATION_EXPERIMENT = EXPERIMENTS.LOGIN_REGISTRATION

export function Register() {
  const location = useLocation()
  const navigate = useNavigate()
  const { register, currentUser } = useAuth()
  const { draftProfile, getDraftId } = useDraftProfile()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [userType, setUserType] = useState<'brand' | 'organizer' | undefined>(
    undefined
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
  const [experimentVariant, setExperimentVariant] =
    useState<RegistrationExperimentVariant>('A')
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
  const emitEvent = useCallback<TrackEventFn>(
    (event, data, userId, experimentId = REGISTRATION_EXPERIMENT, variant) => {
      trackEvent(event, data, userId, experimentId, variant)
    },
    []
  )
  // Get role from query params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const role = params.get('role')
    if (role === 'brand' || role === 'organizer') {
      setUserType(role as 'brand' | 'organizer')
    }
    // Pre-fill email from draft profile if available
    if (draftProfile?.email) {
      setEmail(draftProfile.email)
    }
  }, [location.search, draftProfile])
  useEffect(() => {
    let isMounted = true
    const loadExperiment = async () => {
      try {
        const variant = await getUserExperimentVariant(
          currentUser?.id || '',
          REGISTRATION_EXPERIMENT
        )
        if (!isMounted) return
        setExperimentVariant(variant)
        emitEvent(
          EVENTS.PAGE_VIEW,
          { page: 'register' },
          currentUser?.id,
          REGISTRATION_EXPERIMENT,
          variant
        )
      } catch (error) {
        console.error('Error loading experiment variant:', error)
      }
    }
    loadExperiment()
    return () => {
      isMounted = false
    }
  }, [currentUser?.id, emitEvent])

  useEffect(() => {
    setPasswordErrors(calculatePasswordErrors(password))
    setPasswordStrength(calculatePasswordStrength(password))
  }, [password])

  useEffect(() => {
    const startTime = performance.now()
    return () => {
      emitEvent(
        EVENTS.PAGE_EXIT,
        {
          page: 'register',
          timeSpentMs: performance.now() - startTime
        },
        currentUser?.id,
        REGISTRATION_EXPERIMENT,
        experimentVariant
      )
    }
  }, [currentUser?.id, experimentVariant, emitEvent])

  const handleLoginNavigate = () => {
    emitEvent(
      EVENTS.PAGE_EXIT,
      {
        action: 'go_to_login',
        source: 'register_page'
      },
      undefined,
      REGISTRATION_EXPERIMENT,
      experimentVariant
    )
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Clear any previous debug info
    setDebugInfo(null)

    // Validate that user has selected a type
    if (!userType) {
      setToast({
        isVisible: true,
        type: 'error',
        message: 'Please select whether you are a Brand/Sponsor or Event Organizer'
      })
      trackError(
        ERROR_TYPES.VALIDATION_ERROR,
        'User type not selected',
        undefined,
        {},
        undefined,
        REGISTRATION_EXPERIMENT,
        experimentVariant
      )
      return
    }

    emitEvent(
      EVENTS.REGISTRATION_STARTED,
      {
        userType
      },
      undefined,
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
        REGISTRATION_EXPERIMENT,
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
        REGISTRATION_EXPERIMENT,
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
        REGISTRATION_EXPERIMENT,
        experimentVariant
      )
      return
    }
    setIsSubmitting(true)
    try {
      const user = await register(
        email,
        password,
        userType as 'brand' | 'organizer' | 'admin',
        email.split('@')[0]
      )
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
      emitEvent(
        EVENTS.REGISTRATION_COMPLETED,
        {
          userType,
          emailVerificationSent: true
        },
        undefined,
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
        REGISTRATION_EXPERIMENT,
        experimentVariant
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  // Render success state after verification sent
  if (verificationSent) {
    return (
      <RegistrationSuccess
        email={email}
        experimentVariant={experimentVariant}
        userType={userType}
        toast={toast}
        setToast={setToast}
        navigate={navigate}
        trackEvent={emitEvent}
        EVENTS={EVENTS}
        EXPERIMENTS={EXPERIMENTS}
      />
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
      trackEvent: emitEvent,
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
        <RegistrationHeader
          title='Create Account'
          subtitle='Join SponsrAI to connect brands with event organizers'
        />
        {/* Render the appropriate variant */}
        {renderCurrentVariant()}
        <RegistrationDebugPanel debugInfo={debugInfo} />
        <DraftProfileNotice
          isVisible={Object.keys(draftProfile).length > 0 && !verificationSent}
        />
        <LoginPrompt onNavigate={handleLoginNavigate} />
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
