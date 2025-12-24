import React from 'react'

import { Table } from '../ui'

interface Brand {
  id: string
  companyName: string
  contactName: string
  industry: string
  productName: string
  budget: string
  createdAt: string
}

interface BrandsTableProps {
  brands: Brand[]
  handleSort: (field: string) => void
  currentSort?: { field: string; direction: 'asc' | 'desc' }
  renderSortIcon?: (field: string) => React.ReactNode
  onEdit?: (brand: Brand) => void
}

export function BrandsTable({
  brands,
  handleSort,
  currentSort,
  onEdit
}: BrandsTableProps) {
  return (
    <Table variant='simple' size='md'>
      <Table.Head>
        <Table.Row>
          <Table.HeadCell
            sortable
            sortField='companyName'
            onSort={handleSort}
            currentSort={currentSort}
          >
            Company
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortField='contactName'
            onSort={handleSort}
            currentSort={currentSort}
          >
            Contact
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortField='industry'
            onSort={handleSort}
            currentSort={currentSort}
          >
            Industry
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortField='productName'
            onSort={handleSort}
            currentSort={currentSort}
          >
            Product
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortField='budget'
            onSort={handleSort}
            currentSort={currentSort}
          >
            Budget
          </Table.HeadCell>
          <Table.HeadCell
            sortable
            sortField='createdAt'
            onSort={handleSort}
            currentSort={currentSort}
          >
            Created At
          </Table.HeadCell>
          {onEdit && <Table.HeadCell>Actions</Table.HeadCell>}
        </Table.Row>
      </Table.Head>
      <Table.Body>
        {brands.map((brand) => (
          <Table.Row key={brand.id} hover>
            <Table.Cell>
              <span className='font-medium text-gray-900'>
                {brand.companyName}
              </span>
            </Table.Cell>
            <Table.Cell>{brand.contactName}</Table.Cell>
            <Table.Cell>{brand.industry}</Table.Cell>
            <Table.Cell>{brand.productName}</Table.Cell>
            <Table.Cell>{brand.budget}</Table.Cell>
            <Table.Cell>
              {new Date(brand.createdAt).toLocaleDateString()}
            </Table.Cell>
            {onEdit && (
              <Table.Cell>
                <button
                  onClick={() => onEdit(brand)}
                  className='text-blue-600 hover:text-blue-800 font-medium text-sm'
                >
                  Edit
                </button>
              </Table.Cell>
            )}
          </Table.Row>
        ))}
        {brands.length === 0 && (
          <Table.EmptyState colSpan={onEdit ? 7 : 6}>
            No brands found
          </Table.EmptyState>
        )}
      </Table.Body>
    </Table>
  )
}
