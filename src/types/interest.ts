// Interest types for manual interest expression system

export type InterestStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'

/**
 * Core Interest interface representing a one-way interest expression
 */
export interface Interest {
  id: string
  senderId: string
  senderType: 'brand' | 'organizer'
  receiverId: string
  receiverType: 'brand' | 'organizer'
  brandId: string
  organizerId: string
  status: InterestStatus
  createdAt: Date
  updatedAt: Date
}

/**
 * Enhanced Interest with additional profile information for display
 */
export interface EnhancedInterest extends Interest {
  senderName: string
  senderLogo?: string
  senderDescription?: string
  receiverName: string
  receiverLogo?: string
  receiverDescription?: string
  isMutual: boolean
  hasAIMatch?: boolean
}

/**
 * Interest statistics for dashboard widgets
 */
export interface InterestStats {
  sent: {
    pending: number
    accepted: number
    rejected: number
    total: number
  }
  received: {
    pending: number
    accepted: number
    rejected: number
    total: number
  }
  mutual: number
}

/**
 * Database row type for interests table
 */
export interface InterestRow {
  id: string
  sender_id: string
  sender_type: 'brand' | 'organizer'
  receiver_id: string
  receiver_type: 'brand' | 'organizer'
  brand_id: string
  organizer_id: string
  status: InterestStatus
  created_at: string
  updated_at: string
}
