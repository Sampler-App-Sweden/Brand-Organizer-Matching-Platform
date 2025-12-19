import { supabase } from './supabaseClient'
import type { NotificationType } from '../types/notifications'

/**
 * Core notification creation function
 * Inserts a notification directly into the Supabase notifications table
 *
 * @param userId - The user_id (auth.users.id) who should receive the notification
 * @param title - Notification title
 * @param message - Notification message content
 * @param type - Notification type: 'match' | 'message' | 'system' | 'profile_update'
 * @param relatedId - Optional ID of the related entity (messageId, matchId, etc.)
 */
export async function createNotification(
  userId: string,
  title: string,
  message: string,
  type: NotificationType,
  relatedId?: string
): Promise<void> {
  try {
    const { error } = await supabase.from('notifications').insert({
      user_id: userId,
      title,
      message,
      type,
      related_id: relatedId,
      read: false
    })

    if (error) {
      throw error
    }
  } catch (error) {
    console.error('Failed to create notification:', error)
    throw error
  }
}

/**
 * Get user_id from brand_id
 */
export async function getUserIdFromBrandId(
  brandId: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('user_id')
      .eq('id', brandId)
      .maybeSingle()

    if (error) throw error
    return data?.user_id ?? null
  } catch (error) {
    console.error('Failed to get user_id from brand_id:', error)
    return null
  }
}

/**
 * Get user_id from organizer_id
 */
export async function getUserIdFromOrganizerId(
  organizerId: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('organizers')
      .select('user_id')
      .eq('id', organizerId)
      .maybeSingle()

    if (error) throw error
    return data?.user_id ?? null
  } catch (error) {
    console.error('Failed to get user_id from organizer_id:', error)
    return null
  }
}

/**
 * Get recipient's user_id from a conversation
 * Returns the user_id of the person who is NOT the sender
 */
export async function getRecipientUserIdFromConversation(
  conversationId: string,
  senderUserId: string
): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select(
        `
        brand_id,
        organizer_id,
        brands!inner(user_id),
        organizers!inner(user_id)
      `
      )
      .eq('id', conversationId)
      .maybeSingle()

    if (error) throw error
    if (!data) return null

    // Get both user_ids
    const brandUserId = (data.brands as unknown as { user_id: string })?.user_id
    const organizerUserId = (data.organizers as unknown as { user_id: string })
      ?.user_id

    // Return the one that's not the sender
    if (brandUserId === senderUserId) {
      return organizerUserId
    } else if (organizerUserId === senderUserId) {
      return brandUserId
    }

    return null
  } catch (error) {
    console.error('Failed to get recipient user_id from conversation:', error)
    return null
  }
}

/**
 * Get all user_ids who saved a specific profile
 */
export async function getUsersWhoSavedProfile(
  profileId: string
): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('saved_profiles')
      .select('user_id')
      .eq('profile_id', profileId)

    if (error) throw error
    return (data ?? []).map((record) => record.user_id)
  } catch (error) {
    console.error('Failed to get users who saved profile:', error)
    return []
  }
}

/**
 * Get user's name from their profile
 */
export async function getUserName(userId: string): Promise<string> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', userId)
      .maybeSingle()

    if (error) throw error
    return data?.name ?? 'Someone'
  } catch (error) {
    console.error('Failed to get user name:', error)
    return 'Someone'
  }
}

/**
 * Notify both parties when a new match is created
 * Creates two separate notifications with personalized messages
 */
export async function notifyNewMatch(
  brandId: string,
  organizerId: string,
  matchId: string
): Promise<void> {
  try {
    // Get user IDs
    const brandUserId = await getUserIdFromBrandId(brandId)
    const organizerUserId = await getUserIdFromOrganizerId(organizerId)

    // Get names for personalized messages
    const brandName = await getUserName(brandUserId ?? '')
    const organizerName = await getUserName(organizerUserId ?? '')

    // Notify brand
    if (brandUserId) {
      await createNotification(
        brandUserId,
        'New Match Found!',
        `You've been matched with ${organizerName}. Check out this opportunity!`,
        'match',
        matchId
      )
    }

    // Notify organizer
    if (organizerUserId) {
      await createNotification(
        organizerUserId,
        'New Match Found!',
        `You've been matched with ${brandName}. Check out this potential sponsor!`,
        'match',
        matchId
      )
    }
  } catch (error) {
    console.error('Failed to notify new match:', error)
    throw error
  }
}

/**
 * Notify recipient when they receive a new message
 */
export async function notifyNewMessage(
  conversationId: string,
  senderUserId: string,
  messageContent: string
): Promise<void> {
  try {
    // Get recipient's user_id
    const recipientUserId = await getRecipientUserIdFromConversation(
      conversationId,
      senderUserId
    )

    if (!recipientUserId) {
      console.warn('Could not find recipient for conversation:', conversationId)
      return
    }

    // Get sender's name
    const senderName = await getUserName(senderUserId)

    // Create message preview (first 100 chars)
    const messagePreview =
      messageContent.length > 100
        ? messageContent.substring(0, 100) + '...'
        : messageContent

    await createNotification(
      recipientUserId,
      `New message from ${senderName}`,
      messagePreview,
      'message',
      conversationId
    )
  } catch (error) {
    console.error('Failed to notify new message:', error)
    throw error
  }
}

/**
 * Notify all users who saved a profile when it gets updated
 */
export async function notifyProfileUpdate(
  profileId: string,
  profileName: string,
  updateType: string
): Promise<void> {
  try {
    // Get all users who saved this profile
    const saverUserIds = await getUsersWhoSavedProfile(profileId)

    if (saverUserIds.length === 0) {
      return // No one to notify
    }

    // Create notifications for all savers
    const notificationPromises = saverUserIds.map((userId) =>
      createNotification(
        userId,
        'Profile Updated',
        `${profileName} has updated their ${updateType}. Check out what's new!`,
        'profile_update',
        profileId
      ).catch((error) => {
        console.error(
          `Failed to create profile update notification for user ${userId}:`,
          error
        )
      })
    )

    await Promise.allSettled(notificationPromises)
  } catch (error) {
    console.error('Failed to notify profile update:', error)
    throw error
  }
}

/**
 * Create a system notification for a specific user
 * Used for events like publishing, status changes, etc.
 */
export async function notifySystemEvent(
  userId: string,
  title: string,
  message: string,
  relatedId?: string
): Promise<void> {
  try {
    await createNotification(userId, title, message, 'system', relatedId)
  } catch (error) {
    console.error('Failed to create system notification:', error)
    throw error
  }
}

/**
 * Notify user when someone expresses interest in their profile
 */
export async function notifyInterestReceived(
  receiverId: string,
  senderName: string,
  interestId: string
): Promise<void> {
  try {
    await createNotification(
      receiverId,
      'Someone is interested!',
      `${senderName} expressed interest in your profile. Check it out!`,
      'match',
      interestId
    )
  } catch (error) {
    console.error('Failed to notify interest received:', error)
    throw error
  }
}

/**
 * Notify user when their interest expression is accepted
 */
export async function notifyInterestAccepted(
  senderId: string,
  receiverName: string,
  interestId: string
): Promise<void> {
  try {
    await createNotification(
      senderId,
      'Interest Accepted!',
      `${receiverName} accepted your interest. You can now start a conversation!`,
      'match',
      interestId
    )
  } catch (error) {
    console.error('Failed to notify interest accepted:', error)
    throw error
  }
}

/**
 * Notify both parties when mutual interest creates a match
 */
export async function notifyMutualMatch(
  brandId: string,
  organizerId: string,
  matchId: string
): Promise<void> {
  try {
    // Get user IDs
    const brandUserId = await getUserIdFromBrandId(brandId)
    const organizerUserId = await getUserIdFromOrganizerId(organizerId)

    // Get names
    const brandName = await getUserName(brandUserId ?? '')
    const organizerName = await getUserName(organizerUserId ?? '')

    // Notify brand
    if (brandUserId) {
      await createNotification(
        brandUserId,
        "It's a Match!",
        `You and ${organizerName} have mutual interest! Start your conversation now.`,
        'match',
        matchId
      )
    }

    // Notify organizer
    if (organizerUserId) {
      await createNotification(
        organizerUserId,
        "It's a Match!",
        `You and ${brandName} have mutual interest! Start your conversation now.`,
        'match',
        matchId
      )
    }
  } catch (error) {
    console.error('Failed to notify mutual match:', error)
    throw error
  }
}
