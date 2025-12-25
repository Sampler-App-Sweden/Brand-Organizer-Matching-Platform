import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ConnectionsTable } from '../../components/admin'
import { DashboardLayout } from '../../components/layout'
import { DASHBOARD_SPACING } from '../../constants/dashboardStyles.constants'
import { LoadingSpinner } from '../../components/ui'
import {
  getAllConnections,
  getBatchEnhancedConnections
} from '../../services/connectionService'
import { filterData, sortData } from '../../utils/adminDashboardUtils'
import type { EnhancedConnection } from '../../types'

export function AllConnectionsPage() {
  const [connections, setConnections] = useState<EnhancedConnection[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string>('createdAt')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const loadConnections = async () => {
      try {
        const connectionsData = await getAllConnections()
        const enhancedConnections =
          await getBatchEnhancedConnections(connectionsData)

        // Deduplicate mutual connections - only show one connection per brand-organizer pair
        const uniqueConnections = new Map<string, EnhancedConnection>()
        enhancedConnections.forEach((connection) => {
          const key = `${connection.brandId}|${connection.organizerId}`
          const existing = uniqueConnections.get(key)

          // Keep the connection if:
          // 1. No existing connection for this pair
          // 2. Or this connection is mutual and existing is not
          // 3. Or both are mutual and this one was created first
          if (!existing ||
              (connection.isMutual && !existing.isMutual) ||
              (connection.isMutual && existing.isMutual && connection.createdAt < existing.createdAt)) {
            uniqueConnections.set(key, connection)
          }
        })

        const deduplicatedConnections = Array.from(uniqueConnections.values())
        setConnections(deduplicatedConnections)
      } catch (error) {
        console.error('Error loading connections:', error)
      } finally {
        setLoading(false)
      }
    }
    loadConnections()
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
    const jsonString = JSON.stringify(connections, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'connections.json'
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

  const filteredAndSortedConnections = sortData(
    filterData(connections, searchTerm),
    sortField,
    sortDirection
  )

  // Calculate statistics
  const pendingCount = connections.filter((c) => c.status === 'pending').length
  const acceptedCount = connections.filter(
    (c) => c.status === 'accepted'
  ).length
  const rejectedCount = connections.filter(
    (c) => c.status === 'rejected'
  ).length
  const mutualCount = connections.filter((c) => c.isMutual).length

  return (
    <DashboardLayout userType='admin'>
      <div className={DASHBOARD_SPACING.headerMargin}>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>All Connections</h1>
            <p className='text-gray-600'>
              Viewing all {connections.length} connections on the platform
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
      <div className='mb-6 grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6'>
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <p className='text-sm text-gray-600'>Total Connections</p>
          <p className='text-2xl font-bold text-gray-900'>
            {connections.length}
          </p>
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
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <p className='text-sm text-gray-600'>Mutual</p>
          <p className='text-2xl font-bold text-indigo-600'>{mutualCount}</p>
        </div>
      </div>

      {/* Search and Export */}
      <div className='mb-6 flex items-center gap-4'>
        <input
          type='text'
          placeholder='Search connections...'
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

      {/* Connections Table */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <ConnectionsTable
          connections={filteredAndSortedConnections}
          handleSort={handleSort}
          renderSortIcon={renderSortIcon}
        />
      </div>
    </DashboardLayout>
  )
}
