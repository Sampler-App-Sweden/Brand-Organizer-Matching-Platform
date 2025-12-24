import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { OrganizersTable } from '../../components/admin'
import { EventsTable } from '../../components/admin/EventsTable'
import { EditOrganizerModal } from '../../components/admin/EditOrganizerModal'
import { DashboardLayout } from '../../components/layout'
import { LoadingSpinner } from '../../components/ui'
import { getAllOrganizers, updateOrganizer } from '../../services/dataService'
import { getAllEvents } from '../../services/eventsService'
import { filterData, sortData } from '../../utils/adminDashboardUtils'
import type { Organizer } from '../../types'
import type { Event } from '../../types/event'

export function AllOrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [organizersSearchTerm, setOrganizersSearchTerm] = useState('')
  const [eventsSearchTerm, setEventsSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [editingOrganizer, setEditingOrganizer] = useState<Organizer | null>(
    null
  )
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'organizers' | 'events'>(
    'organizers'
  )

  useEffect(() => {
    const loadData = async () => {
      try {
        const [organizersData, eventsData] = await Promise.all([
          getAllOrganizers(),
          getAllEvents()
        ])
        setOrganizers(organizersData)
        setEvents(eventsData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
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
    const jsonString = JSON.stringify(organizers, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'organizers.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleEdit = (organizer: Organizer) => {
    setEditingOrganizer(organizer)
    setIsEditModalOpen(true)
  }

  const handleSave = async (
    organizerId: string,
    updatedData: Partial<Organizer>
  ) => {
    const organizerToUpdate = organizers.find((o) => o.id === organizerId)
    if (!organizerToUpdate) return

    // Destructure to exclude id and createdAt
    const { id, createdAt, ...organizerDataWithoutIdAndDate } = organizerToUpdate
    const fullOrganizerData: Omit<Organizer, 'id' | 'createdAt'> = {
      ...organizerDataWithoutIdAndDate,
      ...updatedData
    }

    await updateOrganizer(organizerId, fullOrganizerData)

    // Reload organizers to get updated data
    const updatedOrganizers = await getAllOrganizers()
    setOrganizers(updatedOrganizers)
    setIsEditModalOpen(false)
    setEditingOrganizer(null)
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

  const filteredAndSortedOrganizers = sortData(
    filterData(organizers, organizersSearchTerm),
    sortField,
    sortDirection
  )

  const filteredAndSortedEvents = sortData(
    filterData(events, eventsSearchTerm),
    sortField,
    sortDirection
  )

  // Create a map of organizer IDs to organizer names for the EventsTable
  const organizersMap = new Map(
    organizers.map((org) => [org.id, org.organizerName])
  )

  return (
    <DashboardLayout userType='admin'>
      <div className='mb-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>All Organizers</h1>
            <p className='text-gray-600'>
              Viewing all {organizers.length} organizers on the platform
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

      {/* Tabs */}
      <div className='mb-6 border-b border-gray-200'>
        <nav className='-mb-px flex space-x-8'>
          <button
            onClick={() => setActiveTab('organizers')}
            className={`${
              activeTab === 'organizers'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors`}
          >
            Organizers ({organizers.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`${
              activeTab === 'events'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
            } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium transition-colors`}
          >
            Events ({events.length})
          </button>
        </nav>
      </div>

      {/* Search and Export */}
      <div className='mb-4 flex items-center gap-4'>
        <input
          type='text'
          placeholder={
            activeTab === 'organizers' ? 'Search organizers...' : 'Search events...'
          }
          value={
            activeTab === 'organizers' ? organizersSearchTerm : eventsSearchTerm
          }
          onChange={(e) =>
            activeTab === 'organizers'
              ? setOrganizersSearchTerm(e.target.value)
              : setEventsSearchTerm(e.target.value)
          }
          className='flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        />
        <button
          onClick={exportData}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Export Data
        </button>
      </div>

      {/* Content based on active tab */}
      {activeTab === 'organizers' && (
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <OrganizersTable
            organizers={filteredAndSortedOrganizers}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
            onEdit={handleEdit}
          />
        </div>
      )}

      {activeTab === 'events' && (
        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <EventsTable
            events={filteredAndSortedEvents}
            organizersMap={organizersMap}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
          />
        </div>
      )}

      {/* Edit Modal */}
      <EditOrganizerModal
        organizer={editingOrganizer}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setEditingOrganizer(null)
        }}
        onSave={handleSave}
      />
    </DashboardLayout>
  )
}
