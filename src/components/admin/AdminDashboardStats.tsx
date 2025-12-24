
type TabType = 'users' | 'brands' | 'organizers' | 'matches' | 'tickets' | 'connections';

import { Dispatch, SetStateAction } from 'react';

interface AdminDashboardStatsProps {
  usersCount: number;
  brandsCount: number;
  organizersCount: number;
  matchesCount: number;
  ticketsCount: number;
  connectionsCount: number;
  activeTab: TabType;
  setActiveTab: Dispatch<SetStateAction<TabType>>;
}

export const AdminDashboardStats: React.FC<AdminDashboardStatsProps> = ({
  usersCount,
  brandsCount,
  organizersCount,
  matchesCount,
  ticketsCount,
  connectionsCount,
  activeTab,
  setActiveTab
}) => (
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-6'>
    <div
      className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer ${
        activeTab === 'users' ? 'ring-2 ring-indigo-500' : ''
      }`}
      onClick={() => setActiveTab('users')}
    >
      <div className='flex items-center'>
        <div className='bg-indigo-100 rounded-md p-3'>👤</div>
        <div className='ml-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Users</h3>
          <p className='text-2xl font-bold text-gray-900'>{usersCount}</p>
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
        <div className='bg-blue-100 rounded-md p-3'>📦</div>
        <div className='ml-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Brands</h3>
          <p className='text-2xl font-bold text-gray-900'>{brandsCount}</p>
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
        <div className='bg-green-100 rounded-md p-3'>📅</div>
        <div className='ml-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Organizers</h3>
          <p className='text-2xl font-bold text-gray-900'>{organizersCount}</p>
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
        <div className='bg-purple-100 rounded-md p-3'>🤝</div>
        <div className='ml-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Matches</h3>
          <p className='text-2xl font-bold text-gray-900'>{matchesCount}</p>
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
        <div className='bg-orange-100 rounded-md p-3'>🛟</div>
        <div className='ml-4'>
          <h3 className='text-lg font-semibold text-gray-900'>
            Support Tickets
          </h3>
          <p className='text-2xl font-bold text-gray-900'>{ticketsCount}</p>
        </div>
      </div>
    </div>
    <div
      className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer ${
        activeTab === 'connections' ? 'ring-2 ring-indigo-500' : ''
      }`}
      onClick={() => setActiveTab('connections')}
    >
      <div className='flex items-center'>
        <div className='bg-pink-100 rounded-md p-3'>🔗</div>
        <div className='ml-4'>
          <h3 className='text-lg font-semibold text-gray-900'>Connections</h3>
          <p className='text-2xl font-bold text-gray-900'>{connectionsCount}</p>
        </div>
      </div>
    </div>
  </div>
)
