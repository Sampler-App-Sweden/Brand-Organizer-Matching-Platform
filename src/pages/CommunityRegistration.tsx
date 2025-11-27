import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout'
import { FormField, Button } from '../components/ui'
import {
  CheckCircleIcon,
  UploadIcon,
  FlaskConicalIcon,
  Sparkles
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { registerCommunityMember } from '../services/communityService'
export function CommunityRegistration() {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'brand',
    shortDescription: '',
    description: '',
    website: '',
    email: currentUser?.email || '',
    phone: '',
    socialLinks: ''
  })
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setLogoFile(file)
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setLogoPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      navigate('/login', {
        state: {
          returnUrl: '/community/register'
        }
      })
      return
    }
    try {
      setIsLoading(true)
      // In a real app, we'd upload the logo to a storage service
      // and get back a URL. For this demo, we'll use the preview URL
      const logoUrl = logoPreview
      await registerCommunityMember({
        ...formData,
        logoUrl,
        userId: currentUser.id
      })
      setFormSubmitted(true)
    } catch (error) {
      console.error('Failed to register:', error)
    } finally {
      setIsLoading(false)
    }
  }
  if (formSubmitted) {
    return (
      <Layout>
        <div className='max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm'>
          <div className='text-center'>
            <CheckCircleIcon className='h-16 w-16 text-green-500 mx-auto mb-4' />
            <h1 className='text-2xl font-bold text-gray-900 mb-2'>
              Welcome to Our Community!
            </h1>
            <p className='text-gray-600 mb-6'>
              Your profile has been successfully registered and is now visible
              in our community showcase.
            </p>
            <div className='flex flex-col sm:flex-row justify-center gap-4'>
              <Button onClick={() => navigate('/community')}>
                View Community
              </Button>
              <Button variant='outline' onClick={() => navigate('/')}>
                Return to Home
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    )
  }
  return (
    <Layout>
      <div className='max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-sm relative overflow-hidden'>
        {/* Mystical background elements */}
        <div className='absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -mr-20 -mt-20 opacity-70'></div>
        <div className='absolute bottom-0 left-0 w-32 h-32 bg-purple-50 rounded-full -ml-16 -mb-16 opacity-70'></div>
        <div className='relative'>
          <div className='flex items-center mb-2'>
            <FlaskConicalIcon className='h-6 w-6 text-indigo-600 mr-2' />
            <h1 className='text-2xl font-bold text-gray-900'>
              Join Our Community
            </h1>
          </div>
          <p className='text-gray-600 mb-6'>
            Register your brand or organization to be featured in our community
            showcase.
          </p>
          <form onSubmit={handleSubmit}>
            <div className='mb-8'>
              <h2 className='text-lg font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center'>
                <Sparkles className='h-4 w-4 text-indigo-500 mr-2' />
                Basic Information
              </h2>
              <div className='grid md:grid-cols-2 gap-4'>
                <FormField
                  label='Member Type'
                  id='type'
                  type='select'
                  options={[
                    {
                      value: 'brand',
                      label: 'Brand / Sponsor'
                    },
                    {
                      value: 'organizer',
                      label: 'Event Organizer'
                    }
                  ]}
                  required
                  value={formData.type}
                  onChange={handleChange}
                />
                <FormField
                  label='Name'
                  id='name'
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder='Your brand or organization name'
                />
              </div>
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Logo / Image <span className='text-gray-500'>(optional)</span>
                </label>
                <div className='flex items-start'>
                  <div className='mr-4'>
                    {logoPreview ? (
                      <div className='relative h-20 w-20'>
                        <img
                          src={logoPreview}
                          alt='Logo preview'
                          className='h-full w-full object-contain rounded-md border border-gray-200'
                        />
                        <button
                          type='button'
                          onClick={() => {
                            setLogoFile(null)
                            setLogoPreview(null)
                          }}
                          className='absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1'
                          title='Remove image'
                        >
                          <svg
                            className='h-3 w-3'
                            fill='none'
                            viewBox='0 0 24 24'
                            stroke='currentColor'
                          >
                            <path
                              strokeLinecap='round'
                              strokeLinejoin='round'
                              strokeWidth={2}
                              d='M6 18L18 6M6 6l12 12'
                            />
                          </svg>
                        </button>
                      </div>
                    ) : (
                      <div className='h-20 w-20 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50'>
                        <span className='text-gray-400 text-xs text-center'>
                          No logo
                        </span>
                      </div>
                    )}
                  </div>
                  <div className='flex-1'>
                    <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
                      <div className='space-y-1 text-center'>
                        <UploadIcon className='mx-auto h-12 w-12 text-gray-400' />
                        <div className='flex text-sm text-gray-600'>
                          <label
                            htmlFor='logo-upload'
                            className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500'
                          >
                            <span>Upload a file</span>
                            <input
                              id='logo-upload'
                              name='logo-upload'
                              type='file'
                              className='sr-only'
                              accept='image/*'
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className='pl-1'>or drag and drop</p>
                        </div>
                        <p className='text-xs text-gray-500'>
                          PNG, JPG, GIF up to 2MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <FormField
                label='Short Description'
                id='shortDescription'
                required
                maxLength={60}
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder='A brief one-line description (max 60 characters)'
                helpText='This will appear in the community dropdown menu'
              />
              <FormField
                label='Full Description'
                id='description'
                textarea
                required
                rows={3}
                value={formData.description}
                onChange={handleChange}
                placeholder='Describe your brand or organization (max 200 words)'
              />
            </div>
            <div className='mb-8'>
              <h2 className='text-lg font-semibold text-gray-800 mb-4 pb-2 border-b flex items-center'>
                <Sparkles className='h-4 w-4 text-indigo-500 mr-2' />
                Contact Information
              </h2>
              <div className='grid md:grid-cols-2 gap-4'>
                <FormField
                  label='Email'
                  id='email'
                  type='email'
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
                <FormField
                  label='Phone Number'
                  id='phone'
                  type='tel'
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <FormField
                label='Website'
                id='website'
                type='url'
                placeholder='https://'
                value={formData.website}
                onChange={handleChange}
              />
              <FormField
                label='Social Media Links'
                id='socialLinks'
                textarea
                rows={2}
                value={formData.socialLinks}
                onChange={handleChange}
                placeholder='Add links to your social media profiles (one per line)'
              />
            </div>
            <div className='flex justify-end'>
              <Button
                type='submit'
                variant='primary'
                disabled={isLoading}
                className='relative overflow-hidden group'
              >
                {isLoading ? (
                  <div className='flex items-center'>
                    <div className='animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2'></div>
                    Processing...
                  </div>
                ) : (
                  <>
                    Join the Community
                    <div className='absolute inset-0 flex justify-center items-center bg-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <Sparkles className='h-4 w-4 mr-2' />
                      <span>Let's Connect!</span>
                    </div>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  )
}
