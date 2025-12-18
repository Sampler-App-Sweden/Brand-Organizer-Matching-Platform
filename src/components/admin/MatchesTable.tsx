import React from 'react'

interface Brand {
  id: string
  companyName: string
}
interface Organizer {
  id: string
  organizerName: string
}
interface Match {
  id: string
  score: number
  brandId: string
  organizerId: string
  status: string
  createdAt: string
}

interface MatchesTableProps {
  matches: Match[]
  brands: Brand[]
  organizers: Organizer[]
  handleSort: (field: string) => void
  renderSortIcon: (field: string) => React.ReactNode
}

export function MatchesTable({
  matches,
  brands,
  organizers,
  handleSort,
  renderSortIcon
}: MatchesTableProps) {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('id')}
            >
              ID {renderSortIcon('id')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('score')}
            >
              Score {renderSortIcon('score')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('brandId')}
            >
              Brand {renderSortIcon('brandId')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('organizerId')}
            >
              Organizer {renderSortIcon('organizerId')}
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
              Created At {renderSortIcon('createdAt')}
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {matches.map((match) => {
            const brand = brands.find((b) => b.id === match.brandId)
            const organizer = organizers.find((o) => o.id === match.organizerId)
            return (
              <tr key={match.id}>
                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                  {match.id}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {match.score}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {brand ? brand.companyName : match.brandId}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {organizer ? organizer.organizerName : match.organizerId}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {match.status}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                  {new Date(match.createdAt).toLocaleDateString()}
                </td>
              </tr>
            )
          })}
          {matches.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className='px-6 py-4 text-center text-sm text-gray-500'
              >
                No matches found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
