// Chat service for AI-powered communication
export interface Message {
  id: string
  conversationId: string
  senderId: string
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
}
// Get or create a conversation between a brand and an organizer
export const getOrCreateConversation = (
  brandId: string,
  organizerId: string
): Conversation => {
  const conversations = JSON.parse(
    localStorage.getItem('conversations') || '[]'
  ) as Conversation[]
  let conversation = conversations.find(
    (c) => c.brandId === brandId && c.organizerId === organizerId
  )
  if (!conversation) {
    conversation = {
      id: `conv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      brandId,
      organizerId,
      messages: [],
      createdAt: new Date(),
      lastActivity: new Date()
    }
    conversations.push(conversation)
    localStorage.setItem('conversations', JSON.stringify(conversations))
  }
  return conversation
}
// Send a message in a conversation
export const sendMessage = (
  conversationId: string,
  senderId: string,
  senderType: 'brand' | 'organizer',
  content: string
): Message => {
  const conversations = JSON.parse(
    localStorage.getItem('conversations') || '[]'
  ) as Conversation[]
  const conversationIndex = conversations.findIndex(
    (c) => c.id === conversationId
  )
  if (conversationIndex === -1) {
    throw new Error('Conversation not found')
  }
  const message: Message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    conversationId,
    senderId,
    senderType,
    content,
    timestamp: new Date()
  }
  // Add the message to the conversation
  conversations[conversationIndex].messages.push(message)
  conversations[conversationIndex].lastActivity = new Date()
  localStorage.setItem('conversations', JSON.stringify(conversations))
  // Generate AI response if needed
  if (
    content.toLowerCase().includes('?') ||
    content.toLowerCase().includes('help') ||
    content.toLowerCase().includes('suggest')
  ) {
    const aiResponse = generateAIResponse(
      content,
      senderType,
      conversations[conversationIndex]
    )
    const aiMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      conversationId,
      senderId: 'ai-assistant',
      senderType: 'ai',
      content: aiResponse,
      timestamp: new Date()
    }
    conversations[conversationIndex].messages.push(aiMessage)
    conversations[conversationIndex].lastActivity = new Date()
    localStorage.setItem('conversations', JSON.stringify(conversations))
  }
  return message
}
// Get all messages in a conversation
export const getConversationMessages = (conversationId: string): Message[] => {
  const conversations = JSON.parse(
    localStorage.getItem('conversations') || '[]'
  ) as Conversation[]
  const conversation = conversations.find((c) => c.id === conversationId)
  if (!conversation) {
    return []
  }
  return conversation.messages
}
// Get all conversations for a brand
export const getBrandConversations = (brandId: string): Conversation[] => {
  const conversations = JSON.parse(
    localStorage.getItem('conversations') || '[]'
  ) as Conversation[]
  return conversations.filter((c) => c.brandId === brandId)
}
// Get all conversations for an organizer
export const getOrganizerConversations = (
  organizerId: string
): Conversation[] => {
  const conversations = JSON.parse(
    localStorage.getItem('conversations') || '[]'
  ) as Conversation[]
  return conversations.filter((c) => c.organizerId === organizerId)
}
// Get conversations where the current user has sent at least one message
export const getConversationsBySenderId = (userId: string): Conversation[] => {
  const conversations = JSON.parse(
    localStorage.getItem('conversations') || '[]'
  ) as Conversation[]
  return conversations.filter((conversation) =>
    conversation.messages.some((message) => message.senderId === userId)
  )
}

// Generate AI response based on message content
const generateAIResponse = (
  message: string,
  senderType: 'brand' | 'organizer',
  conversation: Conversation
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
