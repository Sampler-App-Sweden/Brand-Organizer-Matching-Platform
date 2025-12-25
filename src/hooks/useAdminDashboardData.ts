import { useState, useEffect } from 'react'
import {
  getAllSupportTickets,
  type SupportTicket
} from '../services/supportTicketService'
import { sendDataByEmail } from '../services/emailService'
import {
  getAllBrands,
  getAllOrganizers
} from '../services/dataService'
import {
  getAllConnections,
  getBatchEnhancedConnections
} from '../services/connectionService'
import type { Brand, Organizer, EnhancedConnection } from '../types'
import type { UserInfo } from '../types/edgeFunctions'

export function useAdminDashboardData() {
  const [users, setUsers] = useState<UserInfo[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [organizers, setOrganizers] = useState<Organizer[]>([])
  const [tickets, setTickets] = useState<SupportTicket[]>([])
  const [connections, setConnections] = useState<EnhancedConnection[]>([])
  const [activeTab, setActiveTab] = useState<
    'users' | 'brands' | 'organizers' | 'tickets' | 'connections'
  >('users')
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortField, setSortField] = useState<string>('created_at')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [isExporting, setIsExporting] = useState(false)
  const [exportFeedback, setExportFeedback] = useState<{
    message: string
    type: 'success' | 'error' | 'info'
    visible: boolean
  }>({
    message: '',
    type: 'info',
    visible: false
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const usersData = JSON.parse(localStorage.getItem('users') || '[]')
        const [brandsData, organizersData, ticketsData, connectionsData] =
          await Promise.all([
            getAllBrands(),
            getAllOrganizers(),
            getAllSupportTickets(),
            getAllConnections()
          ])
        const enhancedConnections = await getBatchEnhancedConnections(connectionsData)

        // Deduplicate mutual connections - only show one connection per brand-organizer pair
        const uniqueConnections = new Map<string, EnhancedConnection>()
        enhancedConnections.forEach((connection) => {
          const key = `${connection.brandId}|${connection.organizerId}`
          const existing = uniqueConnections.get(key)

          if (!existing ||
              (connection.isMutual && !existing.isMutual) ||
              (connection.isMutual && existing.isMutual && connection.createdAt < existing.createdAt)) {
            uniqueConnections.set(key, connection)
          }
        })

        const deduplicatedConnections = Array.from(uniqueConnections.values())

        setUsers(usersData)
        setBrands(brandsData)
        setOrganizers(organizersData)
        setTickets(ticketsData)
        setConnections(deduplicatedConnections)
      } catch (error) {
        console.error('Error loading admin dashboard data:', error)
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

  const exportData = (
    dataType: 'users' | 'brands' | 'organizers' | 'tickets' | 'connections'
  ) => {
    let data
    let filename
    switch (dataType) {
      case 'users':
        data = users
        filename = 'users.json'
        break
      case 'brands':
        data = brands
        filename = 'brands.json'
        break
      case 'organizers':
        data = organizers
        filename = 'organizers.json'
        break
      case 'tickets':
        data = tickets
        filename = 'support-tickets.json'
        break
      case 'connections':
        data = connections
        filename = 'connections.json'
        break
    }
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const emailData = async (
    dataType: 'users' | 'brands' | 'organizers' | 'tickets' | 'connections'
  ) => {
    setIsExporting(true)
    setExportFeedback({
      message: 'Sending data to your email...',
      type: 'info',
      visible: true
    })
    let data
    let subject
    switch (dataType) {
      case 'users':
        data = users
        subject = 'SponsrAI Users Data Export'
        break
      case 'brands':
        data = brands
        subject = 'SponsrAI Brands Data Export'
        break
      case 'organizers':
        data = organizers
        subject = 'SponsrAI Organizers Data Export'
        break
      case 'tickets':
        data = tickets
        subject = 'SponsrAI Support Tickets Data Export'
        break
      case 'connections':
        data = connections
        subject = 'SponsrAI Connections Data Export'
        break
    }
    try {
      await sendDataByEmail('info@sponsrai.se', subject, dataType, data)
      setExportFeedback({
        message: `${
          dataType.charAt(0).toUpperCase() + dataType.slice(1)
        } data successfully sent to info@sponsrai.se`,
        type: 'success',
        visible: true
      })
      setTimeout(() => {
        setExportFeedback((prev) => ({ ...prev, visible: false }))
      }, 5000)
    } catch (error) {
      setExportFeedback({
        message: `Error sending email: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        type: 'error',
        visible: true
      })
    } finally {
      setIsExporting(false)
    }
  }

  return {
    users,
    brands,
    organizers,
    tickets,
    connections,
    activeTab,
    setActiveTab,
    loading,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    handleSort,
    isExporting,
    exportFeedback,
    exportData,
    emailData,
    setExportFeedback
  }
}
