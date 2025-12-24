import React from 'react'
import type { ProductWithBrand } from '../../services/sponsorshipService'

interface ProductsTableProps {
  products: ProductWithBrand[]
  brandsMap: Map<string, string> // Map of brand ID to brand name
  handleSort: (field: string) => void
  renderSortIcon: (field: string) => React.ReactNode
}

export function ProductsTable({
  products,
  brandsMap,
  handleSort,
  renderSortIcon
}: ProductsTableProps) {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('name')}
            >
              Product Name {renderSortIcon('name')}
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
              Brand
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('goals')}
            >
              Goals {renderSortIcon('goals')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('quantity')}
            >
              Quantity {renderSortIcon('quantity')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('status')}
            >
              Status {renderSortIcon('status')}
            </th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {products.map((product) => (
            <tr key={product.id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {product.name}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {brandsMap.get(product.brandId) || 'Unknown'}
              </td>
              <td className='px-6 py-4 text-sm text-gray-500'>
                {product.goals || '-'}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {product.quantity} {product.unit}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm'>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.status === 'online'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {product.status}
                </span>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td
                colSpan={5}
                className='px-6 py-4 text-center text-sm text-gray-500'
              >
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
