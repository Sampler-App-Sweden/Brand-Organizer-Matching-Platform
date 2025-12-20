import { supabase } from './supabaseClient'
import {
  Interest,
  InterestRow,
  EnhancedInterest,
  InterestStats
} from '../types/interest'
import { getBrandById, getOrganizerById } from './dataService'
import { notifyInterestReceived, notifyMutualMatch } from './notificationService'

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

  // If accepted, create reverse interest and mutual match
  if (status === 'accepted') {
    console.log('[respondToInterest] Interest accepted, checking for reverse interest...')
    console.log('[respondToInterest] Interest details:', {
      id: interest.id,
      sender: interest.senderId,
      receiver: interest.receiverId,
      senderType: interest.senderType,
      receiverType: interest.receiverType
    })

    // Check if receiver has already expressed interest (reverse interest exists)
    const reverseInterest = await checkExistingInterest(interest.receiverId, interest.senderId)
    console.log('[respondToInterest] Reverse interest:', reverseInterest ? { id: reverseInterest.id, status: reverseInterest.status } : 'none')

    if (!reverseInterest) {
      console.log('[respondToInterest] Creating reverse interest...')
      // Receiver hasn't expressed interest yet, so create it for them
      // This represents the receiver accepting = expressing interest back
      const { brandId, organizerId } = await getBrandOrganizerIds(
        interest.receiverId,
        interest.receiverType,
        interest.senderId
      )

      const { data, error } = await supabase.from('interests').insert({
        sender_id: interest.receiverId,
        sender_type: interest.receiverType,
        receiver_id: interest.senderId,
        receiver_type: interest.senderType,
        brand_id: brandId,
        organizer_id: organizerId,
        status: 'accepted'
      }).select()

      if (error) {
        console.error('[respondToInterest] Error creating reverse interest:', error)
        throw new Error(`Failed to create reverse interest: ${error.message}`)
      }
      console.log('[respondToInterest] Reverse interest created:', data)
    } else if (reverseInterest.status === 'pending') {
      console.log('[respondToInterest] Updating existing reverse interest to accepted...')
      // Reverse interest exists, update it to accepted
      await respondToInterest(reverseInterest.id, 'accepted')
    }

    console.log('[respondToInterest] Creating manual match...')
    // Now create the mutual match
    await createManualMatch(interest.brandId, interest.organizerId)

    console.log('[respondToInterest] Sending notifications...')
    // Notify both parties
    await notifyMutualMatch(interest.brandId, interest.organizerId, interest.id).catch((error) => {
      console.error('Failed to send mutual match notification:', error)
    })

    console.log('[respondToInterest] ✅ Mutual match flow complete!')
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
  console.log('[createManualMatch] Creating match for:', { brandId, organizerId })

  // Check if match already exists
  const { data: existingMatch, error: fetchError } = await supabase
    .from('matches')
    .select('*')
    .eq('brand_id', brandId)
    .eq('organizer_id', organizerId)
    .maybeSingle()

  if (fetchError) {
    console.error('[createManualMatch] Error fetching existing match:', fetchError)
    throw new Error(`Failed to check existing match: ${fetchError.message}`)
  }

  console.log('[createManualMatch] Existing match:', existingMatch ? { id: existingMatch.id, source: existingMatch.match_source, status: existingMatch.status } : 'none')

  if (existingMatch) {
    // Update to hybrid if it was AI-generated
    if (existingMatch.match_source === 'ai') {
      console.log('[createManualMatch] Updating AI match to hybrid...')
      const { error } = await supabase
        .from('matches')
        .update({ match_source: 'hybrid', status: 'accepted' })
        .eq('id', existingMatch.id)

      if (error) {
        console.error('[createManualMatch] Error updating to hybrid:', error)
        throw new Error(`Failed to update match to hybrid: ${error.message}`)
      }
    } else {
      // Just update status to accepted
      console.log('[createManualMatch] Updating match status to accepted...')
      const { error } = await supabase
        .from('matches')
        .update({ status: 'accepted' })
        .eq('id', existingMatch.id)

      if (error) {
        console.error('[createManualMatch] Error updating match status:', error)
        throw new Error(`Failed to update match status: ${error.message}`)
      }
    }
  } else {
    // Create new manual match
    console.log('[createManualMatch] Creating new manual match...')
    const { data, error } = await supabase.from('matches').insert({
      brand_id: brandId,
      organizer_id: organizerId,
      score: 0,
      match_reasons: ['Mutual interest expressed'],
      status: 'accepted',
      match_source: 'manual'
    }).select()

    if (error) {
      console.error('[createManualMatch] Error creating match:', error)
      throw new Error(`Failed to create match: ${error.message}`)
    }
    console.log('[createManualMatch] Match created:', data)
  }

  // Create conversation if it doesn't exist
  console.log('[createManualMatch] Checking for existing conversation...')
  const { data: existingConversation, error: conversationFetchError } = await supabase
    .from('conversations')
    .select('*')
    .eq('brand_id', brandId)
    .eq('organizer_id', organizerId)
    .maybeSingle()

  if (conversationFetchError) {
    console.error('[createManualMatch] Error fetching conversation:', conversationFetchError)
  }

  console.log('[createManualMatch] Existing conversation:', existingConversation ? { id: existingConversation.id } : 'none')

  if (!existingConversation) {
    console.log('[createManualMatch] Creating conversation for:', { brandId, organizerId })
    const { data: currentUser } = await supabase.auth.getUser()
    console.log('[createManualMatch] Current user creating conversation:', currentUser?.user?.id)

    const { data, error } = await supabase.from('conversations').insert({
      brand_id: brandId,
      organizer_id: organizerId
    }).select()

    if (error) {
      console.error('[createManualMatch] ❌ Error creating conversation:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      // Log but don't throw - match should still be created even if conversation fails
      console.warn('[createManualMatch] ⚠️ Conversation creation failed, but match was created successfully')
    } else {
      console.log('[createManualMatch] ✅ Conversation created:', data)
    }
  }

  console.log('[createManualMatch] ✅ Match creation complete!')
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

/**
 * Batch enhance multiple interests with profile information (optimized)
 * This reduces N+1 queries by fetching all profiles at once
 */
export async function getBatchEnhancedInterests(interests: Interest[]): Promise<EnhancedInterest[]> {
  if (interests.length === 0) return []

  // Extract unique brand and organizer IDs
  const brandIds = new Set<string>()
  const organizerIds = new Set<string>()

  interests.forEach(interest => {
    brandIds.add(interest.brandId)
    organizerIds.add(interest.organizerId)
  })

  // Batch fetch all brands and organizers in parallel
  const [brandsData, organizersData] = await Promise.all([
    supabase
      .from('brands')
      .select('id, company_name, user_id')
      .in('id', Array.from(brandIds)),
    supabase
      .from('organizers')
      .select('id, organizer_name, user_id')
      .in('id', Array.from(organizerIds))
  ])

  if (brandsData.error) {
    console.error('Failed to fetch brands:', brandsData.error)
  }
  if (organizersData.error) {
    console.error('Failed to fetch organizers:', organizersData.error)
  }

  // Create lookup maps
  const brandMap = new Map(
    (brandsData.data || []).map(b => [b.id, { name: b.company_name, userId: b.user_id }])
  )
  const organizerMap = new Map(
    (organizersData.data || []).map(o => [o.id, { name: o.organizer_name, userId: o.user_id }])
  )

  // Get all user IDs for mutual interest check
  const userIds = new Set<string>()
  interests.forEach(i => {
    userIds.add(i.senderId)
    userIds.add(i.receiverId)
  })

  // Batch fetch all interests between these users for mutual check
  const { data: allInterests } = await supabase
    .from('interests')
    .select('sender_id, receiver_id, status')
    .in('sender_id', Array.from(userIds))
    .in('receiver_id', Array.from(userIds))
    .in('status', ['pending', 'accepted'])

  // Create mutual interest map
  const mutualMap = new Map<string, boolean>()
  const interestLookup = new Map<string, boolean>()

  ;(allInterests || []).forEach(i => {
    interestLookup.set(`${i.sender_id}|${i.receiver_id}`, true)
  })

  interests.forEach(interest => {
    const forward = interestLookup.has(`${interest.senderId}|${interest.receiverId}`)
    const reverse = interestLookup.has(`${interest.receiverId}|${interest.senderId}`)
    const pairKey = [interest.senderId, interest.receiverId].sort().join('|')
    mutualMap.set(pairKey, forward && reverse)
  })

  // Batch check for AI matches
  const brandOrgPairs = Array.from(new Set(
    interests.map(i => ({ brand_id: i.brandId, organizer_id: i.organizerId }))
  ))

  const matchConditions = brandOrgPairs.map(pair =>
    `and(brand_id.eq.${pair.brand_id},organizer_id.eq.${pair.organizer_id})`
  ).join(',')

  const { data: aiMatches } = await supabase
    .from('matches')
    .select('brand_id, organizer_id')
    .eq('match_source', 'ai')
    .or(matchConditions)

  const aiMatchMap = new Set(
    (aiMatches || []).map(m => `${m.brand_id}|${m.organizer_id}`)
  )

  // Enhance all interests using the lookup maps
  return interests.map(interest => {
    const brand = brandMap.get(interest.brandId)
    const organizer = organizerMap.get(interest.organizerId)

    const senderName = interest.senderType === 'brand'
      ? (brand?.name || 'Unknown')
      : (organizer?.name || 'Unknown')

    const receiverName = interest.receiverType === 'brand'
      ? (brand?.name || 'Unknown')
      : (organizer?.name || 'Unknown')

    const pairKey = [interest.senderId, interest.receiverId].sort().join('|')
    const isMutual = mutualMap.get(pairKey) || false
    const hasAIMatch = aiMatchMap.has(`${interest.brandId}|${interest.organizerId}`)

    return {
      ...interest,
      senderName,
      senderLogo: undefined,
      receiverName,
      receiverLogo: undefined,
      isMutual,
      hasAIMatch
    }
  })
}
