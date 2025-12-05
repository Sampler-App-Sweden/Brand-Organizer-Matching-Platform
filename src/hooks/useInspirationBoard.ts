import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  getAllCollaborations,
  getSavedCollaborations,
  toggleSavedCollaboration
} from '../services/collaborationService'
import { getProfileOverviewByName } from '../services/profileService'
import {
  getSavedProfileIds,
  toggleSavedProfile
} from '../services/savedProfilesService'
import { Collaboration } from '../types/collaboration'
import { ProfileSaveMeta } from '../types/inspiration'

export type InspirationTab = 'all' | 'saved'

interface UseInspirationBoardOptions {
  userId: string | null
}

export function useInspirationBoard({ userId }: UseInspirationBoardOptions) {
  const [collaborations, setCollaborations] = useState<Collaboration[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<InspirationTab>('all')
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [savedProfileMap, setSavedProfileMap] = useState<
    Record<string, boolean>
  >({})
  const [profileLookupCache, setProfileLookupCache] = useState<
    Record<string, string | null>
  >({})
  const [profileSaveLoading, setProfileSaveLoading] = useState<
    Record<string, boolean>
  >({})

  useEffect(() => {
    const fetchCollaborations = async () => {
      if (!userId) {
        setCollaborations([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const data =
          activeTab === 'all'
            ? await getAllCollaborations()
            : await getSavedCollaborations(userId)
        setCollaborations(data)
      } catch (error) {
        console.error('Failed to fetch collaborations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCollaborations()
  }, [activeTab, userId])

  useEffect(() => {
    const loadSavedProfiles = async () => {
      if (!userId) {
        setSavedProfileMap({})
        return
      }
      try {
        const ids = await getSavedProfileIds(userId)
        const map = ids.reduce<Record<string, boolean>>((acc, id) => {
          acc[id] = true
          return acc
        }, {})
        setSavedProfileMap(map)
      } catch (error) {
        console.error('Failed to load saved profiles:', error)
      }
    }

    loadSavedProfiles()
  }, [userId])

  const resolveProfileId = useCallback(
    async (name: string) => {
      if (!name) {
        return null
      }
      if (profileLookupCache[name] !== undefined) {
        return profileLookupCache[name]
      }
      try {
        const profile = await getProfileOverviewByName(name)
        const id = profile?.id ?? null
        setProfileLookupCache((prev) => ({ ...prev, [name]: id }))
        return id
      } catch (error) {
        console.error('Failed to resolve profile by name:', { name, error })
        setProfileLookupCache((prev) => ({ ...prev, [name]: null }))
        return null
      }
    },
    [profileLookupCache]
  )

  useEffect(() => {
    if (!userId || collaborations.length === 0) {
      return
    }

    const preloadProfiles = async () => {
      const uniqueNames = Array.from(
        new Set(
          collaborations.flatMap((collab) => [
            collab.brandName,
            collab.organizerName
          ])
        )
      )
      const missingNames = uniqueNames.filter(
        (name) => profileLookupCache[name] === undefined
      )
      if (!missingNames.length) {
        return
      }
      await Promise.all(missingNames.map((name) => resolveProfileId(name)))
    }

    preloadProfiles()
  }, [collaborations, profileLookupCache, resolveProfileId, userId])

  const handleSaveProfile = useCallback(
    async (name: string) => {
      if (!userId || !name) {
        return
      }
      setProfileSaveLoading((prev) => ({ ...prev, [name]: true }))
      try {
        const profileId = await resolveProfileId(name)
        if (!profileId) {
          console.warn('No profile found to save for inspiration entry', name)
          return
        }
        const saved = await toggleSavedProfile(userId, profileId)
        setSavedProfileMap((prev) => ({ ...prev, [profileId]: saved }))
      } catch (error) {
        console.error('Failed to save profile from inspiration card:', error)
      } finally {
        setProfileSaveLoading((prev) => ({ ...prev, [name]: false }))
      }
    },
    [resolveProfileId, userId]
  )

  const getProfileSaveMeta = useCallback(
    (name: string): ProfileSaveMeta => {
      const resolvedId = profileLookupCache[name]
      return {
        saved: resolvedId ? Boolean(savedProfileMap[resolvedId]) : false,
        available: resolvedId !== null,
        resolving: resolvedId === undefined,
        loading: Boolean(profileSaveLoading[name])
      }
    },
    [profileLookupCache, profileSaveLoading, savedProfileMap]
  )

  const handleCollaborationSave = useCallback(
    (collaborationId: string) => {
      if (!userId) {
        return
      }
      toggleSavedCollaboration(userId, collaborationId)
      setCollaborations((prev) =>
        prev.map((collab) =>
          collab.id === collaborationId
            ? { ...collab, saved: !collab.saved }
            : collab
        )
      )
    },
    [userId]
  )

  const filteredCollaborations = useMemo(() => {
    if (!activeFilter) {
      return collaborations
    }
    return collaborations.filter((collab) => collab.type === activeFilter)
  }, [activeFilter, collaborations])

  const toggleFilters = () => setShowFilters((prev) => !prev)

  return {
    loading,
    filteredCollaborations,
    activeTab,
    setActiveTab,
    activeFilter,
    setActiveFilter,
    showFilters,
    toggleFilters,
    handleCollaborationSave,
    handleSaveProfile,
    getProfileSaveMeta
  }
}
