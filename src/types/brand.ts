export interface Brand {
  id: string
  userId: string
  companyName: string
  contactName: string
  contactTitle: string
  email: string
  phone: string
  website: string
  address: string
  postalCode: string
  city: string
  industry: string
  customIndustry?: string
  productName: string
  productDescription: string
  productQuantity: string
  targetAudience: string
  ageRange: string
  sponsorshipType: string[]
  customSponsorshipType?: string
  marketingGoals: string
  budget: string
  eventMarketingBudget: string
  interestedInFinancialSponsorship: 'yes' | 'no' | ''
  financialSponsorshipAmount: string
  successMetrics: string
  interestedInSamplingTools: 'yes' | 'no' | ''
  hasTestPanels: 'yes' | 'no' | ''
  testPanelDetails: string
  additionalInfo: string
  createdAt: Date
}
