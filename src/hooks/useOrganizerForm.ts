import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabaseClient'

export interface OrganizerFormData {
  organizerName: string
  contactName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  website: string
  address: string
  postalCode: string
  city: string
  eventName: string
  eventType: string
  elevatorPitch: string
  eventFrequency: string
  eventDate: string
  location: string
  attendeeCount: string
  audienceDescription: string
  audienceDemographics: string[]
  sponsorshipNeeds: string
  seekingFinancialSponsorship: string
  financialSponsorshipAmount: string
  financialSponsorshipOffers: string
  offeringTypes: string[]
  brandVisibility: string
  contentCreation: string
  leadGeneration: string
  productFeedback: string
  bonusValue: string[]
  bonusValueDetails: string
  additionalInfo: string
  mediaFiles: File[]
}

const initialFormData: OrganizerFormData = {
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
  audienceDemographics: [],
  sponsorshipNeeds: '',
  seekingFinancialSponsorship: 'no',
  financialSponsorshipAmount: '',
  financialSponsorshipOffers: '',
  offeringTypes: [],
  brandVisibility: '',
  contentCreation: '',
  leadGeneration: '',
  productFeedback: '',
  bonusValue: [],
  bonusValueDetails: '',
  additionalInfo: '',
  mediaFiles: []
}

export function useOrganizerForm() {
  const navigate = useNavigate()
  const { register, currentUser } = useAuth()
  const [formData, setFormData] = useState<OrganizerFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch existing organizer data
  useEffect(() => {
    const fetchOrganizerData = async () => {
      if (!currentUser) {
        setIsLoading(false)
        return
      }

      try {
        const { data: organizerData, error: organizerError } = await supabase
          .from('organizers')
          .select('*')
          .eq('user_id', currentUser.id)
          .single()

        if (organizerError) {
          if (organizerError.code === 'PGRST116') {
            console.log('No existing organizer profile found')
          } else {
            console.error('Error fetching organizer data:', organizerError)
          }
          setIsLoading(false)
          return
        }

        if (organizerData) {
          setFormData({
            organizerName: organizerData.organizer_name || '',
            contactName: organizerData.contact_name || '',
            email: currentUser.email || '',
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
            seekingFinancialSponsorship: organizerData.seeking_financial_sponsorship || 'no',
            financialSponsorshipAmount: organizerData.financial_sponsorship_amount || '',
            financialSponsorshipOffers: organizerData.financial_sponsorship_offers || '',
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
        console.error('Unexpected error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrganizerData()
  }, [currentUser])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
      if (!formData.organizerName.trim()) newErrors.organizerName = 'Organization name is required'
      if (!formData.contactName.trim()) newErrors.contactName = 'Contact name is required'

      if (!currentUser) {
        if (!formData.password.trim()) newErrors.password = 'Password is required'
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
      }
    } else if (step === 2) {
      if (!formData.eventName.trim()) newErrors.eventName = 'Event name is required'
      if (!formData.eventType) newErrors.eventType = 'Event type is required'
      if (!formData.eventFrequency) newErrors.eventFrequency = 'Event frequency is required'
    } else if (step === 3) {
      if (!formData.attendeeCount) newErrors.attendeeCount = 'Attendee count is required'
      if (!formData.audienceDescription.trim()) newErrors.audienceDescription = 'Audience description is required'
      if (formData.audienceDemographics.length === 0) newErrors.audienceDemographics = 'Select at least one demographic'
    } else if (step === 4) {
      if (formData.offeringTypes.length === 0) newErrors.offeringTypes = 'Select at least one offering type'
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

        const organizerData = {
          organizer_name: formData.organizerName,
          contact_name: formData.contactName,
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

        const { error: organizerError } = await supabase
          .from('organizers')
          .upsert({ ...organizerData, user_id: userId }, { onConflict: 'user_id' })

        if (organizerError) {
          throw new Error(`Failed to save organizer profile: ${organizerError.message}`)
        }

        navigate('/dashboard/organizer')
        return { success: true, message: 'Organizer profile updated successfully!' }
      } else {
        const user = await register(formData.email, formData.password, 'organizer', formData.organizerName)
        userId = user.id

        const { error: organizerError } = await supabase.from('organizers').insert([
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
          throw new Error(`Failed to create organizer profile: ${organizerError.message}`)
        }

        navigate('/dashboard/organizer')
        return { success: true, message: 'Registration successful! Redirecting to dashboard...' }
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