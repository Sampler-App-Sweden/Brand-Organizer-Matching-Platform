// Connection types for manual connection expression system

export type ConnectionStatus = 'pending' | 'accepted' | 'rejected' | 'withdrawn'

/**
 * Core Connection interface representing a one-way connection expression
 */
export interface Connection {
  id: string
  senderId: string
  senderType: 'brand' | 'organizer'
  receiverId: string
  receiverType: 'brand' | 'organizer'
  brandId: string
  organizerId: string
  status: ConnectionStatus
  createdAt: Date
  updatedAt: Date
}

/**
 * Enhanced Connection with additional profile information for display
 */
export interface EnhancedConnection extends Connection {
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
 * Connection statistics for dashboard widgets
 */
export interface ConnectionStats {
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
 * Database row type for connections table
 */
export interface ConnectionRow {
  id: string
  sender_id: string
  sender_type: 'brand' | 'organizer'
  receiver_id: string
  receiver_type: 'brand' | 'organizer'
  brand_id: string
  organizer_id: string
  status: ConnectionStatus
  created_at: string
  updated_at: string
}
