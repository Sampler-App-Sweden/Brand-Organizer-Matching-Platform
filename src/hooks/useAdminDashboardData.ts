import { useState, useEffect } from 'react'
import { getAllSupportTickets } from '../services/supportTicketService'
import { sendDataByEmail } from '../services/emailService'

export function useAdminDashboardData() {
  const [users, setUsers] = useState<any[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [organizers, setOrganizers] = useState<any[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<
    'users' | 'brands' | 'organizers' | 'matches' | 'tickets'
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
      const usersData = JSON.parse(localStorage.getItem('users') || '[]')
      const brandsData = JSON.parse(localStorage.getItem('brands') || '[]')
      const organizersData = JSON.parse(
        localStorage.getItem('organizers') || '[]'
      )
      const matchesData = JSON.parse(localStorage.getItem('matches') || '[]')
      const ticketsData = await getAllSupportTickets()
      setUsers(usersData)
      setBrands(brandsData)
      setOrganizers(organizersData)
      setMatches(matchesData)
      setTickets(ticketsData)
      setLoading(false)
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
    dataType: 'users' | 'brands' | 'organizers' | 'matches' | 'tickets'
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
      case 'matches':
        data = matches
        filename = 'matches.json'
        break
      case 'tickets':
        data = tickets
        filename = 'support-tickets.json'
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
    dataType: 'users' | 'brands' | 'organizers' | 'matches' | 'tickets'
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
      case 'matches':
        data = matches
        subject = 'SponsrAI Matches Data Export'
        break
      case 'tickets':
        data = tickets
        subject = 'SponsrAI Support Tickets Data Export'
        break
    }
    try {
      await sendDataByEmail(
        'preslavnikolov@outlook.com',
        subject,
        dataType,
        data
      )
      setExportFeedback({
        message: `${
          dataType.charAt(0).toUpperCase() + dataType.slice(1)
        } data successfully sent to preslavnikolov@outlook.com`,
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
    matches,
    tickets,
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
