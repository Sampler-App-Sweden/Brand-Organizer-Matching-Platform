import { useState } from 'react'

import {
  CompanyStep,
  DetailsStep,
  ProductStep,
  SponsorshipStep
} from '../components/forms/brand'
import { Layout } from '../components/layout'
import { Button, LoadingSpinner, StepIndicator, Toast } from '../components/ui'
import { useBrandForm } from '../hooks/useBrandForm'

export function BrandForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [toast, setToast] = useState({
    isVisible: false,
    type: 'success' as 'success' | 'error' | 'info' | 'warning',
    message: ''
  })

  const {
    formData,
    errors,
    isLoading,
    isSubmitting,
    currentUser,
    handleInputChange,
    handleMultiSelectChange,
    handleRadioChange,
    validateStep,
    handleSubmit
  } = useBrandForm()

  const totalSteps = 4
  const stepLabels = ['Company', 'Product', 'Sponsorship', 'Details']
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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(currentStep)) return

    const result = await handleSubmit()
    setToast({
      isVisible: true,
      type: result.success ? 'success' : 'error',
      message: result.message
    })
  }
  return (
    <Layout>
      <div className='min-h-screen w-full bg-white'>
        <div className='max-w-3xl mx-auto px-0 py-6 md:px-4 md:py-12'>
          <div className='text-center mb-6 md:mb-8 px-4 md:px-0'>
            <h1 className='text-3xl font-bold text-gray-900 mb-2'>
              {currentUser ? 'Update Brand Profile' : 'Brand Registration'}
            </h1>
            <p className='text-gray-600'>
              {currentUser
                ? 'Update your brand information and sponsorship preferences'
                : 'Register your brand to discover perfect sponsorship opportunities'}
            </p>
          </div>
          {isLoading && (
            <div className='text-center py-12'>
              <LoadingSpinner size={48} className='mx-auto' />
              <p className='mt-4 text-gray-600'>
                Loading your brand information...
              </p>
            </div>
          )}
          {!isLoading && (
            <>
              <div className='mb-6 md:mb-8 px-4 md:px-0'>
                <StepIndicator
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  labels={stepLabels}
                />
              </div>
              <div className='bg-white md:rounded-lg md:shadow-sm md:border border-gray-200 p-4 md:p-6 lg:p-8'>
                <form onSubmit={onSubmit}>
                  {currentStep === 1 && (
                    <CompanyStep
                      formData={formData}
                      errors={errors}
                      currentUser={currentUser}
                      onChange={handleInputChange}
                    />
                  )}
                  {currentStep === 2 && (
                    <ProductStep
                      formData={formData}
                      errors={errors}
                      onChange={handleInputChange}
                    />
                  )}
                  {currentStep === 3 && (
                    <SponsorshipStep
                      formData={formData}
                      errors={errors}
                      onChange={handleInputChange}
                      onMultiSelect={handleMultiSelectChange}
                    />
                  )}
                  {currentStep === 4 && (
                    <DetailsStep
                      formData={formData}
                      errors={errors}
                      onChange={handleInputChange}
                      onRadioChange={handleRadioChange}
                    />
                  )}
                  <div className='mt-8 flex justify-between'>
                    {currentStep > 1 && (
                      <Button
                        type='button'
                        onClick={prevStep}
                        variant='outline'
                      >
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
