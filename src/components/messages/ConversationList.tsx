import type { EnhancedConversation } from '../../types/messages'

interface ConversationListProps {
  conversations: EnhancedConversation[]
  selectedConversation: string | null
  onSelectConversation: (conversationId: string) => void
  userType: 'brand' | 'organizer'
  selectionMode?: boolean
  selectedConversationIds?: string[]
  onToggleSelection?: (conversationId: string) => void
}

export function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  userType,
  selectionMode = false,
  selectedConversationIds = [],
  onToggleSelection
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <div className='overflow-y-auto flex-1'>
        <div className='p-6 text-center text-gray-500 text-sm'>
          No conversations found
        </div>
      </div>
    )
  }

  return (
    <div className='overflow-y-auto flex-1'>
      <ul className='divide-y divide-gray-200'>
        {conversations.map((conversation) => {
          const partnerName =
            userType === 'brand'
              ? conversation.organizerName
              : conversation.brandName
          const partnerLogo =
            userType === 'brand'
              ? conversation.organizerLogo
              : conversation.brandLogo
          const isUnread = conversation.unreadCount > 0
          const isSelected = selectedConversationIds.includes(conversation.id)

          const handleClick = () => {
            if (selectionMode && onToggleSelection) {
              onToggleSelection(conversation.id)
            } else {
              onSelectConversation(conversation.id)
            }
          }

          return (
            <li
              key={conversation.id}
              className={`hover:bg-gray-50 cursor-pointer transition-colors relative ${
                !selectionMode && selectedConversation === conversation.id
                  ? 'bg-indigo-50 border-l-4 border-indigo-600'
                  : isSelected
                  ? 'bg-indigo-100'
                  : isUnread
                  ? 'bg-indigo-50/30'
                  : ''
              }`}
              onClick={handleClick}
            >
              <div className='p-3'>
                <div className='flex items-start gap-3'>
                  {selectionMode && (
                    <div className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={() => {}}
                        className='h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500'
                      />
                    </div>
                  )}
                  <div className='relative'>
                    <div className='h-12 w-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0'>
                      {partnerLogo ? (
                        <img
                          src={partnerLogo}
                          alt={partnerName}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <div className='h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-800 font-bold text-sm'>
                          {partnerName.charAt(0)}
                        </div>
                      )}
                    </div>
                    {isUnread && (
                      <div className='absolute -top-0.5 -right-0.5 h-3 w-3 bg-indigo-600 rounded-full border-2 border-white'></div>
                    )}
                  </div>
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between mb-1'>
                      <h3 className={`text-sm truncate ${isUnread ? 'font-bold text-gray-900' : 'font-medium text-gray-900'}`}>
                        {partnerName}
                      </h3>
                    </div>
                    <p className='text-xs text-gray-600 truncate mb-1'>
                      {conversation.reference}
                    </p>
                    <p className={`text-sm truncate mb-1 ${isUnread ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                      {conversation.lastMessage}
                    </p>
                    <div className='flex items-center justify-between'>
                      <span className={`text-xs ${isUnread ? 'font-medium text-gray-700' : 'text-gray-500'}`}>
                        {conversation.lastMessageTime &&
                          new Date(
                            conversation.lastMessageTime
                          ).toLocaleDateString()}
                      </span>
                      {conversation.archived && (
                        <span className='text-xs text-gray-500'>Archived</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
