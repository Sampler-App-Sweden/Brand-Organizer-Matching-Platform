import { DirectoryFilterParams } from './directoryFilterTypes'

export function clearAllFilters(
  setSearchTerm: (v: string) => void,
  onFilterChange: (filters: Partial<DirectoryFilterParams>) => void
) {
  setSearchTerm('')
  onFilterChange({
    search: undefined,
    category: undefined,
    location: undefined,
    eventType: undefined,
    audienceSize: undefined
  })
}
