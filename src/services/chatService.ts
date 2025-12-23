import { supabase } from './supabaseClient'
import { notifyNewMessage } from './notificationService'
import { checkExistingMatch } from './dataService'
import { checkMutualConnection } from './connectionService'

// Chat service for AI-powered communication
export interface Message {
  id: string
  conversationId: string
  senderId: string | null
  senderType: 'brand' | 'organizer' | 'ai'
  content: string
  timestamp: Date
}

export interface Conversation {
  id: string
  brandId: string
  organizerId: string
  messages: Message[]
  createdAt: Date
  lastActivity: Date
  archived?: boolean
  readOnly?: boolean
  archivedAt?: Date
  archivedBy?: string
}

interface ConversationRow {
  id: string
  brand_id: string
  organizer_id: string
  created_at: string
  last_activity: string | null
  archived?: boolean
  read_only?: boolean
  archived_at?: string | null
  archived_by?: string | null
}

interface MessageRow {
  id: string
  conversation_id: string
  sender_id: string | null
  sender_type: 'brand' | 'organizer' | 'ai'
  content: string
  timestamp: string
}

const mapMessageRow = (row: MessageRow): Message => ({
  id: row.id,
  conversationId: row.conversation_id,
  senderId: row.sender_id,
  senderType: row.sender_type,
  content: row.content,
  timestamp: new Date(row.timestamp)
})

const mapConversationRow = (
  row: ConversationRow,
  messages: Message[] = []
): Conversation => ({
  id: row.id,
  brandId: row.brand_id,
  organizerId: row.organizer_id,
  messages,
  createdAt: new Date(row.created_at),
  lastActivity: new Date(row.last_activity ?? row.created_at),
  archived: row.archived ?? false,
  readOnly: row.read_only ?? false,
  archivedAt: row.archived_at ? new Date(row.archived_at) : undefined,
  archivedBy: row.archived_by ?? undefined
})

const hydrateConversations = async (
  rows: ConversationRow[]
): Promise<Conversation[]> => {
  if (!rows.length) return []

  const conversationIds = rows.map((row) => row.id)
  const { data: messageRows, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .in('conversation_id', conversationIds)
    .order('timestamp', { ascending: true })

  if (messagesError) {
    throw new Error(`Failed to load messages: ${messagesError.message}`)
  }

  const messagesByConversation = new Map<string, Message[]>()
  ;(messageRows as MessageRow[]).forEach((row) => {
    const existing = messagesByConversation.get(row.conversation_id) ?? []
    existing.push(mapMessageRow(row))
    messagesByConversation.set(row.conversation_id, existing)
  })

  return rows.map((row) =>
    mapConversationRow(row, messagesByConversation.get(row.id) ?? [])
  )
}

const fetchConversationById = async (
  conversationId: string
): Promise<Conversation | null> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', conversationId)
    .maybeSingle()

  if (error) {
    throw new Error(`Failed to load conversation: ${error.message}`)
  }

  if (!data) return null

  const messages = await getConversationMessages(conversationId)
  return mapConversationRow(data as ConversationRow, messages)
}

const shouldTriggerAIResponse = (content: string) => {
  const lowered = content.toLowerCase()
  return (
    lowered.includes('?') ||
    lowered.includes('help') ||
    lowered.includes('suggest')
  )
}

/**
 * Check if two users can start a conversation
 * Requires either an accepted match or mutual interest
 */
async function canStartConversation(
  brandId: string,
  organizerId: string
): Promise<boolean> {
  // Check for existing match (AI or manual)
  const match = await checkExistingMatch(brandId, organizerId)
  if (match && match.status === 'accepted') {
    return true
  }

  // Get user IDs from brand and organizer IDs
  const { data: brandData } = await supabase
    .from('brands')
    .select('user_id')
    .eq('id', brandId)
    .maybeSingle()

  const { data: organizerData } = await supabase
    .from('organizers')
    .select('user_id')
    .eq('id', organizerId)
    .maybeSingle()

  if (!brandData?.user_id || !organizerData?.user_id) {
    return false
  }

  // Check for mutual connection
  return await checkMutualConnection(brandData.user_id, organizerData.user_id)
}

// Get or create a conversation between a brand and an organizer
export const getOrCreateConversation = async (
  brandId: string,
  organizerId: string
): Promise<Conversation> => {
  // First check if archived conversation exists (allow read access)
  const { data: existingConversation, error: fetchError } = await supabase
    .from('conversations')
    .select('*')
    .eq('brand_id', brandId)
    .eq('organizer_id', organizerId)
    .maybeSingle()

  if (fetchError && fetchError.code !== 'PGRST116') {
    throw new Error(`Failed to fetch conversation: ${fetchError.message}`)
  }

  // If archived conversation exists, return it (read-only access)
  if (existingConversation && existingConversation.archived) {
    const messages = await getConversationMessages(existingConversation.id)
    return mapConversationRow(existingConversation as ConversationRow, messages)
  }

  // For new/active conversations, check access control
  const hasAccess = await canStartConversation(brandId, organizerId)
  if (!hasAccess) {
    throw new Error(
      'Cannot start conversation. Mutual match or interest required.'
    )
  }

  // If conversation doesn't exist, create it
  if (!existingConversation) {
    const { data: inserted, error: insertError } = await supabase
      .from('conversations')
      .insert({ brand_id: brandId, organizer_id: organizerId })
      .select('*')
      .single()

    if (insertError) {
      throw new Error(`Failed to create conversation: ${insertError.message}`)
    }

    return mapConversationRow(inserted as ConversationRow, [])
  }

  // Return existing active conversation
  const messages = await getConversationMessages(existingConversation.id)
  return mapConversationRow(existingConversation as ConversationRow, messages)
}

// Send a message in a conversation
export const sendMessage = async (
  conversationId: string,
  senderId: string,
  senderType: 'brand' | 'organizer',
  content: string
): Promise<Message> => {
  // Check if conversation is read-only
  const { data: conversation, error: fetchError } = await supabase
    .from('conversations')
    .select('read_only, archived')
    .eq('id', conversationId)
    .single()

  if (fetchError) {
    throw new Error(`Failed to fetch conversation: ${fetchError.message}`)
  }

  if (conversation.read_only) {
    throw new Error(
      'This conversation has been archived and is read-only. You cannot send new messages.'
    )
  }

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      sender_type: senderType,
      content
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to send message: ${error.message}`)
  }

  await supabase
    .from('conversations')
    .update({ last_activity: new Date().toISOString() })
    .eq('id', conversationId)

  const message = mapMessageRow(data as MessageRow)

  // Create notification for recipient (non-blocking)
  notifyNewMessage(conversationId, senderId, content).catch((error) => {
    console.error('Failed to create message notification:', error)
  })

  if (shouldTriggerAIResponse(content)) {
    const conversation = await fetchConversationById(conversationId)
    if (conversation) {
      const aiResponse = generateAIResponse(content, senderType)

      const { error: aiError } = await supabase.from('messages').insert({
        conversation_id: conversationId,
        sender_id: null,
        sender_type: 'ai',
        content: aiResponse
      })

      if (!aiError) {
        await supabase
          .from('conversations')
          .update({ last_activity: new Date().toISOString() })
          .eq('id', conversationId)
      }
    }
  }

  return message
}

// Get all messages in a conversation
export const getConversationMessages = async (
  conversationId: string
): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('timestamp', { ascending: true })

  if (error) {
    throw new Error(`Failed to fetch messages: ${error.message}`)
  }

  return (data as MessageRow[]).map(mapMessageRow)
}

// Get all conversations for a brand
export const getBrandConversations = async (
  brandId: string
): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('brand_id', brandId)
    .order('last_activity', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch brand conversations: ${error.message}`)
  }

  return hydrateConversations(data as ConversationRow[])
}

// Get all conversations for an organizer
export const getOrganizerConversations = async (
  organizerId: string
): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('organizer_id', organizerId)
    .order('last_activity', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch organizer conversations: ${error.message}`)
  }

  return hydrateConversations(data as ConversationRow[])
}

// Get conversations where the current user has sent at least one message
export const getConversationsBySenderId = async (
  userId: string
): Promise<Conversation[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('conversation_id')
    .eq('sender_id', userId)

  if (error) {
    throw new Error(`Failed to fetch sent conversations: ${error.message}`)
  }

  const conversationIds = Array.from(
    new Set(
      (data as { conversation_id: string }[]).map((row) => row.conversation_id)
    )
  )

  if (!conversationIds.length) return []

  const { data: conversationRows, error: conversationsError } = await supabase
    .from('conversations')
    .select('*')
    .in('id', conversationIds)

  if (conversationsError) {
    throw new Error(
      `Failed to fetch conversations by sender: ${conversationsError.message}`
    )
  }

  return hydrateConversations(conversationRows as ConversationRow[])
}

// Generate AI response based on message content
const generateAIResponse = (
  message: string,
  senderType: 'brand' | 'organizer'
): string => {
  const lowercaseMessage = message.toLowerCase()
  // Pricing and budget questions
  if (
    lowercaseMessage.includes('price') ||
    lowercaseMessage.includes('cost') ||
    lowercaseMessage.includes('budget')
  ) {
    if (senderType === 'brand') {
      return 'Based on similar events, I recommend discussing specific sponsorship tiers. You might consider asking about their standard packages and what each level includes in terms of visibility and engagement opportunities.'
    } else {
      return "When discussing pricing with brands, it's helpful to offer clear sponsorship tiers with specific benefits for each level. Consider asking about their budget range to tailor your proposal accordingly."
    }
  }
  // Timeline questions
  if (
    lowercaseMessage.includes('when') ||
    lowercaseMessage.includes('timeline') ||
    lowercaseMessage.includes('deadline')
  ) {
    return "It's important to establish a clear timeline for this partnership. I suggest discussing key dates including: decision deadline, materials needed by, and any promotional lead time required."
  }
  // Value proposition questions
  if (
    lowercaseMessage.includes('benefit') ||
    lowercaseMessage.includes('value') ||
    lowercaseMessage.includes('offer')
  ) {
    if (senderType === 'brand') {
      return 'When evaluating this opportunity, consider asking about: attendee engagement metrics from past events, demographic breakdown, and specific visibility opportunities for your brand.'
    } else {
      return "To effectively communicate your value, highlight specific metrics from past events like attendee satisfaction rates, demographic details, and engagement statistics that would appeal to this brand's target audience."
    }
  }
  // Logistics questions
  if (
    lowercaseMessage.includes('logistics') ||
    lowercaseMessage.includes('setup') ||
    lowercaseMessage.includes('requirements')
  ) {
    return 'Logistics are crucial for a successful partnership. I recommend discussing: space requirements, setup/breakdown times, staffing needs, and any technical specifications needed for your activation.'
  }
  // Contract and terms questions
  if (
    lowercaseMessage.includes('contract') ||
    lowercaseMessage.includes('terms') ||
    lowercaseMessage.includes('agreement')
  ) {
    return "For a smooth partnership, it's good to clarify terms early. Consider discussing: payment schedule, cancellation policies, exclusivity clauses, and deliverables timeline."
  }
  // Default helpful response
  if (senderType === 'brand') {
    return 'As you continue this conversation, consider asking about specific audience demographics, engagement opportunities, and how your brand will be showcased at the event. Would you like me to suggest some specific questions to ask the organizer?'
  } else {
    return "To move this partnership forward, consider providing more details about your event's unique value proposition and specific ways this brand can connect with your audience. Would you like me to suggest some talking points to highlight with this potential sponsor?"
  }
}

// Archive a conversation (mark as read-only and archived)
export const archiveConversation = async (
  conversationId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('conversations')
      .update({
        archived: true,
        read_only: true,
        archived_at: new Date().toISOString(),
        archived_by: userId
      })
      .eq('id', conversationId)

    if (error) {
      return {
        success: false,
        error: `Failed to archive conversation: ${error.message}`
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error archiving conversation: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Delete a conversation permanently (hard delete)
export const deleteConversation = async (
  conversationId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    // Delete the conversation (messages will cascade delete if foreign key is configured)
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId)

    if (error) {
      return {
        success: false,
        error: `Failed to delete conversation: ${error.message}`
      }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error deleting conversation: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Bulk archive conversations
export const bulkArchiveConversations = async (
  conversationIds: string[],
  userId: string
): Promise<{ success: boolean; error?: string; count?: number }> => {
  try {
    if (conversationIds.length === 0) {
      return { success: true, count: 0 }
    }

    const { error, count } = await supabase
      .from('conversations')
      .update({
        archived: true,
        read_only: true,
        archived_at: new Date().toISOString(),
        archived_by: userId
      })
      .in('id', conversationIds)

    if (error) {
      return {
        success: false,
        error: `Failed to archive conversations: ${error.message}`
      }
    }

    return { success: true, count: count || conversationIds.length }
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error archiving conversations: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Bulk delete conversations permanently
export const bulkDeleteConversations = async (
  conversationIds: string[]
): Promise<{ success: boolean; error?: string; count?: number }> => {
  try {
    if (conversationIds.length === 0) {
      return { success: true, count: 0 }
    }

    const { error, count } = await supabase
      .from('conversations')
      .delete()
      .in('id', conversationIds)

    if (error) {
      return {
        success: false,
        error: `Failed to delete conversations: ${error.message}`
      }
    }

    return { success: true, count: count || conversationIds.length }
  } catch (error) {
    return {
      success: false,
      error: `Unexpected error deleting conversations: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}
