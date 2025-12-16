import {
  DollarSignIcon,
  MegaphoneIcon,
  PackageIcon,
  PercentIcon
} from 'lucide-react'

import type { ComponentType } from 'react'

export interface BaseSponsorshipRequest {
  id: 'product' | 'discount' | 'financial' | 'media' | 'any'
  name: string
  description: string
  icon: ComponentType<{ className?: string }>
}

export const baseSponsorshipRequests: BaseSponsorshipRequest[] = [
  {
    id: 'product',
    name: 'Product Sponsorship',
    description: 'Request in-kind items for your event',
    icon: PackageIcon
  },
  {
    id: 'discount',
    name: 'Discount Sponsorship',
    description: 'Request promotional discounts for attendees',
    icon: PercentIcon
  },
  {
    id: 'financial',
    name: 'Financial Sponsorship',
    description: 'Request direct monetary support',
    icon: DollarSignIcon
  },
  {
    id: 'media',
    name: 'Media & Promotion',
    description: 'Request shout-outs, placements, or coverage',
    icon: MegaphoneIcon
  },
  {
    id: 'any',
    name: 'Any Combination',
    description: 'Open to any type of sponsorship support',
    icon: MegaphoneIcon
  }
]
