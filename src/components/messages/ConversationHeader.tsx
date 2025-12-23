import { Archive, ChevronLeft, MoreVertical, Trash2 } from 'lucide-react'
import { useState } from 'react'

import type { EnhancedConversation } from '../../types/messages'

interface ConversationHeaderProps {
  conversation: EnhancedConversation
  partnerDisplayName: string
  partnerInitial: string
  userType: 'brand' | 'organizer'
  onBack?: () => void
  onArchive?: () => void
  onDelete?: () => void
}

export function ConversationHeader({
  conversation,
  partnerDisplayName,
  partnerInitial,
  userType,
  onBack,
  onArchive,
  onDelete
}: ConversationHeaderProps) {
  const [showMenu, setShowMenu] = useState(false)
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

  const handleArchive = () => {
    setShowMenu(false)
    onArchive?.()
  }

  const handleDelete = () => {
    setShowMenu(false)
    onDelete?.()
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

      {/* Three-dot menu */}
      {(onArchive || onDelete) && (
        <div className='relative'>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
            aria-label='More options'
          >
            <MoreVertical className='h-5 w-5 text-gray-600' />
          </button>

          {showMenu && (
            <>
              {/* Backdrop */}
              <div
                className='fixed inset-0 z-10'
                onClick={() => setShowMenu(false)}
              />

              {/* Dropdown menu */}
              <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20'>
                {onArchive && !conversation.archived && (
                  <button
                    onClick={handleArchive}
                    className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors'
                  >
                    <Archive className='h-4 w-4' />
                    Archive conversation
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={handleDelete}
                    className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors'
                  >
                    <Trash2 className='h-4 w-4' />
                    Delete conversation
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
