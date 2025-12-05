import { useCallback, useEffect, useMemo, useState } from 'react'

import { getBrandById, getBrandByUserId, getMatchesForBrand, getMatchesForOrganizer, getOrganizerById, getOrganizerByUserId } from '../services/dataService'
import { DisplayMode, EnhancedMatch, MatchView } from '../types/matches'

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
  filteredMatches: EnhancedMatch[]
  handleSaveSuggestion: (matchId: string) => void
  handleDismissSuggestion: (matchId: string) => void
  removeSavedSuggestion: (matchId: string) => void
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
  const [resolvedUserType, setResolvedUserType] = useState<'brand' | 'organizer'>(
    'brand'
  )
  const [matches, setMatches] = useState<EnhancedMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<MatchView>('confirmed')
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid')
  const [searchTerm, setSearchTerm] = useState('')
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

    const savedItems = JSON.parse(
      localStorage.getItem(`user_${userId}_savedMatches`) || '[]'
    )
    const dismissedItems = JSON.parse(
      localStorage.getItem(`user_${userId}_dismissedMatches`) || '[]'
    )
    setSavedSuggestions(savedItems)
    setDismissedSuggestions(dismissedItems)
  }, [userId])

  const persistSavedSuggestions = useCallback(
    (items: string[]) => {
      if (!userId) return
      localStorage.setItem(
        `user_${userId}_savedMatches`,
        JSON.stringify(items)
      )
    },
    [userId]
  )

  const persistDismissedSuggestions = useCallback(
    (items: string[]) => {
      if (!userId) return
      localStorage.setItem(
        `user_${userId}_dismissedMatches`,
        JSON.stringify(items)
      )
    },
    [userId]
  )

  const handleSaveSuggestion = useCallback(
    (matchId: string) => {
      setSavedSuggestions((prev) => {
        if (prev.includes(matchId)) {
          return prev
        }
        const updated = [...prev, matchId]
        persistSavedSuggestions(updated)
        return updated
      })
    },
    [persistSavedSuggestions]
  )

  const handleDismissSuggestion = useCallback(
    (matchId: string) => {
      setDismissedSuggestions((prev) => {
        if (prev.includes(matchId)) {
          return prev
        }
        const updated = [...prev, matchId]
        persistDismissedSuggestions(updated)
        return updated
      })
    },
    [persistDismissedSuggestions]
  )

  const removeSavedSuggestion = useCallback(
    (matchId: string) => {
      setSavedSuggestions((prev) => {
        const updated = prev.filter((id) => id !== matchId)
        persistSavedSuggestions(updated)
        return updated
      })
    },
    [persistSavedSuggestions]
  )

  const filteredMatches = useMemo(() => {
    const viewFiltered = matches.filter((match) =>
      activeView === 'confirmed'
        ? match.status === 'accepted'
        : match.status === 'pending' && !dismissedSuggestions.includes(match.id)
    )

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
  }, [activeView, dismissedSuggestions, matches, searchTerm])

  return {
    userType: resolvedUserType,
    loading,
    activeView,
    setActiveView,
    displayMode,
    setDisplayMode,
    searchTerm,
    setSearchTerm,
    filteredMatches,
    handleSaveSuggestion,
    handleDismissSuggestion,
    removeSavedSuggestion,
    savedSuggestions
  }
}
