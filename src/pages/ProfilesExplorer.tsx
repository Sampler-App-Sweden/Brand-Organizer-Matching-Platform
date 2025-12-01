import { FilterIcon, PackageIcon, SearchIcon, UsersIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Layout } from '../components/layout'
import { getProfiles } from '../services/profileService'

interface Profile {
  id: string
  role: 'Brand' | 'Organizer'
  name: string
  logoURL?: string
  description: string
  whatTheySeek: {
    sponsorshipTypes: string[]
    budgetRange: string
    quantity?: number
    eventTypes?: string[]
    audienceTags?: string[]
    notes?: string
  }
  created_at: string
}
export function ProfilesExplorer() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [filteredProfiles, setFilteredProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'Brand' | 'Organizer'>(
    'all'
  )
  const [sponsorshipFilter, setSponsorshipFilter] = useState<string | null>(
    null
  )
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setLoading(true)
        const data = await getProfiles()
        setProfiles(data)
        setFilteredProfiles(data)
      } catch (error) {
        console.error('Error loading profiles:', error)
      } finally {
        setLoading(false)
      }
    }
    loadProfiles()
  }, [])
  useEffect(() => {
    // Apply filters
    let result = [...profiles]
    // Apply role filter
    if (roleFilter !== 'all') {
      result = result.filter((profile) => profile.role === roleFilter)
    }
    // Apply sponsorship filter
    if (sponsorshipFilter) {
      result = result.filter((profile) =>
        profile.whatTheySeek?.sponsorshipTypes?.includes(sponsorshipFilter)
      )
    }
    // Apply search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (profile) =>
          profile.name.toLowerCase().includes(term) ||
          profile.description.toLowerCase().includes(term) ||
          profile.whatTheySeek?.notes?.toLowerCase().includes(term) ||
          profile.whatTheySeek?.audienceTags?.some((tag) =>
            tag.toLowerCase().includes(term)
          ) ||
          profile.whatTheySeek?.eventTypes?.some((type) =>
            type.toLowerCase().includes(term)
          )
      )
    }
    setFilteredProfiles(result)
  }, [profiles, roleFilter, sponsorshipFilter, searchTerm])

  // Handlers
  const handleRoleFilterChange = (role: 'all' | 'Brand' | 'Organizer') => {
    setRoleFilter(role)
  }

  const handleSponsorshipFilterChange = (type: string | null) => {
    setSponsorshipFilter(type)
  }

  return (
    <Layout>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>
            Profiles Explorer
          </h1>
          <p className='mt-2 text-gray-600'>
            Explore all users on the platform and see what they're looking for
          </p>
        </div>
        {/* Filters */}
        <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
          <div className='flex flex-col md:flex-row md:items-center gap-4'>
            {/* Search */}
            <div className='relative flex-1'>
              <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                <SearchIcon className='h-5 w-5 text-gray-400' />
              </div>
              <input
                type='text'
                placeholder='Search profiles...'
                className='block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {/* Role filter */}
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-500'>Role:</span>
              <div className='flex rounded-md shadow-sm'>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    roleFilter === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                  onClick={() => handleRoleFilterChange('all')}
                >
                  All
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${
                    roleFilter === 'Brand'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-t border-b border-gray-300'
                  }`}
                  onClick={() => handleRoleFilterChange('Brand')}
                >
                  Brands
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    roleFilter === 'Organizer'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                  }`}
                  onClick={() => handleRoleFilterChange('Organizer')}
                >
                  Organizers
                </button>
              </div>
            </div>
            {/* Sponsorship filter */}
            <div className='flex items-center space-x-2'>
              <span className='text-sm text-gray-500'>Sponsorship:</span>
              <select
                className='block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
                value={sponsorshipFilter || ''}
                onChange={(e) =>
                  handleSponsorshipFilterChange(e.target.value || null)
                }
              >
                <option value=''>Any type</option>
                <option value='Product'>Product</option>
                <option value='Financial'>Financial</option>
                <option value='Discount'>Discount</option>
              </select>
            </div>
          </div>
        </div>
        {/* Results */}
        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500'></div>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
            <div className='inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4'>
              <FilterIcon className='h-8 w-8 text-indigo-600' />
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              No matching profiles found
            </h3>
            <p className='text-gray-600 max-w-md mx-auto'>
              Try adjusting your filters or search terms to find what you're
              looking for.
            </p>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {filteredProfiles.map((profile) => (
              <div
                key={profile.id}
                className='bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200'
              >
                <div className='p-5'>
                  {/* Header with logo and role */}
                  <div className='flex justify-between items-start mb-4'>
                    <div className='flex items-center'>
                      <div className='h-12 w-12 rounded-full overflow-hidden mr-3 bg-gray-200'>
                        {profile.logoURL ? (
                          <img
                            src={profile.logoURL}
                            alt={profile.name}
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <div className='h-full w-full flex items-center justify-center bg-indigo-100 text-indigo-800 font-bold'>
                            {profile.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className='font-medium text-gray-900'>
                          {profile.name}
                        </h3>
                        <div className='flex items-center'>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              profile.role === 'Brand'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {profile.role === 'Brand' ? (
                              <PackageIcon className='h-3 w-3 mr-1' />
                            ) : (
                              <UsersIcon className='h-3 w-3 mr-1' />
                            )}
                            {profile.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Description */}
                  <p className='text-sm text-gray-600 mb-4 line-clamp-2'>
                    {profile.description}
                  </p>
                  {/* What they seek */}
                  <div>
                    <h4 className='text-xs font-medium text-gray-500 uppercase tracking-wider mb-2'>
                      What They Seek
                    </h4>
                    {/* Sponsorship types */}
                    <div className='mb-3'>
                      <span className='text-xs text-gray-500 block mb-1'>
                        Sponsorship Types:
                      </span>
                      <div className='flex flex-wrap gap-1'>
                        {profile.whatTheySeek.sponsorshipTypes?.map((type) => (
                          <span
                            key={type}
                            className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800'
                          >
                            {type}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* Budget range */}
                    <div className='mb-3'>
                      <span className='text-xs text-gray-500 block mb-1'>
                        Budget Range:
                      </span>
                      <span className='text-sm text-gray-900'>
                        {profile.whatTheySeek.budgetRange}
                      </span>
                    </div>
                    {/* Tags */}
                    {(profile.whatTheySeek.audienceTags?.length ||
                      profile.whatTheySeek.eventTypes?.length) && (
                      <div className='mb-3'>
                        <span className='text-xs text-gray-500 block mb-1'>
                          {profile.role === 'Brand'
                            ? 'Target Audience:'
                            : 'Event Types:'}
                        </span>
                        <div className='flex flex-wrap gap-1'>
                          {(profile.role === 'Brand'
                            ? profile.whatTheySeek.audienceTags
                            : profile.whatTheySeek.eventTypes
                          )?.map((tag) => (
                            <span
                              key={tag}
                              className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800'
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Notes */}
                    {profile.whatTheySeek.notes && (
                      <div>
                        <span className='text-xs text-gray-500 block mb-1'>
                          Notes:
                        </span>
                        <p className='text-sm text-gray-900 line-clamp-2'>
                          {profile.whatTheySeek.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
