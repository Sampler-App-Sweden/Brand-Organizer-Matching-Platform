import {
  Connection,
  ConnectionRow,
  ConnectionStats,
  EnhancedConnection
} from '../types'
import { getBrandById, getOrganizerById } from './dataService'
import {
  notifyConnectionReceived,
  notifyMutualMatch
} from './notificationService'
import { supabase } from './supabaseClient'

/**
 * Map database row to Connection object
 */
const mapConnectionRowToConnection = (row: ConnectionRow): Connection => ({
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
 * Express connection with another user's profile
 */
export async function expressConnection(
  senderId: string,
  senderType: 'brand' | 'organizer',
  receiverId: string,
  receiverType: 'brand' | 'organizer'
): Promise<Connection> {
  // Validation
  if (senderId === receiverId) {
    throw new Error('Cannot express connection with yourself')
  }

  if (senderType === receiverType) {
    throw new Error('Can only express connection between brands and organizers')
  }

  // Check for existing connection
  const existing = await checkExistingConnection(senderId, receiverId)
  if (existing) {
    if (existing.status === 'pending') {
      throw new Error('Connection already expressed')
    }
    if (existing.status === 'accepted') {
      throw new Error('Connection already accepted')
    }
    // If rejected or withdrawn, allow re-expressing
  }

  // Get brand and organizer IDs
  const { brandId, organizerId } = await getBrandOrganizerIds(
    senderId,
    senderType,
    receiverId
  )

  // Create connection record
  const { data, error } = await supabase
    .from('connections')
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
    throw new Error(`Failed to express connection: ${error.message}`)
  }

  const connection = mapConnectionRowToConnection(data as ConnectionRow)

  // Check for reverse connection (mutual connection)
  const reverseConnection = await checkExistingConnection(receiverId, senderId)

  if (reverseConnection && reverseConnection.status === 'pending') {
    // Mutual connection! Update both to accepted
    await respondToConnection(connection.id, 'accepted')
    await respondToConnection(reverseConnection.id, 'accepted')

    // Create a manual match
    await createManualMatch(brandId, organizerId)

    // Notify both parties of mutual match
    await notifyMutualMatch(brandId, organizerId, connection.id).catch(
      (error) => {
        console.error('Failed to send mutual match notification:', error)
      }
    )
  } else {
    // One-way connection, notify receiver
    let senderName: string
    if (senderType === 'brand') {
      const brandProfile = await getBrandById(brandId)
      senderName = brandProfile?.companyName || 'A brand'
    } else {
      const organizerProfile = await getOrganizerById(organizerId)
      senderName = organizerProfile?.organizerName || 'An organizer'
    }

    await notifyConnectionReceived(receiverId, senderName, connection.id).catch(
      (error) => {
        console.error('Failed to send connection notification:', error)
      }
    )
  }

  return connection
}

/**
 * Get all connections sent by a user
 */
export async function getSentConnections(
  userId: string
): Promise<Connection[]> {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('sender_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch sent connections: ${error.message}`)
  }

  return (data as ConnectionRow[]).map(mapConnectionRowToConnection)
}

/**
 * Get all connections received by a user
 */
export async function getReceivedConnections(
  userId: string
): Promise<Connection[]> {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('receiver_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to fetch received connections: ${error.message}`)
  }

  return (data as ConnectionRow[]).map(mapConnectionRowToConnection)
}

/**
 * Get mutual connections for a user
 */
export async function getMutualConnections(
  userId: string
): Promise<Connection[]> {
  const sent = await getSentConnections(userId)
  const received = await getReceivedConnections(userId)

  const mutualConnections: Connection[] = []

  // Find connections where both parties expressed connection
  for (const sentConnection of sent) {
    const hasReverse = received.some(
      (r) =>
        r.senderId === sentConnection.receiverId &&
        r.receiverId === sentConnection.senderId &&
        (r.status === 'pending' || r.status === 'accepted')
    )

    if (
      hasReverse &&
      (sentConnection.status === 'pending' ||
        sentConnection.status === 'accepted')
    ) {
      mutualConnections.push(sentConnection)
    }
  }

  return mutualConnections
}

/**
 * Check if a connection exists between two users
 */
export async function checkExistingConnection(
  senderId: string,
  receiverId: string
): Promise<Connection | null> {
  const { data, error } = await supabase
    .from('connections')
    .select('*')
    .eq('sender_id', senderId)
    .eq('receiver_id', receiverId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to check existing connection: ${error.message}`)
  }

  return data ? mapConnectionRowToConnection(data as ConnectionRow) : null
}

/**
 * Check if two users have mutual connection
 */
export async function checkMutualConnection(
  userId1: string,
  userId2: string
): Promise<boolean> {
  const connection1 = await checkExistingConnection(userId1, userId2)
  const connection2 = await checkExistingConnection(userId2, userId1)

  return !!(
    connection1 &&
    connection2 &&
    (connection1.status === 'pending' || connection1.status === 'accepted') &&
    (connection2.status === 'pending' || connection2.status === 'accepted')
  )
}

/**
 * Respond to a connection (accept or reject)
 */
export async function respondToConnection(
  connectionId: string,
  status: 'accepted' | 'rejected'
): Promise<Connection> {
  const { data, error } = await supabase
    .from('connections')
    .update({ status })
    .eq('id', connectionId)
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to respond to connection: ${error.message}`)
  }

  const connection = mapConnectionRowToConnection(data as ConnectionRow)

  // If accepted, create reverse connection and mutual match
  if (status === 'accepted') {
    console.log(
      '[respondToConnection] Connection accepted, checking for reverse connection...'
    )
    console.log('[respondToConnection] Connection details:', {
      id: connection.id,
      sender: connection.senderId,
      receiver: connection.receiverId,
      senderType: connection.senderType,
      receiverType: connection.receiverType
    })

    // Check if receiver has already expressed connection (reverse connection exists)
    const reverseConnection = await checkExistingConnection(
      connection.receiverId,
      connection.senderId
    )
    console.log(
      '[respondToConnection] Reverse connection:',
      reverseConnection
        ? { id: reverseConnection.id, status: reverseConnection.status }
        : 'none'
    )

    if (!reverseConnection) {
      console.log('[respondToConnection] Creating reverse connection...')
      // Receiver hasn't expressed connection yet, so create it for them
      // This represents the receiver accepting = expressing connection back
      const { brandId, organizerId } = await getBrandOrganizerIds(
        connection.receiverId,
        connection.receiverType,
        connection.senderId
      )

      const { data, error } = await supabase
        .from('connections')
        .insert({
          sender_id: connection.receiverId,
          sender_type: connection.receiverType,
          receiver_id: connection.senderId,
          receiver_type: connection.senderType,
          brand_id: brandId,
          organizer_id: organizerId,
          status: 'accepted'
        })
        .select()

      if (error) {
        console.error(
          '[respondToConnection] Error creating reverse connection:',
          error
        )
        throw new Error(`Failed to create reverse connection: ${error.message}`)
      }
      console.log('[respondToConnection] Reverse connection created:', data)
    } else if (reverseConnection.status === 'pending') {
      console.log(
        '[respondToConnection] Updating existing reverse connection to accepted...'
      )
      // Reverse connection exists, update it to accepted
      await respondToConnection(reverseConnection.id, 'accepted')
    }

    console.log('[respondToConnection] Creating manual match...')
    // Now create the mutual match
    await createManualMatch(connection.brandId, connection.organizerId)

    console.log('[respondToConnection] Sending notifications...')
    // Notify both parties
    await notifyMutualMatch(
      connection.brandId,
      connection.organizerId,
      connection.id
    ).catch((error) => {
      console.error('Failed to send mutual match notification:', error)
    })

    console.log('[respondToConnection] ✅ Mutual match flow complete!')
  }
  // No notification sent for rejections - silent operation

  return connection
}

/**
 * Withdraw connection and handle mutual match cleanup
 * - If mutual match exists: mark match as inactive, archive conversation
 * - Conversation remains accessible (read-only)
 * - Messages are preserved
 */
export async function withdrawConnection(connectionId: string): Promise<void> {
  // Step 1: Fetch the connection to get context
  const { data: connectionData, error: fetchError } = await supabase
    .from('connections')
    .select('*')
    .eq('id', connectionId)
    .single()

  if (fetchError) {
    throw new Error(`Failed to fetch connection: ${fetchError.message}`)
  }

  const connection = mapConnectionRowToConnection(
    connectionData as ConnectionRow
  )

  // Step 2: Check for mutual match
  const isMutual = await checkMutualConnection(
    connection.senderId,
    connection.receiverId
  )

  // Step 3: Update connection to withdrawn
  const { error: updateError } = await supabase
    .from('connections')
    .update({ status: 'withdrawn' })
    .eq('id', connectionId)
    .in('status', ['pending', 'accepted'])

  if (updateError) {
    throw new Error(`Failed to withdraw connection: ${updateError.message}`)
  }

  // Step 4: If mutual match exists, handle cleanup
  if (isMutual) {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    // Mark match as inactive (don't delete)
    await supabase
      .from('matches')
      .update({ status: 'inactive' })
      .eq('brand_id', connection.brandId)
      .eq('organizer_id', connection.organizerId)
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
      .eq('brand_id', connection.brandId)
      .eq('organizer_id', connection.organizerId)
      .then(({ error }) => {
        if (error) console.error('Failed to archive conversation:', error)
      })
  }
}

/**
 * Get connection status between current user and a profile
 * Returns 'none', 'sent', 'received', or 'mutual'
 */
export async function getConnectionStatus(
  currentUserId: string,
  profileUserId: string
): Promise<'none' | 'sent' | 'received' | 'mutual'> {
  if (!currentUserId || !profileUserId || currentUserId === profileUserId) {
    return 'none'
  }

  const sentConnection = await checkExistingConnection(
    currentUserId,
    profileUserId
  )
  const receivedConnection = await checkExistingConnection(
    profileUserId,
    currentUserId
  )

  // Check if both connections exist and are active (pending or accepted)
  const sentActive =
    sentConnection &&
    (sentConnection.status === 'pending' ||
      sentConnection.status === 'accepted')
  const receivedActive =
    receivedConnection &&
    (receivedConnection.status === 'pending' ||
      receivedConnection.status === 'accepted')

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
 * Get connection statuses for multiple profiles in batch (optimized for directory views)
 * Returns a map of profileUserId -> ConnectionStatus
 */
export async function getBatchConnectionStatuses(
  currentUserId: string,
  profileUserIds: string[]
): Promise<Map<string, 'none' | 'sent' | 'received' | 'mutual'>> {
  const statusMap = new Map<string, 'none' | 'sent' | 'received' | 'mutual'>()

  if (!currentUserId || profileUserIds.length === 0) {
    return statusMap
  }

  // Filter out current user
  const otherUserIds = profileUserIds.filter((id) => id !== currentUserId)

  if (otherUserIds.length === 0) {
    return statusMap
  }

  // Fetch all connections sent by current user to these profiles
  const { data: sentConnections, error: sentError } = await supabase
    .from('connections')
    .select('*')
    .eq('sender_id', currentUserId)
    .in('receiver_id', otherUserIds)
    .in('status', ['pending', 'accepted'])

  if (sentError) {
    console.error('Failed to fetch sent connections:', sentError)
  }

  // Fetch all connections received by current user from these profiles
  const { data: receivedConnections, error: receivedError } = await supabase
    .from('connections')
    .select('*')
    .eq('receiver_id', currentUserId)
    .in('sender_id', otherUserIds)
    .in('status', ['pending', 'accepted'])

  if (receivedError) {
    console.error('Failed to fetch received connections:', receivedError)
  }

  // Create lookup maps
  const sentMap = new Map<string, boolean>()
  const receivedMap = new Map<string, boolean>()

  sentConnections?.forEach((connection) => {
    sentMap.set(connection.receiver_id, true)
  })

  receivedConnections?.forEach((connection) => {
    receivedMap.set(connection.sender_id, true)
  })

  // Determine status for each profile
  otherUserIds.forEach((profileUserId) => {
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
 * Get connection statistics for a user
 */
export async function getConnectionStats(
  userId: string
): Promise<ConnectionStats> {
  const sent = await getSentConnections(userId)
  const received = await getReceivedConnections(userId)
  const mutual = await getMutualConnections(userId)

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
 * Create a manual match from mutual connection
 */
async function createManualMatch(
  brandId: string,
  organizerId: string
): Promise<void> {
  console.log('[createManualMatch] Creating match for:', {
    brandId,
    organizerId
  })

  // Check if match already exists
  const { data: existingMatch, error: fetchError } = await supabase
    .from('matches')
    .select('*')
    .eq('brand_id', brandId)
    .eq('organizer_id', organizerId)
    .maybeSingle()

  if (fetchError) {
    console.error(
      '[createManualMatch] Error fetching existing match:',
      fetchError
    )
    throw new Error(`Failed to check existing match: ${fetchError.message}`)
  }

  console.log(
    '[createManualMatch] Existing match:',
    existingMatch
      ? {
          id: existingMatch.id,
          source: existingMatch.match_source,
          status: existingMatch.status
        }
      : 'none'
  )

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
    const { data, error } = await supabase
      .from('matches')
      .insert({
        brand_id: brandId,
        organizer_id: organizerId,
        score: 0,
        match_reasons: ['Mutual connection expressed'],
        status: 'accepted',
        match_source: 'manual'
      })
      .select()

    if (error) {
      console.error('[createManualMatch] Error creating match:', error)
      throw new Error(`Failed to create match: ${error.message}`)
    }
    console.log('[createManualMatch] Match created:', data)
  }

  // Create conversation if it doesn't exist
  console.log('[createManualMatch] Checking for existing conversation...')
  const { data: existingConversation, error: conversationFetchError } =
    await supabase
      .from('conversations')
      .select('*')
      .eq('brand_id', brandId)
      .eq('organizer_id', organizerId)
      .maybeSingle()

  if (conversationFetchError) {
    console.error(
      '[createManualMatch] Error fetching conversation:',
      conversationFetchError
    )
  }

  console.log(
    '[createManualMatch] Existing conversation:',
    existingConversation ? { id: existingConversation.id } : 'none'
  )

  if (!existingConversation) {
    console.log('[createManualMatch] Creating conversation for:', {
      brandId,
      organizerId
    })
    const { data: currentUser } = await supabase.auth.getUser()
    console.log(
      '[createManualMatch] Current user creating conversation:',
      currentUser?.user?.id
    )

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        brand_id: brandId,
        organizer_id: organizerId
      })
      .select()

    if (error) {
      console.error('[createManualMatch] ❌ Error creating conversation:', {
        error,
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      // Log but don't throw - match should still be created even if conversation fails
      console.warn(
        '[createManualMatch] ⚠️ Conversation creation failed, but match was created successfully'
      )
    } else {
      console.log('[createManualMatch] ✅ Conversation created:', data)
    }
  }

  console.log('[createManualMatch] ✅ Match creation complete!')
}

/**
 * Get enhanced connection with profile information
 */
export async function getEnhancedConnection(
  connection: Connection
): Promise<EnhancedConnection> {
  // Get sender profile and name
  let senderName: string
  if (connection.senderType === 'brand') {
    const brandProfile = await getBrandById(connection.brandId)
    senderName = brandProfile?.companyName || 'Unknown'
  } else {
    const organizerProfile = await getOrganizerById(connection.organizerId)
    senderName = organizerProfile?.organizerName || 'Unknown'
  }

  // Get receiver profile and name
  let receiverName: string
  if (connection.receiverType === 'brand') {
    const brandProfile = await getBrandById(connection.brandId)
    receiverName = brandProfile?.companyName || 'Unknown'
  } else {
    const organizerProfile = await getOrganizerById(connection.organizerId)
    receiverName = organizerProfile?.organizerName || 'Unknown'
  }

  const isMutual = await checkMutualConnection(
    connection.senderId,
    connection.receiverId
  )

  // Check if AI match exists
  const { data: aiMatch } = await supabase
    .from('matches')
    .select('*')
    .eq('brand_id', connection.brandId)
    .eq('organizer_id', connection.organizerId)
    .eq('match_source', 'ai')
    .maybeSingle()

  return {
    ...connection,
    senderName,
    senderLogo: undefined, // Can be added later with logo service
    receiverName,
    receiverLogo: undefined,
    isMutual,
    hasAIMatch: !!aiMatch
  }
}

/**
 * Batch enhance multiple connections with profile information (optimized)
 * This reduces N+1 queries by fetching all profiles at once
 */
export async function getBatchEnhancedConnections(
  connections: Connection[]
): Promise<EnhancedConnection[]> {
  if (connections.length === 0) return []

  // Extract unique brand and organizer IDs
  const brandIds = new Set<string>()
  const organizerIds = new Set<string>()

  connections.forEach((connection) => {
    brandIds.add(connection.brandId)
    organizerIds.add(connection.organizerId)
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
    (brandsData.data || []).map((b) => [
      b.id,
      { name: b.company_name, userId: b.user_id }
    ])
  )
  const organizerMap = new Map(
    (organizersData.data || []).map((o) => [
      o.id,
      { name: o.organizer_name, userId: o.user_id }
    ])
  )

  // Get all user IDs for mutual connection check
  const userIds = new Set<string>()
  connections.forEach((i) => {
    userIds.add(i.senderId)
    userIds.add(i.receiverId)
  })

  // Batch fetch all connections between these users for mutual check
  const { data: allConnections } = await supabase
    .from('connections')
    .select('sender_id, receiver_id, status')
    .in('sender_id', Array.from(userIds))
    .in('receiver_id', Array.from(userIds))
    .in('status', ['pending', 'accepted'])

  // Create mutual connection map
  const mutualMap = new Map<string, boolean>()
  const connectionLookup = new Map<string, boolean>()

  ;(allConnections || []).forEach((i) => {
    connectionLookup.set(`${i.sender_id}|${i.receiver_id}`, true)
  })

  connections.forEach((connection) => {
    const forward = connectionLookup.has(
      `${connection.senderId}|${connection.receiverId}`
    )
    const reverse = connectionLookup.has(
      `${connection.receiverId}|${connection.senderId}`
    )
    const pairKey = [connection.senderId, connection.receiverId]
      .sort()
      .join('|')
    mutualMap.set(pairKey, forward && reverse)
  })

  // Batch check for AI matches
  const brandOrgPairs = Array.from(
    new Set(
      connections.map((i) => ({
        brand_id: i.brandId,
        organizer_id: i.organizerId
      }))
    )
  )

  const matchConditions = brandOrgPairs
    .map(
      (pair) =>
        `and(brand_id.eq.${pair.brand_id},organizer_id.eq.${pair.organizer_id})`
    )
    .join(',')

  const { data: aiMatches } = await supabase
    .from('matches')
    .select('brand_id, organizer_id')
    .eq('match_source', 'ai')
    .or(matchConditions)

  const aiMatchMap = new Set(
    (aiMatches || []).map((m) => `${m.brand_id}|${m.organizer_id}`)
  )

  // Enhance all connections using the lookup maps
  return connections.map((connection) => {
    const brand = brandMap.get(connection.brandId)
    const organizer = organizerMap.get(connection.organizerId)

    const senderName =
      connection.senderType === 'brand'
        ? brand?.name || 'Unknown'
        : organizer?.name || 'Unknown'

    const receiverName =
      connection.receiverType === 'brand'
        ? brand?.name || 'Unknown'
        : organizer?.name || 'Unknown'

    const pairKey = [connection.senderId, connection.receiverId]
      .sort()
      .join('|')
    const isMutual = mutualMap.get(pairKey) || false
    const hasAIMatch = aiMatchMap.has(
      `${connection.brandId}|${connection.organizerId}`
    )

    return {
      ...connection,
      senderName,
      senderLogo: undefined,
      receiverName,
      receiverLogo: undefined,
      isMutual,
      hasAIMatch
    }
  })
}
