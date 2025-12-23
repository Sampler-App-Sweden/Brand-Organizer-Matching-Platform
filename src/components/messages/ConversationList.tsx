import type { EnhancedConversation } from '../../types/messages'

interface ConversationListProps {
  conversations: EnhancedConversation[]
  selectedConversation: string | null
  onSelectConversation: (conversationId: string) => void
  userType: 'brand' | 'organizer'
}

export function ConversationList({
  conversations,
  selectedConversation,
  onSelectConversation,
  userType
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
          return (
            <li
              key={conversation.id}
              className={`hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedConversation === conversation.id
                  ? 'bg-indigo-50 border-l-4 border-indigo-600'
                  : ''
              }`}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className='p-3'>
                <div className='flex items-start gap-3'>
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
                  <div className='flex-1 min-w-0'>
                    <div className='flex items-start justify-between mb-1'>
                      <h3 className='font-medium text-gray-900 text-sm truncate'>
                        {partnerName}
                      </h3>
                      {conversation.unreadCount > 0 && (
                        <span className='ml-2 inline-flex items-center justify-center h-5 w-5 text-xs font-bold text-white bg-indigo-600 rounded-full flex-shrink-0'>
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className='text-xs text-gray-600 truncate mb-1'>
                      {conversation.reference}
                    </p>
                    <p className='text-sm text-gray-800 truncate mb-1'>
                      {conversation.lastMessage}
                    </p>
                    <div className='flex items-center justify-between'>
                      <span className='text-xs text-gray-500'>
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
