import React, { useState } from 'react';
import { CommunityQueryParams } from '../../types/community';
import { SearchIcon, FilterIcon, XIcon } from 'lucide-react';
interface DirectoryFiltersProps {
  onFilterChange: (filters: Partial<CommunityQueryParams>) => void;
  currentFilters: CommunityQueryParams;
  memberType: 'brand' | 'organizer';
}
export function DirectoryFilters({
  onFilterChange,
  currentFilters,
  memberType
}: DirectoryFiltersProps) {
  const [searchTerm, setSearchTerm] = useState(currentFilters.search || '');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      search: searchTerm
    });
  };
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      category: e.target.value || undefined
    });
  };
  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      location: e.target.value || undefined
    });
  };
  const handleEventTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      eventType: e.target.value || undefined
    });
  };
  const handleAudienceSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({
      audienceSize: e.target.value || undefined
    });
  };
  const clearFilters = () => {
    setSearchTerm('');
    onFilterChange({
      search: undefined,
      category: undefined,
      location: undefined,
      eventType: undefined,
      audienceSize: undefined
    });
  };
  const filtersApplied = currentFilters.search || currentFilters.category || currentFilters.location || currentFilters.eventType || currentFilters.audienceSize;
  const toggleMobileFilters = () => {
    setShowMobileFilters(!showMobileFilters);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sticky top-20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button className="md:hidden inline-flex items-center text-gray-500 hover:text-gray-700" onClick={toggleMobileFilters}>
          {showMobileFilters ? <XIcon className="h-5 w-5" /> : <FilterIcon className="h-5 w-5" />}
        </button>
      </div>
      <div className={`md:block ${showMobileFilters ? 'block' : 'hidden'}`}>
        <form onSubmit={handleSearchSubmit} className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input type="text" placeholder="Search..." className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
        </form>
        <div className="space-y-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              {memberType === 'brand' ? 'Industry' : 'Category'}
            </label>
            <select id="category" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" value={currentFilters.category || ''} onChange={handleCategoryChange}>
              <option value="">All Categories</option>
              {memberType === 'brand' ? <>
                  <option value="food_beverage">Food & Beverage</option>
                  <option value="beauty_cosmetics">Beauty & Cosmetics</option>
                  <option value="health_wellness">Health & Wellness</option>
                  <option value="tech">Technology</option>
                  <option value="fashion">Fashion & Apparel</option>
                  <option value="home_goods">Home Goods</option>
                  <option value="sports_fitness">Sports & Fitness</option>
                  <option value="entertainment">Entertainment</option>
                </> : <>
                  <option value="festival">Festival</option>
                  <option value="conference">Conference</option>
                  <option value="expo">Expo</option>
                  <option value="workshop">Workshop</option>
                  <option value="sports">Sports Event</option>
                  <option value="community">Community Event</option>
                  <option value="networking">Networking Event</option>
                  <option value="concert">Concert</option>
                </>}
            </select>
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select id="location" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" value={currentFilters.location || ''} onChange={handleLocationChange}>
              <option value="">All Locations</option>
              <option value="stockholm">Stockholm</option>
              <option value="gothenburg">Gothenburg</option>
              <option value="malmo">Malmö</option>
              <option value="uppsala">Uppsala</option>
              <option value="other">Other</option>
            </select>
          </div>
          {memberType === 'organizer' && <div>
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-1">
                Event Type
              </label>
              <select id="eventType" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" value={currentFilters.eventType || ''} onChange={handleEventTypeChange}>
                <option value="">All Event Types</option>
                <option value="festival">Festival</option>
                <option value="conference">Conference</option>
                <option value="expo">Expo</option>
                <option value="workshop">Workshop</option>
                <option value="sports">Sports Event</option>
                <option value="community">Community Event</option>
                <option value="networking">Networking Event</option>
                <option value="concert">Concert</option>
              </select>
            </div>}
          <div>
            <label htmlFor="audienceSize" className="block text-sm font-medium text-gray-700 mb-1">
              Audience Size
            </label>
            <select id="audienceSize" className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm" value={currentFilters.audienceSize || ''} onChange={handleAudienceSizeChange}>
              <option value="">All Sizes</option>
              <option value="under_100">Under 100</option>
              <option value="100_500">100 - 500</option>
              <option value="500_1000">500 - 1,000</option>
              <option value="1000_5000">1,000 - 5,000</option>
              <option value="5000_plus">5,000+</option>
            </select>
          </div>
          {filtersApplied && <button type="button" onClick={clearFilters} className="text-sm text-indigo-600 hover:text-indigo-800 mt-2">
              Clear all filters
            </button>}
        </div>
      </div>
    </div>;
}