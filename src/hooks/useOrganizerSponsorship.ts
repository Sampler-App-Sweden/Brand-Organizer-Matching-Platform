import { useEffect, useState } from 'react'

import {
  type OrganizerAllocation,
  type OrganizerDiscountDetails,
  type OrganizerFinancialDetails,
  type OrganizerProductDetails,
  type OrganizerRequestPayload,
  type OrganizerRequestTypeId,
  type OrganizerSponsorshipRequest
} from '../types/sponsorship'
import {
  fetchOrganizerSponsorshipRequest,
  saveOrganizerSponsorshipRequest
} from '../services/sponsorshipService'

const defaultProductDetails: OrganizerProductDetails = {
  items: '',
  quantity: ''
}

const defaultDiscountDetails: OrganizerDiscountDetails = {
  targetLevel: '',
  expectedVolume: ''
}

const defaultFinancialDetails: OrganizerFinancialDetails = {
  minAmount: '',
  maxAmount: '',
  paymentWindow: 'before'
}

const defaultAllocation: OrganizerAllocation = {
  product: 33,
  discount: 33,
  financial: 34
}

type FeedbackState = { type: 'success' | 'error'; message: string } | null

export function useOrganizerSponsorship(organizerId?: string) {
  const [selectedTypes, setSelectedTypes] = useState<OrganizerRequestTypeId[]>(
    []
  )
  const [productDetails, setProductDetails] = useState<OrganizerProductDetails>(
    defaultProductDetails
  )
  const [discountDetails, setDiscountDetails] =
    useState<OrganizerDiscountDetails>(defaultDiscountDetails)
  const [financialDetails, setFinancialDetails] =
    useState<OrganizerFinancialDetails>(defaultFinancialDetails)
  const [allocation, setAllocation] =
    useState<OrganizerAllocation>(defaultAllocation)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'draft' | 'published' | null>(null)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<FeedbackState>(null)

  useEffect(() => {
    if (!organizerId) {
      resetState()
      setLoading(false)
      return
    }

    let isMounted = true

    const loadRequest = async () => {
      setLoading(true)
      try {
        const request = await fetchOrganizerSponsorshipRequest(organizerId)
        if (!isMounted) return
        if (request) {
          hydrateFromRequest(request)
        } else {
          resetState()
          setStatus(null)
          setUpdatedAt(null)
        }
        setFeedback(null)
      } catch (error) {
        console.error(error)
        if (isMounted) {
          setFeedback({
            type: 'error',
            message: 'Failed to load sponsorship request. Please try again.'
          })
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadRequest()
    return () => {
      isMounted = false
    }
  }, [organizerId])

  const resetState = () => {
    setSelectedTypes([])
    setProductDetails(defaultProductDetails)
    setDiscountDetails(defaultDiscountDetails)
    setFinancialDetails(defaultFinancialDetails)
    setAllocation(defaultAllocation)
    setStatus(null)
    setUpdatedAt(null)
  }

  const hydrateFromRequest = (request: OrganizerSponsorshipRequest) => {
    setSelectedTypes(request.selectedTypes)
    setProductDetails(request.productDetails)
    setDiscountDetails(request.discountDetails)
    setFinancialDetails(request.financialDetails)
    setAllocation(request.allocation)
    setStatus(request.status)
    setUpdatedAt(request.updatedAt)
  }

  const handleTypeToggle = (typeId: OrganizerRequestTypeId) => {
    setFeedback(null)
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    )
  }

  const handleAllocationChange = (
    type: 'product' | 'discount' | 'financial',
    value: number
  ) => {
    const remaining = 100 - value
    if (type === 'product') {
      const discountShare = Math.round(
        remaining *
          (allocation.discount /
            (allocation.discount + allocation.financial || 1))
      )
      setAllocation({
        product: value,
        discount: discountShare,
        financial: remaining - discountShare
      })
    } else if (type === 'discount') {
      const productShare = Math.round(
        remaining *
          (allocation.product /
            (allocation.product + allocation.financial || 1))
      )
      setAllocation({
        product: productShare,
        discount: value,
        financial: remaining - productShare
      })
    } else {
      const productShare = Math.round(
        remaining *
          (allocation.product / (allocation.product + allocation.discount || 1))
      )
      setAllocation({
        product: productShare,
        discount: remaining - productShare,
        financial: value
      })
    }
  }

  const handleSave = async (nextStatus: 'draft' | 'published') => {
    if (!organizerId || selectedTypes.length === 0) return
    setIsSubmitting(true)
    setFeedback(null)
    const payload: OrganizerRequestPayload = {
      selectedTypes,
      productDetails,
      discountDetails,
      financialDetails,
      allocation
    }
    try {
      const request = await saveOrganizerSponsorshipRequest(
        organizerId,
        payload,
        nextStatus
      )
      hydrateFromRequest(request)
      setFeedback({
        type: 'success',
        message:
          nextStatus === 'draft'
            ? 'Draft saved successfully.'
            : 'Request published successfully.'
      })
    } catch (error) {
      console.error(error)
      setFeedback({
        type: 'error',
        message: 'Failed to save sponsorship request. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    selectedTypes,
    productDetails,
    discountDetails,
    financialDetails,
    allocation,
    isSubmitting,
    loading,
    status,
    updatedAt,
    feedback,
    setProductDetails,
    setDiscountDetails,
    setFinancialDetails,
    setAllocation,
    handleTypeToggle,
    handleAllocationChange,
    handleSave
  }
}
