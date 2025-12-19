import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  getBrandById,
  getBrandByUserId,
  getMatchesForBrand,
  getMatchesForOrganizer,
  getOrganizerById,
  getOrganizerByUserId
} from '../services/dataService'
import {
  deleteMatchPreference,
  getMatchPreferences,
  upsertMatchPreference
} from '../services/matchPreferencesService'
import { DisplayMode, EnhancedMatch, MatchView, MatchSource } from '../types/matches'

interface UseMatchesPageOptions {
  userId: string | null
  userType: 'brand' | 'organizer' | 'admin' | null
}

interface UseMatchesPageResult {
  userType: 'brand' | 'organizer'
  loading: boolean
  activeView: MatchView
  setActiveView: (view: MatchView) => void
  displayMode: DisplayMode
  setDisplayMode: (mode: DisplayMode) => void
  searchTerm: string
  setSearchTerm: (value: string) => void
  matchSource: MatchSource | 'all'
  setMatchSource: (source: MatchSource | 'all') => void
  filteredMatches: EnhancedMatch[]
  handleSaveSuggestion: (matchId: string) => Promise<void>
  handleDismissSuggestion: (matchId: string) => Promise<void>
  removeSavedSuggestion: (matchId: string) => Promise<void>
  savedSuggestions: string[]
}

const DEFAULT_MATCH_CRITERIA = [
  'Audience alignment',
  'Budget fit',
  'Industry relevance'
]

export function useMatchesPage({
  userId,
  userType
}: UseMatchesPageOptions): UseMatchesPageResult {
  const [resolvedUserType, setResolvedUserType] = useState<
    'brand' | 'organizer'
  >('brand')
  const [matches, setMatches] = useState<EnhancedMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<MatchView>('confirmed')
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [matchSource, setMatchSource] = useState<MatchSource | 'all'>('all')
  const [savedSuggestions, setSavedSuggestions] = useState<string[]>([])
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (userType === 'brand' || userType === 'organizer') {
      setResolvedUserType(userType)
    }
  }, [userType])

  useEffect(() => {
    const loadMatches = async () => {
      if (!userId || (userType !== 'brand' && userType !== 'organizer')) {
        setMatches([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        let entityId = ''
        if (userType === 'brand') {
          const brandData = await getBrandByUserId(userId)
          entityId = brandData?.id ?? ''
        } else {
          const organizerData = await getOrganizerByUserId(userId)
          entityId = organizerData?.id ?? ''
        }

        if (!entityId) {
          setMatches([])
          return
        }

        const rawMatches =
          userType === 'brand'
            ? await getMatchesForBrand(entityId)
            : await getMatchesForOrganizer(entityId)

        const enhancedMatches = await Promise.all(
          rawMatches.map(async (match) => {
            const brandData = await getBrandById(match.brandId)
            const organizerData = await getOrganizerById(match.organizerId)
            return {
              ...match,
              brandName: brandData?.companyName || 'Unknown Brand',
              brandLogo:
                'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&h=250&q=80',
              organizerName:
                organizerData?.organizerName || 'Unknown Organizer',
              organizerLogo:
                'https://images.unsplash.com/photo-1561489404-42f5a5c8e0eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&h=250&q=80',
              eventName: organizerData?.eventName || 'Unknown Event',
              productName: brandData?.productName || 'Unknown Product',
              matchCriteria: match.matchReasons || DEFAULT_MATCH_CRITERIA
            }
          })
        )

        setMatches(enhancedMatches)
      } catch (error) {
        console.error('Failed to load matches:', error)
      } finally {
        setLoading(false)
      }
    }

    loadMatches()
  }, [userId, userType])

  useEffect(() => {
    if (!userId) {
      setSavedSuggestions([])
      setDismissedSuggestions([])
      return
    }

    let isMounted = true
    const loadPreferences = async () => {
      try {
        const preferences = await getMatchPreferences(userId)
        if (!isMounted) return
        setSavedSuggestions(preferences.saved)
        setDismissedSuggestions(preferences.dismissed)
      } catch (error) {
        console.error('Failed to load match preferences:', error)
      }
    }

    loadPreferences()

    return () => {
      isMounted = false
    }
  }, [userId])

  const handleSaveSuggestion = useCallback(
    async (matchId: string) => {
      if (!userId) {
        return
      }

      setSavedSuggestions((prev) =>
        prev.includes(matchId) ? prev : [...prev, matchId]
      )
      setDismissedSuggestions((prev) => prev.filter((id) => id !== matchId))

      try {
        await upsertMatchPreference(userId, matchId, 'saved')
      } catch (error) {
        console.error('Failed to save match preference:', error)
        setSavedSuggestions((prev) => prev.filter((id) => id !== matchId))
      }
    },
    [userId]
  )

  const handleDismissSuggestion = useCallback(
    async (matchId: string) => {
      if (!userId) {
        return
      }

      setDismissedSuggestions((prev) =>
        prev.includes(matchId) ? prev : [...prev, matchId]
      )
      setSavedSuggestions((prev) => prev.filter((id) => id !== matchId))

      try {
        await upsertMatchPreference(userId, matchId, 'dismissed')
      } catch (error) {
        console.error('Failed to dismiss match preference:', error)
        setDismissedSuggestions((prev) => prev.filter((id) => id !== matchId))
      }
    },
    [userId]
  )

  const removeSavedSuggestion = useCallback(
    async (matchId: string) => {
      if (!userId) {
        return
      }

      setSavedSuggestions((prev) => prev.filter((id) => id !== matchId))

      try {
        await deleteMatchPreference(userId, matchId)
      } catch (error) {
        console.error('Failed to remove saved match preference:', error)
        setSavedSuggestions((prev) =>
          prev.includes(matchId) ? prev : [...prev, matchId]
        )
      }
    },
    [userId]
  )

  const filteredMatches = useMemo(() => {
    let viewFiltered = matches.filter((match) =>
      activeView === 'confirmed'
        ? match.status === 'accepted'
        : match.status === 'pending' && !dismissedSuggestions.includes(match.id)
    )

    // Filter by match source for confirmed matches
    if (activeView === 'confirmed' && matchSource !== 'all') {
      viewFiltered = viewFiltered.filter(
        (match) => match.matchSource === matchSource
      )
    }

    if (!searchTerm) {
      return viewFiltered
    }

    const term = searchTerm.toLowerCase()
    return viewFiltered.filter(
      (match) =>
        match.brandName.toLowerCase().includes(term) ||
        match.organizerName.toLowerCase().includes(term) ||
        match.eventName.toLowerCase().includes(term) ||
        match.productName.toLowerCase().includes(term)
    )
  }, [activeView, dismissedSuggestions, matches, searchTerm, matchSource])

  return {
    userType: resolvedUserType,
    loading,
    activeView,
    setActiveView,
    displayMode,
    setDisplayMode,
    searchTerm,
    setSearchTerm,
    matchSource,
    setMatchSource,
    filteredMatches,
    handleSaveSuggestion,
    handleDismissSuggestion,
    removeSavedSuggestion,
    savedSuggestions
  }
}
