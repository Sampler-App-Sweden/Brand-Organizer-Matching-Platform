import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { getCommunityMembers, toggleFeatureStatus } from '../services/communityService';
import { CommunityMember, CommunityQueryParams } from '../types/community';
import { CommunityCard } from '../components/community/CommunityCard';
import { Button } from '../components/Button';
import { Link } from 'react-router-dom';
import { UsersIcon, SearchIcon, FilterIcon, Sparkles, PackageIcon, CalendarIcon } from 'lucide-react';
export function CommunityPage() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState<CommunityQueryParams>({
    featured: false,
    type: undefined,
    search: undefined
  });
  const [searchTerm, setSearchTerm] = useState('');
  useEffect(() => {
    fetchMembers(1, true);
  }, [filters]);
  const fetchMembers = async (pageNum: number, replace: boolean = false) => {
    try {
      setLoading(true);
      const data = await getCommunityMembers({
        page: pageNum,
        limit: 12,
        ...filters
      });
      if (replace) {
        setMembers(data);
      } else {
        setMembers(prev => [...prev, ...data]);
      }
      setHasMore(data.length === 12);
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch community members:', error);
      setLoading(false);
    }
  };
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({
      ...filters,
      search: searchTerm
    });
    setPage(1);
  };
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMembers(nextPage);
  };
  const handleFilterChange = (key: string, value: any) => {
    setFilters({
      ...filters,
      [key]: value
    });
    setPage(1);
  };
  const handleFeatureToggle = (memberId: string, featured: boolean) => {
    setMembers(prev => prev.map(member => member.id === memberId ? {
      ...member,
      featured
    } : member));
  };
  return <Layout>
      <div className="bg-white min-h-screen">
        <div className="bg-gradient-to-b from-indigo-50 to-white pt-12 pb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-100 rounded-full -mr-32 -mt-32 opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100 rounded-full -ml-24 -mb-24 opacity-30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="flex items-center mb-2">
              <UsersIcon className="h-6 w-6 text-indigo-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">
                Our Community
              </h1>
            </div>
            <p className="text-lg text-gray-600 mb-8">
              Discover the brands and organizers bringing the magic.
            </p>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-4">
              <div className="flex-1 mb-4 md:mb-0">
                <form onSubmit={handleSearch} className="relative">
                  <input type="text" placeholder="Search by name..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <button type="submit" className="absolute inset-y-0 right-0 pr-3 flex items-center text-indigo-600">
                    Search
                  </button>
                </form>
              </div>
              <div className="flex space-x-2">
                <button onClick={() => handleFilterChange('type', filters.type === 'brand' ? undefined : 'brand')} className={`px-3 py-2 rounded-md flex items-center text-sm ${filters.type === 'brand' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <PackageIcon className="h-4 w-4 mr-1" />
                  Brands
                </button>
                <button onClick={() => handleFilterChange('type', filters.type === 'organizer' ? undefined : 'organizer')} className={`px-3 py-2 rounded-md flex items-center text-sm ${filters.type === 'organizer' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  Organizers
                </button>
                {(filters.type || filters.featured || filters.search) && <button onClick={() => {
                setFilters({
                  featured: false,
                  type: undefined,
                  search: undefined
                });
                setSearchTerm('');
              }} className="px-3 py-2 rounded-md bg-red-100 text-red-700 hover:bg-red-200 text-sm">
                    Clear Filters
                  </button>}
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          {loading && members.length === 0 ? <div className="flex justify-center items-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div> : <>
              {members.length === 0 ? <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                  <FilterIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">
                    No Results Found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Try adjusting your search or filter criteria.
                  </p>
                  <Button variant="outline" onClick={() => {
              setFilters({
                featured: false,
                type: undefined,
                search: undefined
              });
              setSearchTerm('');
            }}>
                    Clear All Filters
                  </Button>
                </div> : <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map(member => <CommunityCard key={member.id} member={member} onFeatureToggle={handleFeatureToggle} />)}
                </div>}
              <div className="mt-12 flex flex-col items-center">
                {hasMore && <Button variant="outline" onClick={loadMore} disabled={loading} className="min-w-[120px]">
                    {loading ? <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-indigo-500 border-t-transparent mr-2"></div>
                        Loading...
                      </> : 'Load More'}
                  </Button>}
                <Link to="/community/register" className="mt-8">
                  <Button variant="primary" className="flex items-center">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Join the Community
                  </Button>
                </Link>
              </div>
            </>}
        </div>
      </div>
    </Layout>;
}