export function sortData(
  data: any[],
  sortField: string,
  sortDirection: 'asc' | 'desc'
) {
  if (!sortField) return data
  return [...data].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]
    if (sortField.includes('.')) {
      const parts = sortField.split('.')
      aValue = parts.reduce((obj, key) => obj?.[key], a)
      bValue = parts.reduce((obj, key) => obj?.[key], b)
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
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
  })
}

export function filterData(data: any[], searchTerm: string) {
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
