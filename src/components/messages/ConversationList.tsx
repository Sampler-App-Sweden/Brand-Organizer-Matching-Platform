import { PhaseBadge } from './PhaseBadge'
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
        <div className='p-6 text-center text-gray-500'>
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
              <div className='p-4'>
                <div className='flex justify-between items-start mb-2'>
                  <div className='flex items-center'>
                    <div className='h-10 w-10 rounded-full overflow-hidden mr-3 bg-gray-200'>
                      {partnerLogo ? (
                        <img
                          src={partnerLogo}
                          alt={partnerName}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        <div className='h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-800 font-bold'>
                          {partnerName.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className='font-medium text-gray-900'>
                        {partnerName}
                      </h3>
                      <div className='flex items-center'>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            userType === 'brand'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {userType === 'brand' ? 'Organizer' : 'Brand'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className='inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full'>
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
                <div className='mb-2'>
                  <p className='text-sm text-gray-900 font-medium'>
                    {conversation.reference}
                  </p>
                </div>
                <div className='flex justify-between items-center'>
                  <PhaseBadge phase={conversation.phase} />
                  <span className='text-xs text-gray-500'>
                    {conversation.lastMessageTime &&
                      new Date(
                        conversation.lastMessageTime
                      ).toLocaleDateString()}
                  </span>
                </div>
                {conversation.awaitingReply && (
                  <div className='mt-2'>
                    <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-amber-700 bg-amber-100'>
                      Awaiting reply
                    </span>
                  </div>
                )}
                <p className='mt-2 text-sm text-gray-600 truncate'>
                  {conversation.lastMessage}
                </p>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
