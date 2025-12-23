import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { DashboardLayout } from '../../components/layout'
import {
  BulkActionsToolbar,
  ConfirmDialog,
  ConversationDetail,
  ConversationList
} from '../../components/messages'
import { LoadingSpinner } from '../../components/ui'
import { useConversations } from '../../hooks/useConversations'

export function MessagesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
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
    bulkArchiveConversations,
    bulkDeleteConversations,
    sortBy,
    setSortBy
  } = useConversations()

  const [showMobileDetail, setShowMobileDetail] = useState(false)

  // Auto-select conversation from URL query parameter
  useEffect(() => {
    const conversationId = searchParams.get('conversation')
    if (conversationId && !loading) {
      // Check if conversation exists in the list
      const conversationExists = filteredConversations.some(
        (c) => c.id === conversationId
      )
      if (conversationExists) {
        selectConversation(conversationId)
        setShowMobileDetail(true)
        // Remove the query parameter after selecting
        searchParams.delete('conversation')
        setSearchParams(searchParams, { replace: true })
      }
    }
  }, [
    searchParams,
    setSearchParams,
    selectConversation,
    loading,
    filteredConversations
  ])
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedConversationIds, setSelectedConversationIds] = useState<
    string[]
  >([])
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false)

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

  // Bulk selection handlers
  const handleCancelSelection = () => {
    setSelectionMode(false)
    setSelectedConversationIds([])
  }

  const handleToggleSelection = (conversationId: string) => {
    setSelectedConversationIds((prev) =>
      prev.includes(conversationId)
        ? prev.filter((id) => id !== conversationId)
        : [...prev, conversationId]
    )
  }

  const handleSelectAll = () => {
    setSelectedConversationIds(filteredConversations.map((c) => c.id))
  }

  const handleDeselectAll = () => {
    setSelectedConversationIds([])
  }

  const handleBulkArchive = async () => {
    await bulkArchiveConversations(selectedConversationIds)
    setSelectionMode(false)
    setSelectedConversationIds([])
  }

  const handleBulkDeleteClick = () => {
    setShowBulkDeleteConfirm(true)
  }

  const handleBulkDeleteConfirm = async () => {
    setShowBulkDeleteConfirm(false)
    await bulkDeleteConversations(selectedConversationIds)
    setSelectionMode(false)
    setSelectedConversationIds([])
  }

  const handleBulkDeleteCancel = () => {
    setShowBulkDeleteConfirm(false)
  }

  return (
    <DashboardLayout userType={userType} mainPaddingClassName='p-0'>
      <div className='flex flex-col h-full overflow-hidden'>
        {selectionMode ? (
          <BulkActionsToolbar
            selectedCount={selectedConversationIds.length}
            totalCount={filteredConversations.length}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
            onArchive={handleBulkArchive}
            onDelete={handleBulkDeleteClick}
            onCancel={handleCancelSelection}
          />
        ) : (
          <div className='px-4 pt-4 pb-3'>
            <div className='flex items-center justify-between'>
              <h1 className='text-xl md:text-2xl font-bold text-gray-900'>
                Messages
              </h1>
              <div className='flex items-center gap-2'>
                <span className='text-sm font-medium text-gray-700'>Sort:</span>
                <div className='flex rounded-md overflow-hidden border border-gray-300'>
                  <button
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      sortBy === 'recent'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSortBy('recent')}
                  >
                    Recent
                  </button>
                  <button
                    className={`px-3 py-1.5 text-sm transition-colors ${
                      sortBy === 'unread'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => setSortBy('unread')}
                  >
                    Unread
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <LoadingSpinner size={64} />
          </div>
        ) : (
          <div className='flex flex-1 gap-4 overflow-hidden min-h-0 pb-4'>
            {/* Mobile: show list or detail based on state */}
            <div
              className={`${
                showMobileDetail ? 'hidden' : 'flex'
              } md:flex ${selectionMode ? 'md:w-full' : 'md:w-1/3'} w-full bg-white rounded-lg shadow-sm overflow-hidden flex-col h-full min-h-0`}
            >
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
                selectionMode={selectionMode}
                selectedConversationIds={selectedConversationIds}
                onToggleSelection={handleToggleSelection}
              />
            </div>
            {/* Mobile: show detail when conversation selected, Desktop: always show (hidden in selection mode) */}
            {!selectionMode && (
              <div
                className={`${
                  showMobileDetail ? 'flex' : 'hidden'
                } md:flex md:w-2/3 w-full bg-white rounded-lg shadow-sm overflow-hidden flex-col h-full min-h-0`}
              >
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
            )}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        open={showDeleteConfirm}
        title='Delete Conversation'
        message='Are you sure you want to delete this conversation? This action cannot be undone and all messages will be permanently deleted.'
        confirmLabel='Delete'
        cancelLabel='Cancel'
        variant='danger'
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* Bulk delete confirmation dialog */}
      <ConfirmDialog
        open={showBulkDeleteConfirm}
        title='Delete Conversations'
        message={`Are you sure you want to delete ${selectedConversationIds.length} conversation${selectedConversationIds.length === 1 ? '' : 's'}? This action cannot be undone and all messages will be permanently deleted.`}
        confirmLabel='Delete'
        cancelLabel='Cancel'
        variant='danger'
        onConfirm={handleBulkDeleteConfirm}
        onCancel={handleBulkDeleteCancel}
      />
    </DashboardLayout>
  )
}
