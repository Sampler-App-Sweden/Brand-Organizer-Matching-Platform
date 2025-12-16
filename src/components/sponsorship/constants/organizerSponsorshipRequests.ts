import {
  DollarSignIcon,
  MegaphoneIcon,
  MoreHorizontalIcon,
  PackageIcon,
  PercentIcon
} from 'lucide-react'

import type { ComponentType } from 'react'

export interface BaseSponsorshipRequest {
  id: 'product' | 'discount' | 'financial' | 'media' | 'other'
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
    id: 'other',
    name: 'Other Collaboration',
    description: 'Describe a custom collaboration opportunity',
    icon: MoreHorizontalIcon
  }
]
