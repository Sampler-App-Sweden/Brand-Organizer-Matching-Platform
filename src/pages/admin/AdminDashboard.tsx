import {
  ArrowDownIcon,
  ArrowUpIcon,
  CalendarIcon,
  DownloadIcon,
  HandshakeIcon,
  MailIcon,
  PackageIcon,
  SearchIcon,
  UsersIcon,
  LifeBuoyIcon
} from 'lucide-react'
import { useState, useEffect } from 'react'

import { DashboardLayout } from '../../components/layout'
import { Button } from '../../components/ui'
import { User } from '../../services/authService'
import { sendDataByEmail } from '../../services/emailService'
import { Match } from '../../services/matchingService'
import {
  getAllSupportTickets,
  updateSupportTicketStatus,
  updateSupportTicketPriority,
  type SupportTicket
} from '../../services/supportTicketService'

export function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [brands, setBrands] = useState<any[]>([])
  const [organizers, setOrganizers] = useState<any[]>([])
  const [matches, setMatches] = useState<Match[]>([])
  const [tickets, setTickets] = useState<SupportTicket[]>([])
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
      // Load all data from localStorage and Supabase
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
  const sortData = (data: any[]) => {
    if (!sortField) return data
    return [...data].sort((a, b) => {
      let aValue = a[sortField]
      let bValue = b[sortField]
      // Handle nested fields (e.g., "user.name")
      if (sortField.includes('.')) {
        const parts = sortField.split('.')
        aValue = parts.reduce((obj, key) => obj?.[key], a)
        bValue = parts.reduce((obj, key) => obj?.[key], b)
      }
      // Handle dates
      if (aValue instanceof Date && bValue instanceof Date) {
        return sortDirection === 'asc'
          ? aValue.getTime() - bValue.getTime()
          : bValue.getTime() - aValue.getTime()
      }
      // Handle strings
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }
      // Handle numbers
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
    })
  }
  const filterData = (data: any[]) => {
    if (!searchTerm) return data
    const term = searchTerm.toLowerCase()
    return data.filter((item) => {
      // Search in all string properties
      return Object.values(item).some((value) => {
        if (typeof value === 'string') {
          return value.toLowerCase().includes(term)
        }
        return false
      })
    })
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
    const blob = new Blob([jsonString], {
      type: 'application/json'
    })
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
      // Hide feedback after 5 seconds
      setTimeout(() => {
        setExportFeedback((prev) => ({
          ...prev,
          visible: false
        }))
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
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? (
      <ArrowUpIcon className='h-4 w-4 ml-1' />
    ) : (
      <ArrowDownIcon className='h-4 w-4 ml-1' />
    )
  }
  if (loading) {
    return (
      <DashboardLayout userType='admin'>
        <div className='flex justify-center items-center h-64'>
          <div className='text-gray-500'>Loading...</div>
        </div>
      </DashboardLayout>
    )
  }
  return (
    <DashboardLayout userType='admin'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Admin Dashboard</h1>
        <p className='text-gray-600'>
          Manage users, brands, organizers, and matches on the SponsrAI
          platform.
        </p>
      </div>
      {/* Stats */}
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6'>
        <div
          className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer ${
            activeTab === 'users' ? 'ring-2 ring-indigo-500' : ''
          }`}
          onClick={() => setActiveTab('users')}
        >
          <div className='flex items-center'>
            <div className='bg-indigo-100 rounded-md p-3'>
              <UsersIcon className='h-6 w-6 text-indigo-600' />
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Users</h3>
              <p className='text-2xl font-bold text-gray-900'>{users.length}</p>
            </div>
          </div>
        </div>
        <div
          className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer ${
            activeTab === 'brands' ? 'ring-2 ring-indigo-500' : ''
          }`}
          onClick={() => setActiveTab('brands')}
        >
          <div className='flex items-center'>
            <div className='bg-blue-100 rounded-md p-3'>
              <PackageIcon className='h-6 w-6 text-blue-600' />
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Brands</h3>
              <p className='text-2xl font-bold text-gray-900'>
                {brands.length}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer ${
            activeTab === 'organizers' ? 'ring-2 ring-indigo-500' : ''
          }`}
          onClick={() => setActiveTab('organizers')}
        >
          <div className='flex items-center'>
            <div className='bg-green-100 rounded-md p-3'>
              <CalendarIcon className='h-6 w-6 text-green-600' />
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Organizers
              </h3>
              <p className='text-2xl font-bold text-gray-900'>
                {organizers.length}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer ${
            activeTab === 'matches' ? 'ring-2 ring-indigo-500' : ''
          }`}
          onClick={() => setActiveTab('matches')}
        >
          <div className='flex items-center'>
            <div className='bg-purple-100 rounded-md p-3'>
              <HandshakeIcon className='h-6 w-6 text-purple-600' />
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Matches</h3>
              <p className='text-2xl font-bold text-gray-900'>
                {matches.length}
              </p>
            </div>
          </div>
        </div>
        <div
          className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer ${
            activeTab === 'tickets' ? 'ring-2 ring-indigo-500' : ''
          }`}
          onClick={() => setActiveTab('tickets')}
        >
          <div className='flex items-center'>
            <div className='bg-orange-100 rounded-md p-3'>
              <LifeBuoyIcon className='h-6 w-6 text-orange-600' />
            </div>
            <div className='ml-4'>
              <h3 className='text-lg font-semibold text-gray-900'>Support Tickets</h3>
              <p className='text-2xl font-bold text-gray-900'>
                {tickets.length}
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Search, Export and Email */}
      <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <div className='relative w-full md:w-64 mb-4 md:mb-0'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <SearchIcon className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Search...'
              className='pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className='flex space-x-2'>
            <Button
              variant='outline'
              className='flex items-center'
              onClick={() => exportData(activeTab)}
            >
              <DownloadIcon className='h-4 w-4 mr-2' />
              Download {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </Button>
            <Button
              variant='primary'
              className='flex items-center'
              onClick={() => emailData(activeTab)}
              disabled={isExporting}
            >
              {isExporting ? (
                <span className='inline-block w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
              ) : (
                <MailIcon className='h-4 w-4 mr-2' />
              )}
              Email to preslavnikolov@outlook.com
            </Button>
          </div>
        </div>
        {/* Feedback message */}
        {exportFeedback.visible && (
          <div
            className={`mt-4 p-3 rounded-md ${
              exportFeedback.type === 'success'
                ? 'bg-green-100 text-green-800'
                : exportFeedback.type === 'error'
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {exportFeedback.message}
          </div>
        )}
      </div>
      {/* Data Tables */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        {activeTab === 'users' && (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('id')}
                  >
                    <div className='flex items-center'>
                      ID {renderSortIcon('id')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('name')}
                  >
                    <div className='flex items-center'>
                      Name {renderSortIcon('name')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('email')}
                  >
                    <div className='flex items-center'>
                      Email {renderSortIcon('email')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('type')}
                  >
                    <div className='flex items-center'>
                      Type {renderSortIcon('type')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className='flex items-center'>
                      Created At {renderSortIcon('createdAt')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filterData(sortData(users)).map((user) => (
                  <tr key={user.id}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {user.id}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {user.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {user.email}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          user.type === 'brand'
                            ? 'bg-blue-100 text-blue-800'
                            : user.type === 'organizer'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {user.type.charAt(0).toUpperCase() + user.type.slice(1)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {filterData(sortData(users)).length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className='px-6 py-4 text-center text-sm text-gray-500'
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'brands' && (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('companyName')}
                  >
                    <div className='flex items-center'>
                      Company {renderSortIcon('companyName')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('contactName')}
                  >
                    <div className='flex items-center'>
                      Contact {renderSortIcon('contactName')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('industry')}
                  >
                    <div className='flex items-center'>
                      Industry {renderSortIcon('industry')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('productName')}
                  >
                    <div className='flex items-center'>
                      Product {renderSortIcon('productName')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('budget')}
                  >
                    <div className='flex items-center'>
                      Budget {renderSortIcon('budget')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className='flex items-center'>
                      Created At {renderSortIcon('createdAt')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filterData(sortData(brands)).map((brand) => (
                  <tr key={brand.id}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {brand.companyName}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {brand.contactName}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {brand.industry === 'food_beverage'
                        ? 'Food & Beverage'
                        : brand.industry === 'beauty_cosmetics'
                        ? 'Beauty & Cosmetics'
                        : brand.industry === 'health_wellness'
                        ? 'Health & Wellness'
                        : brand.industry === 'tech'
                        ? 'Technology'
                        : brand.industry === 'fashion'
                        ? 'Fashion'
                        : brand.industry === 'home_goods'
                        ? 'Home Goods'
                        : brand.industry === 'sports_fitness'
                        ? 'Sports & Fitness'
                        : brand.industry === 'entertainment'
                        ? 'Entertainment'
                        : 'Other'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {brand.productName}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {brand.budget === 'under_10000'
                        ? 'Under 10,000 kr'
                        : brand.budget === '10000_50000'
                        ? '10,000 - 50,000 kr'
                        : brand.budget === '50000_100000'
                        ? '50,000 - 100,000 kr'
                        : brand.budget === '100000_250000'
                        ? '100,000 - 250,000 kr'
                        : brand.budget === '250000_plus'
                        ? '250,000+ kr'
                        : 'Not specified'}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {new Date(brand.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {filterData(sortData(brands)).length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-6 py-4 text-center text-sm text-gray-500'
                    >
                      No brands found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'organizers' && (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('organizerName')}
                  >
                    <div className='flex items-center'>
                      Organizer {renderSortIcon('organizerName')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('eventName')}
                  >
                    <div className='flex items-center'>
                      Event {renderSortIcon('eventName')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('eventType')}
                  >
                    <div className='flex items-center'>
                      Type {renderSortIcon('eventType')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('eventDate')}
                  >
                    <div className='flex items-center'>
                      Date {renderSortIcon('eventDate')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('location')}
                  >
                    <div className='flex items-center'>
                      Location {renderSortIcon('location')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('attendeeCount')}
                  >
                    <div className='flex items-center'>
                      Attendees {renderSortIcon('attendeeCount')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filterData(sortData(organizers)).map((organizer) => (
                  <tr key={organizer.id}>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {organizer.organizerName}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {organizer.eventName}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {organizer.eventType.charAt(0).toUpperCase() +
                        organizer.eventType.slice(1)}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {new Date(organizer.eventDate).toLocaleDateString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {organizer.location}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {organizer.attendeeCount === 'under_100'
                        ? 'Under 100'
                        : organizer.attendeeCount === '100_500'
                        ? '100 - 500'
                        : organizer.attendeeCount === '500_1000'
                        ? '500 - 1,000'
                        : organizer.attendeeCount === '1000_5000'
                        ? '1,000 - 5,000'
                        : organizer.attendeeCount === '5000_plus'
                        ? '5,000+'
                        : 'Not specified'}
                    </td>
                  </tr>
                ))}
                {filterData(sortData(organizers)).length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-6 py-4 text-center text-sm text-gray-500'
                    >
                      No organizers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'matches' && (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('id')}
                  >
                    <div className='flex items-center'>
                      ID {renderSortIcon('id')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('score')}
                  >
                    <div className='flex items-center'>
                      Score {renderSortIcon('score')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('brandId')}
                  >
                    <div className='flex items-center'>
                      Brand {renderSortIcon('brandId')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('organizerId')}
                  >
                    <div className='flex items-center'>
                      Organizer {renderSortIcon('organizerId')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('status')}
                  >
                    <div className='flex items-center'>
                      Status {renderSortIcon('status')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('createdAt')}
                  >
                    <div className='flex items-center'>
                      Created At {renderSortIcon('createdAt')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filterData(sortData(matches)).map((match) => {
                  const brand = brands.find((b) => b.id === match.brandId)
                  const organizer = organizers.find(
                    (o) => o.id === match.organizerId
                  )
                  return (
                    <tr key={match.id}>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {match.id}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div
                            className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              match.score >= 80
                                ? 'bg-green-100 text-green-800'
                                : match.score >= 60
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {match.score}%
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {brand ? brand.companyName : 'Unknown Brand'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                        {organizer ? organizer.eventName : 'Unknown Event'}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            match.status === 'accepted'
                              ? 'bg-green-100 text-green-800'
                              : match.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {match.status.charAt(0).toUpperCase() +
                            match.status.slice(1)}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                        {new Date(match.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  )
                })}
                {filterData(sortData(matches)).length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className='px-6 py-4 text-center text-sm text-gray-500'
                    >
                      No matches found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        {activeTab === 'tickets' && (
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('created_at')}
                  >
                    <div className='flex items-center'>
                      Created {renderSortIcon('created_at')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('name')}
                  >
                    <div className='flex items-center'>
                      Name {renderSortIcon('name')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('email')}
                  >
                    <div className='flex items-center'>
                      Email {renderSortIcon('email')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('category')}
                  >
                    <div className='flex items-center'>
                      Category {renderSortIcon('category')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('status')}
                  >
                    <div className='flex items-center'>
                      Status {renderSortIcon('status')}
                    </div>
                  </th>
                  <th
                    className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                    onClick={() => handleSort('priority')}
                  >
                    <div className='flex items-center'>
                      Priority {renderSortIcon('priority')}
                    </div>
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Message
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filterData(sortData(tickets)).map((ticket) => (
                  <tr key={ticket.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {new Date(ticket.created_at).toLocaleString()}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                      {ticket.name}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {ticket.email}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <span className='px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800'>
                        {ticket.category}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.status === 'open'
                            ? 'bg-yellow-100 text-yellow-800'
                            : ticket.status === 'in_progress'
                            ? 'bg-blue-100 text-blue-800'
                            : ticket.status === 'resolved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {ticket.status === 'in_progress'
                          ? 'In Progress'
                          : ticket.status.charAt(0).toUpperCase() +
                            ticket.status.slice(1)}
                      </span>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <span
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          ticket.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : ticket.priority === 'medium'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {ticket.priority.charAt(0).toUpperCase() +
                          ticket.priority.slice(1)}
                      </span>
                    </td>
                    <td className='px-6 py-4 text-sm text-gray-500 max-w-xs truncate'>
                      {ticket.message}
                    </td>
                  </tr>
                ))}
                {filterData(sortData(tickets)).length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className='px-6 py-4 text-center text-sm text-gray-500'
                    >
                      No support tickets found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
