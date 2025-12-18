export function sortData<T extends Record<string, unknown>>(
  data: T[],
  sortField: string,
  sortDirection: 'asc' | 'desc'
): T[] {
  if (!sortField) return data
  return [...data].sort((a, b) => {
    let aValue: unknown = a[sortField]
    let bValue: unknown = b[sortField]
    if (sortField.includes('.')) {
      const parts = sortField.split('.')
      aValue = parts.reduce((obj: unknown, key: string) => (obj as Record<string, unknown>)?.[key], a as unknown)
      bValue = parts.reduce((obj: unknown, key: string) => (obj as Record<string, unknown>)?.[key], b as unknown)
    }
    if (aValue instanceof Date && bValue instanceof Date) {
      return sortDirection === 'asc'
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime()
    }
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    }
    return 0
  })
}

export function filterData<T extends Record<string, unknown>>(
  data: T[],
  searchTerm: string
): T[] {
  if (!searchTerm) return data
  const term = searchTerm.toLowerCase()
  return data.filter((item) => {
    return Object.values(item).some((value) => {
      if (typeof value === 'string') {
        return value.toLowerCase().includes(term)
      }
      return false
    })
  })
}
