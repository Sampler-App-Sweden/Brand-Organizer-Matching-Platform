import { DollarSignIcon, PackageIcon, PercentIcon } from 'lucide-react'
import type { ReactNode } from 'react'

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
  icon: ReactNode
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
    icon: <PackageIcon className='h-5 w-5' />
  },
  {
    id: 'discount',
    name: 'Discount Sponsorship',
    description: 'Issue promo codes or percentage discounts',
    icon: <PercentIcon className='h-5 w-5' />
  },
  {
    id: 'financial',
    name: 'Financial Sponsorship',
    description: 'Direct monetary support',
    icon: <DollarSignIcon className='h-5 w-5' />
  },
  {
    id: 'custom',
    name: 'Custom Mix',
    description: 'Allocate percentages across multiple sponsorship types',
    icon: <div className='h-5 w-5' />
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
