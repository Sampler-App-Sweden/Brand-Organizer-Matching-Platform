import React from 'react'
import type { EnhancedConnection } from '../../types'

interface ConnectionsTableProps {
  connections: EnhancedConnection[]
  handleSort: (field: string) => void
  renderSortIcon: (field: string) => React.ReactNode
}

export function ConnectionsTable({
  connections,
  handleSort,
  renderSortIcon
}: ConnectionsTableProps) {
  const getStatusBadge = (status: string) => {
    const statusColors = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      withdrawn: 'bg-gray-100 text-gray-800'
    }
    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusColors[status as keyof typeof statusColors] ||
          'bg-gray-100 text-gray-800'
        }`}
      >
        {status}
      </span>
    )
  }

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
              onClick={() => handleSort('senderName')}
            >
              Sender {renderSortIcon('senderName')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('receiverName')}
            >
              Receiver {renderSortIcon('receiverName')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('status')}
            >
              Status {renderSortIcon('status')}
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Type
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
          {connections.map((connection) => (
            <tr key={connection.id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {connection.id.substring(0, 8)}...
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                <div>
                  <div className='font-medium'>{connection.senderName}</div>
                  <div className='text-xs text-gray-500'>
                    {connection.senderType}
                  </div>
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                <div>
                  <div className='font-medium'>{connection.receiverName}</div>
                  <div className='text-xs text-gray-500'>
                    {connection.receiverType}
                  </div>
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {getStatusBadge(connection.status)}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                <div className='flex flex-col gap-1'>
                  {connection.isMutual && (
                    <span className='px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800'>
                      Mutual
                    </span>
                  )}
                  {connection.hasAIMatch && (
                    <span className='px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800'>
                      AI Match
                    </span>
                  )}
                </div>
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {new Date(connection.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {connections.length === 0 && (
            <tr>
              <td
                colSpan={6}
                className='px-6 py-4 text-center text-sm text-gray-500'
              >
                No connections found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
