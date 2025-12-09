import { ChevronDownIcon } from 'lucide-react'

import { PHASE_OPTIONS } from '../../constants/messages'
import type { ConversationPhase } from '../../types/messages'

interface ConversationFiltersProps {
  phaseFilter: ConversationPhase | 'all'
  sortBy: 'recent' | 'unread'
  onPhaseChange: (value: ConversationPhase | 'all') => void
  onSortChange: (value: 'recent' | 'unread') => void
}

export function ConversationFilters({
  phaseFilter,
  sortBy,
  onPhaseChange,
  onSortChange
}: ConversationFiltersProps) {
  return (
    <div className='bg-white p-4 rounded-lg shadow-sm mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
      <div className='flex items-center'>
        <label
          htmlFor='phase-filter'
          className='mr-2 text-sm font-medium text-gray-700'
        >
          Phase:
        </label>
        <div className='relative'>
          <select
            id='phase-filter'
            className='appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
            value={phaseFilter}
            onChange={(e) =>
              onPhaseChange(e.target.value as ConversationPhase | 'all')
            }
          >
            {PHASE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
            <ChevronDownIcon className='h-4 w-4 text-gray-400' />
          </div>
        </div>
      </div>
      <div className='flex items-center'>
        <span className='mr-2 text-sm font-medium text-gray-700'>Sort by:</span>
        <div className='flex rounded-md overflow-hidden border border-gray-300'>
          <button
            className={`px-3 py-1.5 text-sm ${
              sortBy === 'recent'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700'
            }`}
            onClick={() => onSortChange('recent')}
          >
            Recent
          </button>
          <button
            className={`px-3 py-1.5 text-sm ${
              sortBy === 'unread'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-700'
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
