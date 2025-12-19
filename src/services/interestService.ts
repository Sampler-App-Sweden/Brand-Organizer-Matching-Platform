import { supabase } from './supabaseClient'
import {
  Interest,
  InterestRow,
  EnhancedInterest,
  InterestStats
} from '../types/interest'
import { getBrandById, getOrganizerById } from './dataService'
import { notifyInterestReceived, notifyInterestAccepted, notifyMutualMatch } from './notificationService'

/**
 * Map database row to Interest object
 */
const mapInterestRowToInterest = (row: InterestRow): Interest => ({
  id: row.id,
  senderId: row.sender_id,
  senderType: row.sender_type,
  receiverId: row.receiver_id,
  receiverType: row.receiver_type,
  brandId: row.brand_id,
  organizerId: row.organizer_id,
  status: row.status,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at)
})

/**
 * Get brand and organizer IDs for a user pair
 */
async function getBrandOrganizerIds(
  senderId: string,
  senderType: 'brand' | 'organizer',
  receiverId: string
): Promise<{ brandId: string; organizerId: string }> {
  let brandUserId: string, organizerUserId: string

  if (senderType === 'brand') {
    brandUserId = senderId
    organizerUserId = receiverId
  } else {
    brandUserId = receiverId
    organizerUserId = senderId
  }

  // Get brand and organizer records
  const { data: brandData, error: brandError } = await supabase
    .from('brands')
    .select('id')
    .eq('user_id', brandUserId)
    .maybeSingle()

  if (brandError) {
    throw new Error(`Failed to find brand: ${brandError.message}`)
  }
  if (!brandData) {
    throw new Error('Brand profile not found')
  }

  const { data: organizerData, error: organizerError } = await supabase
    .from('organizers')
    .select('id')
    .eq('user_id', organizerUserId)
    .maybeSingle()

  if (organizerError) {
    throw new Error(`Failed to find organizer: ${organizerError.message}`)
  }
  if (!organizerData) {
    throw new Error('Organizer profile not found')
  }

  return {
    brandId: brandData.id,
    organizerId: organizerData.id
  }
}

/**
 * Express interest in another user's profile
 */
export async function expressInterest(
  senderId: string,
  senderType: 'brand' | 'organizer',
  receiverId: string,
  receiverType: 'brand' | 'organizer'
): Promise<Interest> {
  // Validation
  if (senderId === receiverId) {
    throw new Error('Cannot express interest in yourself')
  }

  if (senderType === receiverType) {
    throw new Error('Can only express interest between brands and organizers')
  }

  // Check for existing interest
  const existing = await checkExistingInterest(senderId, receiverId)
  if (existing) {
    if (existing.status === 'pending') {
      throw new Error('Interest already expressed')
    }
    if (existing.status === 'accepted') {
      throw new Error('Interest already accepted')
    }
    // If rejected or withdrawn, allow re-expressing
  }

  // Get brand and organizer IDs
  const { brandId, organizerId } = await getBrandOrganizerIds(
    senderId,
    senderType,
    receiverId
  )

  // Create interest record
  const { data, error } = await supabase
    .from('interests')
    .insert({
      sender_id: senderId,
      sender_type: senderType,
      receiver_id: receiverId,
      receiver_type: receiverType,
      brand_id: brandId,
      organizer_id: organizerId,
      status: 'pending'
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to express interest: ${error.message}`)
  }

  const interest = mapInterestRowToInterest(data as InterestRow)

  // Check for reverse interest (mutual interest)
  const reverseInterest = await checkExistingInterest(receiverId, senderId)

  if (reverseInterest && reverseInterest.status === 'pending') {
    // Mutual interest! Update both to accepted
    await respondToInterest(interest.id, 'accepted')
    await respondToInterest(reverseInterest.id, 'accepted')

    // Create a manual match
    await createManualMatch(brandId, organizerId)

    // Notify both parties of mutual match
    await notifyMutualMatch(brandId, organizerId, interest.id).catch((error) => {
      console.error('Failed to send mutual match notification:', error)
    })
  } else {
    // One-way interest, notify receiver
    let senderName: string
    if (senderType === 'brand') {
      const brandProfile = await getBrandById(brandId)
      senderName = brandProfile?.companyName || 'A brand'
    } else {
      const organizerProfile = await getOrganizerById(organizerId)
      senderName = organizerProfile?.organizerName || 'An organizer'
    }

    await notifyInterestReceived(receiverId, senderName, interest.id).catch((error) => {
      console.error('Failed to send interest notification:', error)
    })
  }

  return interest
}

/**
 * Get all interests sent by a user
 */
export async function getSentInterests(userId: string): Promise<Interest[]> {
  const { data, error } = await supabase
    .from('interests')
    .select('*')
    .eq('sender_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch sent interests: ${error.message}`)
  }

  return (data as InterestRow[]).map(mapInterestRowToInterest)
}

/**
 * Get all interests received by a user
 */
export async function getReceivedInterests(userId: string): Promise<Interest[]> {
  const { data, error } = await supabase
    .from('interests')
    .select('*')
    .eq('receiver_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch received interests: ${error.message}`)
  }

  return (data as InterestRow[]).map(mapInterestRowToInterest)
}

/**
 * Get mutual interests for a user
 */
export async function getMutualInterests(userId: string): Promise<Interest[]> {
  const sent = await getSentInterests(userId)
  const received = await getReceivedInterests(userId)

  const mutualInterests: Interest[] = []

  // Find interests where both parties expressed interest
  for (const sentInterest of sent) {
    const hasReverse = received.some(
      (r) =>
        r.senderId === sentInterest.receiverId &&
        r.receiverId === sentInterest.senderId &&
        (r.status === 'pending' || r.status === 'accepted')
    )

    if (hasReverse && (sentInterest.status === 'pending' || sentInterest.status === 'accepted')) {
      mutualInterests.push(sentInterest)
    }
  }

  return mutualInterests
}

/**
 * Check if an interest exists between two users
 */
export async function checkExistingInterest(
  senderId: string,
  receiverId: string
): Promise<Interest | null> {
  const { data, error } = await supabase
    .from('interests')
    .select('*')
    .eq('sender_id', senderId)
    .eq('receiver_id', receiverId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to check existing interest: ${error.message}`)
  }

  return data ? mapInterestRowToInterest(data as InterestRow) : null
}

/**
 * Check if two users have mutual interest
 */
export async function checkMutualInterest(
  userId1: string,
  userId2: string
): Promise<boolean> {
  const interest1 = await checkExistingInterest(userId1, userId2)
  const interest2 = await checkExistingInterest(userId2, userId1)

  return !!(
    interest1 &&
    interest2 &&
    (interest1.status === 'pending' || interest1.status === 'accepted') &&
    (interest2.status === 'pending' || interest2.status === 'accepted')
  )
}

/**
 * Respond to an interest (accept or reject)
 */
export async function respondToInterest(
  interestId: string,
  status: 'accepted' | 'rejected'
): Promise<Interest> {
  const { data, error } = await supabase
    .from('interests')
    .update({ status })
    .eq('id', interestId)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to respond to interest: ${error.message}`)
  }

  const interest = mapInterestRowToInterest(data as InterestRow)

  // If accepted, check if this creates a mutual match
  if (status === 'accepted') {
    const isMutual = await checkMutualInterest(interest.senderId, interest.receiverId)

    if (isMutual) {
      // Create manual match
      await createManualMatch(interest.brandId, interest.organizerId)

      // Notify both parties
      await notifyMutualMatch(interest.brandId, interest.organizerId, interest.id).catch((error) => {
        console.error('Failed to send mutual match notification:', error)
      })
    } else {
      // Just notify the sender that their interest was accepted
      let receiverName: string
      if (interest.receiverType === 'brand') {
        const brandProfile = await getBrandById(interest.brandId)
        receiverName = brandProfile?.companyName || 'The brand'
      } else {
        const organizerProfile = await getOrganizerById(interest.organizerId)
        receiverName = organizerProfile?.organizerName || 'The organizer'
      }

      await notifyInterestAccepted(interest.senderId, receiverName, interest.id).catch((error) => {
        console.error('Failed to send interest accepted notification:', error)
      })
    }
  }
  // No notification sent for rejections - silent operation

  return interest
}

/**
 * Withdraw interest and handle mutual match cleanup
 * - If mutual match exists: mark match as inactive, archive conversation
 * - Conversation remains accessible (read-only)
 * - Messages are preserved
 */
export async function withdrawInterest(interestId: string): Promise<void> {
  // Step 1: Fetch the interest to get context
  const { data: interestData, error: fetchError } = await supabase
    .from('interests')
    .select('*')
    .eq('id', interestId)
    .single()

  if (fetchError) {
    throw new Error(`Failed to fetch interest: ${fetchError.message}`)
  }

  const interest = mapInterestRowToInterest(interestData as InterestRow)

  // Step 2: Check for mutual match
  const isMutual = await checkMutualInterest(interest.senderId, interest.receiverId)

  // Step 3: Update interest to withdrawn
  const { error: updateError } = await supabase
    .from('interests')
    .update({ status: 'withdrawn' })
    .eq('id', interestId)
    .in('status', ['pending', 'accepted'])

  if (updateError) {
    throw new Error(`Failed to withdraw interest: ${updateError.message}`)
  }

  // Step 4: If mutual match exists, handle cleanup
  if (isMutual) {
    const { data: { user } } = await supabase.auth.getUser()

    // Mark match as inactive (don't delete)
    await supabase
      .from('matches')
      .update({ status: 'inactive' })
      .eq('brand_id', interest.brandId)
      .eq('organizer_id', interest.organizerId)
      .in('status', ['pending', 'accepted'])
      .then(({ error }) => {
        if (error) console.error('Failed to mark match as inactive:', error)
      })

    // Archive conversation (mark as read-only, keep accessible)
    await supabase
      .from('conversations')
      .update({
        archived: true,
        read_only: true,
        archived_at: new Date().toISOString(),
        archived_by: user?.id || null
      })
      .eq('brand_id', interest.brandId)
      .eq('organizer_id', interest.organizerId)
      .then(({ error }) => {
        if (error) console.error('Failed to archive conversation:', error)
      })
  }
}

/**
 * Get interest status between current user and a profile
 * Returns 'none', 'sent', 'received', or 'mutual'
 */
export async function getInterestStatus(
  currentUserId: string,
  profileUserId: string
): Promise<'none' | 'sent' | 'received' | 'mutual'> {
  if (!currentUserId || !profileUserId || currentUserId === profileUserId) {
    return 'none'
  }

  const sentInterest = await checkExistingInterest(currentUserId, profileUserId)
  const receivedInterest = await checkExistingInterest(profileUserId, currentUserId)

  // Check if both interests exist and are active (pending or accepted)
  const sentActive = sentInterest && (sentInterest.status === 'pending' || sentInterest.status === 'accepted')
  const receivedActive = receivedInterest && (receivedInterest.status === 'pending' || receivedInterest.status === 'accepted')

  if (sentActive && receivedActive) {
    return 'mutual'
  } else if (sentActive) {
    return 'sent'
  } else if (receivedActive) {
    return 'received'
  }

  return 'none'
}

/**
 * Get interest statuses for multiple profiles in batch (optimized for directory views)
 * Returns a map of profileUserId -> InterestStatus
 */
export async function getBatchInterestStatuses(
  currentUserId: string,
  profileUserIds: string[]
): Promise<Map<string, 'none' | 'sent' | 'received' | 'mutual'>> {
  const statusMap = new Map<string, 'none' | 'sent' | 'received' | 'mutual'>()

  if (!currentUserId || profileUserIds.length === 0) {
    return statusMap
  }

  // Filter out current user
  const otherUserIds = profileUserIds.filter(id => id !== currentUserId)

  if (otherUserIds.length === 0) {
    return statusMap
  }

  // Fetch all interests sent by current user to these profiles
  const { data: sentInterests, error: sentError } = await supabase
    .from('interests')
    .select('*')
    .eq('sender_id', currentUserId)
    .in('receiver_id', otherUserIds)
    .in('status', ['pending', 'accepted'])

  if (sentError) {
    console.error('Failed to fetch sent interests:', sentError)
  }

  // Fetch all interests received by current user from these profiles
  const { data: receivedInterests, error: receivedError } = await supabase
    .from('interests')
    .select('*')
    .eq('receiver_id', currentUserId)
    .in('sender_id', otherUserIds)
    .in('status', ['pending', 'accepted'])

  if (receivedError) {
    console.error('Failed to fetch received interests:', receivedError)
  }

  // Create lookup maps
  const sentMap = new Map<string, boolean>()
  const receivedMap = new Map<string, boolean>()

  sentInterests?.forEach(interest => {
    sentMap.set(interest.receiver_id, true)
  })

  receivedInterests?.forEach(interest => {
    receivedMap.set(interest.sender_id, true)
  })

  // Determine status for each profile
  otherUserIds.forEach(profileUserId => {
    const hasSent = sentMap.has(profileUserId)
    const hasReceived = receivedMap.has(profileUserId)

    if (hasSent && hasReceived) {
      statusMap.set(profileUserId, 'mutual')
    } else if (hasSent) {
      statusMap.set(profileUserId, 'sent')
    } else if (hasReceived) {
      statusMap.set(profileUserId, 'received')
    } else {
      statusMap.set(profileUserId, 'none')
    }
  })

  return statusMap
}

/**
 * Get interest statistics for a user
 */
export async function getInterestStats(userId: string): Promise<InterestStats> {
  const sent = await getSentInterests(userId)
  const received = await getReceivedInterests(userId)
  const mutual = await getMutualInterests(userId)

  return {
    sent: {
      pending: sent.filter((i) => i.status === 'pending').length,
      accepted: sent.filter((i) => i.status === 'accepted').length,
      rejected: sent.filter((i) => i.status === 'rejected').length,
      total: sent.length
    },
    received: {
      pending: received.filter((i) => i.status === 'pending').length,
      accepted: received.filter((i) => i.status === 'accepted').length,
      rejected: received.filter((i) => i.status === 'rejected').length,
      total: received.length
    },
    mutual: mutual.length
  }
}

/**
 * Create a manual match from mutual interest
 */
async function createManualMatch(brandId: string, organizerId: string): Promise<void> {
  // Check if match already exists
  const { data: existingMatch } = await supabase
    .from('matches')
    .select('*')
    .eq('brand_id', brandId)
    .eq('organizer_id', organizerId)
    .maybeSingle()

  if (existingMatch) {
    // Update to hybrid if it was AI-generated
    if (existingMatch.match_source === 'ai') {
      await supabase
        .from('matches')
        .update({ match_source: 'hybrid', status: 'accepted' })
        .eq('id', existingMatch.id)
    } else {
      // Just update status to accepted
      await supabase
        .from('matches')
        .update({ status: 'accepted' })
        .eq('id', existingMatch.id)
    }
  } else {
    // Create new manual match
    await supabase.from('matches').insert({
      brand_id: brandId,
      organizer_id: organizerId,
      score: 0,
      match_reasons: ['Mutual interest expressed'],
      status: 'accepted',
      match_source: 'manual'
    })
  }

  // Create conversation if it doesn't exist
  const { data: existingConversation } = await supabase
    .from('conversations')
    .select('*')
    .eq('brand_id', brandId)
    .eq('organizer_id', organizerId)
    .maybeSingle()

  if (!existingConversation) {
    await supabase.from('conversations').insert({
      brand_id: brandId,
      organizer_id: organizerId
    })
  }
}

/**
 * Get enhanced interest with profile information
 */
export async function getEnhancedInterest(interest: Interest): Promise<EnhancedInterest> {
  // Get sender profile and name
  let senderName: string
  if (interest.senderType === 'brand') {
    const brandProfile = await getBrandById(interest.brandId)
    senderName = brandProfile?.companyName || 'Unknown'
  } else {
    const organizerProfile = await getOrganizerById(interest.organizerId)
    senderName = organizerProfile?.organizerName || 'Unknown'
  }

  // Get receiver profile and name
  let receiverName: string
  if (interest.receiverType === 'brand') {
    const brandProfile = await getBrandById(interest.brandId)
    receiverName = brandProfile?.companyName || 'Unknown'
  } else {
    const organizerProfile = await getOrganizerById(interest.organizerId)
    receiverName = organizerProfile?.organizerName || 'Unknown'
  }

  const isMutual = await checkMutualInterest(interest.senderId, interest.receiverId)

  // Check if AI match exists
  const { data: aiMatch } = await supabase
    .from('matches')
    .select('*')
    .eq('brand_id', interest.brandId)
    .eq('organizer_id', interest.organizerId)
    .eq('match_source', 'ai')
    .maybeSingle()

  return {
    ...interest,
    senderName,
    senderLogo: undefined, // Can be added later with logo service
    receiverName,
    receiverLogo: undefined,
    isMutual,
    hasAIMatch: !!aiMatch
  }
}
