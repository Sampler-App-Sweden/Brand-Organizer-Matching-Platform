interface ConversationFiltersProps {
  sortBy: 'recent' | 'unread'
  onSortChange: (value: 'recent' | 'unread') => void
}

export function ConversationFilters({
  sortBy,
  onSortChange
}: ConversationFiltersProps) {
  return (
    <div className='bg-white p-3 rounded-lg shadow-sm mb-3 flex justify-end items-center'>
      <div className='flex items-center gap-2'>
        <span className='text-sm font-medium text-gray-700'>Sort:</span>
        <div className='flex rounded-md overflow-hidden border border-gray-300'>
          <button
            className={`px-3 py-1.5 text-sm transition-colors ${
              sortBy === 'recent'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onSortChange('recent')}
          >
            Recent
          </button>
          <button
            className={`px-3 py-1.5 text-sm transition-colors ${
              sortBy === 'unread'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
            onClick={() => onSortChange('unread')}
          >
            Unread
          </button>
        </div>
      </div>
    </div>
  )
}
