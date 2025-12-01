import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getBrandByUserId,
  saveBrand,
  updateBrand
} from '../services/dataService'

export interface BrandFormData {
  companyName: string
  contactName: string
  contactTitle: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  website: string
  address: string
  postalCode: string
  city: string
  industry: string
  productName: string
  productDescription: string
  productQuantity: string
  targetAudience: string
  ageRange: string
  sponsorshipType: string[]
  marketingGoals: string
  budget: string
  eventMarketingBudget: string
  interestedInFinancialSponsorship: string
  financialSponsorshipAmount: string
  successMetrics: string
  interestedInSamplingTools: string
  hasTestPanels: string
  testPanelDetails: string
  additionalInfo: string
}

const initialFormData: BrandFormData = {
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
  sponsorshipType: [],
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
}

export function useBrandForm() {
  const navigate = useNavigate()
  const { register, currentUser } = useAuth()
  const [formData, setFormData] = useState<BrandFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [existingBrandId, setExistingBrandId] = useState<string | null>(null)

  // Fetch existing brand data if user is logged in
  useEffect(() => {
    const fetchBrandData = async () => {
      if (!currentUser) {
        setIsLoading(false)
        return
      }

      try {
        const brand = await getBrandByUserId(currentUser.id)
        if (brand) {
          setExistingBrandId(brand.id)
          setFormData({
            companyName: brand.companyName || '',
            contactName: brand.contactName || '',
            contactTitle: brand.contactTitle || '',
            email: brand.email || currentUser.email,
            password: '',
            confirmPassword: '',
            phone: brand.phone || '',
            website: brand.website || '',
            address: brand.address || '',
            postalCode: brand.postalCode || '',
            city: brand.city || '',
            industry: brand.industry || '',
            productName: brand.productName || '',
            productDescription: brand.productDescription || '',
            productQuantity: brand.productQuantity || '',
            targetAudience: brand.targetAudience || '',
            ageRange: brand.ageRange || '',
            sponsorshipType: brand.sponsorshipType || [],
            marketingGoals: brand.marketingGoals || '',
            budget: brand.budget || '',
            eventMarketingBudget: brand.eventMarketingBudget || '',
            interestedInFinancialSponsorship:
              brand.interestedInFinancialSponsorship || 'no',
            financialSponsorshipAmount: brand.financialSponsorshipAmount || '',
            successMetrics: brand.successMetrics || '',
            interestedInSamplingTools: brand.interestedInSamplingTools || 'no',
            hasTestPanels: brand.hasTestPanels || 'no',
            testPanelDetails: brand.testPanelDetails || '',
            additionalInfo: brand.additionalInfo || ''
          })
        }
      } catch (error) {
        console.error('Error loading brand data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBrandData()
  }, [currentUser])

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
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
      return { ...prev, [name]: currentValues }
    })
  }

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
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

      if (!currentUser) {
        if (!formData.password.trim())
          newErrors.password = 'Password is required'
        else if (formData.password.length < 6)
          newErrors.password = 'Password must be at least 6 characters'
        if (formData.password !== formData.confirmPassword)
          newErrors.confirmPassword = 'Passwords do not match'
      }
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

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      let userId = currentUser?.id ?? ''

      if (!currentUser) {
        const user = await register(
          formData.email,
          formData.password,
          'brand',
          formData.companyName
        )
        userId = user.id
      }

      const brandPayload = {
        userId,
        companyName: formData.companyName,
        contactName: formData.contactName,
        contactTitle: formData.contactTitle,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        industry: formData.industry,
        productName: formData.productName,
        productDescription: formData.productDescription,
        productQuantity: formData.productQuantity,
        targetAudience: formData.targetAudience,
        ageRange: formData.ageRange,
        sponsorshipType: formData.sponsorshipType,
        marketingGoals: formData.marketingGoals,
        budget: formData.budget,
        eventMarketingBudget: formData.eventMarketingBudget,
        interestedInFinancialSponsorship:
          formData.interestedInFinancialSponsorship,
        financialSponsorshipAmount: formData.financialSponsorshipAmount,
        successMetrics: formData.successMetrics,
        interestedInSamplingTools: formData.interestedInSamplingTools,
        hasTestPanels: formData.hasTestPanels,
        testPanelDetails: formData.testPanelDetails,
        additionalInfo: formData.additionalInfo
      }

      if (currentUser) {
        if (existingBrandId) {
          await updateBrand(existingBrandId, brandPayload)
          navigate('/dashboard/brand')
          return {
            success: true,
            message: 'Brand profile updated successfully!'
          }
        }

        const createdBrand = await saveBrand(brandPayload)
        setExistingBrandId(createdBrand.id)
        navigate('/dashboard/brand')
        return {
          success: true,
          message: 'Brand profile created successfully!'
        }
      }

      await saveBrand(brandPayload)
      navigate('/dashboard/brand')
      return {
        success: true,
        message: 'Registration successful! Redirecting to dashboard...'
      }
    } catch (error) {
      console.error('Submit error:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : 'An error occurred'
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
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
  }
}
