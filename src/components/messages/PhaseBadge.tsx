import { AlertCircle, CheckCircle, Clock, FileTextIcon, MessageSquareIcon } from 'lucide-react'

import type { ConversationPhase } from '../../types/messages'
import { formatPhaseLabel } from '../../utils/messages'

interface PhaseBadgeProps {
  phase: ConversationPhase
  className?: string
  showLabel?: boolean
}

export function PhaseBadge({ phase, className = '', showLabel = true }: PhaseBadgeProps) {
  const colorClass = getPhaseColor(phase)

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass} ${className}`}>
      {getPhaseIcon(phase)}
      {showLabel && <span className='ml-1'>{formatPhaseLabel(phase)}</span>}
    </span>
  )
}

function getPhaseColor(phase: ConversationPhase) {
  switch (phase) {
    case 'inquiry':
      return 'bg-purple-100 text-purple-800'
    case 'negotiation':
      return 'bg-amber-100 text-amber-800'
    case 'contract_draft':
      return 'bg-blue-100 text-blue-800'
    case 'completed':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

function getPhaseIcon(phase: ConversationPhase) {
  switch (phase) {
    case 'inquiry':
      return <MessageSquareIcon className='h-4 w-4' />
    case 'negotiation':
      return <Clock className='h-4 w-4' />
    case 'contract_draft':
      return <FileTextIcon className='h-4 w-4' />
    case 'completed':
      return <CheckCircle className='h-4 w-4' />
    default:
      return <AlertCircle className='h-4 w-4' />
  }
}
