import { FilterIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { FilterSelect } from './FilterSelect'
import { SearchBar } from './SearchBar'
import {
  getCategoryOptions,
  locationOptions,
  eventTypeOptions,
  audienceSizeOptions
} from './directoryFilterOptions'
import { clearAllFilters } from './directoryFilterUtils'
import { DirectoryFilterParams } from './directoryFilterTypes'

interface DirectoryFiltersProps {
  onFilterChange: (filters: Partial<DirectoryFilterParams>) => void
  currentFilters: DirectoryFilterParams
  memberType: 'brand' | 'organizer'
}

export function DirectoryFilters({
  onFilterChange,
  currentFilters,
  memberType
}: DirectoryFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '')
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFilterChange({ search: searchTerm })
  }

  const handleSelectChange =
    (key: keyof DirectoryFilterParams) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onFilterChange({ [key]: e.target.value || undefined })
    }

  const handleClearFilters = () => {
    clearAllFilters(setSearchTerm, onFilterChange)
  }
  const filtersApplied =
    currentFilters.search ||
    currentFilters.category ||
    currentFilters.location ||
    currentFilters.eventType ||
    currentFilters.audienceSize
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters)
  }
  return (
    <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-4 sticky top-20'>
      <div className='flex justify-between items-center mb-4'>
        <h3 className='text-lg font-semibold text-gray-900'>Filters</h3>
        <button
          className='md:hidden inline-flex items-center text-gray-500 hover:text-gray-700'
          onClick={toggleMobileFilters}
        >
          {showMobileFilters ? (
            <XIcon className='h-5 w-5' />
          ) : (
            <FilterIcon className='h-5 w-5' />
          )}
        </button>
      </div>
      <div className={`md:block ${showMobileFilters ? 'block' : 'hidden'}`}>
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onSubmit={handleSearchSubmit}
        />
        <div className='space-y-4'>
          <FilterSelect
            id='category'
            label={memberType === 'brand' ? 'Industry' : 'Category'}
            value={currentFilters.category || ''}
            options={getCategoryOptions(memberType)}
            onChange={handleSelectChange('category')}
          />
          <FilterSelect
            id='location'
            label='Location'
            value={currentFilters.location || ''}
            options={locationOptions}
            onChange={handleSelectChange('location')}
          />
          {memberType === 'organizer' && (
            <FilterSelect
              id='eventType'
              label='Event Type'
              value={currentFilters.eventType || ''}
              options={eventTypeOptions}
              onChange={handleSelectChange('eventType')}
            />
          )}
          <FilterSelect
            id='audienceSize'
            label='Audience Size'
            value={currentFilters.audienceSize || ''}
            options={audienceSizeOptions}
            onChange={handleSelectChange('audienceSize')}
          />
          {filtersApplied && (
            <button
              type='button'
              onClick={handleClearFilters}
              className='text-sm text-indigo-600 hover:text-indigo-800 mt-2'
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
