import type { EnhancedConversation, ConversationPhase } from '../types/messages'

export function getFilteredConversations(
  conversations: EnhancedConversation[],
  phaseFilter: ConversationPhase | 'all',
  sortBy: 'recent' | 'unread'
) {
  const filtered =
    phaseFilter === 'all'
      ? [...conversations]
      : conversations.filter(
          (conversation) => conversation.phase === phaseFilter
        )

  return filtered.sort((a, b) => {
    if (sortBy === 'recent') {
      return (
        (b.lastMessageTime?.getTime() ?? 0) -
        (a.lastMessageTime?.getTime() ?? 0)
      )
    }

    return b.unreadCount - a.unreadCount
  })
}

export function formatPhaseLabel(phase: ConversationPhase | 'all') {
  if (phase === 'all') return 'All Phases'

  return phase
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

export function getContextualCTA(phase: ConversationPhase) {
  switch (phase) {
    case 'inquiry':
      return 'Send Offer'
    case 'negotiation':
      return 'Request Update'
    case 'contract_draft':
      return 'Review Contract'
    case 'completed':
      return 'View Summary'
    default:
      return 'Continue'
  }
}
