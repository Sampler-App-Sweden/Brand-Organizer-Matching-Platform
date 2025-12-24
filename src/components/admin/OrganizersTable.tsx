import React from 'react'

interface Organizer {
  id: string
  organizerName: string
  contactName: string
  email: string
  location: string
}

interface OrganizersTableProps {
  organizers: Organizer[]
  handleSort: (field: string) => void
  renderSortIcon: (field: string) => React.ReactNode
  onEdit?: (organizer: Organizer) => void
}

export function OrganizersTable({
  organizers,
  handleSort,
  renderSortIcon,
  onEdit
}: OrganizersTableProps) {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('organizerName')}
            >
              Organizer {renderSortIcon('organizerName')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('contactName')}
            >
              Contact {renderSortIcon('contactName')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('email')}
            >
              Email {renderSortIcon('email')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('location')}
            >
              Location {renderSortIcon('location')}
            </th>
            {onEdit && (
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {organizers.map((organizer) => (
            <tr key={organizer.id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {organizer.organizerName}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {organizer.contactName}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {organizer.email}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {organizer.location}
              </td>
              {onEdit && (
                <td className='px-6 py-4 whitespace-nowrap text-sm'>
                  <button
                    onClick={() => onEdit(organizer)}
                    className='text-blue-600 hover:text-blue-800 font-medium'
                  >
                    Edit
                  </button>
                </td>
              )}
            </tr>
          ))}
          {organizers.length === 0 && (
            <tr>
              <td
                colSpan={onEdit ? 5 : 4}
                className='px-6 py-4 text-center text-sm text-gray-500'
              >
                No organizers found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
