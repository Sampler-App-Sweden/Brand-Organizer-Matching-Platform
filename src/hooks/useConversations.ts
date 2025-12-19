import type { FormEvent } from 'react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { useAuth } from '../context/AuthContext'
import {
  getBrandConversations,
  getConversationMessages,
  getConversationsBySenderId,
  getOrganizerConversations,
  sendMessage
} from '../services/chatService'
import type { Conversation, Message } from '../services/chatService'
import {
  getBrandById,
  getBrandByUserId,
  getOrganizerById,
  getOrganizerByUserId
} from '../services/dataService'
import type { Brand } from '../types/brand'
import type { Organizer } from '../types/organizer'
import type { ConversationPhase, EnhancedConversation } from '../types/messages'
import { getFilteredConversations } from '../utils/messages'

export function useConversations() {
  const { currentUser } = useAuth()
  const [conversations, setConversations] = useState<EnhancedConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [phaseFilter, setPhaseFilter] = useState<ConversationPhase | 'all'>('all')
  const [sortBy, setSortBy] = useState<'recent' | 'unread'>('recent')
  const [showArchived, setShowArchived] = useState(false)
  const [partnerInfo, setPartnerInfo] = useState<Brand | Organizer | null>(null)
  const [userType, setUserType] = useState<'brand' | 'organizer'>('brand')
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageError, setMessageError] = useState<string | null>(null)
  const [conversationsError, setConversationsError] = useState<string | null>(null)

  const filteredConversations = useMemo(() => {
    let filtered = conversations

    // Filter by archived status
    if (!showArchived) {
      filtered = filtered.filter(c => !c.archived)
    }

    // Apply existing phase and sort filters
    return getFilteredConversations(filtered, phaseFilter, sortBy)
  }, [conversations, showArchived, phaseFilter, sortBy])

  const selectedConversationRef = useRef<string | null>(null)
  useEffect(() => {
    selectedConversationRef.current = selectedConversation
  }, [selectedConversation])

  const fetchMessages = useCallback(
    async (conversationId: string, options: { showLoading?: boolean } = { showLoading: true }) => {
      if (options.showLoading) {
        setMessagesLoading(true)
      }
      setMessageError(null)
      try {
        const messagesData = await getConversationMessages(conversationId)
        setMessages(messagesData)
        return messagesData
      } catch (error) {
        console.error('Failed to load messages:', error)
        setMessageError('Failed to load messages. Please try again.')
        setMessages([])
        return []
      } finally {
        if (options.showLoading) {
          setMessagesLoading(false)
        }
      }
    },
    []
  )

  const fetchPartnerDetails = useCallback(
    async (conversation: EnhancedConversation) => {
      const partnerType = userType === 'brand' ? 'organizer' : 'brand'
      const partnerId = partnerType === 'brand' ? conversation.brandId : conversation.organizerId
      const partnerData = partnerType === 'brand' ? await getBrandById(partnerId) : await getOrganizerById(partnerId)
      setPartnerInfo(partnerData)
    },
    [userType]
  )

  useEffect(() => {
    const loadConversations = async () => {
      if (!currentUser) {
        setConversations([])
        setSelectedConversation(null)
        setPartnerInfo(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setConversationsError(null)

      try {
        const derivedUserType = (currentUser.type as 'brand' | 'organizer') || 'brand'
        setUserType(derivedUserType)

        let rawConversations: Conversation[] = []

        if (derivedUserType === 'brand') {
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

        const sentConversations = await getConversationsBySenderId(currentUser.id)
        if (sentConversations.length) {
          const mergedMap = new Map<string, Conversation>()
          const mergedItems = [...rawConversations, ...sentConversations]
          mergedItems.forEach((conv) => {
            if (!mergedMap.has(conv.id)) {
              mergedMap.set(conv.id, conv)
            }
          })
          rawConversations = Array.from(mergedMap.values())
        }

        const enhancedConversations = await Promise.all(
          rawConversations.map(async (conv) => {
            const brandData = await getBrandById(conv.brandId)
            const organizerData = await getOrganizerById(conv.organizerId)

            const lastMessage = conv.messages.length > 0 ? conv.messages[conv.messages.length - 1] : null
            const lastMessageTime = lastMessage?.timestamp ? new Date(lastMessage.timestamp) : conv.lastActivity || conv.createdAt
            const awaitingReply = Boolean(
              lastMessage &&
                currentUser &&
                lastMessage.senderId === currentUser.id &&
                lastMessage.senderType === derivedUserType
            )

            // Placeholder data for unread and phase until backend supplies it
            const unreadCount = Math.floor(Math.random() * 3)
            const phases: ConversationPhase[] = ['inquiry', 'negotiation', 'contract_draft', 'completed']
            const phase = phases[Math.floor(Math.random() * phases.length)]
            const reference =
              derivedUserType === 'brand'
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
              lastMessageTime,
              unreadCount,
              phase,
              reference,
              awaitingReply,
              archived: conv.archived,
              readOnly: conv.readOnly,
              archivedAt: conv.archivedAt,
              archivedBy: conv.archivedBy
            }
          })
        )

        setConversations(enhancedConversations)

        const currentSelectedId = selectedConversationRef.current
        if (!currentSelectedId && enhancedConversations.length > 0) {
          setSelectedConversation(enhancedConversations[0].id)
        } else if (currentSelectedId && !enhancedConversations.some((conv) => conv.id === currentSelectedId)) {
          setSelectedConversation(enhancedConversations.length ? enhancedConversations[0].id : null)
        }

        if (!enhancedConversations.length) {
          setMessages([])
          setPartnerInfo(null)
        }
      } catch (error) {
        console.error('Failed to load conversations:', error)
        setConversationsError('Failed to load conversations. Please try again.')
        setConversations([])
        setSelectedConversation(null)
      } finally {
        setLoading(false)
      }
    }

    loadConversations()
  }, [currentUser])

  useEffect(() => {
    const hydrateSelection = async () => {
      if (!selectedConversation) {
        setMessages([])
        setPartnerInfo(null)
        return
      }

      const activeConversation = conversations.find((c) => c.id === selectedConversation)
      if (!activeConversation) return

      await fetchMessages(selectedConversation)
      await fetchPartnerDetails(activeConversation)
    }

    hydrateSelection()
  }, [selectedConversation, conversations, fetchMessages, fetchPartnerDetails])

  const handleSendMessage = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!selectedConversation || !newMessage.trim() || !currentUser) return
      try {
        setSendingMessage(true)
        setMessageError(null)
        await sendMessage(selectedConversation, currentUser.id, userType, newMessage)
        setNewMessage('')
        const updatedMessages = await fetchMessages(selectedConversation, { showLoading: false })
        const lastMessage = updatedMessages.length > 0 ? updatedMessages[updatedMessages.length - 1] : null
        setConversations((prev) =>
          prev.map((conversation) =>
            conversation.id === selectedConversation
              ? {
                  ...conversation,
                  lastMessage: lastMessage?.content || conversation.lastMessage,
                  lastMessageTime: lastMessage ? new Date(lastMessage.timestamp) : conversation.lastMessageTime,
                  awaitingReply: Boolean(
                    lastMessage &&
                      lastMessage.senderId === currentUser.id &&
                      lastMessage.senderType === userType
                  )
                }
              : conversation
          )
        )
      } catch (error) {
        console.error('Failed to send message:', error)
        setMessageError('Failed to send message. Please try again.')
      } finally {
        setSendingMessage(false)
      }
    },
    [currentUser, fetchMessages, newMessage, selectedConversation, userType]
  )

  const handleSelectConversation = useCallback((conversationId: string) => {
    if (conversationId === selectedConversation) return
    setSelectedConversation(conversationId)
  }, [selectedConversation])

  const handlePhaseUpdate = useCallback((phase: ConversationPhase) => {
    if (!selectedConversation) return
    setConversations((prev) =>
      prev.map((conversation) =>
        conversation.id === selectedConversation ? { ...conversation, phase } : conversation
      )
    )
  }, [selectedConversation])

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === selectedConversation),
    [conversations, selectedConversation]
  )

  const partnerDisplayName = partnerInfo
    ? userType === 'brand'
      ? (partnerInfo as Organizer).organizerName || 'Unknown Organizer'
      : (partnerInfo as Brand).companyName || 'Unknown Brand'
    : 'Unknown Partner'
  const partnerInitial = partnerDisplayName.charAt(0) || 'U'

  return {
    userType,
    loading,
    conversationsError,
    filteredConversations,
    selectedConversation,
    selectConversation: handleSelectConversation,
    activeConversation,
    partnerDisplayName,
    partnerInitial,
    hasPartnerInfo: Boolean(partnerInfo),
    messages,
    messagesLoading,
    messageError,
    newMessage,
    setNewMessage,
    sendingMessage,
    sendMessage: handleSendMessage,
    updatePhase: handlePhaseUpdate,
    phaseFilter,
    setPhaseFilter,
    sortBy,
    setSortBy,
    showArchived,
    setShowArchived
  }
}
