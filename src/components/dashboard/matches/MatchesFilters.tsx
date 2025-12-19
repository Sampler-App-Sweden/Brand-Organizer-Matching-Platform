import {
  GridIcon,
  HandshakeIcon,
  ListIcon,
  SearchIcon,
  SparklesIcon
} from 'lucide-react'

import { DisplayMode, MatchView, MatchSource } from '../../../types/matches'

interface MatchesFiltersProps {
  activeView: MatchView
  onViewChange: (view: MatchView) => void
  displayMode: DisplayMode
  onDisplayModeChange: (mode: DisplayMode) => void
  searchTerm: string
  onSearchTermChange: (value: string) => void
  matchSource?: MatchSource | 'all'
  onMatchSourceChange?: (source: MatchSource | 'all') => void
}

export function MatchesFilters({
  activeView,
  onViewChange,
  displayMode,
  onDisplayModeChange,
  searchTerm,
  onSearchTermChange,
  matchSource = 'all',
  onMatchSourceChange
}: MatchesFiltersProps) {
  return (
    <div className='bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col gap-4'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
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
      {activeView === 'confirmed' && onMatchSourceChange && (
        <div className='flex items-center gap-2'>
          <label className='text-sm font-medium text-gray-700'>Match Type:</label>
          <div className='flex gap-2'>
            <button
              onClick={() => onMatchSourceChange('all')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                matchSource === 'all'
                  ? 'bg-indigo-100 text-indigo-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => onMatchSourceChange('ai')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                matchSource === 'ai'
                  ? 'bg-purple-100 text-purple-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              AI
            </button>
            <button
              onClick={() => onMatchSourceChange('manual')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                matchSource === 'manual'
                  ? 'bg-pink-100 text-pink-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Manual
            </button>
            <button
              onClick={() => onMatchSourceChange('hybrid')}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                matchSource === 'hybrid'
                  ? 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 font-medium'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Hybrid
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
