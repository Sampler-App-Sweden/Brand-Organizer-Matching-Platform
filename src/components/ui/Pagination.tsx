import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}
export function Pagination({
  currentPage,
  totalPages,
  onPageChange
}: PaginationProps) {
  const renderPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show a subset of pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 4; i++) {
          pages.push(i)
        }
        pages.push('ellipsis')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push(1)
        pages.push('ellipsis')
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // In the middle
        pages.push(1)
        pages.push('ellipsis')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('ellipsis')
        pages.push(totalPages)
      }
    }
    return pages
  }
  if (totalPages <= 1) {
    return null
  }
  return (
    <div className='flex items-center justify-center'>
      <nav className='flex items-center space-x-1'>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`p-2 rounded-md ${
            currentPage === 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          aria-label='Previous page'
        >
          <ChevronLeftIcon className='h-5 w-5' />
        </button>
        {renderPageNumbers().map((page, index) =>
          page === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} className='px-3 py-2 text-gray-500'>
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page as number)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        )}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`p-2 rounded-md ${
            currentPage === totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          aria-label='Next page'
        >
          <ChevronRightIcon className='h-5 w-5' />
        </button>
      </nav>
    </div>
  )
}
