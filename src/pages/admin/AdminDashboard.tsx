import { AdminDashboardActions } from '../../components/admin/AdminDashboardActions'
import { AdminDashboardStats } from '../../components/admin/AdminDashboardStats'
import { BrandsTable } from '../../components/admin/BrandsTable'
import { MatchesTable } from '../../components/admin/MatchesTable'
import { OrganizersTable } from '../../components/admin/OrganizersTable'
import { TicketsTable } from '../../components/admin/TicketsTable'
import { UsersTable } from '../../components/admin/UsersTable'
import { DashboardLayout } from '../../components/layout'
import { useAdminDashboardData } from '../../hooks/useAdminDashboardData'
import { filterData, sortData } from '../../utils/adminDashboardUtils'

export function AdminDashboard() {
  const {
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
    emailData
  } = useAdminDashboardData();

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? '↑' : '↓'
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
      <AdminDashboardStats
        usersCount={users.length}
        brandsCount={brands.length}
        organizersCount={organizers.length}
        matchesCount={matches.length}
        ticketsCount={tickets.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      {/* Search, Export and Email */}
      <AdminDashboardActions
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        exportData={exportData}
        emailData={emailData}
        isExporting={isExporting}
        exportFeedback={exportFeedback}
      />
      {/* Data Tables */}
      <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
        {activeTab === 'users' && (
          <UsersTable
            users={sortData(
              filterData(users, searchTerm),
              sortField,
              sortDirection
            )}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
          />
        )}
        {activeTab === 'brands' && (
          <BrandsTable
            brands={sortData(
              filterData(brands, searchTerm),
              sortField,
              sortDirection
            )}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
          />
        )}
        {activeTab === 'organizers' && (
          <OrganizersTable
            organizers={sortData(
              filterData(organizers, searchTerm),
              sortField,
              sortDirection
            )}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
          />
        )}
        {activeTab === 'matches' && (
          <MatchesTable
            matches={sortData(
              filterData(matches, searchTerm),
              sortField,
              sortDirection
            )}
            brands={brands}
            organizers={organizers}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
          />
        )}
        {activeTab === 'tickets' && (
          <TicketsTable
            tickets={sortData(
              filterData(tickets, searchTerm),
              sortField,
              sortDirection
            )}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
          />
        )}
      </div>
    </DashboardLayout>
  )
}
