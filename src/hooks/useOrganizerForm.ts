import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getOrganizerByUserId,
  saveOrganizer,
  updateOrganizer
} from '../services/dataService'
import type { Organizer } from '../types'

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
  attendeeCount: string
  audienceDescription: string
  audienceDemographics: string[]
  sponsorshipNeeds: string
  seekingFinancialSponsorship: Organizer['seekingFinancialSponsorship']
  financialSponsorshipAmount: string
  financialSponsorshipOffers: string
  offeringTypes: string[]
  brandVisibility: string
  productSampling: string
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
  attendeeCount: '',
  audienceDescription: '',
  audienceDemographics: [],
  sponsorshipNeeds: '',
  seekingFinancialSponsorship: 'no',
  financialSponsorshipAmount: '',
  financialSponsorshipOffers: '',
  offeringTypes: [],
  brandVisibility: '',
  productSampling: '',
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
  const [existingOrganizerId, setExistingOrganizerId] = useState<string | null>(
    null
  )

  // Fetch existing organizer data
  useEffect(() => {
    const fetchOrganizerData = async () => {
      if (!currentUser) {
        setIsLoading(false)
        return
      }

      try {
        const organizer = await getOrganizerByUserId(currentUser.id)
        if (organizer) {
          setExistingOrganizerId(organizer.id)
          setFormData({
            organizerName: organizer.organizerName || '',
            contactName: organizer.contactName || '',
            email: currentUser.email || '',
            password: '',
            confirmPassword: '',
            phone: organizer.phone || '',
            website: organizer.website || '',
            address: organizer.address || '',
            postalCode: organizer.postalCode || '',
            city: organizer.city || '',
            attendeeCount: organizer.attendeeCount || '',
            audienceDescription: organizer.audienceDescription || '',
            audienceDemographics: organizer.audienceDemographics || [],
            sponsorshipNeeds: organizer.sponsorshipNeeds || '',
            seekingFinancialSponsorship:
              organizer.seekingFinancialSponsorship || 'no',
            financialSponsorshipAmount:
              organizer.financialSponsorshipAmount || '',
            financialSponsorshipOffers:
              organizer.financialSponsorshipOffers || '',
            offeringTypes: organizer.offeringTypes || [],
            brandVisibility: organizer.brandVisibility || '',
            productSampling: organizer.productSampling || '',
            contentCreation: organizer.contentCreation || '',
            leadGeneration: organizer.leadGeneration || '',
            productFeedback: organizer.productFeedback || '',
            bonusValue: organizer.bonusValue || [],
            bonusValueDetails: organizer.bonusValueDetails || '',
            additionalInfo: organizer.additionalInfo || '',
            mediaFiles: []
          })
        } else {
          // No existing organizer - populate email from currentUser
          setFormData((prev) => ({
            ...prev,
            email: currentUser.email || ''
          }))
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
      if (!formData.organizerName.trim())
        newErrors.organizerName = 'Organization name is required'
      if (!formData.contactName.trim())
        newErrors.contactName = 'Contact name is required'
      if (!formData.city.trim())
        newErrors.city = 'City is required'

      if (!currentUser) {
        if (!formData.password.trim())
          newErrors.password = 'Password is required'
        else if (formData.password.length < 6)
          newErrors.password = 'Password must be at least 6 characters'
        if (formData.password !== formData.confirmPassword)
          newErrors.confirmPassword = 'Passwords do not match'
      }
    } else if (step === 2) {
      if (!formData.attendeeCount)
        newErrors.attendeeCount = 'Attendee count is required'
      if (!formData.audienceDescription.trim())
        newErrors.audienceDescription = 'Audience description is required'
      if (formData.audienceDemographics.length === 0)
        newErrors.audienceDemographics = 'Select at least one demographic'
    } else if (step === 3) {
      if (formData.offeringTypes.length === 0)
        newErrors.offeringTypes = 'Select at least one offering type'
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
          'organizer',
          formData.organizerName
        )
        userId = user.id
      }

      const organizerPayload = {
        userId,
        organizerName: formData.organizerName,
        contactName: formData.contactName,
        email: formData.email,
        phone: formData.phone,
        website: formData.website,
        address: formData.address,
        postalCode: formData.postalCode,
        city: formData.city,
        // Event fields removed from registration - set as empty
        eventName: '',
        eventType: '',
        customEventType: '',
        elevatorPitch: '',
        eventFrequency: '',
        eventDate: '',
        location: '',
        // Audience and offering fields
        attendeeCount: formData.attendeeCount,
        audienceDescription: formData.audienceDescription,
        audienceDemographics: formData.audienceDemographics,
        sponsorshipNeeds: formData.sponsorshipNeeds,
        seekingFinancialSponsorship: formData.seekingFinancialSponsorship,
        financialSponsorshipAmount: formData.financialSponsorshipAmount,
        financialSponsorshipOffers: formData.financialSponsorshipOffers,
        offeringTypes: formData.offeringTypes,
        brandVisibility: formData.brandVisibility,
        productSampling: formData.productSampling,
        contentCreation: formData.contentCreation,
        leadGeneration: formData.leadGeneration,
        productFeedback: formData.productFeedback,
        bonusValue: formData.bonusValue,
        bonusValueDetails: formData.bonusValueDetails,
        additionalInfo: formData.additionalInfo,
        mediaFiles: []
      }

      if (currentUser) {
        if (existingOrganizerId) {
          await updateOrganizer(existingOrganizerId, organizerPayload)
          navigate('/dashboard/organizer')
          return {
            success: true,
            message: 'Organizer profile updated successfully!'
          }
        }

        await saveOrganizer(organizerPayload)
        navigate('/dashboard/organizer')
        return {
          success: true,
          message: 'Organizer profile created successfully!'
        }
      }

      await saveOrganizer(organizerPayload)
      navigate('/dashboard/organizer')
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
