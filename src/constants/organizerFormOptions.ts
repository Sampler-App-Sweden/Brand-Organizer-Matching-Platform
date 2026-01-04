import {
  BriefcaseIcon,
  CheckCircleIcon,
  ImageIcon,
  MegaphoneIcon,
  PresentationIcon,
  TargetIcon,
  UsersIcon
} from 'lucide-react'

export const eventTypeOptions = [
  { value: 'conference', label: 'Conference' },
  { value: 'festival', label: 'Festival' },
  { value: 'expo', label: 'Expo/Trade Show' },
  { value: 'workshop', label: 'Workshop/Seminar' },
  { value: 'concert', label: 'Concert/Performance' },
  { value: 'sports', label: 'Sports Event' },
  { value: 'networking', label: 'Networking Event' },
  { value: 'community', label: 'Community Event' },
  { value: 'other', label: 'Other' }
]

export const eventFrequencyOptions = [
  { value: 'one_time', label: 'One-time Event' },
  { value: 'annual', label: 'Annual' },
  { value: 'biannual', label: 'Bi-annual' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'weekly', label: 'Weekly' }
]

export const attendeeCountOptions = [
  { value: 'under_100', label: 'Under 100' },
  { value: '100_500', label: '100-500' },
  { value: '500_1000', label: '500-1,000' },
  { value: '1000_5000', label: '1,000-5,000' },
  { value: '5000_plus', label: 'Over 5,000' }
]

// Store icon component references, not JSX elements
export const demographicOptions = [
  { id: '18-24', label: '18-24 years', IconComponent: UsersIcon },
  { id: '25-34', label: '25-34 years', IconComponent: UsersIcon },
  { id: '35-44', label: '35-44 years', IconComponent: UsersIcon },
  { id: '45-54', label: '45-54 years', IconComponent: UsersIcon },
  { id: '55_plus', label: '55+ years', IconComponent: UsersIcon }
]

export const offeringTypes = [
  {
    id: 'brand_visibility',
    label: 'Brand Visibility',
    description: 'Logo placement, signage, mentions',
    IconComponent: MegaphoneIcon
  },
  {
    id: 'product_sampling',
    label: 'Product Sampling',
    description: 'Opportunities for attendees to try products',
    IconComponent: BriefcaseIcon
  },
  {
    id: 'content_creation',
    label: 'Content Creation',
    description: 'Photos, videos, social media content',
    IconComponent: ImageIcon
  },
  {
    id: 'lead_generation',
    label: 'Lead Generation',
    description: 'Collecting attendee information for brands',
    IconComponent: UsersIcon
  },
  {
    id: 'product_feedback',
    label: 'Product Feedback',
    description: 'Gathering opinions and reviews',
    IconComponent: CheckCircleIcon
  }
]

export const bonusValueOptions = [
  {
    id: 'media_coverage',
    label: 'Media Coverage',
    description: 'Press, publications, or media attention',
    IconComponent: PresentationIcon
  },
  {
    id: 'industry_network',
    label: 'Industry Network',
    description: 'Access to valuable industry contacts',
    IconComponent: UsersIcon
  },
  {
    id: 'influencer_presence',
    label: 'Influencer Presence',
    description: 'Social media influencers attending',
    IconComponent: TargetIcon
  },
  {
    id: 'exclusive_access',
    label: 'Exclusive Access',
    description: 'VIP areas or special event access',
    IconComponent: CheckCircleIcon
  }
]
