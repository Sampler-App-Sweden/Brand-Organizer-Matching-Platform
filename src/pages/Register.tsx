import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FormField } from '../components/FormField';
import { Button } from '../components/Button';
import { TechLayout } from '../components/TechLayout';
import { Toast } from '../components/Toast';
import { AlertCircleIcon, EyeIcon, EyeOffIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react';
import { getUserExperimentVariant, EXPERIMENTS } from '../services/experimentService';
import { trackEvent, trackError, EVENTS, ERROR_TYPES } from '../services/analyticsService';
import { useDraftProfile } from '../context/DraftProfileContext';
import { convertDraftToProfile } from '../services/draftService';
export function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    register,
    currentUser
  } = useAuth();
  const {
    draftProfile,
    getDraftId
  } = useDraftProfile();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState<'brand' | 'organizer' | 'community'>('brand');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [experimentVariant, setExperimentVariant] = useState<'A' | 'B' | 'C'>('A');
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [toast, setToast] = useState({
    isVisible: false,
    type: 'success' as 'success' | 'error' | 'info' | 'warning',
    message: ''
  });
  // Password strength validation
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordErrors, setPasswordErrors] = useState({
    length: true,
    uppercase: true,
    lowercase: true,
    number: true
  });
  // Get redirect path from location state if available
  const redirectPath = location.state?.from || '/';
  // Get role from query params if available
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const role = params.get('role');
    if (role === 'brand' || role === 'organizer' || role === 'community') {
      setUserType(role);
    }
    // Pre-fill email from draft profile if available
    if (draftProfile?.email) {
      setEmail(draftProfile.email);
    }
  }, [location.search, draftProfile]);
  useEffect(() => {
    // Load experiment variant
    const loadExperiment = async () => {
      try {
        const variant = await getUserExperimentVariant(currentUser?.id || '', EXPERIMENTS.LOGIN_REGISTRATION);
        setExperimentVariant(variant);
        // Track page view
        trackEvent(EVENTS.PAGE_VIEW, {
          page: 'register'
        }, currentUser?.id, EXPERIMENTS.LOGIN_REGISTRATION, variant);
      } catch (error) {
        console.error('Error loading experiment variant:', error);
      }
    };
    loadExperiment();
    // If user is already logged in, redirect to dashboard
    if (currentUser) {
      navigate(redirectPath);
    }
    // Check password strength
    const hasLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    setPasswordErrors({
      length: !hasLength,
      uppercase: !hasUppercase,
      lowercase: !hasLowercase,
      number: !hasNumber
    });
    // Calculate strength (0-4)
    let strength = 0;
    if (hasLength) strength++;
    if (hasUppercase) strength++;
    if (hasLowercase) strength++;
    if (hasNumber) strength++;
    setPasswordStrength(strength);
    // Cleanup function
    return () => {
      trackEvent(EVENTS.PAGE_EXIT, {
        page: 'register',
        timeSpent: Date.now() - performance.now()
      }, currentUser?.id, EXPERIMENTS.LOGIN_REGISTRATION, experimentVariant);
    };
  }, [currentUser, navigate, redirectPath, password, experimentVariant]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clear any previous debug info
    setDebugInfo(null);
    trackEvent(EVENTS.REGISTRATION_STARTED, {
      userType
    }, undefined, EXPERIMENTS.LOGIN_REGISTRATION, experimentVariant);
    // Validate inputs - make validation less strict for testing
    if (password !== confirmPassword) {
      setToast({
        isVisible: true,
        type: 'error',
        message: 'Passwords do not match'
      });
      trackError(ERROR_TYPES.VALIDATION_ERROR, 'Passwords do not match', undefined, {
        userType
      }, undefined, EXPERIMENTS.LOGIN_REGISTRATION, experimentVariant);
      return;
    }
    // Reduce password strength requirement for testing
    if (experimentVariant === 'C' && passwordStrength < 3) {
      setToast({
        isVisible: true,
        type: 'error',
        message: 'Password does not meet the strength requirements'
      });
      trackError(ERROR_TYPES.VALIDATION_ERROR, 'Password strength insufficient', undefined, {
        userType,
        passwordStrength
      }, undefined, EXPERIMENTS.LOGIN_REGISTRATION, experimentVariant);
      return;
    }
    // For other variants, just ensure password is at least 6 characters
    if (experimentVariant !== 'C' && password.length < 6) {
      setToast({
        isVisible: true,
        type: 'error',
        message: 'Password must be at least 6 characters'
      });
      trackError(ERROR_TYPES.VALIDATION_ERROR, 'Password too short', undefined, {
        userType
      }, undefined, EXPERIMENTS.LOGIN_REGISTRATION, experimentVariant);
      return;
    }
    setIsSubmitting(true);
    try {
      // Log registration attempt for debugging
      console.log(`Attempting to register with: ${email}, type: ${userType}`);
      const user = await register(email, password, userType);
      console.log('Registration successful:', user);
      // If we have a draft profile, convert it to a full profile
      const draftId = getDraftId();
      if (draftId) {
        try {
          await convertDraftToProfile(draftId, user.id);
        } catch (error) {
          console.error('Error converting draft to profile:', error);
          // Continue with registration even if draft conversion fails
        }
      }
      setVerificationSent(true);
      setToast({
        isVisible: true,
        type: 'success',
        message: 'Account created successfully! Please check your email to verify your account.'
      });
      trackEvent(EVENTS.REGISTRATION_COMPLETED, {
        userType,
        emailVerificationSent: true
      }, undefined, EXPERIMENTS.LOGIN_REGISTRATION, experimentVariant);
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Failed to create account';
      let errorType = ERROR_TYPES.UNKNOWN_ERROR;
      // Enhanced error handling with more specific messages
      if (error.message && error.message.includes('already')) {
        errorMessage = 'Email already registered. Please log in or reset your password.';
        errorType = ERROR_TYPES.VALIDATION_ERROR;
      } else if (error.message && error.message.includes('valid email')) {
        errorMessage = 'Please enter a valid email address.';
        errorType = ERROR_TYPES.VALIDATION_ERROR;
      } else if (error.message && error.message.includes('password')) {
        errorMessage = 'Password is too weak. Please use a stronger password.';
        errorType = ERROR_TYPES.VALIDATION_ERROR;
      } else if (error.message && error.message.includes('network')) {
        errorMessage = 'Network error. Please check your internet connection.';
        errorType = ERROR_TYPES.NETWORK_ERROR;
      }
      // Set detailed debug info for troubleshooting
      setDebugInfo(`Error: ${error.message || 'Unknown error'}\nStack: ${error.stack || 'No stack trace'}`);
      setToast({
        isVisible: true,
        type: 'error',
        message: errorMessage
      });
      trackError(errorType, errorMessage, error.stack, {
        userType,
        email
      }, undefined, EXPERIMENTS.LOGIN_REGISTRATION, experimentVariant);
    } finally {
      setIsSubmitting(false);
    }
  };
  // Render success state after verification sent
  if (verificationSent) {
    return <TechLayout>
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 relative">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600 mb-6">
              We've sent a verification link to <strong>{email}</strong>. Please
              check your inbox and click the link to verify your account.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6 text-left">
              <p className="text-sm text-blue-800">
                <strong>Next steps:</strong>
                <ol className="list-decimal pl-5 mt-2 space-y-1">
                  <li>Check your email (including spam folder)</li>
                  <li>Click the verification link</li>
                  <li>
                    Once verified, you can log in and complete your profile
                  </li>
                </ol>
              </p>
            </div>
            <div className="space-y-3">
              <Button variant="primary" className="w-full" techEffect={true} onClick={() => {
              navigate('/login');
              trackEvent(EVENTS.PAGE_VIEW, {
                source: 'registration_success',
                action: 'go_to_login'
              }, undefined, EXPERIMENTS.LOGIN_REGISTRATION, experimentVariant);
            }}>
                Go to Login
              </Button>
              <Button variant="outline" className="w-full" onClick={() => {
              // In a real app, this would resend the verification email
              setToast({
                isVisible: true,
                type: 'info',
                message: 'Verification email resent. Please check your inbox.'
              });
              trackEvent(EVENTS.REGISTRATION_COMPLETED, {
                action: 'resend_verification',
                userType
              }, undefined, EXPERIMENTS.LOGIN_REGISTRATION, experimentVariant);
            }}>
                Resend Verification Email
              </Button>
            </div>
          </div>
          {/* Tech decoration elements */}
          <div className="absolute -top-6 -right-6 w-12 h-12 opacity-10 animate-spin-slow" style={{
          animationDuration: '15s'
        }}>
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
            </svg>
          </div>
          <div className="absolute -bottom-6 -left-6 w-12 h-12 opacity-10 animate-spin-slow" style={{
          animationDuration: '20s',
          animationDirection: 'reverse'
        }}>
            <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
            </svg>
          </div>
        </div>
        <Toast type={toast.type} message={toast.message} duration={5000} onClose={() => setToast({
        ...toast,
        isVisible: false
      })} isVisible={toast.isVisible} />
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
      </TechLayout>;
  }
  // Render current variant
  const renderCurrentVariant = () => {
    // Use the existing variant rendering functions but wrap them in the new tech design
    if (experimentVariant === 'A') {
      return renderVariantA();
    } else if (experimentVariant === 'B') {
      return renderVariantB();
    } else {
      return renderVariantC();
    }
  };
  return <TechLayout>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 relative">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Create Account
        </h1>
        <p className="text-gray-600 mb-6">
          Join SponsrAI to connect brands with event organizers
        </p>
        {/* Render the appropriate variant */}
        {renderCurrentVariant()}
        {/* Debug information section */}
        {debugInfo && <div className="mt-6 p-3 bg-gray-100 rounded-md border border-gray-300">
            <h3 className="text-sm font-medium text-gray-700 mb-1">
              Debug Information:
            </h3>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40">
              {debugInfo}
            </pre>
          </div>}
        {/* Draft profile information if available */}
        {Object.keys(draftProfile).length > 0 && !verificationSent && <div className="mt-6 p-3 bg-blue-50 rounded-md border border-blue-200">
            <h3 className="text-sm font-medium text-blue-700 mb-1">
              Using information from your draft profile
            </h3>
            <p className="text-xs text-blue-600">
              We've pre-filled some information based on what you shared
              earlier. Your profile will be completed after registration.
            </p>
          </div>}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium" onClick={() => {
            trackEvent(EVENTS.PAGE_EXIT, {
              action: 'go_to_login',
              source: 'register_page'
            }, undefined, EXPERIMENTS.LOGIN_REGISTRATION, experimentVariant);
          }}>
              Log In
            </Link>
          </p>
        </div>
        {/* Tech decoration elements */}
        <div className="absolute -top-6 -right-6 w-12 h-12 opacity-10 animate-spin-slow" style={{
        animationDuration: '15s'
      }}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="10 5" />
          </svg>
        </div>
        <div className="absolute -bottom-6 -left-6 w-12 h-12 opacity-10 animate-spin-slow" style={{
        animationDuration: '20s',
        animationDirection: 'reverse'
      }}>
          <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" strokeDasharray="8 4" />
          </svg>
        </div>
      </div>
      <Toast type={toast.type} message={toast.message} duration={5000} onClose={() => setToast({
      ...toast,
      isVisible: false
    })} isVisible={toast.isVisible} />
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
    </TechLayout>;
}
// Keep the existing variant rendering functions
function renderVariantA() {
  return <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <FormField label="I am a" id="userType" type="select" options={[{
        value: 'brand',
        label: 'Brand / Sponsor'
      }, {
        value: 'organizer',
        label: 'Event Organizer'
      }, {
        value: 'community',
        label: 'Community Member'
      }]} value={userType} onChange={e => setUserType(e.target.value as 'brand' | 'organizer' | 'community')} />
        <FormField label="Email Address" id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-800">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input id="password" type={showPassword ? 'text' : 'password'} className="block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} className={`block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${confirmPassword && password !== confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && <p className="mt-1 text-xs text-red-600">Passwords do not match</p>}
        </div>
        <div className="pt-2">
          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>
      </div>
    </form>;
}
function renderVariantB() {
  return <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <FormField label="I am a" id="userType" type="select" options={[{
        value: 'brand',
        label: 'Brand / Sponsor'
      }, {
        value: 'organizer',
        label: 'Event Organizer'
      }, {
        value: 'community',
        label: 'Community Member'
      }]} value={userType} onChange={e => setUserType(e.target.value as 'brand' | 'organizer' | 'community')} />
        <FormField label="Email Address" id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-800">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input id="password" type={showPassword ? 'text' : 'password'} className="block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          {/* Password strength meter */}
          <div className="mt-2">
            <div className="flex space-x-1 mb-1">
              {[...Array(4)].map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i < passwordStrength ? passwordStrength === 1 ? 'bg-red-500' : passwordStrength === 2 ? 'bg-yellow-500' : passwordStrength === 3 ? 'bg-green-400' : 'bg-green-600' : 'bg-gray-200'}`} />)}
            </div>
            <p className="text-xs text-gray-500">
              {passwordStrength === 0 && 'Very weak'}
              {passwordStrength === 1 && 'Weak'}
              {passwordStrength === 2 && 'Medium'}
              {passwordStrength === 3 && 'Strong'}
              {passwordStrength === 4 && 'Very strong'}
            </p>
          </div>
          {/* Password requirements */}
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500 mb-1">Password must have:</p>
            <ul className="space-y-1">
              <li className="flex items-center text-xs">
                {passwordErrors.length ? <XCircleIcon className="h-3.5 w-3.5 text-red-500 mr-1.5" /> : <CheckCircleIcon className="h-3.5 w-3.5 text-green-500 mr-1.5" />}
                <span className={passwordErrors.length ? 'text-red-600' : 'text-green-600'}>
                  At least 8 characters
                </span>
              </li>
              <li className="flex items-center text-xs">
                {passwordErrors.uppercase ? <XCircleIcon className="h-3.5 w-3.5 text-red-500 mr-1.5" /> : <CheckCircleIcon className="h-3.5 w-3.5 text-green-500 mr-1.5" />}
                <span className={passwordErrors.uppercase ? 'text-red-600' : 'text-green-600'}>
                  At least one uppercase letter
                </span>
              </li>
              <li className="flex items-center text-xs">
                {passwordErrors.lowercase ? <XCircleIcon className="h-3.5 w-3.5 text-red-500 mr-1.5" /> : <CheckCircleIcon className="h-3.5 w-3.5 text-green-500 mr-1.5" />}
                <span className={passwordErrors.lowercase ? 'text-red-600' : 'text-green-600'}>
                  At least one lowercase letter
                </span>
              </li>
              <li className="flex items-center text-xs">
                {passwordErrors.number ? <XCircleIcon className="h-3.5 w-3.5 text-red-500 mr-1.5" /> : <CheckCircleIcon className="h-3.5 w-3.5 text-green-500 mr-1.5" />}
                <span className={passwordErrors.number ? 'text-red-600' : 'text-green-600'}>
                  At least one number
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} className={`block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${confirmPassword && password !== confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && <p className="mt-1 text-xs text-red-600">Passwords do not match</p>}
        </div>
        <div className="pt-2">
          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>
      </div>
    </form>;
}
function renderVariantC() {
  return <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <FormField label="I am a" id="userType" type="select" options={[{
        value: 'brand',
        label: 'Brand / Sponsor'
      }, {
        value: 'organizer',
        label: 'Event Organizer'
      }, {
        value: 'community',
        label: 'Community Member'
      }]} value={userType} onChange={e => {
        setUserType(e.target.value as 'brand' | 'organizer' | 'community');
        trackEvent(EVENTS.FORM_SUBMITTED, {
          field: 'userType',
          value: e.target.value
        }, undefined, EXPERIMENTS.LOGIN_REGISTRATION, experimentVariant);
      }} />
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-2">
          <p className="text-sm text-blue-800">
            <strong>
              {userType === 'brand' ? 'Brand / Sponsor' : userType === 'organizer' ? 'Event Organizer' : 'Community Member'}
            </strong>
            :
            {userType === 'brand' ? ' Perfect for companies looking to promote products or services through events.' : userType === 'organizer' ? ' Ideal for those organizing events and seeking brand partnerships.' : ' Join our community to participate in events and test panels.'}
          </p>
        </div>
        <FormField label="Email Address" id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" />
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-800">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input id="password" type={showPassword ? 'text' : 'password'} className="block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => {
            setShowPassword(!showPassword);
            trackEvent(EVENTS.FORM_SUBMITTED, {
              field: 'showPassword',
              value: !showPassword
            }, undefined, EXPERIMENTS.LOGIN_REGISTRATION, experimentVariant);
          }}>
              {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          {/* Password strength meter */}
          <div className="mt-2">
            <div className="flex space-x-1 mb-1">
              {[...Array(4)].map((_, i) => <div key={i} className={`h-1.5 flex-1 rounded-full ${i < passwordStrength ? passwordStrength === 1 ? 'bg-red-500' : passwordStrength === 2 ? 'bg-yellow-500' : passwordStrength === 3 ? 'bg-green-400' : 'bg-green-600' : 'bg-gray-200'}`} />)}
            </div>
            <p className="text-xs text-gray-500">
              {passwordStrength === 0 && 'Very weak'}
              {passwordStrength === 1 && 'Weak'}
              {passwordStrength === 2 && 'Medium'}
              {passwordStrength === 3 && 'Strong'}
              {passwordStrength === 4 && 'Very strong'}
            </p>
          </div>
          {/* Password requirements */}
          <div className="mt-2 space-y-1">
            <p className="text-xs text-gray-500 mb-1">Password must have:</p>
            <ul className="space-y-1">
              <li className="flex items-center text-xs">
                {passwordErrors.length ? <XCircleIcon className="h-3.5 w-3.5 text-red-500 mr-1.5" /> : <CheckCircleIcon className="h-3.5 w-3.5 text-green-500 mr-1.5" />}
                <span className={passwordErrors.length ? 'text-red-600' : 'text-green-600'}>
                  At least 8 characters
                </span>
              </li>
              <li className="flex items-center text-xs">
                {passwordErrors.uppercase ? <XCircleIcon className="h-3.5 w-3.5 text-red-500 mr-1.5" /> : <CheckCircleIcon className="h-3.5 w-3.5 text-green-500 mr-1.5" />}
                <span className={passwordErrors.uppercase ? 'text-red-600' : 'text-green-600'}>
                  At least one uppercase letter
                </span>
              </li>
              <li className="flex items-center text-xs">
                {passwordErrors.lowercase ? <XCircleIcon className="h-3.5 w-3.5 text-red-500 mr-1.5" /> : <CheckCircleIcon className="h-3.5 w-3.5 text-green-500 mr-1.5" />}
                <span className={passwordErrors.lowercase ? 'text-red-600' : 'text-green-600'}>
                  At least one lowercase letter
                </span>
              </li>
              <li className="flex items-center text-xs">
                {passwordErrors.number ? <XCircleIcon className="h-3.5 w-3.5 text-red-500 mr-1.5" /> : <CheckCircleIcon className="h-3.5 w-3.5 text-green-500 mr-1.5" />}
                <span className={passwordErrors.number ? 'text-red-600' : 'text-green-600'}>
                  At least one number
                </span>
              </li>
            </ul>
          </div>
        </div>
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-800">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} className={`block w-full rounded-md shadow-sm border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${confirmPassword && password !== confirmPassword ? 'border-red-300 focus:border-red-500 focus:ring-red-200' : ''}`} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => {
            setShowConfirmPassword(!showConfirmPassword);
            trackEvent(EVENTS.FORM_SUBMITTED, {
              field: 'showConfirmPassword',
              value: !showConfirmPassword
            }, undefined, EXPERIMENTS.LOGIN_REGISTRATION, experimentVariant);
          }}>
              {showConfirmPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}
            </button>
          </div>
          {confirmPassword && password !== confirmPassword && <p className="mt-1 text-xs text-red-600">Passwords do not match</p>}
        </div>
        <div className="pt-2">
          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </Button>
        </div>
      </div>
    </form>;
}