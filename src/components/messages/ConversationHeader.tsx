import { ChevronLeft } from 'lucide-react'

import type { EnhancedConversation } from '../../types/messages'

interface ConversationHeaderProps {
  conversation: EnhancedConversation
  partnerDisplayName: string
  partnerInitial: string
  userType: 'brand' | 'organizer'
  onBack?: () => void
}

export function ConversationHeader({
  conversation,
  partnerDisplayName,
  partnerInitial,
  userType,
  onBack
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
      <div className='h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-800 font-bold text-sm'>
        {partnerInitial}
      </div>
    )
  }

  return (
    <div className='p-3 border-b border-gray-200 flex items-center gap-3'>
      {onBack && (
        <button
          onClick={onBack}
          className='md:hidden p-2 -ml-2 hover:bg-gray-100 rounded-lg transition-colors'
          aria-label='Back to conversations'
        >
          <ChevronLeft className='h-5 w-5 text-gray-600' />
        </button>
      )}
      <div className='h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0'>
        {renderAvatar()}
      </div>
      <div className='flex-1 min-w-0'>
        <h3 className='font-medium text-gray-900 truncate'>{partnerDisplayName}</h3>
        <p className='text-sm text-gray-600 truncate'>{conversation.reference}</p>
      </div>
    </div>
  )
}
