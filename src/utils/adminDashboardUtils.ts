// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function sortData<T extends Record<string, any>>(
  data: T[],
  sortField: string,
  sortDirection: 'asc' | 'desc'
): T[] {
  if (!sortField) return data
  return [...data].sort((a, b) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let aValue: any = a[sortField]
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let bValue: any = b[sortField]
    if (sortField.includes('.')) {
      const parts = sortField.split('.')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      aValue = parts.reduce((obj: any, key: string) => obj?.[key], a)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      bValue = parts.reduce((obj: any, key: string) => obj?.[key], b)
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function filterData<T extends Record<string, any>>(
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
