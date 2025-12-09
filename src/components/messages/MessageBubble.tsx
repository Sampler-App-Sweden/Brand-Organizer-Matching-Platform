import type { Message } from '../../services/chatService'

interface MessageBubbleProps {
  message: Message
  userType: 'brand' | 'organizer'
}

export function MessageBubble({ message, userType }: MessageBubbleProps) {
  const isSender = message.senderType === userType
  const isAi = message.senderType === 'ai'

  const bubbleClasses = (() => {
    if (isAi) return 'bg-gray-100 text-gray-800'
    if (isSender) return 'bg-indigo-600 text-white'
    return 'bg-gray-200 text-gray-800'
  })()

  return (
    <div className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs sm:max-w-md rounded-lg p-3 ${bubbleClasses}`}>
        {isAi && (
          <div className='text-xs font-medium text-gray-500 mb-1'>
            AI Assistant
          </div>
        )}
        <p className='text-sm'>{message.content}</p>
        <div className='text-xs mt-1 text-right opacity-70'>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
    </div>
  )
}
