import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Layout } from '../components/layout'
import {
  FormField,
  Button,
  SelectionCard,
  StepIndicator,
  Toast
} from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabaseClient'
import {
  BuildingIcon,
  UserIcon,
  PhoneIcon,
  GlobeIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  DollarSignIcon,
  MegaphoneIcon,
  TargetIcon,
  CheckCircleIcon,
  BriefcaseIcon,
  ImageIcon,
  UploadIcon,
  PresentationIcon
} from 'lucide-react'
export function OrganizerForm() {
  const navigate = useNavigate()
  const { register, currentUser } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    organizerName: '',
    contactName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    website: '',
    address: '',
    postalCode: '',
    city: '',
    eventName: '',
    eventType: '',
    elevatorPitch: '',
    eventFrequency: '',
    eventDate: '',
    location: '',
    attendeeCount: '',
    audienceDescription: '',
    audienceDemographics: [] as string[],
    sponsorshipNeeds: '',
    seekingFinancialSponsorship: 'no',
    financialSponsorshipAmount: '',
    financialSponsorshipOffers: '',
    offeringTypes: [] as string[],
    brandVisibility: '',
    contentCreation: '',
    leadGeneration: '',
    productFeedback: '',
    bonusValue: [] as string[],
    bonusValueDetails: '',
    additionalInfo: '',
    mediaFiles: [] as File[]
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [toast, setToast] = useState({
    isVisible: false,
    type: 'success' as 'success' | 'error' | 'info' | 'warning',
    message: ''
  })

  // Fetch existing organizer data if user is logged in
  useEffect(() => {
    const fetchOrganizerData = async () => {
      if (!currentUser) {
        setIsLoading(false)
        return
      }

      try {
        const { data: organizerData, error } = await supabase
          .from('organizers')
          .select('*')
          .eq('user_id', currentUser.id)
          .single()

        if (error) {
          if (error.code !== 'PGRST116') {
            // PGRST116 means no rows found, which is fine
            console.error('Error fetching organizer data:', error)
          }
          setIsLoading(false)
          return
        }

        if (organizerData) {
          setFormData({
            organizerName: organizerData.organizer_name || '',
            contactName: organizerData.contact_name || '',
            email: organizerData.email || currentUser.email,
            password: '',
            confirmPassword: '',
            phone: organizerData.phone || '',
            website: organizerData.website || '',
            address: organizerData.address || '',
            postalCode: organizerData.postal_code || '',
            city: organizerData.city || '',
            eventName: organizerData.event_name || '',
            eventType: organizerData.event_type || '',
            elevatorPitch: organizerData.elevator_pitch || '',
            eventFrequency: organizerData.event_frequency || '',
            eventDate: organizerData.event_date || '',
            location: organizerData.location || '',
            attendeeCount: organizerData.attendee_count || '',
            audienceDescription: organizerData.audience_description || '',
            audienceDemographics: organizerData.audience_demographics || [],
            sponsorshipNeeds: organizerData.sponsorship_needs || '',
            seekingFinancialSponsorship:
              organizerData.seeking_financial_sponsorship || 'no',
            financialSponsorshipAmount:
              organizerData.financial_sponsorship_amount || '',
            financialSponsorshipOffers:
              organizerData.financial_sponsorship_offers || '',
            offeringTypes: organizerData.offering_types || [],
            brandVisibility: organizerData.brand_visibility || '',
            contentCreation: organizerData.content_creation || '',
            leadGeneration: organizerData.lead_generation || '',
            productFeedback: organizerData.product_feedback || '',
            bonusValue: organizerData.bonus_value || [],
            bonusValueDetails: organizerData.bonus_value_details || '',
            additionalInfo: organizerData.additional_info || '',
            mediaFiles: []
          })
        }
      } catch (error) {
        console.error('Error loading organizer data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizerData()
  }, [currentUser])
  const totalSteps = 4
  const stepLabels = ['Organization', 'Event', 'Audience', 'Offerings']
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
    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = {
          ...prev
        }
        delete newErrors[name]
        return newErrors
      })
    }
  }
  const handleMultiSelectChange = (name: string, value: string) => {
    setFormData((prev) => {
      const currentValues = [...(prev[name as keyof typeof prev] as string[])]
      const index = currentValues.indexOf(value)
      if (index === -1) {
        currentValues.push(value)
      } else {
        currentValues.splice(index, 1)
      }
      return {
        ...prev,
        [name]: currentValues
      }
    })
  }
  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }
  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {}
    if (step === 1) {
      if (!formData.organizerName.trim())
        newErrors.organizerName = 'Organization name is required'
      if (!formData.contactName.trim())
        newErrors.contactName = 'Contact name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = 'Email is invalid'
      
      // Only validate password for new registrations (not logged-in users)
      if (!currentUser) {
        if (!formData.password.trim()) newErrors.password = 'Password is required'
        else if (formData.password.length < 6)
          newErrors.password = 'Password must be at least 6 characters'
        if (formData.password !== formData.confirmPassword)
          newErrors.confirmPassword = 'Passwords do not match'
      }
    } else if (step === 2) {
      if (!formData.eventName.trim())
        newErrors.eventName = 'Event name is required'
      if (!formData.eventType) newErrors.eventType = 'Event type is required'
      if (!formData.eventFrequency)
        newErrors.eventFrequency = 'Event frequency is required'
    } else if (step === 3) {
      if (!formData.attendeeCount)
        newErrors.attendeeCount = 'Attendee count is required'
      if (!formData.audienceDescription.trim())
        newErrors.audienceDescription = 'Audience description is required'
      if (formData.audienceDemographics.length === 0)
        newErrors.audienceDemographics = 'Select at least one demographic'
    } else if (step === 4) {
      if (formData.offeringTypes.length === 0)
        newErrors.offeringTypes = 'Select at least one offering type'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  const nextStep = () => {
    if (validateStep(currentStep)) {
      window.scrollTo(0, 0)
      setCurrentStep(currentStep + 1)
    }
  }
  const prevStep = () => {
    window.scrollTo(0, 0)
    setCurrentStep(currentStep - 1)
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return
    setIsSubmitting(true)
    try {
      let userId: string

      if (currentUser) {
        // Updating existing organizer profile
        userId = currentUser.id

        const organizerData = {
          organizer_name: formData.organizerName,
          contact_name: formData.contactName,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          address: formData.address,
          postal_code: formData.postalCode,
          city: formData.city,
          event_name: formData.eventName,
          event_type: formData.eventType,
          elevator_pitch: formData.elevatorPitch,
          event_frequency: formData.eventFrequency,
          event_date: formData.eventDate,
          location: formData.location,
          attendee_count: formData.attendeeCount,
          audience_description: formData.audienceDescription,
          audience_demographics: formData.audienceDemographics,
          sponsorship_needs: formData.sponsorshipNeeds,
          seeking_financial_sponsorship: formData.seekingFinancialSponsorship,
          financial_sponsorship_amount: formData.financialSponsorshipAmount,
          financial_sponsorship_offers: formData.financialSponsorshipOffers,
          offering_types: formData.offeringTypes,
          brand_visibility: formData.brandVisibility,
          content_creation: formData.contentCreation,
          lead_generation: formData.leadGeneration,
          product_feedback: formData.productFeedback,
          bonus_value: formData.bonusValue,
          bonus_value_details: formData.bonusValueDetails,
          additional_info: formData.additionalInfo,
          media_files: []
        }

        // Check if organizer exists
        const { data: existing } = await supabase
          .from('organizers')
          .select('id')
          .eq('user_id', userId)
          .single()

        if (existing) {
          // Update existing organizer
          const { error: organizerError } = await supabase
            .from('organizers')
            .update(organizerData)
            .eq('user_id', userId)

          if (organizerError) {
            throw new Error(`Failed to update organizer profile: ${organizerError.message}`)
          }
        } else {
          // Insert new organizer for existing user
          const { error: organizerError } = await supabase
            .from('organizers')
            .insert([{ ...organizerData, user_id: userId }])

          if (organizerError) {
            throw new Error(`Failed to create organizer profile: ${organizerError.message}`)
          }
        }

        setToast({
          isVisible: true,
          type: 'success',
          message: 'Organizer profile updated successfully!'
        })

        setTimeout(() => {
          navigate('/dashboard/organizer')
        }, 1500)
      } else {
        // New registration
        const user = await register(
          formData.email,
          formData.password,
          'organizer',
          formData.organizerName
        )
        userId = user.id

        // Insert organizer data into Supabase
        const { error: organizerError } = await supabase
          .from('organizers')
          .insert([
            {
              user_id: userId,
            organizer_name: formData.organizerName,
            contact_name: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            address: formData.address,
            postal_code: formData.postalCode,
            city: formData.city,
            event_name: formData.eventName,
            event_type: formData.eventType,
            elevator_pitch: formData.elevatorPitch,
            event_frequency: formData.eventFrequency,
            event_date: formData.eventDate,
            location: formData.location,
            attendee_count: formData.attendeeCount,
            audience_description: formData.audienceDescription,
            audience_demographics: formData.audienceDemographics,
            sponsorship_needs: formData.sponsorshipNeeds,
            seeking_financial_sponsorship: formData.seekingFinancialSponsorship,
            financial_sponsorship_amount: formData.financialSponsorshipAmount,
            financial_sponsorship_offers: formData.financialSponsorshipOffers,
            offering_types: formData.offeringTypes,
            brand_visibility: formData.brandVisibility,
            content_creation: formData.contentCreation,
            lead_generation: formData.leadGeneration,
            product_feedback: formData.productFeedback,
            bonus_value: formData.bonusValue,
            bonus_value_details: formData.bonusValueDetails,
              additional_info: formData.additionalInfo,
              media_files: []
            }
          ])

        if (organizerError) {
          throw new Error(
            `Failed to create organizer profile: ${organizerError.message}`
          )
        }

        setToast({
          isVisible: true,
          type: 'success',
          message: 'Registration successful! Redirecting to dashboard...'
        })

        setTimeout(() => {
          navigate('/dashboard/organizer')
        }, 2000)
      }

      // Update profile with additional details
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.organizerName,
          phone: formData.phone,
          description: formData.elevatorPitch,
          logo_url: formData.website
        })
        .eq('id', userId)

      if (profileError) {
        console.warn('Failed to update profile:', profileError)
      }
    } catch (error) {
      setToast({
        isVisible: true,
        type: 'error',
        message:
          error instanceof Error
            ? error.message
            : 'An error occurred during registration'
      })
      setIsSubmitting(false)
    }
  }
  const eventTypeOptions = [
    {
      value: 'conference',
      label: 'Conference'
    },
    {
      value: 'festival',
      label: 'Festival'
    },
    {
      value: 'expo',
      label: 'Expo/Trade Show'
    },
    {
      value: 'workshop',
      label: 'Workshop/Seminar'
    },
    {
      value: 'concert',
      label: 'Concert/Performance'
    },
    {
      value: 'sports',
      label: 'Sports Event'
    },
    {
      value: 'networking',
      label: 'Networking Event'
    },
    {
      value: 'community',
      label: 'Community Event'
    }
  ]
  const eventFrequencyOptions = [
    {
      value: 'one_time',
      label: 'One-time Event'
    },
    {
      value: 'annual',
      label: 'Annual'
    },
    {
      value: 'biannual',
      label: 'Bi-annual'
    },
    {
      value: 'quarterly',
      label: 'Quarterly'
    },
    {
      value: 'monthly',
      label: 'Monthly'
    },
    {
      value: 'weekly',
      label: 'Weekly'
    }
  ]
  const attendeeCountOptions = [
    {
      value: 'under_100',
      label: 'Under 100'
    },
    {
      value: '100_500',
      label: '100-500'
    },
    {
      value: '500_1000',
      label: '500-1,000'
    },
    {
      value: '1000_5000',
      label: '1,000-5,000'
    },
    {
      value: '5000_plus',
      label: 'Over 5,000'
    }
  ]
  const demographicOptions = [
    {
      id: '18-24',
      label: '18-24 years',
      icon: <UsersIcon className='h-5 w-5' />
    },
    {
      id: '25-34',
      label: '25-34 years',
      icon: <UsersIcon className='h-5 w-5' />
    },
    {
      id: '35-44',
      label: '35-44 years',
      icon: <UsersIcon className='h-5 w-5' />
    },
    {
      id: '45-54',
      label: '45-54 years',
      icon: <UsersIcon className='h-5 w-5' />
    },
    {
      id: '55_plus',
      label: '55+ years',
      icon: <UsersIcon className='h-5 w-5' />
    }
  ]
  const offeringTypes = [
    {
      id: 'brand_visibility',
      label: 'Brand Visibility',
      description: 'Logo placement, signage, mentions',
      icon: <MegaphoneIcon className='h-5 w-5' />
    },
    {
      id: 'product_sampling',
      label: 'Product Sampling',
      description: 'Opportunities for attendees to try products',
      icon: <BriefcaseIcon className='h-5 w-5' />
    },
    {
      id: 'content_creation',
      label: 'Content Creation',
      description: 'Photos, videos, social media content',
      icon: <ImageIcon className='h-5 w-5' />
    },
    {
      id: 'lead_generation',
      label: 'Lead Generation',
      description: 'Collecting attendee information for brands',
      icon: <UsersIcon className='h-5 w-5' />
    },
    {
      id: 'product_feedback',
      label: 'Product Feedback',
      description: 'Gathering opinions and reviews',
      icon: <CheckCircleIcon className='h-5 w-5' />
    }
  ]
  const bonusValueOptions = [
    {
      id: 'media_coverage',
      label: 'Media Coverage',
      description: 'Press, publications, or media attention',
      icon: <PresentationIcon className='h-5 w-5' />
    },
    {
      id: 'industry_network',
      label: 'Industry Network',
      description: 'Access to valuable industry contacts',
      icon: <UsersIcon className='h-5 w-5' />
    },
    {
      id: 'influencer_presence',
      label: 'Influencer Presence',
      description: 'Social media influencers attending',
      icon: <TargetIcon className='h-5 w-5' />
    },
    {
      id: 'exclusive_access',
      label: 'Exclusive Access',
      description: 'VIP areas or special event access',
      icon: <CheckCircleIcon className='h-5 w-5' />
    }
  ]
  return (
    <Layout>
      <div className='min-h-screen w-full bg-white'>
        <div className='max-w-3xl mx-auto px-4 py-12'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              {currentUser ? 'Update Organizer Profile' : 'Organizer Registration'}
            </h1>
            <p className='text-gray-600'>
              {currentUser
                ? 'Update your event information and sponsorship offerings'
                : 'Register your event to find the perfect brand sponsors'}
            </p>
          </div>
          {isLoading && (
            <div className='text-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto'></div>
              <p className='mt-4 text-gray-600'>Loading your organizer information...</p>
            </div>
          )}
          {!isLoading && (
          <>
          <div className='mb-8'>
            <StepIndicator
              currentStep={currentStep}
              totalSteps={totalSteps}
              labels={stepLabels}
            />
          </div>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8'>
            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div className='space-y-6'>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                    <BuildingIcon className='h-5 w-5 text-indigo-500 mr-2' />
                    Organization Information
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      label='Organization Name'
                      id='organizerName'
                      required
                      value={formData.organizerName}
                      onChange={handleInputChange}
                      error={errors.organizerName}
                    />
                    <FormField
                      label='Contact Name'
                      id='contactName'
                      required
                      value={formData.contactName}
                      onChange={handleInputChange}
                      error={errors.contactName}
                    />
                  </div>
                  <FormField
                    label='Email Address'
                    id='email'
                    type='email'
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    error={errors.email}
                    disabled={!!currentUser}
                  />
                  {!currentUser && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                      <FormField
                        label='Password'
                        id='password'
                        type='password'
                        required
                        value={formData.password}
                        onChange={handleInputChange}
                        error={errors.password}
                      />
                      <FormField
                        label='Confirm Password'
                        id='confirmPassword'
                        type='password'
                        required
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        error={errors.confirmPassword}
                      />
                    </div>
                  )}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      label='Phone Number'
                      id='phone'
                      type='tel'
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                    <FormField
                      label='Website'
                      id='website'
                      type='url'
                      value={formData.website}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <div className='md:col-span-1'>
                      <FormField
                        label='Address'
                        id='address'
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <FormField
                        label='Postal Code'
                        id='postalCode'
                        value={formData.postalCode}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <FormField
                        label='City'
                        id='city'
                        value={formData.city}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className='space-y-6'>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                    <CalendarIcon className='h-5 w-5 text-indigo-500 mr-2' />
                    Event Information
                  </h2>
                  <FormField
                    label='Event Name'
                    id='eventName'
                    required
                    value={formData.eventName}
                    onChange={handleInputChange}
                    error={errors.eventName}
                  />
                  <FormField
                    label='Event Type'
                    id='eventType'
                    type='select'
                    options={eventTypeOptions}
                    required
                    value={formData.eventType}
                    onChange={handleInputChange}
                    error={errors.eventType}
                  />
                  <FormField
                    label='Elevator Pitch'
                    id='elevatorPitch'
                    textarea
                    placeholder='Briefly describe your event in 1-2 sentences'
                    value={formData.elevatorPitch}
                    onChange={handleInputChange}
                  />
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      label='Event Frequency'
                      id='eventFrequency'
                      type='select'
                      options={eventFrequencyOptions}
                      required
                      value={formData.eventFrequency}
                      onChange={handleInputChange}
                      error={errors.eventFrequency}
                    />
                    <FormField
                      label='Event Date'
                      id='eventDate'
                      type='date'
                      value={formData.eventDate}
                      onChange={handleInputChange}
                    />
                  </div>
                  <FormField
                    label='Location'
                    id='location'
                    placeholder='Venue or location of the event'
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              {currentStep === 3 && (
                <div className='space-y-6'>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                    <UsersIcon className='h-5 w-5 text-indigo-500 mr-2' />
                    Audience Information
                  </h2>
                  <FormField
                    label='Expected Attendee Count'
                    id='attendeeCount'
                    type='select'
                    options={attendeeCountOptions}
                    required
                    value={formData.attendeeCount}
                    onChange={handleInputChange}
                    error={errors.attendeeCount}
                  />
                  <FormField
                    label='Audience Description'
                    id='audienceDescription'
                    textarea
                    required
                    placeholder='Describe your typical attendees, their interests, and demographics'
                    value={formData.audienceDescription}
                    onChange={handleInputChange}
                    error={errors.audienceDescription}
                  />
                  <div>
                    <label className='block text-sm font-medium text-gray-800 mb-2'>
                      Audience Age Demographics
                      {errors.audienceDemographics && (
                        <span className='text-red-500 ml-1 text-xs'>
                          {errors.audienceDemographics}
                        </span>
                      )}
                    </label>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                      {demographicOptions.map((demo) => (
                        <SelectionCard
                          key={demo.id}
                          id={demo.id}
                          label={demo.label}
                          icon={demo.icon}
                          isSelected={formData.audienceDemographics.includes(
                            demo.id
                          )}
                          onClick={() =>
                            handleMultiSelectChange(
                              'audienceDemographics',
                              demo.id
                            )
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <FormField
                    label='Sponsorship Needs'
                    id='sponsorshipNeeds'
                    textarea
                    placeholder="Describe what kinds of sponsors you're looking for and why"
                    value={formData.sponsorshipNeeds}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              {currentStep === 4 && (
                <div className='space-y-6'>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                    <BriefcaseIcon className='h-5 w-5 text-indigo-500 mr-2' />
                    Sponsorship Offerings
                  </h2>
                  <div>
                    <label className='block text-sm font-medium text-gray-800 mb-2'>
                      Are you seeking financial sponsorship?
                    </label>
                    <div className='grid grid-cols-2 gap-4'>
                      <SelectionCard
                        id='financial-yes'
                        label='Yes'
                        isSelected={
                          formData.seekingFinancialSponsorship === 'yes'
                        }
                        onClick={() =>
                          handleRadioChange(
                            'seekingFinancialSponsorship',
                            'yes'
                          )
                        }
                      />
                      <SelectionCard
                        id='financial-no'
                        label='No'
                        isSelected={
                          formData.seekingFinancialSponsorship === 'no'
                        }
                        onClick={() =>
                          handleRadioChange('seekingFinancialSponsorship', 'no')
                        }
                      />
                    </div>
                  </div>
                  {formData.seekingFinancialSponsorship === 'yes' && (
                    <>
                      <FormField
                        label='Financial Sponsorship Amount'
                        id='financialSponsorshipAmount'
                        placeholder='e.g., 50,000 SEK'
                        value={formData.financialSponsorshipAmount}
                        onChange={handleInputChange}
                      />
                      <FormField
                        label='What sponsors receive for financial support'
                        id='financialSponsorshipOffers'
                        textarea
                        placeholder='Describe what sponsors will receive in return for financial support'
                        value={formData.financialSponsorshipOffers}
                        onChange={handleInputChange}
                      />
                    </>
                  )}
                  <div>
                    <label className='block text-sm font-medium text-gray-800 mb-2'>
                      What can you offer sponsors?
                      {errors.offeringTypes && (
                        <span className='text-red-500 ml-1 text-xs'>
                          {errors.offeringTypes}
                        </span>
                      )}
                    </label>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                      {offeringTypes.map((type) => (
                        <SelectionCard
                          key={type.id}
                          id={type.id}
                          label={type.label}
                          description={type.description}
                          icon={type.icon}
                          isSelected={formData.offeringTypes.includes(type.id)}
                          onClick={() =>
                            handleMultiSelectChange('offeringTypes', type.id)
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {formData.offeringTypes.includes('brand_visibility') && (
                    <FormField
                      label='Brand Visibility Details'
                      id='brandVisibility'
                      textarea
                      placeholder='Describe how brands will be visible at your event'
                      value={formData.brandVisibility}
                      onChange={handleInputChange}
                    />
                  )}
                  {formData.offeringTypes.includes('content_creation') && (
                    <FormField
                      label='Content Creation Details'
                      id='contentCreation'
                      textarea
                      placeholder='Describe what kind of content you can create for sponsors'
                      value={formData.contentCreation}
                      onChange={handleInputChange}
                    />
                  )}
                  <div>
                    <label className='block text-sm font-medium text-gray-800 mb-2'>
                      Bonus Value
                    </label>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                      {bonusValueOptions.map((option) => (
                        <SelectionCard
                          key={option.id}
                          id={option.id}
                          label={option.label}
                          description={option.description}
                          icon={option.icon}
                          isSelected={formData.bonusValue.includes(option.id)}
                          onClick={() =>
                            handleMultiSelectChange('bonusValue', option.id)
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {formData.bonusValue.length > 0 && (
                    <FormField
                      label='Bonus Value Details'
                      id='bonusValueDetails'
                      textarea
                      placeholder='Provide more details about the bonus value you offer'
                      value={formData.bonusValueDetails}
                      onChange={handleInputChange}
                    />
                  )}
                  <FormField
                    label='Additional Information'
                    id='additionalInfo'
                    textarea
                    placeholder="Any other details you'd like to share with potential sponsors"
                    value={formData.additionalInfo}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              <div className='mt-8 flex justify-between'>
                {currentStep > 1 && (
                  <Button type='button' onClick={prevStep} variant='outline'>
                    Previous
                  </Button>
                )}
                {currentStep < totalSteps ? (
                  <Button
                    type='button'
                    onClick={nextStep}
                    variant='primary'
                    className='ml-auto'
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type='submit'
                    variant='primary'
                    className='ml-auto'
                    isLoading={isSubmitting}
                  >
                    {isSubmitting 
                      ? 'Submitting...' 
                      : currentUser 
                      ? 'Update Profile' 
                      : 'Complete Registration'}
                  </Button>
                )}
              </div>
            </form>
          </div>
          </>
          )}
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
    </Layout>
  )
}
