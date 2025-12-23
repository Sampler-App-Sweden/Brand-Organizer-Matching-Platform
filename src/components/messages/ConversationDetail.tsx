import { Archive, MessageSquareIcon, SendIcon } from 'lucide-react'
import type { FormEvent } from 'react'

import { Button } from '../ui'
import type { Message } from '../../services/chatService'
import type { EnhancedConversation } from '../../types/messages'
import { ConversationHeader } from './ConversationHeader'
import { MessageBubble } from './MessageBubble'

interface ConversationDetailProps {
  activeConversation?: EnhancedConversation
  partnerDisplayName: string
  partnerInitial: string
  userType: 'brand' | 'organizer'
  messages: Message[]
  messagesLoading: boolean
  messageError: string | null
  newMessage: string
  sendingMessage: boolean
  onMessageChange: (value: string) => void
  onSendMessage: (event: FormEvent<HTMLFormElement>) => void
  hasPartnerInfo: boolean
  onBack?: () => void
}

export function ConversationDetail({
  activeConversation,
  partnerDisplayName,
  partnerInitial,
  userType,
  messages,
  messagesLoading,
  messageError,
  newMessage,
  sendingMessage,
  onMessageChange,
  onSendMessage,
  hasPartnerInfo,
  onBack
}: ConversationDetailProps) {
  if (!activeConversation || !hasPartnerInfo) {
    return (
      <div className='flex flex-col items-center justify-center h-full text-gray-500'>
        <MessageSquareIcon className='h-12 w-12 mb-2 text-gray-400' />
        <p>Select a conversation to view messages</p>
      </div>
    )
  }

  return (
    <>
      <ConversationHeader
        conversation={activeConversation}
        partnerDisplayName={partnerDisplayName}
        partnerInitial={partnerInitial}
        userType={userType}
        onBack={onBack}
      />
      {activeConversation.readOnly && (
        <div className='bg-yellow-50 border-b border-yellow-200 px-4 py-3'>
          <div className='flex items-center gap-2 text-yellow-800'>
            <Archive className='h-4 w-4' />
            <span className='text-sm font-medium'>
              This conversation has been archived. You can view messages but cannot send new ones.
            </span>
          </div>
        </div>
      )}
      {/* Messages list - scrollable */}
      <div className='flex-1 min-h-0 overflow-y-auto p-4 space-y-4'>
        {messagesLoading ? (
          <div className='flex flex-col items-center justify-center h-full text-gray-500'>
            <MessageSquareIcon className='h-12 w-12 mb-2 text-gray-400' />
            <p>Loading messages...</p>
          </div>
        ) : messageError ? (
          <div className='flex flex-col items-center justify-center h-full text-red-600 text-center px-4'>
            <MessageSquareIcon className='h-12 w-12 mb-2 text-red-400' />
            <p>{messageError}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className='flex flex-col items-center justify-center h-full text-gray-500'>
            <MessageSquareIcon className='h-12 w-12 mb-2 text-gray-400' />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              userType={userType}
            />
          ))
        )}
      </div>
      {/* Message input at bottom */}
      <div className='border-t border-gray-200 p-3'>
        <form onSubmit={onSendMessage} className='flex gap-2'>
          <textarea
            className='flex-1 border border-gray-300 rounded-lg resize-none py-2 px-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed'
            placeholder={
              activeConversation.readOnly
                ? 'This conversation is archived'
                : 'Type a message...'
            }
            rows={2}
            value={newMessage}
            onChange={(e) => onMessageChange(e.target.value)}
            disabled={activeConversation.readOnly}
          />
          <Button
            type='submit'
            variant='primary'
            disabled={!newMessage.trim() || sendingMessage || activeConversation.readOnly}
            className='flex items-center self-end px-4'
          >
            <SendIcon className='h-4 w-4' />
          </Button>
        </form>
        {messageError && (
          <div className='mt-2 text-sm text-red-600'>{messageError}</div>
        )}
      </div>
    </>
  )
}
