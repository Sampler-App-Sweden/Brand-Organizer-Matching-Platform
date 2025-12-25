import { Dispatch, SetStateAction } from 'react'
import { AdminStatsCard } from './AdminStatsCard'

type TabType = 'users' | 'brands' | 'organizers' | 'tickets' | 'connections'

interface AdminDashboardStatsProps {
  usersCount: number
  brandsCount: number
  organizersCount: number
  ticketsCount: number
  connectionsCount: number
  activeTab: TabType
  setActiveTab: Dispatch<SetStateAction<TabType>>
}

export const AdminDashboardStats: React.FC<AdminDashboardStatsProps> = ({
  usersCount,
  brandsCount,
  organizersCount,
  ticketsCount,
  connectionsCount,
  activeTab,
  setActiveTab
}) => (
  <div className='mb-6'>
    <h2 className='text-sm font-medium text-gray-700 mb-4'>Platform Overview</h2>
    <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4'>
      <AdminStatsCard
        label='Users'
        value={usersCount}
        isActive={activeTab === 'users'}
        onClick={() => setActiveTab('users')}
        sublabel='Click to view'
      />
      <AdminStatsCard
        label='Brands'
        value={brandsCount}
        isActive={activeTab === 'brands'}
        onClick={() => setActiveTab('brands')}
        sublabel='Click to view'
      />
      <AdminStatsCard
        label='Organizers'
        value={organizersCount}
        isActive={activeTab === 'organizers'}
        onClick={() => setActiveTab('organizers')}
        sublabel='Click to view'
      />
      <AdminStatsCard
        label='Support Tickets'
        value={ticketsCount}
        isActive={activeTab === 'tickets'}
        onClick={() => setActiveTab('tickets')}
        sublabel='Click to view'
      />
      <AdminStatsCard
        label='Connections'
        value={connectionsCount}
        isActive={activeTab === 'connections'}
        onClick={() => setActiveTab('connections')}
        sublabel='Click to view'
      />
    </div>
  </div>
)
