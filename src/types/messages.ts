export type ConversationPhase =
  | 'inquiry'
  | 'negotiation'
  | 'contract_draft'
  | 'completed'

export interface EnhancedConversation {
  id: string
  brandId: string
  organizerId: string
  brandName: string
  brandLogo?: string
  organizerName: string
  organizerLogo?: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  phase: ConversationPhase
  reference: string
  awaitingReply: boolean
  archived?: boolean
  readOnly?: boolean
  archivedAt?: Date
  archivedBy?: string
}
