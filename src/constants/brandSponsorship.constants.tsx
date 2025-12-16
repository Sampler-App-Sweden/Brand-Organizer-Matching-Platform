import { DollarSignIcon, PackageIcon, PercentIcon, SlidersIcon } from 'lucide-react'
import type { ComponentType } from 'react'

import {
  OfferCustomMix,
  OfferDiscountDetails,
  OfferFinancialDetails,
  OfferProductDetails,
  SponsorshipTypeId
} from '../types/sponsorship'

export interface SponsorshipTypeConfig {
  id: SponsorshipTypeId
  name: string
  description: string
  icon: ComponentType<{ className?: string }>
}

export const SPONSORSHIP_TYPE_IDS: SponsorshipTypeId[] = [
  'product',
  'discount',
  'financial',
  'custom'
]

export const SPONSORSHIP_TYPE_CONFIGS: SponsorshipTypeConfig[] = [
  {
    id: 'product',
    name: 'Product Sponsorship',
    description: 'Provide in-kind items (e.g. coffee beans, merch)',
    icon: PackageIcon
  },
  {
    id: 'discount',
    name: 'Discount Sponsorship',
    description: 'Issue promo codes or percentage discounts',
    icon: PercentIcon
  },
  {
    id: 'financial',
    name: 'Financial Sponsorship',
    description: 'Direct monetary support',
    icon: DollarSignIcon
  },
  {
    id: 'custom',
    name: 'Custom Mix',
    description: 'Allocate percentages across multiple sponsorship types',
    icon: SlidersIcon
  }
]

export const createDefaultProductDetails = (): OfferProductDetails => ({
  name: '',
  description: '',
  quantity: ''
})

export const createDefaultDiscountDetails = (): OfferDiscountDetails => ({
  code: '',
  value: '',
  validFrom: '',
  validTo: ''
})

export const createDefaultFinancialDetails = (): OfferFinancialDetails => ({
  amount: '',
  terms: 'upfront'
})

export const createDefaultCustomMix = (): OfferCustomMix => ({
  product: 33,
  discount: 33,
  financial: 34
})
