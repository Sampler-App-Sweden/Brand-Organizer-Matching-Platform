import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { TicketsTable } from '../../components/admin'
import { DashboardLayout } from '../../components/layout'
import { LoadingSpinner } from '../../components/ui'
import {
  getAllSupportTickets,
  type SupportTicket
} from '../../services/supportTicketService'
import { filterData, sortData } from '../../utils/adminDashboardUtils'

export function AllTicketsPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const ticketsData = await getAllSupportTickets()
        setTickets(ticketsData)
      } catch (error) {
        console.error('Error loading support tickets:', error)
      } finally {
        setLoading(false)
      }
    }
    loadTickets()
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
    const jsonString = JSON.stringify(tickets, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'support-tickets.json'
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

  const filteredAndSortedTickets = sortData(
    filterData(tickets, searchTerm),
    sortField,
    sortDirection
  )

  // Calculate statistics
  const openTickets = tickets.filter((t) => t.status === 'open').length
  const inProgressTickets = tickets.filter(
    (t) => t.status === 'in_progress'
  ).length
  const resolvedTickets = tickets.filter((t) => t.status === 'resolved').length
  const closedTickets = tickets.filter((t) => t.status === 'closed').length

  return (
    <DashboardLayout userType='admin'>
      <div className='mb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>
              All Support Tickets
            </h1>
            <p className='text-gray-600'>
              Viewing all {tickets.length} support tickets
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
      <div className='mb-4 grid grid-cols-1 md:grid-cols-5 gap-4'>
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <p className='text-sm text-gray-600'>Total Tickets</p>
          <p className='text-2xl font-bold text-gray-900'>{tickets.length}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <p className='text-sm text-gray-600'>Open</p>
          <p className='text-2xl font-bold text-orange-600'>{openTickets}</p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <p className='text-sm text-gray-600'>In Progress</p>
          <p className='text-2xl font-bold text-blue-600'>
            {inProgressTickets}
          </p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <p className='text-sm text-gray-600'>Resolved</p>
          <p className='text-2xl font-bold text-green-600'>
            {resolvedTickets}
          </p>
        </div>
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <p className='text-sm text-gray-600'>Closed</p>
          <p className='text-2xl font-bold text-gray-600'>{closedTickets}</p>
        </div>
      </div>

      {/* Search and Export */}
      <div className='mb-4 flex items-center gap-4'>
        <input
          type='text'
          placeholder='Search tickets...'
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

      {/* Tickets Table */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <TicketsTable
          tickets={filteredAndSortedTickets}
          handleSort={handleSort}
          renderSortIcon={renderSortIcon}
        />
      </div>
    </DashboardLayout>
  )
}
