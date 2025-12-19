import React from 'react'

import { Table } from '../ui'

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
  currentSort?: { field: string; direction: 'asc' | 'desc' }
  renderSortIcon?: (field: string) => React.ReactNode
}

export function UsersTable({
  users,
  handleSort,
  currentSort
}: UsersTableProps) {
  return (
    <Table variant='simple' size='md'>
      <Table.Head>
        <Table.Row>
          <Table.HeadCell
            sortable
            sortField='id'
            onSort={handleSort}
            currentSort={currentSort}
          >
            ID
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortField='name'
            onSort={handleSort}
            currentSort={currentSort}
          >
            Name
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortField='email'
            onSort={handleSort}
            currentSort={currentSort}
          >
            Email
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortField='type'
            onSort={handleSort}
            currentSort={currentSort}
          >
            Type
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortField='createdAt'
            onSort={handleSort}
            currentSort={currentSort}
          >
            Created At
          </Table.HeadCell>
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {users.map((user) => (
          <Table.Row key={user.id} hover>
            <Table.Cell>
              <span className='font-medium text-gray-900'>{user.name}</span>
            </Table.Cell>
            <Table.Cell>{user.email}</Table.Cell>
            <Table.Cell>{user.type}</Table.Cell>
            <Table.Cell>
              {new Date(user.createdAt).toLocaleDateString()}
            </Table.Cell>
          </Table.Row>
        ))}
        {users.length === 0 && (
          <Table.EmptyState colSpan={5}>No users found</Table.EmptyState>
        )}
      </Table.Body>
    </Table>
  )
}
