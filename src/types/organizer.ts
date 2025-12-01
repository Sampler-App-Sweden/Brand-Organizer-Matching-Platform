export interface Organizer {
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
  mediaFiles: string[] // URLs to media files
  createdAt: Date
}
