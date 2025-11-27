import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabaseClient'

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

  // Fetch existing brand data if user is logged in
  useEffect(() => {
    const fetchBrandData = async () => {
      if (!currentUser) {
        setIsLoading(false)
        return
      }

      try {
        const { data: brandData, error } = await supabase
          .from('brands')
          .select('*')
          .eq('user_id', currentUser.id)
          .single()

        if (error) {
          if (error.code !== 'PGRST116') {
            console.error('Error fetching brand data:', error)
          }
          setIsLoading(false)
          return
        }

        if (brandData) {
          setFormData({
            companyName: brandData.company_name || '',
            contactName: brandData.contact_name || '',
            contactTitle: brandData.contact_title || '',
            email: brandData.email || currentUser.email,
            password: '',
            confirmPassword: '',
            phone: brandData.phone || '',
            website: brandData.website || '',
            address: brandData.address || '',
            postalCode: brandData.postal_code || '',
            city: brandData.city || '',
            industry: brandData.industry || '',
            productName: brandData.product_name || '',
            productDescription: brandData.product_description || '',
            productQuantity: brandData.product_quantity || '',
            targetAudience: brandData.target_audience || '',
            ageRange: brandData.age_range || '',
            sponsorshipType: brandData.sponsorship_type || [],
            marketingGoals: brandData.marketing_goals || '',
            budget: brandData.budget || '',
            eventMarketingBudget: brandData.event_marketing_budget || '',
            interestedInFinancialSponsorship:
              brandData.interested_in_financial_sponsorship || 'no',
            financialSponsorshipAmount:
              brandData.financial_sponsorship_amount || '',
            successMetrics: brandData.success_metrics || '',
            interestedInSamplingTools:
              brandData.interested_in_sampling_tools || 'no',
            hasTestPanels: brandData.has_test_panels || 'no',
            testPanelDetails: brandData.test_panel_details || '',
            additionalInfo: brandData.additional_info || ''
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
      let userId: string

      if (currentUser) {
        userId = currentUser.id

        const brandData = {
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

        const { data: existing } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', userId)
          .single()

        if (existing) {
          const { error: brandError } = await supabase
            .from('brands')
            .update(brandData)
            .eq('user_id', userId)

          if (brandError) {
            throw new Error(
              `Failed to update brand profile: ${brandError.message}`
            )
          }
        } else {
          const { error: brandError } = await supabase
            .from('brands')
            .insert([{ ...brandData, user_id: userId }])

          if (brandError) {
            throw new Error(
              `Failed to create brand profile: ${brandError.message}`
            )
          }
        }

        navigate('/dashboard/brand')
        return { success: true, message: 'Brand profile updated successfully!' }
      } else {
        const user = await register(
          formData.email,
          formData.password,
          'brand',
          formData.companyName
        )
        userId = user.id

        const { error: brandError } = await supabase.from('brands').insert([
          {
            user_id: userId,
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
          throw new Error(
            `Failed to create brand profile: ${brandError.message}`
          )
        }

        navigate('/dashboard/brand')
        return {
          success: true,
          message: 'Registration successful! Redirecting to dashboard...'
        }
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
