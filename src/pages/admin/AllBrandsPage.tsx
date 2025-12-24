import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { BrandsTable } from '../../components/admin'
import { DashboardLayout } from '../../components/layout'
import { LoadingSpinner } from '../../components/ui'
import { getAllBrands } from '../../services/dataService'
import { filterData, sortData } from '../../utils/adminDashboardUtils'
import type { Brand } from '../../types'

export function AllBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const loadBrands = async () => {
      try {
        const brandsData = await getAllBrands()
        setBrands(brandsData)
      } catch (error) {
        console.error('Error loading brands:', error)
      } finally {
        setLoading(false)
      }
    }
    loadBrands()
  }, [])

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  const exportData = () => {
    const jsonString = JSON.stringify(brands, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'brands.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <DashboardLayout userType='admin'>
        <div className='flex justify-center items-center h-64'>
          <LoadingSpinner size={64} />
        </div>
      </DashboardLayout>
    )
  }

  const filteredAndSortedBrands = sortData(
    filterData(brands, searchTerm),
    sortField,
    sortDirection
  ).map((brand) => ({
    ...brand,
    createdAt:
      typeof brand.createdAt === 'string'
        ? brand.createdAt
        : brand.createdAt.toISOString()
  }))

  return (
    <DashboardLayout userType='admin'>
      <div className='mb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>All Brands</h1>
            <p className='text-gray-600'>
              Viewing all {brands.length} brands on the platform
            </p>
          </div>
          <Link
            to='/admin'
            className='text-blue-600 hover:text-blue-800 font-medium'
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Search and Export */}
      <div className='mb-4 flex items-center gap-4'>
        <input
          type='text'
          placeholder='Search brands...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          onClick={exportData}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Export Data
        </button>
      </div>

      {/* Brands Table */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <BrandsTable
          brands={filteredAndSortedBrands}
          handleSort={handleSort}
          renderSortIcon={renderSortIcon}
        />
      </div>
    </DashboardLayout>
  )
}
