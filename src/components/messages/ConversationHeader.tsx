import { ChevronDownIcon, FileTextIcon } from 'lucide-react'

import { Button } from '../ui'
import type {
  ConversationPhase,
  EnhancedConversation
} from '../../types/messages'
import { getContextualCTA } from '../../utils/messages'

interface ConversationHeaderProps {
  conversation: EnhancedConversation
  partnerDisplayName: string
  partnerInitial: string
  userType: 'brand' | 'organizer'
  onPhaseChange: (phase: ConversationPhase) => void
}

export function ConversationHeader({
  conversation,
  partnerDisplayName,
  partnerInitial,
  userType,
  onPhaseChange
}: ConversationHeaderProps) {
  const partnerLogo =
    userType === 'brand' ? conversation.organizerLogo : conversation.brandLogo

  const renderAvatar = () => {
    if (partnerLogo) {
      return (
        <img
          src={partnerLogo}
          alt={partnerDisplayName}
          className='h-full w-full object-cover'
        />
      )
    }

    return (
      <div className='h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-800 font-bold'>
        {partnerInitial}
      </div>
    )
  }

  return (
    <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
      <div className='flex items-center'>
        <div className='h-10 w-10 rounded-full overflow-hidden mr-3 bg-gray-200'>
          {renderAvatar()}
        </div>
        <div>
          <h3 className='font-medium text-gray-900'>{partnerDisplayName}</h3>
          <p className='text-sm text-gray-600'>{conversation.reference}</p>
        </div>
        {conversation.awaitingReply && (
          <span className='ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold text-amber-700 bg-amber-100'>
            Awaiting reply
          </span>
        )}
      </div>
      <div className='flex items-center space-x-2'>
        <div className='relative'>
          <select
            className='appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            value={conversation.phase}
            onChange={(e) => onPhaseChange(e.target.value as ConversationPhase)}
          >
            <option value='inquiry'>Inquiry</option>
            <option value='negotiation'>Negotiation</option>
            <option value='contract_draft'>Contract Draft</option>
            <option value='completed'>Completed</option>
          </select>
          <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
            <ChevronDownIcon className='h-4 w-4 text-gray-400' />
          </div>
        </div>
        {conversation.phase === 'contract_draft' && (
          <Button variant='outline' className='flex items-center'>
            <FileTextIcon className='h-4 w-4 mr-1' />
            View Contract
          </Button>
        )}
        <Button variant='primary'>
          {getContextualCTA(conversation.phase)}
        </Button>
      </div>
    </div>
  )
}
