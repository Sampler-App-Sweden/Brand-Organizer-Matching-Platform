export type UserRole = 'brand' | 'organizer'
// Generic draft profile that can contain fields from any role
export interface DraftProfile {
  // Common fields
  name?: string
  email?: string
  phone?: string
  location?: string
  // Brand fields
  companyName?: string
  productName?: string
  productDescription?: string
  targetAudience?: string
  productQuantity?: string
  marketingGoals?: string
  budget?: string
  // Organizer fields
  organizerName?: string
  eventName?: string
  eventDate?: string
  audienceDescription?: string
  attendeeCount?: string
  sponsorshipNeeds?: string
  // Community fields
  age?: string
  occupation?: string
  interests?: string
  availability?: string
  // Any other fields that might be extracted
  [key: string]: string | undefined
}

// Brand profile
export interface BrandProfile {
  id: string
  userId: string
  companyName: string
  contactName: string
  contactTitle: string
  email: string
  phone: string
  website: string
  industry: string
  productName: string
  productDescription: string
  productQuantity: string
  targetAudience: string
  ageRange: string
  sponsorshipType: string[]
  marketingGoals: string
  budget: string
  eventMarketingBudget: string
  interestedInFinancialSponsorship: string
  financialSponsorshipAmount: string
  successMetrics: string
  interestedInSamplingTools: string
  hasTestPanels: string
  testPanelDetails: string
  additionalInfo: string
  createdAt: Date
}

// Organizer profile
export interface OrganizerProfile {
  id: string
  userId: string
  organizerName: string
  contactName: string
  email: string
  phone: string
  website: string
  eventName: string
  eventType: string
  elevatorPitch: string
  eventFrequency: string
  eventDate: string
  location: string
  attendeeCount: string
  audienceDescription: string
  audienceDemographics: string[]
  sponsorshipNeeds: string
  offeringTypes: string[]
  brandVisibility: string
  contentCreation: string
  leadGeneration: string
  productFeedback: string
  bonusValue: string[]
  bonusValueDetails: string
  additionalInfo: string
  mediaFiles: string[]
  createdAt: Date
}

// Community profile
export interface CommunityProfile {
  id: string
  userId: string
  name: string
  email: string
  phone: string
  age: string
  occupation: string
  location: string
  interests: string[]
  availabilityDays: string[]
  availabilityTimes: string[]
  willingToJoinTestPanels: boolean
  preferredEventTypes: string[]
  preferredProductCategories: string[]
  dietaryRestrictions: string[]
  travelDistance: string
  socialMediaHandles: string
  additionalInfo: string
  createdAt: Date
}
