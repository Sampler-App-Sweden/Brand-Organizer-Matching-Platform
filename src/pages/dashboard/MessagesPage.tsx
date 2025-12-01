import React, { useEffect, useState } from 'react'
import { DashboardLayout } from '../../components/layout'
import { useAuth } from '../../context/AuthContext'
import {
  getBrandConversations,
  getConversationMessages,
  getOrganizerConversations,
  sendMessage,
  type Conversation,
  type Message
} from '../../services/chatService'
import {
  getBrandById,
  getBrandByUserId,
  getOrganizerById,
  getOrganizerByUserId
} from '../../services/dataService'
import {
  MessageSquareIcon,
  SendIcon,
  PaperclipIcon,
  ChevronDownIcon,
  Clock,
  CheckCircle,
  AlertCircle,
  FileTextIcon
} from 'lucide-react'
import { Button } from '../../components/ui'
import type { Brand } from '../../types/brand'
import type { Organizer } from '../../types/organizer'
// Conversation phase types
type ConversationPhase =
  | 'inquiry'
  | 'negotiation'
  | 'contract_draft'
  | 'completed'
// Extended conversation type with additional UI metadata
interface EnhancedConversation {
  id: string
  brandId: string
  organizerId: string
  brandName: string
  brandLogo?: string
  organizerName: string
  organizerLogo?: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
  phase: ConversationPhase
  reference: string // Product or event title
}
export function MessagesPage() {
  const { currentUser } = useAuth()
  const [conversations, setConversations] = useState<EnhancedConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [phaseFilter, setPhaseFilter] = useState<ConversationPhase | 'all'>(
    'all'
  )
  const [sortBy, setSortBy] = useState<'recent' | 'unread'>('recent')
  const [partnerInfo, setPartnerInfo] = useState<Brand | Organizer | null>(null)
  const [userType, setUserType] = useState<'brand' | 'organizer'>('brand')

  const partnerDisplayName = partnerInfo
    ? userType === 'brand'
      ? (partnerInfo as Organizer).organizerName || 'Unknown Organizer'
      : (partnerInfo as Brand).companyName || 'Unknown Brand'
    : 'Unknown Partner'
  const partnerInitial = partnerDisplayName.charAt(0) || 'U'
  useEffect(() => {
    const loadConversations = async () => {
      if (!currentUser) return
      setLoading(true)
      // Determine if the user is a brand or organizer
      const userType = currentUser.type as 'brand' | 'organizer'
      setUserType(userType)
      // Get conversations based on user type
      let rawConversations: Conversation[] = []
      if (userType === 'brand') {
        const brandData = await getBrandByUserId(currentUser.id)
        if (brandData) {
          rawConversations = await getBrandConversations(brandData.id)
        }
      } else {
        const organizerData = await getOrganizerByUserId(currentUser.id)
        if (organizerData) {
          rawConversations = await getOrganizerConversations(organizerData.id)
        }
      }
      // Enhance conversations with metadata
      const enhancedConversations = await Promise.all(
        rawConversations.map(async (conv) => {
          const brandData = await getBrandById(conv.brandId)
          const organizerData = await getOrganizerById(conv.organizerId)
          // Get last message
          const lastMessage =
            conv.messages.length > 0
              ? conv.messages[conv.messages.length - 1]
              : null
          // Mock unread count (in a real app, this would be stored in the database)
          const unreadCount = Math.floor(Math.random() * 3)
          // Mock phase (in a real app, this would be stored in the database)
          const phases: ConversationPhase[] = [
            'inquiry',
            'negotiation',
            'contract_draft',
            'completed'
          ]
          const phase = phases[Math.floor(Math.random() * phases.length)]
          // Reference is either the product name or event name
          const reference =
            userType === 'brand'
              ? organizerData?.eventName || 'Unknown Event'
              : brandData?.productName || 'Unknown Product'
          return {
            id: conv.id,
            brandId: conv.brandId,
            organizerId: conv.organizerId,
            brandName: brandData?.companyName || 'Unknown Brand',
            brandLogo:
              'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&h=250&q=80',
            organizerName: organizerData?.organizerName || 'Unknown Organizer',
            organizerLogo:
              'https://images.unsplash.com/photo-1561489404-42f5a5c8e0eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&h=250&q=80',
            lastMessage: lastMessage?.content || 'No messages yet',
            lastMessageTime: lastMessage?.timestamp || conv.createdAt,
            unreadCount,
            phase,
            reference
          }
        })
      )
      setConversations(enhancedConversations)
      // Select the first conversation by default if available
      if (enhancedConversations.length > 0 && !selectedConversation) {
        setSelectedConversation(enhancedConversations[0].id)
        loadMessages(enhancedConversations[0].id)
        // Load partner info
        const partnerType = userType === 'brand' ? 'organizer' : 'brand'
        const partnerId =
          partnerType === 'brand'
            ? enhancedConversations[0].brandId
            : enhancedConversations[0].organizerId
        const partnerData =
          partnerType === 'brand'
            ? await getBrandById(partnerId)
            : await getOrganizerById(partnerId)
        setPartnerInfo(partnerData)
      }
      setLoading(false)
    }
    loadConversations()
  }, [currentUser, selectedConversation])
  const loadMessages = async (conversationId: string) => {
    const messagesData = await getConversationMessages(conversationId)
    setMessages(messagesData)
  }
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedConversation || !newMessage.trim() || !currentUser) return
    await sendMessage(
      selectedConversation,
      currentUser.id,
      userType,
      newMessage
    )
    setNewMessage('')
    // Reload messages
    loadMessages(selectedConversation)
  }
  const handleSelectConversation = async (conversationId: string) => {
    setSelectedConversation(conversationId)
    loadMessages(conversationId)
    // Load partner info
    const conversation = conversations.find((c) => c.id === conversationId)
    if (conversation) {
      const partnerType = userType === 'brand' ? 'organizer' : 'brand'
      const partnerId =
        partnerType === 'brand'
          ? conversation.brandId
          : conversation.organizerId
      const partnerData =
        partnerType === 'brand'
          ? await getBrandById(partnerId)
          : await getOrganizerById(partnerId)
      setPartnerInfo(partnerData)
    }
  }
  const filterConversations = () => {
    let filtered = [...conversations]
    // Apply phase filter
    if (phaseFilter !== 'all') {
      filtered = filtered.filter((conv) => conv.phase === phaseFilter)
    }
    // Apply sorting
    if (sortBy === 'recent') {
      filtered.sort((a, b) => {
        return (
          new Date(b.lastMessageTime || 0).getTime() -
          new Date(a.lastMessageTime || 0).getTime()
        )
      })
    } else if (sortBy === 'unread') {
      filtered.sort((a, b) => b.unreadCount - a.unreadCount)
    }
    return filtered
  }
  const getPhaseColor = (phase: ConversationPhase) => {
    switch (phase) {
      case 'inquiry':
        return 'bg-purple-100 text-purple-800'
      case 'negotiation':
        return 'bg-amber-100 text-amber-800'
      case 'contract_draft':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  const getPhaseIcon = (phase: ConversationPhase) => {
    switch (phase) {
      case 'inquiry':
        return <MessageSquareIcon className='h-4 w-4' />
      case 'negotiation':
        return <Clock className='h-4 w-4' />
      case 'contract_draft':
        return <FileTextIcon className='h-4 w-4' />
      case 'completed':
        return <CheckCircle className='h-4 w-4' />
      default:
        return <AlertCircle className='h-4 w-4' />
    }
  }
  const getContextualCTA = (phase: ConversationPhase) => {
    switch (phase) {
      case 'inquiry':
        return 'Send Offer'
      case 'negotiation':
        return 'Request Update'
      case 'contract_draft':
        return 'Review Contract'
      case 'completed':
        return 'View Summary'
      default:
        return 'Continue'
    }
  }
  const formatPhaseLabel = (phase: ConversationPhase | 'all') => {
    if (phase === 'all') return 'All Phases'
    return phase.charAt(0).toUpperCase() + phase.slice(1).replace('_', ' ')
  }
  return (
    <DashboardLayout userType={userType}>
      <div className='flex flex-col h-[calc(100vh-9rem)]'>
        <div className='mb-4'>
          <h1 className='text-2xl font-bold text-gray-900'>Messages</h1>
          <p className='text-gray-600'>
            Manage your conversations with brands and organizers
          </p>
        </div>
        {/* Filters and controls */}
        <div className='bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div className='flex items-center'>
            <label
              htmlFor='phase-filter'
              className='mr-2 text-sm font-medium text-gray-700'
            >
              Phase:
            </label>
            <div className='relative'>
              <select
                id='phase-filter'
                className='appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                value={phaseFilter}
                onChange={(e) =>
                  setPhaseFilter(e.target.value as ConversationPhase | 'all')
                }
              >
                <option value='all'>All Phases</option>
                <option value='inquiry'>Inquiry</option>
                <option value='negotiation'>Negotiation</option>
                <option value='contract_draft'>Contract Draft</option>
                <option value='completed'>Completed</option>
              </select>
              <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                <ChevronDownIcon className='h-4 w-4 text-gray-400' />
              </div>
            </div>
          </div>
          <div className='flex items-center'>
            <span className='mr-2 text-sm font-medium text-gray-700'>
              Sort by:
            </span>
            <div className='flex rounded-md overflow-hidden border border-gray-300'>
              <button
                className={`px-3 py-1.5 text-sm ${
                  sortBy === 'recent'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700'
                }`}
                onClick={() => setSortBy('recent')}
              >
                Recent
              </button>
              <button
                className={`px-3 py-1.5 text-sm ${
                  sortBy === 'unread'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white text-gray-700'
                }`}
                onClick={() => setSortBy('unread')}
              >
                Unread
              </button>
            </div>
          </div>
        </div>
        {loading ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-gray-500'>Loading conversations...</div>
          </div>
        ) : (
          <div className='flex flex-1 gap-4 overflow-hidden'>
            {/* Conversation list */}
            <div className='w-full md:w-1/3 bg-white rounded-lg shadow-sm overflow-hidden flex flex-col'>
              <div className='overflow-y-auto flex-1'>
                {filterConversations().length === 0 ? (
                  <div className='p-6 text-center text-gray-500'>
                    No conversations found
                  </div>
                ) : (
                  <ul className='divide-y divide-gray-200'>
                    {filterConversations().map((conversation) => {
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
                          onClick={() =>
                            handleSelectConversation(conversation.id)
                          }
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
                                      {userType === 'brand'
                                        ? 'Organizer'
                                        : 'Brand'}
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
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPhaseColor(
                                  conversation.phase
                                )}`}
                              >
                                {getPhaseIcon(conversation.phase)}
                                <span className='ml-1'>
                                  {formatPhaseLabel(conversation.phase)}
                                </span>
                              </span>
                              <span className='text-xs text-gray-500'>
                                {conversation.lastMessageTime &&
                                  new Date(
                                    conversation.lastMessageTime
                                  ).toLocaleDateString()}
                              </span>
                            </div>
                            <p className='mt-2 text-sm text-gray-600 truncate'>
                              {conversation.lastMessage}
                            </p>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>
            </div>
            {/* Conversation detail */}
            <div className='hidden md:flex md:w-2/3 bg-white rounded-lg shadow-sm overflow-hidden flex-col'>
              {selectedConversation && partnerInfo ? (
                <>
                  {/* Conversation header */}
                  <div className='p-4 border-b border-gray-200 flex justify-between items-center'>
                    <div className='flex items-center'>
                      <div className='h-10 w-10 rounded-full overflow-hidden mr-3 bg-gray-200'>
                        {userType === 'brand' &&
                        conversations.find((c) => c.id === selectedConversation)
                          ?.organizerLogo ? (
                          <img
                            src={
                              conversations.find(
                                (c) => c.id === selectedConversation
                              )?.organizerLogo
                            }
                            alt={partnerDisplayName}
                            className='h-full w-full object-cover'
                          />
                        ) : userType === 'organizer' &&
                          conversations.find(
                            (c) => c.id === selectedConversation
                          )?.brandLogo ? (
                          <img
                            src={
                              conversations.find(
                                (c) => c.id === selectedConversation
                              )?.brandLogo
                            }
                            alt={partnerDisplayName}
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <div className='h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-800 font-bold'>
                            {partnerInitial}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className='font-medium text-gray-900'>
                          {partnerDisplayName}
                        </h3>
                        <p className='text-sm text-gray-600'>
                          {
                            conversations.find(
                              (c) => c.id === selectedConversation
                            )?.reference
                          }
                        </p>
                      </div>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <div className='relative'>
                        <select
                          className='appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
                          value={
                            conversations.find(
                              (c) => c.id === selectedConversation
                            )?.phase
                          }
                          onChange={(e) => {
                            // In a real app, this would update the phase in the database
                            const updatedConversations = conversations.map(
                              (c) =>
                                c.id === selectedConversation
                                  ? {
                                      ...c,
                                      phase: e.target.value as ConversationPhase
                                    }
                                  : c
                            )
                            setConversations(updatedConversations)
                          }}
                        >
                          <option value='inquiry'>Inquiry</option>
                          <option value='negotiation'>Negotiation</option>
                          <option value='contract_draft'>Contract Draft</option>
                          <option value='completed'>Completed</option>
                        </select>
                        <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                          <ChevronDownIcon className='h-4 w-4 text-gray-400' />
                        </div>
                      </div>
                      {conversations.find((c) => c.id === selectedConversation)
                        ?.phase === 'contract_draft' && (
                        <Button variant='outline' className='flex items-center'>
                          <FileTextIcon className='h-4 w-4 mr-1' />
                          View Contract
                        </Button>
                      )}
                      <Button variant='primary'>
                        {getContextualCTA(
                          conversations.find(
                            (c) => c.id === selectedConversation
                          )?.phase || 'inquiry'
                        )}
                      </Button>
                    </div>
                  </div>
                  {/* Messages */}
                  <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                    {messages.length === 0 ? (
                      <div className='flex flex-col items-center justify-center h-full text-gray-500'>
                        <MessageSquareIcon className='h-12 w-12 mb-2 text-gray-400' />
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.senderType === userType
                              ? 'justify-end'
                              : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs sm:max-w-md rounded-lg p-3 ${
                              message.senderType === 'ai'
                                ? 'bg-gray-100 text-gray-800'
                                : message.senderType === userType
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-800'
                            }`}
                          >
                            {message.senderType === 'ai' && (
                              <div className='text-xs font-medium text-gray-500 mb-1'>
                                AI Assistant
                              </div>
                            )}
                            <p className='text-sm'>{message.content}</p>
                            <div className='text-xs mt-1 text-right opacity-70'>
                              {new Date(message.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  {/* Message input */}
                  <div className='border-t border-gray-200 p-4'>
                    <form
                      onSubmit={handleSendMessage}
                      className='flex items-end'
                    >
                      <div className='flex-1 border rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500'>
                        <textarea
                          className='block w-full border-0 resize-none py-3 px-4 focus:outline-none focus:ring-0 sm:text-sm'
                          placeholder='Type a message...'
                          rows={2}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                        ></textarea>
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
                            disabled={!newMessage.trim()}
                            className='flex items-center'
                          >
                            <SendIcon className='h-4 w-4 mr-1' />
                            Send
                          </Button>
                        </div>
                      </div>
                    </form>
                  </div>
                </>
              ) : (
                <div className='flex flex-col items-center justify-center h-full text-gray-500'>
                  <MessageSquareIcon className='h-12 w-12 mb-2 text-gray-400' />
                  <p>Select a conversation to view messages</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
