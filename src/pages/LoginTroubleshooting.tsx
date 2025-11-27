import {
  AlertCircleIcon,
  CheckCircleIcon,
  CookieIcon,
  DatabaseIcon,
  KeyIcon,
  LockIcon,
  MailIcon,
  RefreshCwIcon,
  ServerIcon,
  ShieldIcon,
  SparklesIcon,
  UserIcon,
  WifiOffIcon
} from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { Layout } from '../components/layout'
import { Button } from '../components/ui'

type TroubleshootingStep =
  | 'initial'
  | 'account-check'
  | 'browser-check'
  | 'network-check'
  | 'solution'
export function LoginTroubleshooting() {
  const [currentStep, setCurrentStep] = useState<TroubleshootingStep>('initial')
  const [formData, setFormData] = useState({
    email: '',
    errorMessage: '',
    browser: '',
    operatingSystem: '',
    triedIncognito: 'no',
    usingVpn: 'no',
    clearedCache: 'no',
    disabledExtensions: 'no'
  })
  const [diagnosis, setDiagnosis] = useState<string[]>([])
  const [solutions, setSolutions] = useState<string[]>([])
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const handleNextStep = (nextStep: TroubleshootingStep) => {
    setCurrentStep(nextStep)
    window.scrollTo(0, 0)
  }
  const analyzeProblem = () => {
    const newDiagnosis: string[] = []
    const newSolutions: string[] = []
    // Check for common issues based on the form data
    if (formData.errorMessage.toLowerCase().includes('password')) {
      newDiagnosis.push('Incorrect password or account credentials')
      newSolutions.push(
        'Reset your password using the "Forgot Password" link on the login page'
      )
    }
    if (
      formData.errorMessage.toLowerCase().includes('not found') ||
      formData.errorMessage.toLowerCase().includes('no account')
    ) {
      newDiagnosis.push('Account may not exist with the provided email')
      newSolutions.push('Create a new account using the registration page')
      newSolutions.push('Double-check your email address for typos')
    }
    if (formData.usingVpn === 'yes') {
      newDiagnosis.push('VPN connection may be interfering with authentication')
      newSolutions.push('Temporarily disable your VPN and try logging in again')
    }
    if (formData.clearedCache === 'no') {
      newDiagnosis.push('Browser cache or cookies may be corrupted')
      newSolutions.push('Clear your browser cache and cookies, then try again')
    }
    if (formData.disabledExtensions === 'no') {
      newDiagnosis.push('Browser extensions might be blocking authentication')
      newSolutions.push(
        'Temporarily disable all browser extensions and try again'
      )
    }
    if (formData.triedIncognito === 'no') {
      newSolutions.push(
        "Try logging in using your browser's incognito/private mode"
      )
    }
    // If no specific issues identified, provide general solutions
    if (newDiagnosis.length === 0) {
      newDiagnosis.push('General authentication issue')
      newSolutions.push('Try logging in from a different device or browser')
      newSolutions.push(
        'Check if the SponsrAI service is experiencing downtime'
      )
      newSolutions.push('Contact support if the issue persists')
    }
    setDiagnosis(newDiagnosis)
    setSolutions(newSolutions)
    handleNextStep('solution')
  }
  return (
    <Layout>
      <div className='min-h-screen w-full bg-white'>
        <div className='max-w-3xl mx-auto px-4 py-12'>
          {/* Header */}
          <div className='text-center mb-10 relative'>
            <div className='absolute top-0 left-1/2 transform -translate-x-1/2 -mt-6 w-32 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent'></div>
            <h1 className='text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center'>
              <KeyIcon className='h-6 w-6 text-indigo-600 mr-2' />
              Login Troubleshooting
            </h1>
            <p className='text-gray-600'>
              Let's help you solve your login issues and get you back into your
              account.
            </p>
            <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 mt-6 w-32 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent'></div>
          </div>
          {/* Main content - changes based on current step */}
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8 relative overflow-hidden'>
            {/* Mystical decorative elements */}
            <div className='absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -mr-20 -mt-20 opacity-30'></div>
            <div className='absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full -ml-16 -mb-16 opacity-30'></div>
            {/* Subtle arcane pattern */}
            <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-100/10 via-transparent to-transparent opacity-40'></div>
            <div className='relative z-10'>
              {currentStep === 'initial' && (
                <div>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                    <SparklesIcon className='h-5 w-5 text-indigo-500 mr-2' />
                    What's happening?
                  </h2>
                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Your Email Address
                      </label>
                      <div className='relative'>
                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                          <MailIcon className='h-5 w-5 text-gray-400' />
                        </div>
                        <input
                          type='email'
                          name='email'
                          className='block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                          placeholder="Enter the email you're trying to use"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Error Message (if any)
                      </label>
                      <textarea
                        name='errorMessage'
                        rows={2}
                        className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                        placeholder='Copy and paste any error message you see'
                        value={formData.errorMessage}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                    <div className='flex justify-end'>
                      <Button
                        onClick={() => handleNextStep('account-check')}
                        variant='primary'
                        className='bg-gradient-to-r from-indigo-500 to-purple-600'
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 'account-check' && (
                <div>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                    <UserIcon className='h-5 w-5 text-indigo-500 mr-2' />
                    Account Check
                  </h2>
                  <div className='bg-indigo-50 p-4 rounded-lg mb-6 border border-indigo-100'>
                    <p className='text-sm text-indigo-700'>
                      Let's first check if we can find your account and verify
                      its status.
                    </p>
                  </div>
                  <div className='space-y-4 mb-6'>
                    <div className='flex items-start p-4 border border-gray-200 rounded-lg bg-white'>
                      <div className='flex-shrink-0 pt-0.5'>
                        <DatabaseIcon className='h-5 w-5 text-indigo-500' />
                      </div>
                      <div className='ml-3'>
                        <h3 className='text-sm font-medium text-gray-900'>
                          Account Lookup
                        </h3>
                        <p className='text-sm text-gray-500'>
                          We'll check if an account exists with email:{' '}
                          <span className='font-medium text-gray-700'>
                            {formData.email || '[No email provided]'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start p-4 border border-gray-200 rounded-lg bg-white'>
                      <div className='flex-shrink-0 pt-0.5'>
                        <LockIcon className='h-5 w-5 text-indigo-500' />
                      </div>
                      <div className='ml-3'>
                        <h3 className='text-sm font-medium text-gray-900'>
                          Account Status
                        </h3>
                        <p className='text-sm text-gray-500'>
                          We'll verify if your account is active and not locked
                          due to too many failed login attempts.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='space-y-4 mb-6'>
                    <div>
                      <p className='text-sm text-gray-700 mb-2'>
                        Have you tried resetting your password?
                      </p>
                      <div className='flex space-x-4'>
                        <button
                          className='inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          onClick={() => window.open('/login', '_blank')}
                        >
                          Try Password Reset
                        </button>
                        <button
                          className='inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          onClick={() => window.open('/register', '_blank')}
                        >
                          Create New Account
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <Button
                      onClick={() => handleNextStep('initial')}
                      variant='outline'
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => handleNextStep('browser-check')}
                      variant='primary'
                      className='bg-gradient-to-r from-indigo-500 to-purple-600'
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}
              {currentStep === 'browser-check' && (
                <div>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                    <div className='h-5 w-5 text-indigo-500 mr-2' />
                    Browser & System Check
                  </h2>
                  <div className='space-y-6'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Browser and Version
                        </label>
                        <input
                          type='text'
                          name='browser'
                          className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                          placeholder='e.g. Chrome 94, Firefox 92'
                          value={formData.browser}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Operating System
                        </label>
                        <input
                          type='text'
                          name='operatingSystem'
                          className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
                          placeholder='e.g. Windows 10, macOS, iOS'
                          value={formData.operatingSystem}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className='space-y-4'>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Have you tried using incognito/private mode?
                        </label>
                        <div className='flex space-x-4'>
                          <label className='inline-flex items-center'>
                            <input
                              type='radio'
                              name='triedIncognito'
                              value='yes'
                              checked={formData.triedIncognito === 'yes'}
                              onChange={handleInputChange}
                              className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                            />
                            <span className='ml-2 text-sm text-gray-700'>
                              Yes
                            </span>
                          </label>
                          <label className='inline-flex items-center'>
                            <input
                              type='radio'
                              name='triedIncognito'
                              value='no'
                              checked={formData.triedIncognito === 'no'}
                              onChange={handleInputChange}
                              className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                            />
                            <span className='ml-2 text-sm text-gray-700'>
                              No
                            </span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Have you cleared your browser cache and cookies?
                        </label>
                        <div className='flex space-x-4'>
                          <label className='inline-flex items-center'>
                            <input
                              type='radio'
                              name='clearedCache'
                              value='yes'
                              checked={formData.clearedCache === 'yes'}
                              onChange={handleInputChange}
                              className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                            />
                            <span className='ml-2 text-sm text-gray-700'>
                              Yes
                            </span>
                          </label>
                          <label className='inline-flex items-center'>
                            <input
                              type='radio'
                              name='clearedCache'
                              value='no'
                              checked={formData.clearedCache === 'no'}
                              onChange={handleInputChange}
                              className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                            />
                            <span className='ml-2 text-sm text-gray-700'>
                              No
                            </span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Have you disabled browser extensions/add-ons?
                        </label>
                        <div className='flex space-x-4'>
                          <label className='inline-flex items-center'>
                            <input
                              type='radio'
                              name='disabledExtensions'
                              value='yes'
                              checked={formData.disabledExtensions === 'yes'}
                              onChange={handleInputChange}
                              className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                            />
                            <span className='ml-2 text-sm text-gray-700'>
                              Yes
                            </span>
                          </label>
                          <label className='inline-flex items-center'>
                            <input
                              type='radio'
                              name='disabledExtensions'
                              value='no'
                              checked={formData.disabledExtensions === 'no'}
                              onChange={handleInputChange}
                              className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                            />
                            <span className='ml-2 text-sm text-gray-700'>
                              No
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-between'>
                      <Button
                        onClick={() => handleNextStep('account-check')}
                        variant='outline'
                      >
                        Back
                      </Button>
                      <Button
                        onClick={() => handleNextStep('network-check')}
                        variant='primary'
                        className='bg-gradient-to-r from-indigo-500 to-purple-600'
                      >
                        Continue
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 'network-check' && (
                <div>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                    <WifiOffIcon className='h-5 w-5 text-indigo-500 mr-2' />
                    Network & Connection Check
                  </h2>
                  <div className='bg-indigo-50 p-4 rounded-lg mb-6 border border-indigo-100'>
                    <p className='text-sm text-indigo-700'>
                      Sometimes network issues or security settings can prevent
                      successful login.
                    </p>
                  </div>
                  <div className='space-y-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-1'>
                        Are you using a VPN or corporate network?
                      </label>
                      <div className='flex space-x-4'>
                        <label className='inline-flex items-center'>
                          <input
                            type='radio'
                            name='usingVpn'
                            value='yes'
                            checked={formData.usingVpn === 'yes'}
                            onChange={handleInputChange}
                            className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                          />
                          <span className='ml-2 text-sm text-gray-700'>
                            Yes
                          </span>
                        </label>
                        <label className='inline-flex items-center'>
                          <input
                            type='radio'
                            name='usingVpn'
                            value='no'
                            checked={formData.usingVpn === 'no'}
                            onChange={handleInputChange}
                            className='focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300'
                          />
                          <span className='ml-2 text-sm text-gray-700'>No</span>
                        </label>
                      </div>
                    </div>
                    <div className='p-4 border border-gray-200 rounded-lg bg-white'>
                      <h3 className='text-sm font-medium text-gray-900 mb-2'>
                        Network Troubleshooting Tips
                      </h3>
                      <ul className='space-y-2 text-sm text-gray-600'>
                        <li className='flex items-start'>
                          <span className='flex-shrink-0 h-5 w-5 text-indigo-500 flex items-center justify-center mr-1'>
                            •
                          </span>
                          <span>
                            Try using a different network (switch from WiFi to
                            mobile data)
                          </span>
                        </li>
                        <li className='flex items-start'>
                          <span className='flex-shrink-0 h-5 w-5 text-indigo-500 flex items-center justify-center mr-1'>
                            •
                          </span>
                          <span>
                            Restart your router if you're on a home network
                          </span>
                        </li>
                        <li className='flex items-start'>
                          <span className='flex-shrink-0 h-5 w-5 text-indigo-500 flex items-center justify-center mr-1'>
                            •
                          </span>
                          <span>
                            Check if your network blocks certain websites or
                            services
                          </span>
                        </li>
                        <li className='flex items-start'>
                          <span className='flex-shrink-0 h-5 w-5 text-indigo-500 flex items-center justify-center mr-1'>
                            •
                          </span>
                          <span>
                            Temporarily disable any firewall or security
                            software
                          </span>
                        </li>
                      </ul>
                    </div>
                    <div className='flex justify-between'>
                      <Button
                        onClick={() => handleNextStep('browser-check')}
                        variant='outline'
                      >
                        Back
                      </Button>
                      <Button
                        onClick={analyzeProblem}
                        variant='primary'
                        className='bg-gradient-to-r from-indigo-500 to-purple-600'
                      >
                        Find Solutions
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 'solution' && (
                <div>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                    <CheckCircleIcon className='h-5 w-5 text-indigo-500 mr-2' />
                    Your Personalized Solutions
                  </h2>
                  <div className='bg-indigo-50 p-4 rounded-lg mb-6 border border-indigo-100'>
                    <p className='text-sm text-indigo-700'>
                      Based on your answers, we've identified potential
                      solutions to help you log in.
                    </p>
                  </div>
                  {diagnosis.length > 0 && (
                    <div className='mb-6'>
                      <h3 className='text-sm font-medium text-gray-900 mb-2'>
                        Potential Issues:
                      </h3>
                      <div className='bg-white border border-gray-200 rounded-lg'>
                        {diagnosis.map((issue, index) => (
                          <div
                            key={index}
                            className={`p-3 flex items-start ${
                              index !== diagnosis.length - 1
                                ? 'border-b border-gray-200'
                                : ''
                            }`}
                          >
                            <AlertCircleIcon className='h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5' />
                            <span className='text-sm text-gray-700'>
                              {issue}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className='mb-8'>
                    <h3 className='text-sm font-medium text-gray-900 mb-2'>
                      Recommended Solutions:
                    </h3>
                    <div className='bg-white border border-gray-200 rounded-lg'>
                      {solutions.map((solution, index) => (
                        <div
                          key={index}
                          className={`p-3 flex items-start ${
                            index !== solutions.length - 1
                              ? 'border-b border-gray-200'
                              : ''
                          }`}
                        >
                          <div className='flex-shrink-0 h-5 w-5 text-green-500 flex items-center justify-center mr-2 mt-0.5'>
                            {index + 1}
                          </div>
                          <span className='text-sm text-gray-700'>
                            {solution}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='bg-purple-50 border border-purple-100 rounded-lg p-4 mb-6'>
                    <div className='flex'>
                      <ShieldIcon className='h-5 w-5 text-purple-500 mr-2 flex-shrink-0' />
                      <div>
                        <h3 className='text-sm font-medium text-purple-900 mb-1'>
                          Still having trouble?
                        </h3>
                        <p className='text-sm text-purple-700'>
                          Our support team is ready to help. Click the chat icon
                          in the bottom right corner or email us at
                          support@sponsrai.se
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <Button
                      onClick={() => handleNextStep('initial')}
                      variant='outline'
                      className='flex items-center'
                    >
                      <RefreshCwIcon className='h-4 w-4 mr-1' />
                      Start Over
                    </Button>
                    <Link to='/login'>
                      <Button
                        variant='primary'
                        className='bg-gradient-to-r from-indigo-500 to-purple-600'
                      >
                        Return to Login
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Common login issues */}
          <div className='mt-12'>
            <h2 className='text-xl font-semibold text-gray-900 mb-6 text-center'>
              Common Login Issues
            </h2>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden'>
                <div className='absolute top-0 right-0 w-16 h-16 bg-indigo-50 rounded-full -mr-8 -mt-8 opacity-30'></div>
                <h3 className='text-lg font-medium text-gray-900 mb-3 flex items-center'>
                  <CookieIcon className='h-5 w-5 text-indigo-500 mr-2' />
                  Browser Storage Issues
                </h3>
                <p className='text-sm text-gray-600 mb-3'>
                  Our platform requires cookies and local storage to function
                  properly. Make sure:
                </p>
                <ul className='text-sm text-gray-600 space-y-2'>
                  <li className='flex items-start'>
                    <span className='text-indigo-500 mr-2'>•</span>
                    <span>Cookies are enabled in your browser</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='text-indigo-500 mr-2'>•</span>
                    <span>You're not in private/incognito browsing mode</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='text-indigo-500 mr-2'>•</span>
                    <span>No privacy extensions are blocking storage</span>
                  </li>
                </ul>
              </div>
              <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-5 relative overflow-hidden'>
                <div className='absolute top-0 right-0 w-16 h-16 bg-purple-50 rounded-full -mr-8 -mt-8 opacity-30'></div>
                <h3 className='text-lg font-medium text-gray-900 mb-3 flex items-center'>
                  <ServerIcon className='h-5 w-5 text-purple-500 mr-2' />
                  Account Security
                </h3>
                <p className='text-sm text-gray-600 mb-3'>
                  We take security seriously. Your account might be temporarily
                  locked if:
                </p>
                <ul className='text-sm text-gray-600 space-y-2'>
                  <li className='flex items-start'>
                    <span className='text-purple-500 mr-2'>•</span>
                    <span>There were too many failed login attempts</span>
                  </li>
                  <li className='flex items-start'>
                    <span className='text-purple-500 mr-2'>•</span>
                    <span>
                      Suspicious activity was detected from your account
                    </span>
                  </li>
                  <li className='flex items-start'>
                    <span className='text-purple-500 mr-2'>•</span>
                    <span>You're logging in from an unusual location</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
