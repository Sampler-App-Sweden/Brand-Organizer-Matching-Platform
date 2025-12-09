import type { ConversationPhase } from '../types/messages'

export const PHASE_OPTIONS: Array<{
  value: ConversationPhase | 'all'
  label: string
}> = [
  { value: 'all', label: 'All Phases' },
  { value: 'inquiry', label: 'Inquiry' },
  { value: 'negotiation', label: 'Negotiation' },
  { value: 'contract_draft', label: 'Contract Draft' },
  { value: 'completed', label: 'Completed' }
]
