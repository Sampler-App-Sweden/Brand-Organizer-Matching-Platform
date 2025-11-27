import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '../../components/DashboardLayout';
import { useAuth } from '../../context/AuthContext';
import { getSavedMembers } from '../../services/communityService';
import { CommunityMember } from '../../types/community';
import { DirectoryCard } from '../../components/directory/DirectoryCard';
import { BookmarkIcon, StarIcon } from 'lucide-react';
export function SavedItemsPage() {
  const {
    currentUser
  } = useAuth();
  const [savedMembers, setSavedMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'brands' | 'organizers'>('all');
  useEffect(() => {
    const fetchSavedMembers = async () => {
      if (!currentUser) return;
      setLoading(true);
      try {
        const members = await getSavedMembers(currentUser.id);
        setSavedMembers(members);
      } catch (error) {
        console.error('Failed to fetch saved members:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSavedMembers();
  }, [currentUser]);
  const filteredMembers = activeTab === 'all' ? savedMembers : savedMembers.filter(member => member.type === (activeTab === 'brands' ? 'brand' : 'organizer'));
  const userType = currentUser?.type as 'brand' | 'organizer';
  return <DashboardLayout userType={userType}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Saved Items</h1>
        <p className="text-gray-600">
          View and manage your saved brands, organizers, and inspiration.
        </p>
      </div>
      {/* Tab Navigation */}
      <div className="mb-6 border-b border-gray-200">
        <nav className="flex -mb-px space-x-8">
          <button onClick={() => setActiveTab('all')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'all' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            All Saved
          </button>
          <button onClick={() => setActiveTab('brands')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'brands' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Brands
          </button>
          <button onClick={() => setActiveTab('organizers')} className={`py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'organizers' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
            Organizers
          </button>
        </nav>
      </div>
      {loading ? <div className="flex justify-center items-center h-64">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
        </div> : filteredMembers.length === 0 ? <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <StarIcon className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">
            No saved items
          </h3>
          <p className="text-gray-600 mb-6">
            You haven't saved any{' '}
            {activeTab === 'brands' ? 'brands' : activeTab === 'organizers' ? 'organizers' : 'items'}{' '}
            yet. Browse the community to find and save{' '}
            {activeTab === 'brands' ? 'brands' : activeTab === 'organizers' ? 'organizers' : 'items'}{' '}
            you're interested in.
          </p>
        </div> : <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => <DirectoryCard key={member.id} member={member} />)}
        </div>}
    </DashboardLayout>;
}