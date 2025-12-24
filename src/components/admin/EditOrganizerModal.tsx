import { useState, useEffect } from 'react'
import type { Organizer } from '../../types'

interface EditOrganizerModalProps {
  organizer: Organizer | null
  isOpen: boolean
  onClose: () => void
  onSave: (
    organizerId: string,
    updatedData: Partial<Organizer>
  ) => Promise<void>
}

export function EditOrganizerModal({
  organizer,
  isOpen,
  onClose,
  onSave
}: EditOrganizerModalProps) {
  const [formData, setFormData] = useState({
    organizerName: '',
    contactName: '',
    email: '',
    phone: '',
    website: '',
    eventName: '',
    eventType: '',
    location: ''
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (organizer) {
      setFormData({
        organizerName: organizer.organizerName || '',
        contactName: organizer.contactName || '',
        email: organizer.email || '',
        phone: organizer.phone || '',
        website: organizer.website || '',
        eventName: organizer.eventName || '',
        eventType: organizer.eventType || '',
        location: organizer.location || ''
      })
    }
  }, [organizer])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!organizer) return

    setIsSaving(true)
    try {
      await onSave(organizer.id, formData)
      onClose()
    } catch (error) {
      console.error('Error saving organizer:', error)
      alert('Failed to save changes. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen || !organizer) return null

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto'>
        <div className='p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-2xl font-bold text-gray-900'>
              Edit Organizer
            </h2>
            <button
              onClick={onClose}
              className='text-gray-400 hover:text-gray-600 text-2xl'
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Organizer Name *
                </label>
                <input
                  type='text'
                  value={formData.organizerName}
                  onChange={(e) =>
                    setFormData({ ...formData, organizerName: e.target.value })
                  }
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Contact Name *
                </label>
                <input
                  type='text'
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Email *
                </label>
                <input
                  type='email'
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Phone
                </label>
                <input
                  type='tel'
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Website
                </label>
                <input
                  type='url'
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Event Name
                </label>
                <input
                  type='text'
                  value={formData.eventName}
                  onChange={(e) =>
                    setFormData({ ...formData, eventName: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Event Type
                </label>
                <input
                  type='text'
                  value={formData.eventType}
                  onChange={(e) =>
                    setFormData({ ...formData, eventType: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-700 mb-1'>
                  Location
                </label>
                <input
                  type='text'
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                />
              </div>
            </div>

            <div className='flex justify-end gap-3 mt-6'>
              <button
                type='button'
                onClick={onClose}
                className='px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
              >
                Cancel
              </button>
              <button
                type='submit'
                disabled={isSaving}
                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300'
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
