import React from 'react'

interface Ticket {
  id: string
  created_at: string
  name: string
  email: string
  category: string
  status: string
  priority: string
}

interface TicketsTableProps {
  tickets: Ticket[]
  handleSort: (field: string) => void
  renderSortIcon: (field: string) => React.ReactNode
}

export function TicketsTable({
  tickets,
  handleSort,
  renderSortIcon
}: TicketsTableProps) {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('created_at')}
            >
              Created At {renderSortIcon('created_at')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('name')}
            >
              Name {renderSortIcon('name')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('email')}
            >
              Email {renderSortIcon('email')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('category')}
            >
              Category {renderSortIcon('category')}
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Status
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Priority
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {tickets.map((ticket) => (
            <tr key={ticket.id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {new Date(ticket.created_at).toLocaleDateString()}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {ticket.name}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {ticket.email}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {ticket.category}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {ticket.status}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {ticket.priority}
              </td>
            </tr>
          ))}
          {tickets.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className='px-6 py-4 text-center text-sm text-gray-500'
              >
                No support tickets found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
