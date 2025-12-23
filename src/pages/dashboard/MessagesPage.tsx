import { useState } from 'react'

import {
  ConversationDetail,
  ConversationFilters,
  ConversationList
} from '../../components/messages'
import { DashboardLayout } from '../../components/layout'
import { useConversations } from '../../hooks/useConversations'

export function MessagesPage() {
  const {
    userType,
    loading,
    conversationsError,
    filteredConversations,
    selectedConversation,
    selectConversation,
    activeConversation,
    partnerDisplayName,
    partnerInitial,
    hasPartnerInfo,
    messages,
    messagesLoading,
    messageError,
    newMessage,
    setNewMessage,
    sendingMessage,
    sendMessage,
    sortBy,
    setSortBy
  } = useConversations()

  const [showMobileDetail, setShowMobileDetail] = useState(false)

  const handleSelectConversation = (conversationId: string) => {
    selectConversation(conversationId)
    setShowMobileDetail(true)
  }

  const handleBackToList = () => {
    setShowMobileDetail(false)
  }

  return (
    <DashboardLayout userType={userType} mainPaddingClassName='p-0'>
      <div className='flex flex-col flex-1 h-[calc(100vh-9rem)] min-h-0'>
        <div className='px-4 pt-4 pb-3'>
          <h1 className='text-xl md:text-2xl font-bold text-gray-900'>Messages</h1>
        </div>
        <div className='px-4'>
          <ConversationFilters
            sortBy={sortBy}
            onSortChange={(value) => setSortBy(value)}
          />
        </div>
        {loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-gray-500 text-sm'>Loading conversations...</div>
          </div>
        ) : (
          <div className='flex flex-1 gap-4 overflow-hidden min-h-0 px-4 pb-4'>
            {/* Mobile: show list or detail based on state */}
            <div className={`${showMobileDetail ? 'hidden' : 'flex'} md:flex md:w-1/3 w-full bg-white rounded-lg shadow-sm overflow-hidden flex-col h-full min-h-0`}>
              {conversationsError && (
                <div className='p-3 text-sm text-red-600 border-b border-red-100 bg-red-50'>
                  {conversationsError}
                </div>
              )}
              <ConversationList
                conversations={filteredConversations}
                userType={userType}
                selectedConversation={selectedConversation}
                onSelectConversation={handleSelectConversation}
              />
            </div>
            {/* Mobile: show detail when conversation selected, Desktop: always show */}
            <div className={`${showMobileDetail ? 'flex' : 'hidden'} md:flex md:w-2/3 w-full bg-white rounded-lg shadow-sm overflow-hidden flex-col h-full min-h-0`}>
              <ConversationDetail
                activeConversation={activeConversation}
                partnerDisplayName={partnerDisplayName}
                partnerInitial={partnerInitial}
                userType={userType}
                messages={messages}
                messagesLoading={messagesLoading}
                messageError={messageError}
                newMessage={newMessage}
                sendingMessage={sendingMessage}
                onMessageChange={setNewMessage}
                onSendMessage={sendMessage}
                hasPartnerInfo={hasPartnerInfo}
                onBack={handleBackToList}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
