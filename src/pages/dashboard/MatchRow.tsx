import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Match } from '../../services/matchingService'

// Component to render a single match row
export function MatchRow({ match }: { match: Match }) {
  const [organizer, setOrganizer] = useState<any>(null)
  useEffect(() => {
    // In a real app, this would be an API call
    const organizerData = JSON.parse(localStorage.getItem('organizers') || '[]')
    const found = organizerData.find((o: any) => o.id === match.organizerId)
    setOrganizer(found || null)
  }, [match])
  if (!organizer) return null
  return (
    <tr>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              match.score >= 80
                ? 'bg-green-100 text-green-800'
                : match.score >= 60
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            {match.score}%
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='text-sm font-medium text-gray-900'>
          {organizer.eventName}
        </div>
        <div className='text-sm text-gray-500'>{organizer.eventType}</div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>
        <span
          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            match.status === 'accepted'
              ? 'bg-green-100 text-green-800'
              : match.status === 'rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
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
