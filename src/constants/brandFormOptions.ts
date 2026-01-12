import {
  BadgePercentIcon,
  BriefcaseIcon,
  DollarSignIcon,
  HelpCircleIcon,
  PackageIcon,
  UsersIcon
} from 'lucide-react'

export const industryOptions = [
  { value: 'food_beverage', label: 'Food & Beverage' },
  { value: 'beauty_cosmetics', label: 'Beauty & Cosmetics' },
  { value: 'health_wellness', label: 'Health & Wellness' },
  { value: 'tech', label: 'Technology' },
  { value: 'fashion', label: 'Fashion & Apparel' },
  { value: 'home_goods', label: 'Home Goods' },
  { value: 'sports_fitness', label: 'Sports & Fitness' },
  { value: 'entertainment', label: 'Entertainment' },
  { value: 'other', label: 'Other' }
]

export const ageRangeOptions = [
  { value: 'under_18', label: 'Under 18' },
  { value: '18-24', label: '18-24' },
  { value: '25-34', label: '25-34' },
  { value: '35-44', label: '35-44' },
  { value: '45-54', label: '45-54' },
  { value: '55_plus', label: '55+' },
  { value: 'all', label: 'All ages' }
]

export const budgetOptions = [
  { value: 'under_10000', label: 'Under 10,000 SEK' },
  { value: '10000_50000', label: '10,000 - 50,000 SEK' },
  { value: '50000_100000', label: '50,000 - 100,000 SEK' },
  { value: '100000_250000', label: '100,000 - 250,000 SEK' },
  { value: '250000_plus', label: 'Over 250,000 SEK' }
]

export const sponsorshipTypes = [
  {
    id: 'product_sampling',
    label: 'Product Sampling',
    description: 'Distribute product samples at events',
    IconComponent: PackageIcon
  },
  {
    id: 'financial_sponsorship',
    label: 'Financial Sponsorship',
    description: 'Provide monetary support for events',
    IconComponent: DollarSignIcon
  },
  {
    id: 'in_kind_goods',
    label: 'In-Kind Goods',
    description: 'Provide products or services as sponsorship',
    IconComponent: BadgePercentIcon
  },
  {
    id: 'merchandise',
    label: 'Merchandise',
    description: 'Provide branded merchandise for events',
    IconComponent: BriefcaseIcon
  },
  {
    id: 'experience',
    label: 'Brand Experience',
    description: 'Create interactive brand experiences',
    IconComponent: UsersIcon
  },
  {
    id: 'other',
    label: 'Other',
    description: 'Other sponsorship type',
    IconComponent: HelpCircleIcon
  }
]
