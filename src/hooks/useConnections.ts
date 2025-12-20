import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { getOrCreateConversation } from '../services/chatService'
import {
  getBatchEnhancedConnections,
  getConnectionStats,
  getMutualConnections,
  getReceivedConnections,
  getSentConnections,
  respondToConnection,
  withdrawConnection
} from '../services/connectionService'
import { Connection, ConnectionStats, EnhancedConnection } from '../types'

interface UseConnectionsOptions {
  userId: string | null
  autoLoad?: boolean
}

interface UseConnectionsReturn {
  sentConnections: EnhancedConnection[]
  receivedConnections: EnhancedConnection[]
  mutualConnections: EnhancedConnection[]
  stats: ConnectionStats | null
  loading: boolean
  error: string | null
  acceptConnection: (connectionId: string) => Promise<void>
  rejectConnection: (connectionId: string) => Promise<void>
  withdrawPendingConnection: (connectionId: string) => Promise<void>
  startConversation: (brandId: string, organizerId: string) => Promise<void>
  refetch: () => Promise<void>
}

export function useConnections({
  userId,
  autoLoad = true
}: UseConnectionsOptions): UseConnectionsReturn {
  const [sentConnections, setSentConnections] = useState<EnhancedConnection[]>(
    []
  )
  const [receivedConnections, setReceivedConnections] = useState<
    EnhancedConnection[]
  >([])
  const [mutualConnections, setMutualConnections] = useState<
    EnhancedConnection[]
  >([])
  const [stats, setStats] = useState<ConnectionStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  /**
   * Load all connections for the user
   */
  const loadConnections = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    setError(null)

    try {
      // Fetch all connection types in parallel
      const [sent, received, mutual, statistics] = await Promise.all([
        getSentConnections(userId),
        getReceivedConnections(userId),
        getMutualConnections(userId),
        getConnectionStats(userId)
      ])

      // Batch enhance connections with profile information (optimized!)
      const [enhancedSent, enhancedReceived, enhancedMutual] =
        await Promise.all([
          getBatchEnhancedConnections(sent),
          getBatchEnhancedConnections(received),
          getBatchEnhancedConnections(mutual)
        ])

      // Filter out mutual connections from sent and received tabs
      // so they only appear in the mutual tab
      const filteredSent = enhancedSent.filter(
        (connection) => !connection.isMutual
      )
      const filteredReceived = enhancedReceived.filter(
        (connection) => !connection.isMutual
      )

      setSentConnections(filteredSent)
      setReceivedConnections(filteredReceived)
      setMutualConnections(enhancedMutual)
      setStats(statistics)
    } catch (err) {
      console.error('Failed to load connections:', err)
      setError(
        err instanceof Error ? err.message : 'Failed to load connections'
      )
    } finally {
      setLoading(false)
    }
  }, [userId])

  /**
   * Accept a connection
   */
  const acceptConnection = useCallback(
    async (connectionId: string) => {
      try {
        await respondToConnection(connectionId, 'accepted')
        // Reload connections to reflect the change
        await loadConnections()
      } catch (err) {
        console.error('Failed to accept connection:', err)
        throw err
      }
    },
    [loadConnections]
  )

  /**
   * Reject a connection
   */
  const rejectConnection = useCallback(
    async (connectionId: string) => {
      try {
        await respondToConnection(connectionId, 'rejected')
        // Reload connections to reflect the change
        await loadConnections()
      } catch (err) {
        console.error('Failed to reject connection:', err)
        throw err
      }
    },
    [loadConnections]
  )

  /**
   * Withdraw a pending connection
   */
  const withdrawPendingConnection = useCallback(
    async (connectionId: string) => {
      try {
        await withdrawConnection(connectionId)
        // Reload connections to reflect the change
        await loadConnections()
      } catch (err) {
        console.error('Failed to withdraw connection:', err)
        throw err
      }
    },
    [loadConnections]
  )

  /**
   * Start a conversation (navigate to messages)
   */
  const startConversation = useCallback(
    async (brandId: string, organizerId: string) => {
      try {
        const conversation = await getOrCreateConversation(brandId, organizerId)
        navigate(`/dashboard/messages?conversation=${conversation.id}`)
      } catch (err) {
        console.error('Failed to start conversation:', err)
        throw err
      }
    },
    [navigate]
  )

  /**
   * Refetch connections
   */
  const refetch = useCallback(async () => {
    await loadConnections()
  }, [loadConnections])

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad && userId) {
      loadConnections()
    }
  }, [autoLoad, userId, loadConnections])

  return {
    sentConnections,
    receivedConnections,
    mutualConnections,
    stats,
    loading,
    error,
    acceptConnection,
    rejectConnection,
    withdrawPendingConnection,
    startConversation,
    refetch
  }
}
