import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getDraftsByEmail } from '../services/draftService'
import { trackEvent, EVENTS } from '../services/analyticsService'

export function useLogin() {
  const location = useLocation()
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [toast, setToast] = useState({
    isVisible: false,
    type: 'success' as 'success' | 'error' | 'info' | 'warning',
    message: ''
  })

  const redirectPath = location.state?.from || '/'
  const draftId = location.state?.draftId || null
  const searchParams = new URLSearchParams(location.search)
  const verified = searchParams.get('verified') === 'true'

  // Check if email was verified
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

  const quickLogin = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
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
      const user = await login(email, password)
      trackEvent(EVENTS.LOGIN_SUCCESS, {
        userType: user.type,
        hasDraft: !!draftId
      })

      if (draftId) {
        if (user.type === 'brand') {
          navigate('/brand', { state: { draftId } })
        } else if (user.type === 'organizer') {
          navigate('/organizer', { state: { draftId } })
        } else if (user.type === 'admin') {
          navigate('/admin')
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
        } else if (user.type === 'admin') {
          navigate('/admin')
        } else {
          navigate(redirectPath)
        }
      }
    } catch (error) {
      setError('Invalid email or password.')
      trackEvent(EVENTS.LOGIN_FAILURE, {
        reason: 'invalid_credentials'
      })
    } finally {
      setIsLoading(false)
    }
  }

  return {
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
  }
}
