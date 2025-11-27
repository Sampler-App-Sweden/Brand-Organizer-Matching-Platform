import React, { useEffect, useState } from 'react'
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
import {
  BuildingIcon,
  UserIcon,
  PhoneIcon,
  GlobeIcon,
  BriefcaseIcon,
  TargetIcon,
  DollarSignIcon,
  CheckCircleIcon,
  PackageIcon,
  BadgePercentIcon,
  UsersIcon,
  BarChart3Icon
} from 'lucide-react'
import { supabase } from '../services/supabaseClient'
export function BrandForm() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    contactTitle: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    website: '',
    address: '',
    postalCode: '',
    city: '',
    industry: '',
    productName: '',
    productDescription: '',
    productQuantity: '',
    targetAudience: '',
    ageRange: '',
    sponsorshipType: [] as string[],
    marketingGoals: '',
    budget: '',
    eventMarketingBudget: '',
    interestedInFinancialSponsorship: 'no',
    financialSponsorshipAmount: '',
    successMetrics: '',
    interestedInSamplingTools: 'no',
    hasTestPanels: 'no',
    testPanelDetails: '',
    additionalInfo: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState({
    isVisible: false,
    type: 'success' as 'success' | 'error' | 'info' | 'warning',
    message: ''
  })
  const totalSteps = 4
  const stepLabels = ['Company', 'Product', 'Sponsorship', 'Details']
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
      if (!formData.companyName.trim())
        newErrors.companyName = 'Company name is required'
      if (!formData.contactName.trim())
        newErrors.contactName = 'Contact name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = 'Email is invalid'
      if (!formData.password.trim()) newErrors.password = 'Password is required'
      else if (formData.password.length < 6)
        newErrors.password = 'Password must be at least 6 characters'
      if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = 'Passwords do not match'
    } else if (step === 2) {
      if (!formData.industry) newErrors.industry = 'Industry is required'
      if (!formData.productName.trim())
        newErrors.productName = 'Product name is required'
      if (!formData.productDescription.trim())
        newErrors.productDescription = 'Product description is required'
    } else if (step === 3) {
      if (formData.sponsorshipType.length === 0)
        newErrors.sponsorshipType = 'Select at least one sponsorship type'
      if (!formData.budget) newErrors.budget = 'Budget range is required'
      if (!formData.targetAudience.trim())
        newErrors.targetAudience = 'Target audience is required'
      if (!formData.ageRange) newErrors.ageRange = 'Age range is required'
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
      // In a real app, this would be an API call
      // For now, we'll simulate a delay and save to localStorage
      await new Promise((resolve) => setTimeout(resolve, 1500))
      // Register the user
      const user = await register(
        formData.email,
        formData.password,
        'brand',
        formData.companyName
      )
      // Save brand data
      // Insert brand data into Supabase
      const { error: brandError } = await supabase.from('brands').insert([
        {
          user_id: user.id,
          company_name: formData.companyName,
          contact_name: formData.contactName,
          contact_title: formData.contactTitle,
          email: formData.email,
          phone: formData.phone,
          website: formData.website,
          address: formData.address,
          postal_code: formData.postalCode,
          city: formData.city,
          industry: formData.industry,
          product_name: formData.productName,
          product_description: formData.productDescription,
          product_quantity: formData.productQuantity,
          target_audience: formData.targetAudience,
          age_range: formData.ageRange,
          sponsorship_type: formData.sponsorshipType,
          marketing_goals: formData.marketingGoals,
          budget: formData.budget,
          event_marketing_budget: formData.eventMarketingBudget,
          interested_in_financial_sponsorship:
            formData.interestedInFinancialSponsorship,
          financial_sponsorship_amount: formData.financialSponsorshipAmount,
          success_metrics: formData.successMetrics,
          interested_in_sampling_tools: formData.interestedInSamplingTools,
          has_test_panels: formData.hasTestPanels,
          test_panel_details: formData.testPanelDetails,
          additional_info: formData.additionalInfo
        }
      ])

      if (brandError) {
        throw new Error(`Failed to create brand profile: ${brandError.message}`)
      }

      // Update profile with additional details
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: formData.companyName,
          phone: formData.phone,
          description: formData.productDescription,
          logo_url: formData.website
        })
        .eq('id', user.id)

      if (profileError) {
        console.warn('Failed to update profile:', profileError)
      }
      setToast({
        isVisible: true,
        type: 'success',
        message: 'Registration successful! Redirecting to dashboard...'
      })
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/dashboard/brand')
      }, 2000)
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
  const industryOptions = [
    {
      value: 'food_beverage',
      label: 'Food & Beverage'
    },
    {
      value: 'beauty_cosmetics',
      label: 'Beauty & Cosmetics'
    },
    {
      value: 'health_wellness',
      label: 'Health & Wellness'
    },
    {
      value: 'tech',
      label: 'Technology'
    },
    {
      value: 'fashion',
      label: 'Fashion & Apparel'
    },
    {
      value: 'home_goods',
      label: 'Home Goods'
    },
    {
      value: 'sports_fitness',
      label: 'Sports & Fitness'
    },
    {
      value: 'entertainment',
      label: 'Entertainment'
    }
  ]
  const ageRangeOptions = [
    {
      value: 'under_18',
      label: 'Under 18'
    },
    {
      value: '18-24',
      label: '18-24'
    },
    {
      value: '25-34',
      label: '25-34'
    },
    {
      value: '35-44',
      label: '35-44'
    },
    {
      value: '45-54',
      label: '45-54'
    },
    {
      value: '55_plus',
      label: '55+'
    },
    {
      value: 'all',
      label: 'All ages'
    }
  ]
  const budgetOptions = [
    {
      value: 'under_10000',
      label: 'Under 10,000 SEK'
    },
    {
      value: '10000_50000',
      label: '10,000 - 50,000 SEK'
    },
    {
      value: '50000_100000',
      label: '50,000 - 100,000 SEK'
    },
    {
      value: '100000_250000',
      label: '100,000 - 250,000 SEK'
    },
    {
      value: '250000_plus',
      label: 'Over 250,000 SEK'
    }
  ]
  const sponsorshipTypes = [
    {
      id: 'product_sampling',
      label: 'Product Sampling',
      description: 'Distribute product samples at events',
      icon: <PackageIcon className='h-5 w-5' />
    },
    {
      id: 'financial_sponsorship',
      label: 'Financial Sponsorship',
      description: 'Provide monetary support for events',
      icon: <DollarSignIcon className='h-5 w-5' />
    },
    {
      id: 'in_kind_goods',
      label: 'In-Kind Goods',
      description: 'Provide products or services as sponsorship',
      icon: <BadgePercentIcon className='h-5 w-5' />
    },
    {
      id: 'merchandise',
      label: 'Merchandise',
      description: 'Provide branded merchandise for events',
      icon: <BriefcaseIcon className='h-5 w-5' />
    },
    {
      id: 'experience',
      label: 'Brand Experience',
      description: 'Create interactive brand experiences',
      icon: <UsersIcon className='h-5 w-5' />
    }
  ]
  return (
    <Layout>
      <div className='min-h-screen w-full bg-white'>
        <div className='max-w-3xl mx-auto px-4 py-12'>
          <div className='text-center mb-8'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              Brand Registration
            </h1>
            <p className='text-gray-600'>
              Register your brand to discover perfect sponsorship opportunities
            </p>
          </div>
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
                    Company Information
                  </h2>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      label='Company Name'
                      id='companyName'
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      error={errors.companyName}
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
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <FormField
                      label='Contact Title/Position'
                      id='contactTitle'
                      value={formData.contactTitle}
                      onChange={handleInputChange}
                    />
                    <FormField
                      label='Phone Number'
                      id='phone'
                      type='tel'
                      value={formData.phone}
                      onChange={handleInputChange}
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
                  />
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
                  <FormField
                    label='Website'
                    id='website'
                    type='url'
                    value={formData.website}
                    onChange={handleInputChange}
                  />
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
                    <PackageIcon className='h-5 w-5 text-indigo-500 mr-2' />
                    Product Information
                  </h2>
                  <FormField
                    label='Industry'
                    id='industry'
                    type='select'
                    options={industryOptions}
                    required
                    value={formData.industry}
                    onChange={handleInputChange}
                    error={errors.industry}
                  />
                  <FormField
                    label='Product Name'
                    id='productName'
                    required
                    value={formData.productName}
                    onChange={handleInputChange}
                    error={errors.productName}
                  />
                  <FormField
                    label='Product Description'
                    id='productDescription'
                    textarea
                    required
                    value={formData.productDescription}
                    onChange={handleInputChange}
                    error={errors.productDescription}
                    helpText='Describe your product, its features, and what makes it unique'
                  />
                  <FormField
                    label='Product Quantity Available for Sampling'
                    id='productQuantity'
                    placeholder='e.g., 500 samples, 1000 units, etc.'
                    value={formData.productQuantity}
                    onChange={handleInputChange}
                  />
                </div>
              )}
              {currentStep === 3 && (
                <div className='space-y-6'>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                    <TargetIcon className='h-5 w-5 text-indigo-500 mr-2' />
                    Sponsorship Details
                  </h2>
                  <div>
                    <label className='block text-sm font-medium text-gray-800 mb-2'>
                      Sponsorship Type
                      {errors.sponsorshipType && (
                        <span className='text-red-500 ml-1 text-xs'>
                          {errors.sponsorshipType}
                        </span>
                      )}
                    </label>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      {sponsorshipTypes.map((type) => (
                        <SelectionCard
                          key={type.id}
                          id={type.id}
                          label={type.label}
                          description={type.description}
                          icon={type.icon}
                          isSelected={formData.sponsorshipType.includes(
                            type.id
                          )}
                          onClick={() =>
                            handleMultiSelectChange('sponsorshipType', type.id)
                          }
                        />
                      ))}
                    </div>
                  </div>
                  <FormField
                    label='Target Audience'
                    id='targetAudience'
                    textarea
                    required
                    placeholder='Describe your ideal customer or audience'
                    value={formData.targetAudience}
                    onChange={handleInputChange}
                    error={errors.targetAudience}
                  />
                  <FormField
                    label='Target Age Range'
                    id='ageRange'
                    type='select'
                    options={ageRangeOptions}
                    required
                    value={formData.ageRange}
                    onChange={handleInputChange}
                    error={errors.ageRange}
                  />
                  <FormField
                    label='Marketing Goals'
                    id='marketingGoals'
                    textarea
                    placeholder='What do you hope to achieve through event sponsorships?'
                    value={formData.marketingGoals}
                    onChange={handleInputChange}
                  />
                  <FormField
                    label='Sponsorship Budget Range'
                    id='budget'
                    type='select'
                    options={budgetOptions}
                    required
                    value={formData.budget}
                    onChange={handleInputChange}
                    error={errors.budget}
                  />
                </div>
              )}
              {currentStep === 4 && (
                <div className='space-y-6'>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4 flex items-center'>
                    <BarChart3Icon className='h-5 w-5 text-indigo-500 mr-2' />
                    Additional Details
                  </h2>
                  <div>
                    <label className='block text-sm font-medium text-gray-800 mb-2'>
                      Are you interested in financial sponsorship opportunities?
                    </label>
                    <div className='grid grid-cols-2 gap-4'>
                      <SelectionCard
                        id='financial-yes'
                        label='Yes'
                        isSelected={
                          formData.interestedInFinancialSponsorship === 'yes'
                        }
                        onClick={() =>
                          handleRadioChange(
                            'interestedInFinancialSponsorship',
                            'yes'
                          )
                        }
                      />
                      <SelectionCard
                        id='financial-no'
                        label='No'
                        isSelected={
                          formData.interestedInFinancialSponsorship === 'no'
                        }
                        onClick={() =>
                          handleRadioChange(
                            'interestedInFinancialSponsorship',
                            'no'
                          )
                        }
                      />
                    </div>
                  </div>
                  {formData.interestedInFinancialSponsorship === 'yes' && (
                    <FormField
                      label='Financial Sponsorship Amount'
                      id='financialSponsorshipAmount'
                      placeholder='e.g., 50,000 SEK'
                      value={formData.financialSponsorshipAmount}
                      onChange={handleInputChange}
                    />
                  )}
                  <FormField
                    label='Success Metrics'
                    id='successMetrics'
                    textarea
                    placeholder='How will you measure the success of your sponsorship?'
                    value={formData.successMetrics}
                    onChange={handleInputChange}
                  />
                  <div>
                    <label className='block text-sm font-medium text-gray-800 mb-2'>
                      Are you interested in product sampling tools?
                    </label>
                    <div className='grid grid-cols-2 gap-4'>
                      <SelectionCard
                        id='sampling-yes'
                        label='Yes'
                        isSelected={
                          formData.interestedInSamplingTools === 'yes'
                        }
                        onClick={() =>
                          handleRadioChange('interestedInSamplingTools', 'yes')
                        }
                      />
                      <SelectionCard
                        id='sampling-no'
                        label='No'
                        isSelected={formData.interestedInSamplingTools === 'no'}
                        onClick={() =>
                          handleRadioChange('interestedInSamplingTools', 'no')
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className='block text-sm font-medium text-gray-800 mb-2'>
                      Do you have upcoming test panels or sampling
                      opportunities?
                    </label>
                    <div className='grid grid-cols-2 gap-4'>
                      <SelectionCard
                        id='testpanel-yes'
                        label='Yes'
                        isSelected={formData.hasTestPanels === 'yes'}
                        onClick={() =>
                          handleRadioChange('hasTestPanels', 'yes')
                        }
                      />
                      <SelectionCard
                        id='testpanel-no'
                        label='No'
                        isSelected={formData.hasTestPanels === 'no'}
                        onClick={() => handleRadioChange('hasTestPanels', 'no')}
                      />
                    </div>
                  </div>
                  {formData.hasTestPanels === 'yes' && (
                    <FormField
                      label='Test Panel Details'
                      id='testPanelDetails'
                      textarea
                      placeholder='Describe your upcoming test panels or sampling opportunities'
                      value={formData.testPanelDetails}
                      onChange={handleInputChange}
                    />
                  )}
                  <FormField
                    label='Additional Information'
                    id='additionalInfo'
                    textarea
                    placeholder="Any other details you'd like to share"
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
                    {isSubmitting ? 'Submitting...' : 'Complete Registration'}
                  </Button>
                )}
              </div>
            </form>
          </div>
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
