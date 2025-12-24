import React from 'react'
import type { Event } from '../../types/event'

interface EventsTableProps {
  events: Event[]
  organizersMap: Map<string, string> // Map of organizer ID to organizer name
  handleSort: (field: string) => void
  renderSortIcon: (field: string) => React.ReactNode
}

export function EventsTable({
  events,
  organizersMap,
  handleSort,
  renderSortIcon
}: EventsTableProps) {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('eventName')}
            >
              Event Name {renderSortIcon('eventName')}
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Organizer
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('slogan')}
            >
              Slogan {renderSortIcon('slogan')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('totalEventBudget')}
            >
              Budget {renderSortIcon('totalEventBudget')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('status')}
            >
              Status {renderSortIcon('status')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('createdAt')}
            >
              Created {renderSortIcon('createdAt')}
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {events.map((event) => (
            <tr key={event.id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {event.eventName}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {organizersMap.get(event.organizerId) || 'Unknown'}
              </td>
              <td className='px-6 py-4 text-sm text-gray-500'>
                {event.slogan || '-'}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {event.totalEventBudget || '-'}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm'>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    event.status === 'published'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {event.status}
                </span>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {new Date(event.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {events.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className='px-6 py-4 text-center text-sm text-gray-500'
              >
                No events found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
