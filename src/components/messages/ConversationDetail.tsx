import { MessageSquareIcon, PaperclipIcon, SendIcon } from 'lucide-react'
import type { FormEvent } from 'react'

import { Button } from '../ui'
import type { Message } from '../../services/chatService'
import type {
  ConversationPhase,
  EnhancedConversation
} from '../../types/messages'
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
  onPhaseChange: (phase: ConversationPhase) => void
  hasPartnerInfo: boolean
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
  onPhaseChange,
  hasPartnerInfo
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
        onPhaseChange={onPhaseChange}
      />
      {/* Window with conversations */}
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
      <div className='border-t border-gray-200 p-3 pb-2'>
        <form onSubmit={onSendMessage} className='flex items-end'>
          <div className='flex-1 border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500'>
            <textarea
              className='block w-full border-0 resize-none py-3 px-4 focus:outline-none focus:ring-0 sm:text-sm'
              placeholder='Type a message...'
              rows={2}
              value={newMessage}
              onChange={(e) => onMessageChange(e.target.value)}
            />
            <div className='flex items-center justify-between p-2 border-t border-gray-200'>
              <button
                type='button'
                className='p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              >
                <PaperclipIcon className='h-5 w-5' />
              </button>
              <Button
                type='submit'
                variant='primary'
                disabled={!newMessage.trim() || sendingMessage}
                className='flex items-center'
              >
                <SendIcon className='h-4 w-4 mr-1' />
                {sendingMessage ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </form>
        {messageError && (
          <div className='mt-2 text-sm text-red-600'>{messageError}</div>
        )}
      </div>
    </>
  )
}
