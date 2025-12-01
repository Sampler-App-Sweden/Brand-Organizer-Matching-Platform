import { useEffect, useState } from 'react'
import type { Organizer } from '../types/organizer'
import type { Match } from '../services/matchingService'
import {
  getOrganizerByUserId,
  getMatchesForOrganizer
} from '../services/dataService'

export function useOrganizerDashboard(userId?: string) {
  const [organizer, setOrganizer] = useState<Organizer | null>(null)
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      if (!userId) {
        if (isMounted) {
          setOrganizer(null)
          setMatches([])
          setLoading(false)
        }
        return
      }

      if (isMounted) {
        setLoading(true)
      }

      try {
        const organizerData = await getOrganizerByUserId(userId)
        if (!isMounted) return

        setOrganizer(organizerData)

        if (organizerData) {
          const matchData = await getMatchesForOrganizer(organizerData.id)
          if (!isMounted) return
          setMatches(matchData)
        } else {
          setMatches([])
        }
      } catch (error) {
        if (isMounted) {
          console.error('Failed to load organizer dashboard data:', error)
          setMatches([])
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [userId])

  const pendingMatches = matches.filter((m) => m.status === 'pending')
  const acceptedMatches = matches.filter((m) => m.status === 'accepted')

  return { organizer, matches, pendingMatches, acceptedMatches, loading }
}
