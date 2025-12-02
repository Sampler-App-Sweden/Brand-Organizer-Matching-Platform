export type SponsorshipStatus = 'online' | 'offline'

export interface ProductImage {
  id: string
  url: string
  file?: File
}

export interface SponsorshipProduct {
  id: string
  name: string
  images: ProductImage[]
  goals: string
  quantity: number
  unit: string
  details?: string
  status: SponsorshipStatus
  order: number
}

export interface ProductSponsorshipManagerProps {
  brandId?: string
  onSave?: (products: SponsorshipProduct[]) => void
}

export type SponsorshipTypeId = 'product' | 'discount' | 'financial' | 'custom'

export interface OfferProductDetails {
  name: string
  description: string
  quantity: string
}

export interface OfferDiscountDetails {
  code: string
  value: string
  validFrom: string
  validTo: string
}

export interface OfferFinancialDetails {
  amount: string
  terms: string
}

export interface OfferCustomMix {
  product: number
  discount: number
  financial: number
}

export interface SponsorshipOfferPayload {
  selectedTypes: SponsorshipTypeId[]
  productDetails: OfferProductDetails
  discountDetails: OfferDiscountDetails
  financialDetails: OfferFinancialDetails
  customMix: OfferCustomMix
}

export interface SponsorshipOffer extends SponsorshipOfferPayload {
  id: string
  brandId: string
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}
