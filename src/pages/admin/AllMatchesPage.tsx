import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MatchesTable } from '../../components/admin'
import { DashboardLayout } from '../../components/layout'
import { LoadingSpinner } from '../../components/ui'
import {
  getAllMatches,
  getAllBrands,
  getAllOrganizers
} from '../../services/dataService'
import { filterData, sortData } from '../../utils/adminDashboardUtils'
import type { Match, Brand, Organizer } from '../../types'

export function AllMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const [matchesData, brandsData, organizersData] = await Promise.all([
          getAllMatches(),
          getAllBrands(),
          getAllOrganizers()
        ])
        setMatches(matchesData)
        setBrands(brandsData)
        setOrganizers(organizersData)
      } catch (error) {
        console.error('Error loading matches:', error)
      } finally {
        setLoading(false)
      }
    }
    loadMatches()
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
    const jsonString = JSON.stringify(matches, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'matches.json'
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

  const filteredAndSortedMatches = sortData(
    filterData(matches, searchTerm),
    sortField,
    sortDirection
  ).map((match) => ({
    ...match,
    createdAt:
      typeof match.createdAt === 'string'
        ? match.createdAt
        : match.createdAt.toISOString()
  }))

  // Calculate statistics
  const pendingCount = matches.filter((m) => m.status === 'pending').length
  const acceptedCount = matches.filter((m) => m.status === 'accepted').length
  const rejectedCount = matches.filter((m) => m.status === 'rejected').length

  return (
    <DashboardLayout userType='admin'>
      <div className='mb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>All Matches</h1>
            <p className='text-gray-600'>
              Viewing all {matches.length} matches on the platform
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

      {/* Statistics */}
      <div className='mb-4 grid grid-cols-1 md:grid-cols-4 gap-4'>
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <p className='text-sm text-gray-600'>Total Matches</p>
          <p className='text-2xl font-bold text-gray-900'>{matches.length}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <p className='text-sm text-gray-600'>Pending</p>
          <p className='text-2xl font-bold text-yellow-600'>{pendingCount}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <p className='text-sm text-gray-600'>Accepted</p>
          <p className='text-2xl font-bold text-green-600'>{acceptedCount}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <p className='text-sm text-gray-600'>Rejected</p>
          <p className='text-2xl font-bold text-red-600'>{rejectedCount}</p>
        </div>
      </div>

      {/* Search and Export */}
      <div className='mb-4 flex items-center gap-4'>
        <input
          type='text'
          placeholder='Search matches...'
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

      {/* Matches Table */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <MatchesTable
          matches={filteredAndSortedMatches}
          brands={brands}
          organizers={organizers}
          handleSort={handleSort}
          renderSortIcon={renderSortIcon}
        />
      </div>
    </DashboardLayout>
  )
}
