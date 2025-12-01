export type SponsorshipType = 'financial' | 'product' | 'service' | 'mixed'

export type PaymentTerms =
  | 'full_upfront'
  | 'installments'
  | 'post_event'
  | 'custom'

export interface Contract {
  id: string
  matchId: string
  brandName: string
  organizerName: string
  eventName: string
  sponsorshipAmount: number
  sponsorshipType: SponsorshipType
  deliverables: string
  startDate: string
  endDate: string
  paymentTerms: PaymentTerms
  cancellationPolicy: string
  additionalTerms?: string
  status: 'pending' | 'signed' | 'declined'
  createdAt: string
  updatedAt?: string
  brandApproved?: boolean
  organizerApproved?: boolean
}
