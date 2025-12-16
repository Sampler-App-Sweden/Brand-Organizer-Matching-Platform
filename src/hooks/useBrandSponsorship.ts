import { useEffect, useMemo, useState } from 'react'

import {
  createDefaultCustomMix,
  createDefaultDiscountDetails,
  createDefaultFinancialDetails,
  createDefaultOtherDetails,
  createDefaultProductDetails,
  SPONSORSHIP_TYPE_CONFIGS,
  SPONSORSHIP_TYPE_IDS,
  type SponsorshipTypeConfig
} from '../constants/brandSponsorship.constants'
import {
  fetchSponsorshipOffer,
  saveSponsorshipOffer
} from '../services/sponsorshipService'
import {
  type OfferCustomMix,
  type OfferDiscountDetails,
  type OfferFinancialDetails,
  type OfferOtherDetails,
  type OfferProductDetails,
  type SponsorshipTypeId
} from '../types/sponsorship'

type FeedbackState = { type: 'success' | 'error'; message: string } | null
export type SponsorshipType = SponsorshipTypeConfig & { percentage: number }

export function useBrandSponsorship(brandId?: string) {
  const [selectedTypes, setSelectedTypes] = useState<SponsorshipTypeId[]>([])
  const [productDetails, setProductDetails] = useState<OfferProductDetails>(
    () => createDefaultProductDetails()
  )
  const [discountDetails, setDiscountDetails] = useState<OfferDiscountDetails>(
    () => createDefaultDiscountDetails()
  )
  const [financialDetails, setFinancialDetails] =
    useState<OfferFinancialDetails>(() => createDefaultFinancialDetails())
  const [otherDetails, setOtherDetails] = useState<OfferOtherDetails>(() =>
    createDefaultOtherDetails()
  )
  const [customMix, setCustomMix] = useState<OfferCustomMix>(() =>
    createDefaultCustomMix()
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'draft' | 'published' | null>(null)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<FeedbackState>(null)

  useEffect(() => {
    if (!brandId) {
      setSelectedTypes([])
      setProductDetails(createDefaultProductDetails())
      setDiscountDetails(createDefaultDiscountDetails())
      setFinancialDetails(createDefaultFinancialDetails())
      setOtherDetails(createDefaultOtherDetails())
      setCustomMix(createDefaultCustomMix())
      setStatus(null)
      setUpdatedAt(null)
      setLoading(false)
      return
    }

    let isMounted = true

    const loadOffer = async () => {
      setLoading(true)
      try {
        const offer = await fetchSponsorshipOffer(brandId)
        if (!isMounted) return
        if (offer) {
          const sanitizedTypes = offer.selectedTypes.filter(
            (type): type is SponsorshipTypeId =>
              SPONSORSHIP_TYPE_IDS.includes(type as SponsorshipTypeId)
          )
          setSelectedTypes(sanitizedTypes)
          setProductDetails(offer.productDetails)
          setDiscountDetails(offer.discountDetails)
          setFinancialDetails(offer.financialDetails)
          setOtherDetails(offer.otherDetails)
          setCustomMix(offer.customMix)
          setStatus(offer.status)
          setUpdatedAt(offer.updatedAt)
        } else {
          setSelectedTypes([])
          setProductDetails(createDefaultProductDetails())
          setDiscountDetails(createDefaultDiscountDetails())
          setFinancialDetails(createDefaultFinancialDetails())
          setOtherDetails(createDefaultOtherDetails())
          setCustomMix(createDefaultCustomMix())
          setStatus(null)
          setUpdatedAt(null)
        }
        setFeedback(null)
      } catch (error) {
        console.error(error)
        if (isMounted) {
          setFeedback({
            type: 'error',
            message: 'Failed to load sponsorship offer. Please try again.'
          })
        }
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadOffer()
    return () => {
      isMounted = false
    }
  }, [brandId])

  const sponsorshipTypes: SponsorshipType[] = useMemo(
    () =>
      SPONSORSHIP_TYPE_CONFIGS.map((config) => ({
        ...config,
        percentage:
          config.id === 'other'
            ? 100
            : config.id in customMix
            ? customMix[config.id as keyof OfferCustomMix]
            : 0
      })),
    [customMix]
  )

  const handleTypeToggle = (typeId: SponsorshipTypeId) => {
    setFeedback(null)
    setSelectedTypes((prev) =>
      prev.includes(typeId)
        ? prev.filter((id) => id !== typeId)
        : [...prev, typeId]
    )
  }

  const handleCustomMixChange = (
    type: 'product' | 'discount' | 'financial',
    value: number
  ) => {
    const clamped = Math.max(0, Math.min(100, value))
    setCustomMix((prev) => {
      const otherKeys = (['product', 'discount', 'financial'] as const).filter(
        (key) => key !== type
      )
      const otherTotal = otherKeys.reduce((sum, key) => sum + prev[key], 0)
      const ratios =
        otherTotal === 0
          ? otherKeys.map(() => 1 / otherKeys.length)
          : otherKeys.map((key) => prev[key] / otherTotal)
      const remaining = 100 - clamped
      const firstValue = Math.round(remaining * ratios[0])
      const secondValue = remaining - firstValue
      const next: OfferCustomMix = {
        product: prev.product,
        discount: prev.discount,
        financial: prev.financial
      }
      next[type] = clamped
      next[otherKeys[0]] = firstValue
      next[otherKeys[1]] = secondValue
      return next
    })
  }

  const handleSave = async (nextStatus: 'draft' | 'published') => {
    if (!brandId || selectedTypes.length === 0) return
    setIsSubmitting(true)
    setFeedback(null)
    try {
      const payload = {
        selectedTypes,
        productDetails,
        discountDetails,
        financialDetails,
        otherDetails,
        customMix
      }
      const offer = await saveSponsorshipOffer(brandId, payload, nextStatus)
      const sanitizedTypes = offer.selectedTypes.filter(
        (type): type is SponsorshipTypeId =>
          SPONSORSHIP_TYPE_IDS.includes(type as SponsorshipTypeId)
      )
      setSelectedTypes(sanitizedTypes)
      setProductDetails(offer.productDetails)
      setDiscountDetails(offer.discountDetails)
      setFinancialDetails(offer.financialDetails)
      setOtherDetails(offer.otherDetails)
      setCustomMix(offer.customMix)
      setStatus(offer.status)
      setUpdatedAt(offer.updatedAt)
      setFeedback({
        type: 'success',
        message:
          nextStatus === 'draft'
            ? 'Draft saved successfully.'
            : 'Offer published successfully.'
      })
    } catch (error) {
      console.error(error)
      setFeedback({
        type: 'error',
        message: 'Failed to save sponsorship offer. Please try again.'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    customMix,
    discountDetails,
    feedback,
    financialDetails,
    handleCustomMixChange,
    handleSave,
    handleTypeToggle,
    isSubmitting,
    loading,
    otherDetails,
    productDetails,
    selectedTypes,
    setDiscountDetails,
    setFinancialDetails,
    setOtherDetails,
    setProductDetails,
    sponsorshipTypes,
    status,
    updatedAt
  }
}