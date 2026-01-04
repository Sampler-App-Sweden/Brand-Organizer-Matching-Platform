import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  getOrganizerByUserId,
  saveOrganizer,
  updateOrganizer
} from '../services/dataService'
import { createEvent, fetchOrganizerEvents } from '../services/eventsService'
import type { Organizer } from '../types'
import type { CreateEventInput } from '../types/event'

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
  customEventType: string
  elevatorPitch: string
  eventFrequency: string
  eventDate: string
  location: string
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
  eventName: '',
  eventType: '',
  customEventType: '',
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
            eventName: organizer.eventName || '',
            eventType: organizer.eventType || '',
            customEventType: organizer.customEventType || '',
            elevatorPitch: organizer.elevatorPitch || '',
            eventFrequency: organizer.eventFrequency || '',
            eventDate: organizer.eventDate || '',
            location: organizer.location || '',
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
      if (!formData.eventName.trim())
        newErrors.eventName = 'Event name is required'
      if (!formData.eventType) newErrors.eventType = 'Event type is required'
      if (formData.eventType === 'other' && !formData.customEventType.trim())
        newErrors.customEventType = 'Custom event type is required'
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

  // Helper function to create initial event from organizer form data
  const createInitialEvent = async (organizerId: string) => {
    // Only create event if we have event data
    if (!formData.eventName.trim()) {
      return
    }

    // Check if organizer already has events
    try {
      const existingEvents = await fetchOrganizerEvents(organizerId)
      if (existingEvents.length > 0) {
        // Organizer already has events, don't create another one
        return
      }
    } catch (error) {
      console.error('Error checking existing events:', error)
      // Continue with event creation even if check fails
    }

    // Determine the event type display name
    const eventTypeDisplay =
      formData.eventType === 'other'
        ? formData.customEventType
        : formData.eventType

    // Map frequency to recurring concept
    const isRecurring = formData.eventFrequency !== 'one-time'
    const recurringConcept = {
      isRecurring,
      frequency: isRecurring ? formData.eventFrequency : undefined
    }

    // Create event dates array
    const eventDates = formData.eventDate
      ? [{ date: formData.eventDate, description: eventTypeDisplay }]
      : []

    // Map attendee count to physical reach
    const physicalReach = {
      signups: '',
      attendees: formData.attendeeCount || '',
      waitlist: ''
    }

    // Create the event input
    const eventInput: CreateEventInput = {
      eventName: formData.eventName,
      slogan: formData.elevatorPitch || `${eventTypeDisplay} in ${formData.city}`,
      essence:
        formData.elevatorPitch ||
        `${formData.eventName} is a ${eventTypeDisplay.toLowerCase()} event${formData.location ? ` held at ${formData.location}` : ''}.`,
      concept: `${eventTypeDisplay} event bringing together the community${formData.location ? ` at ${formData.location}` : ''}.`,
      setup: formData.location || 'To be determined',
      positioning: '',
      eventDates,
      recurringConcept,
      corePillars: eventTypeDisplay ? [eventTypeDisplay] : [],
      audienceDescription: formData.audienceDescription || '',
      physicalReach,
      digitalChannels: [],
      pastEvents: { totalEventsHosted: '' },
      eventMedia: { images: [], description: '' },
      partnerships: [],
      applicationLink: '',
      totalEventBudget: ''
    }

    try {
      await createEvent(organizerId, eventInput, 'draft')
      console.log('Initial event created successfully')
    } catch (error) {
      console.error('Failed to create initial event:', error)
      // Don't throw error - we don't want to block registration if event creation fails
    }
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
        eventName: formData.eventName,
        eventType: formData.eventType,
        customEventType: formData.customEventType,
        elevatorPitch: formData.elevatorPitch,
        eventFrequency: formData.eventFrequency,
        eventDate: formData.eventDate,
        location: formData.location,
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

        const createdOrganizer = await saveOrganizer(organizerPayload)
        setExistingOrganizerId(createdOrganizer.id)

        // Create initial event from form data
        await createInitialEvent(createdOrganizer.id)

        navigate('/dashboard/organizer')
        return {
          success: true,
          message: 'Organizer profile created successfully!'
        }
      }

      const savedOrganizer = await saveOrganizer(organizerPayload)

      // Create initial event from form data
      await createInitialEvent(savedOrganizer.id)

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
