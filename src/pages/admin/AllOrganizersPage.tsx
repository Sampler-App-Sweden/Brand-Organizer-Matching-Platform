import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { OrganizersTable } from '../../components/admin'
import { EditOrganizerModal } from '../../components/admin/EditOrganizerModal'
import { DashboardLayout } from '../../components/layout'
import { LoadingSpinner } from '../../components/ui'
import { getAllOrganizers, updateOrganizer } from '../../services/dataService'
import { filterData, sortData } from '../../utils/adminDashboardUtils'
import type { Organizer } from '../../types'

export function AllOrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
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
    const loadOrganizers = async () => {
      try {
        const organizersData = await getAllOrganizers()
        setOrganizers(organizersData)
      } catch (error) {
        console.error('Error loading organizers:', error)
      } finally {
        setLoading(false)
      }
    }
    loadOrganizers()
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

    const fullOrganizerData: Omit<Organizer, 'id' | 'createdAt'> = {
      ...organizerToUpdate,
      ...updatedData,
      createdAt: undefined as any
    }
    delete (fullOrganizerData as any).id
    delete (fullOrganizerData as any).createdAt

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
    filterData(organizers, searchTerm),
    sortField,
    sortDirection
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

      {/* Search and Export */}
      <div className='mb-4 flex items-center gap-4'>
        <input
          type='text'
          placeholder='Search organizers...'
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

      {/* Organizers Table */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        <OrganizersTable
          organizers={filteredAndSortedOrganizers}
          handleSort={handleSort}
          renderSortIcon={renderSortIcon}
          onEdit={handleEdit}
        />
      </div>

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
