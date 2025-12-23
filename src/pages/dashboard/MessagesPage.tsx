import { useState } from 'react'

import {
  ConversationDetail,
  ConversationFilters,
  ConversationList
} from '../../components/messages'
import { ConfirmDialog } from '../../components/messages/ConfirmDialog'
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
    archiveConversation,
    deleteConversation,
    sortBy,
    setSortBy
  } = useConversations()

  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleSelectConversation = (conversationId: string) => {
    selectConversation(conversationId)
    setShowMobileDetail(true)
  }

  const handleBackToList = () => {
    setShowMobileDetail(false)
  }

  const handleArchive = async () => {
    if (!activeConversation) return
    await archiveConversation(activeConversation.id)
    // On mobile, go back to list after archiving
    if (showMobileDetail) {
      setShowMobileDetail(false)
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
  }

  const handleDeleteConfirm = async () => {
    if (!activeConversation) return
    setShowDeleteConfirm(false)
    await deleteConversation(activeConversation.id)
    // On mobile, go back to list after deleting
    if (showMobileDetail) {
      setShowMobileDetail(false)
    }
  }

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <DashboardLayout userType={userType} mainPaddingClassName='p-0'>
      <div className='flex flex-col h-screen overflow-hidden'>
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
          <div className='flex flex-1 gap-4 overflow-hidden min-h-0 pb-4'>
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
                onArchive={handleArchive}
                onDelete={handleDeleteClick}
              />
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone and all messages will be permanently deleted."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </DashboardLayout>
  )
}
