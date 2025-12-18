import React from 'react'

interface User {
  id: string
  name: string
  email: string
  type: string
  createdAt: string
}

interface UsersTableProps {
  users: User[]
  handleSort: (field: string) => void
  renderSortIcon: (field: string) => React.ReactNode
}

export function UsersTable({
  users,
  handleSort,
  renderSortIcon
}: UsersTableProps) {
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
              onClick={() => handleSort('type')}
            >
              Type {renderSortIcon('type')}
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
          {users.map((user) => (
            <tr key={user.id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {user.name}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {user.email}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {user.type}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {new Date(user.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className='px-6 py-4 text-center text-sm text-gray-500'
              >
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
