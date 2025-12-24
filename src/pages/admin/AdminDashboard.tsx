import {
  AdminDashboardActions,
  AdminDashboardStats,
  BrandsTable,
  MatchesTable,
  OrganizersTable,
  TicketsTable,
  UsersTable,
  ConnectionsTable
} from '../../components/admin'
import { DashboardLayout } from '../../components/layout'
import { LoadingSpinner } from '../../components/ui'
import { useAdminDashboardData } from '../../hooks/useAdminDashboardData'
import { filterData, sortData } from '../../utils/adminDashboardUtils'

export function AdminDashboard() {
  const {
    users,
    brands,
    organizers,
    matches,
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
    emailData
  } = useAdminDashboardData()

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === 'asc' ? '↑' : '↓'
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
        connectionsCount={connections.length}
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
            ).map((brand) => ({
              ...brand,
              createdAt:
                typeof brand.createdAt === 'string'
                  ? brand.createdAt
                  : brand.createdAt.toISOString()
            }))}
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
            ).map((match) => ({
              ...match,
              createdAt:
                typeof match.createdAt === 'string'
                  ? match.createdAt
                  : match.createdAt.toISOString()
            }))}
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
        {activeTab === 'connections' && (
          <ConnectionsTable
            connections={sortData(
              filterData(connections, searchTerm),
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
