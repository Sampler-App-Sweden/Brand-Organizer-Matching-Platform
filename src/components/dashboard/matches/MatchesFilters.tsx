import {
  GridIcon,
  HandshakeIcon,
  ListIcon,
  SearchIcon,
  SparklesIcon
} from 'lucide-react'

import { DisplayMode, MatchView } from '../../../types/matches'

interface MatchesFiltersProps {
  activeView: MatchView
  onViewChange: (view: MatchView) => void
  displayMode: DisplayMode
  onDisplayModeChange: (mode: DisplayMode) => void
  searchTerm: string
  onSearchTermChange: (value: string) => void
}

export function MatchesFilters({
  activeView,
  onViewChange,
  displayMode,
  onDisplayModeChange,
  searchTerm,
  onSearchTermChange
}: MatchesFiltersProps) {
  return (
    <div className='bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
      <div className='flex items-center space-x-4'>
        <div className='flex rounded-md overflow-hidden border border-indigo-200 bg-indigo-50'>
          <button
            className={`px-4 py-2 flex items-center ${
              activeView === 'confirmed'
                ? 'bg-indigo-600 text-white'
                : 'text-indigo-700'
            }`}
            onClick={() => onViewChange('confirmed')}
          >
            <HandshakeIcon className='h-4 w-4 mr-2' />
            Confirmed
          </button>
          <button
            className={`px-4 py-2 flex items-center ${
              activeView === 'suggested'
                ? 'bg-indigo-600 text-white'
                : 'text-indigo-700'
            }`}
            onClick={() => onViewChange('suggested')}
          >
            <SparklesIcon className='h-4 w-4 mr-2' />
            Suggested
          </button>
        </div>
        <div className='flex rounded-md overflow-hidden border border-gray-300'>
          <button
            className={`p-2 ${
              displayMode === 'grid' ? 'bg-gray-200' : 'bg-white'
            }`}
            onClick={() => onDisplayModeChange('grid')}
            title='Grid view'
          >
            <GridIcon className='h-5 w-5 text-gray-700' />
          </button>
          <button
            className={`p-2 ${
              displayMode === 'list' ? 'bg-gray-200' : 'bg-white'
            }`}
            onClick={() => onDisplayModeChange('list')}
            title='List view'
          >
            <ListIcon className='h-5 w-5 text-gray-700' />
          </button>
        </div>
      </div>
      <div className='relative w-full sm:w-64'>
        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
          <SearchIcon className='h-5 w-5 text-gray-400' />
        </div>
        <input
          type='text'
          placeholder='Search matches...'
          className='pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
          value={searchTerm}
          onChange={(event) => onSearchTermChange(event.target.value)}
        />
      </div>
    </div>
  )
}
