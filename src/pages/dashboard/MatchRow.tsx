import { Link } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import { getOrganizerById } from '../../services/dataService'
import { Organizer, Match } from '../../types'

export function MatchRow({
  match,
  organizer: organizerProp
}: {
  match: Match
  organizer?: Organizer
}) {
  const [organizer, setOrganizer] = useState<Organizer | null>(
    organizerProp ?? null
  )
  const [isLoading, setIsLoading] = useState(!organizerProp)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (organizerProp) {
      setOrganizer(organizerProp)
      setIsLoading(false)
      setError(null)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setError(null)

    getOrganizerById(match.organizerId)
      .then((data) => {
        if (!isMounted) return
        if (!data) {
          setError('Organizer not found')
          setOrganizer(null)
          return
        }
        setOrganizer(data)
      })
      .catch((err: unknown) => {
        if (!isMounted) return
        const message =
          err instanceof Error ? err.message : 'Unable to load organizer'
        setError(message)
        setOrganizer(null)
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [match.organizerId, organizerProp])

  const scoreTone = useMemo(() => {
    if (match.score >= 80) return 'bg-green-100 text-green-800'
    if (match.score >= 60) return 'bg-yellow-100 text-yellow-800'
    return 'bg-gray-100 text-gray-800'
  }, [match.score])

  const statusTone = useMemo(() => {
    if (match.status === 'accepted') return 'bg-green-100 text-green-800'
    if (match.status === 'rejected') return 'bg-red-100 text-red-800'
    return 'bg-yellow-100 text-yellow-800'
  }, [match.status])

  if (isLoading) {
    return (
      <tr>
        <td className='px-6 py-4 text-sm text-gray-500' colSpan={4}>
          Loading match...
        </td>
      </tr>
    )
  }

  if (error || !organizer) {
    return (
      <tr>
        <td className='px-6 py-4 text-sm text-red-600' colSpan={4}>
          {error ?? 'Organizer details unavailable'}
        </td>
      </tr>
    )
  }

  return (
    <tr>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${scoreTone}`}
          >
            {match.score}%
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm font-medium text-gray-900'>
          {organizer.eventName || 'Untitled event'}
        </div>
        <div className='text-sm text-gray-500'>
          {organizer.eventType || 'Unknown type'}
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusTone}`}
        >
          {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
        </span>
      </td>
      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
        <Link
          to={`/dashboard/brand/matches/${match.id}`}
          className='text-indigo-600 hover:text-indigo-900 mr-4'
        >
          View Details
        </Link>
      </td>
    </tr>
  )
}
