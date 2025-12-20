import { useState, useEffect, useCallback } from 'react'
import {
  Interest,
  EnhancedInterest,
  InterestStats
} from '../types/interest'
import {
  getSentInterests,
  getReceivedInterests,
  getMutualInterests,
  respondToInterest,
  withdrawInterest,
  getInterestStats,
  getBatchEnhancedInterests
} from '../services/interestService'
import { useNavigate } from 'react-router-dom'
import { getOrCreateConversation } from '../services/chatService'

interface UseInterestsOptions {
  userId: string | null
  autoLoad?: boolean
}

interface UseInterestsReturn {
  sentInterests: EnhancedInterest[]
  receivedInterests: EnhancedInterest[]
  mutualInterests: EnhancedInterest[]
  stats: InterestStats | null
  loading: boolean
  error: string | null
  acceptInterest: (interestId: string) => Promise<void>
  rejectInterest: (interestId: string) => Promise<void>
  withdrawPendingInterest: (interestId: string) => Promise<void>
  startConversation: (brandId: string, organizerId: string) => Promise<void>
  refetch: () => Promise<void>
}

export function useInterests({
  userId,
  autoLoad = true
}: UseInterestsOptions): UseInterestsReturn {
  const [sentInterests, setSentInterests] = useState<EnhancedInterest[]>([])
  const [receivedInterests, setReceivedInterests] = useState<EnhancedInterest[]>([])
  const [mutualInterests, setMutualInterests] = useState<EnhancedInterest[]>([])
  const [stats, setStats] = useState<InterestStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  /**
   * Load all interests for the user
   */
  const loadInterests = useCallback(async () => {
    if (!userId) return

    setLoading(true)
    setError(null)

    try {
      // Fetch all interest types in parallel
      const [sent, received, mutual, statistics] = await Promise.all([
        getSentInterests(userId),
        getReceivedInterests(userId),
        getMutualInterests(userId),
        getInterestStats(userId)
      ])

      // Batch enhance interests with profile information (optimized!)
      const [enhancedSent, enhancedReceived, enhancedMutual] = await Promise.all([
        getBatchEnhancedInterests(sent),
        getBatchEnhancedInterests(received),
        getBatchEnhancedInterests(mutual)
      ])

      // Filter out mutual interests from sent and received tabs
      // so they only appear in the mutual tab
      const filteredSent = enhancedSent.filter(interest => !interest.isMutual)
      const filteredReceived = enhancedReceived.filter(interest => !interest.isMutual)

      setSentInterests(filteredSent)
      setReceivedInterests(filteredReceived)
      setMutualInterests(enhancedMutual)
      setStats(statistics)
    } catch (err) {
      console.error('Failed to load interests:', err)
      setError(err instanceof Error ? err.message : 'Failed to load interests')
    } finally {
      setLoading(false)
    }
  }, [userId])

  /**
   * Accept an interest
   */
  const acceptInterest = useCallback(async (interestId: string) => {
    try {
      await respondToInterest(interestId, 'accepted')
      // Reload interests to reflect the change
      await loadInterests()
    } catch (err) {
      console.error('Failed to accept interest:', err)
      throw err
    }
  }, [loadInterests])

  /**
   * Reject an interest
   */
  const rejectInterest = useCallback(async (interestId: string) => {
    try {
      await respondToInterest(interestId, 'rejected')
      // Reload interests to reflect the change
      await loadInterests()
    } catch (err) {
      console.error('Failed to reject interest:', err)
      throw err
    }
  }, [loadInterests])

  /**
   * Withdraw a pending interest
   */
  const withdrawPendingInterest = useCallback(async (interestId: string) => {
    try {
      await withdrawInterest(interestId)
      // Reload interests to reflect the change
      await loadInterests()
    } catch (err) {
      console.error('Failed to withdraw interest:', err)
      throw err
    }
  }, [loadInterests])

  /**
   * Start a conversation (navigate to messages)
   */
  const startConversation = useCallback(async (brandId: string, organizerId: string) => {
    try {
      const conversation = await getOrCreateConversation(brandId, organizerId)
      navigate(`/dashboard/messages?conversation=${conversation.id}`)
    } catch (err) {
      console.error('Failed to start conversation:', err)
      throw err
    }
  }, [navigate])

  /**
   * Refetch interests
   */
  const refetch = useCallback(async () => {
    await loadInterests()
  }, [loadInterests])

  // Auto-load on mount if enabled
  useEffect(() => {
    if (autoLoad && userId) {
      loadInterests()
    }
  }, [autoLoad, userId, loadInterests])

  return {
    sentInterests,
    receivedInterests,
    mutualInterests,
    stats,
    loading,
    error,
    acceptInterest,
    rejectInterest,
    withdrawPendingInterest,
    startConversation,
    refetch
  }
}
