export function OrganizersTable({
  organizers,
  sortField,
  sortDirection,
  handleSort,
  filterData,
  renderSortIcon
}: any) {
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
              onClick={() => handleSort('eventName')}
            >
              Event {renderSortIcon('eventName')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('eventType')}
            >
              Type {renderSortIcon('eventType')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('eventDate')}
            >
              Date {renderSortIcon('eventDate')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('location')}
            >
              Location {renderSortIcon('location')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('attendeeCount')}
            >
              Attendees {renderSortIcon('attendeeCount')}
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {filterData(organizers).map((organizer: any) => (
            <tr key={organizer.id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {organizer.organizerName}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {organizer.eventName}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {organizer.eventType}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {new Date(organizer.eventDate).toLocaleDateString()}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {organizer.location}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {organizer.attendeeCount}
              </td>
            </tr>
          ))}
          {filterData(organizers).length === 0 && (
            <tr>
              <td
                colSpan={6}
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
