import type { ConversationPhase } from '../../types/messages'
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
    updatePhase,
    phaseFilter,
    setPhaseFilter,
    sortBy,
    setSortBy
  } = useConversations()

  return (
    <DashboardLayout userType={userType} mainPaddingClassName='p-0'>
      <div className='flex flex-col flex-1 h-[calc(100vh-9rem)] min-h-0'>
        <div className='mb-4'>
          <h1 className='text-2xl font-bold text-gray-900'>Messages</h1>
          <p className='text-gray-600'>
            Manage your conversations with brands and organizers
          </p>
        </div>
        <ConversationFilters
          phaseFilter={phaseFilter}
          sortBy={sortBy}
          onPhaseChange={(value) =>
            setPhaseFilter(value as ConversationPhase | 'all')
          }
          onSortChange={(value) => setSortBy(value)}
        />
        {loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-gray-500'>Loading conversations...</div>
          </div>
        ) : (
          <div className='flex flex-1 gap-4 overflow-hidden min-h-0'>
            <div className='w-full md:w-1/3 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col h-full min-h-0'>
              {conversationsError && (
                <div className='p-3 text-sm text-red-600 border-b border-red-100 bg-red-50'>
                  {conversationsError}
                </div>
              )}
              <ConversationList
                conversations={filteredConversations}
                userType={userType}
                selectedConversation={selectedConversation}
                onSelectConversation={selectConversation}
              />
            </div>
            <div className='hidden md:flex md:w-2/3 bg-white rounded-lg shadow-sm overflow-hidden flex-col h-full min-h-0'>
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
                onPhaseChange={updatePhase}
                hasPartnerInfo={hasPartnerInfo}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
