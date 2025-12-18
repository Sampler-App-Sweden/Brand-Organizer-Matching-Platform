export function BrandsTable({
  brands,
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
              onClick={() => handleSort('companyName')}
            >
              Company {renderSortIcon('companyName')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('contactName')}
            >
              Contact {renderSortIcon('contactName')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('industry')}
            >
              Industry {renderSortIcon('industry')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('productName')}
            >
              Product {renderSortIcon('productName')}
            </th>
            <th
              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
              onClick={() => handleSort('budget')}
            >
              Budget {renderSortIcon('budget')}
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
          {filterData(brands).map((brand: any) => (
            <tr key={brand.id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                {brand.companyName}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {brand.contactName}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {brand.industry}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {brand.productName}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {brand.budget}
              </td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {new Date(brand.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
          {filterData(brands).length === 0 && (
            <tr>
              <td
                colSpan={6}
                className='px-6 py-4 text-center text-sm text-gray-500'
              >
                No brands found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
