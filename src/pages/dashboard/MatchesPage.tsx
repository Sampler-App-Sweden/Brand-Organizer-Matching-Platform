import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout'
import { useAuth } from '../../context/AuthContext'
import {
  getBrandByUserId,
  getOrganizerByUserId,
  getBrandById,
  getOrganizerById,
  getMatchesForBrand,
  getMatchesForOrganizer
} from '../../services/dataService'
import { Match } from '../../services/matchingService'
import {
  CheckIcon,
  StarIcon,
  XIcon,
  SearchIcon,
  GridIcon,
  ListIcon,
  HandshakeIcon,
  SparklesIcon,
  ArrowRightIcon
} from 'lucide-react'
import { Button } from '../../components/ui'
type MatchView = 'confirmed' | 'suggested'
type DisplayMode = 'grid' | 'list'
interface EnhancedMatch extends Match {
  brandName: string
  brandLogo?: string
  organizerName: string
  organizerLogo?: string
  eventName: string
  productName: string
  matchCriteria: string[]
}
export function MatchesPage() {
  const { currentUser } = useAuth()
  const [userType, setUserType] = useState<'brand' | 'organizer'>('brand')
  const [matches, setMatches] = useState<EnhancedMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [activeView, setActiveView] = useState<MatchView>('confirmed')
  const [displayMode, setDisplayMode] = useState<DisplayMode>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const [savedSuggestions, setSavedSuggestions] = useState<string[]>([])
  const [dismissedSuggestions, setDismissedSuggestions] = useState<string[]>([])
  useEffect(() => {
    const loadMatches = async () => {
      if (!currentUser) return
      setLoading(true)
      // Determine if the user is a brand or organizer
      const userType = currentUser.type as 'brand' | 'organizer'
      setUserType(userType)
      // Get entity data (brand or organizer)
      let entityId = ''
      if (userType === 'brand') {
        const brandData = await getBrandByUserId(currentUser.id)
        if (brandData) {
          entityId = brandData.id
        }
      } else {
        const organizerData = await getOrganizerByUserId(currentUser.id)
        if (organizerData) {
          entityId = organizerData.id
        }
      }
      if (!entityId) {
        setLoading(false)
        return
      }
      // Get matches
      const rawMatches =
        userType === 'brand'
          ? await getMatchesForBrand(entityId)
          : await getMatchesForOrganizer(entityId)
      // Enhance matches with metadata
      const enhancedMatches = await Promise.all(
        rawMatches.map(async (match) => {
          const brandData = await getBrandById(match.brandId)
          const organizerData = await getOrganizerById(match.organizerId)
          return {
            ...match,
            brandName: brandData?.companyName || 'Unknown Brand',
            brandLogo:
              'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&h=250&q=80',
            organizerName: organizerData?.organizerName || 'Unknown Organizer',
            organizerLogo:
              'https://images.unsplash.com/photo-1561489404-42f5a5c8e0eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=250&h=250&q=80',
            eventName: organizerData?.eventName || 'Unknown Event',
            productName: brandData?.productName || 'Unknown Product',
            matchCriteria: match.matchReasons || [
              'Audience alignment',
              'Budget fit',
              'Industry relevance'
            ]
          }
        })
      )
      setMatches(enhancedMatches)
      setLoading(false)
      // Load saved and dismissed suggestions from localStorage
      const savedItems = JSON.parse(
        localStorage.getItem(`user_${currentUser.id}_savedMatches`) || '[]'
      )
      const dismissedItems = JSON.parse(
        localStorage.getItem(`user_${currentUser.id}_dismissedMatches`) || '[]'
      )
      setSavedSuggestions(savedItems)
      setDismissedSuggestions(dismissedItems)
    }
    loadMatches()
  }, [currentUser])
  const handleSaveSuggestion = (matchId: string) => {
    if (!currentUser) return
    const newSavedItems = [...savedSuggestions, matchId]
    setSavedSuggestions(newSavedItems)
    localStorage.setItem(
      `user_${currentUser.id}_savedMatches`,
      JSON.stringify(newSavedItems)
    )
  }
  const handleDismissSuggestion = (matchId: string) => {
    if (!currentUser) return
    const newDismissedItems = [...dismissedSuggestions, matchId]
    setDismissedSuggestions(newDismissedItems)
    localStorage.setItem(
      `user_${currentUser.id}_dismissedMatches`,
      JSON.stringify(newDismissedItems)
    )
  }
  const filterMatches = () => {
    let filtered = [...matches]
    // Filter by view
    if (activeView === 'confirmed') {
      filtered = filtered.filter((match) => match.status === 'accepted')
    } else {
      filtered = filtered.filter((match) => match.status === 'pending')
      // Remove dismissed suggestions
      filtered = filtered.filter(
        (match) => !dismissedSuggestions.includes(match.id)
      )
    }
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (match) =>
          match.brandName.toLowerCase().includes(term) ||
          match.organizerName.toLowerCase().includes(term) ||
          match.eventName.toLowerCase().includes(term) ||
          match.productName.toLowerCase().includes(term)
      )
    }
    return filtered
  }
  const getScoreColor = (score: number) => {
    if (score >= 85) return 'bg-green-100 text-green-800'
    if (score >= 70) return 'bg-amber-100 text-amber-800'
    return 'bg-gray-100 text-gray-800'
  }
  return (
    <DashboardLayout userType={userType}>
      <div className='flex flex-col'>
        <div className='mb-4'>
          <h1 className='text-2xl font-bold text-gray-900'>Matches</h1>
          <p className='text-gray-600'>
            {activeView === 'confirmed'
              ? 'View and manage your confirmed matches'
              : 'Discover new AI-suggested matches based on your profile'}
          </p>
        </div>
        {/* Filters and controls */}
        <div className='bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div className='flex items-center space-x-4'>
            <div className='flex rounded-md overflow-hidden border border-indigo-200 bg-indigo-50'>
              <button
                className={`px-4 py-2 flex items-center ${
                  activeView === 'confirmed'
                    ? 'bg-indigo-600 text-white'
                    : 'text-indigo-700'
                }`}
                onClick={() => setActiveView('confirmed')}
              >
                <HandshakeIcon className='h-4 w-4 mr-2' />
                Confirmed
              </button>
              <button
                className={`px-4 py-2 flex items-center ${
                  activeView === 'suggested'
                    ? 'bg-indigo-600 text-white'
                    : 'text-indigo-700'
                }`}
                onClick={() => setActiveView('suggested')}
              >
                <SparklesIcon className='h-4 w-4 mr-2' />
                Suggested
              </button>
            </div>
            <div className='flex rounded-md overflow-hidden border border-gray-300'>
              <button
                className={`p-2 ${
                  displayMode === 'grid' ? 'bg-gray-200' : 'bg-white'
                }`}
                onClick={() => setDisplayMode('grid')}
                title='Grid view'
              >
                <GridIcon className='h-5 w-5 text-gray-700' />
              </button>
              <button
                className={`p-2 ${
                  displayMode === 'list' ? 'bg-gray-200' : 'bg-white'
                }`}
                onClick={() => setDisplayMode('list')}
                title='List view'
              >
                <ListIcon className='h-5 w-5 text-gray-700' />
              </button>
            </div>
          </div>
          <div className='relative w-full sm:w-64'>
            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
              <SearchIcon className='h-5 w-5 text-gray-400' />
            </div>
            <input
              type='text'
              placeholder='Search matches...'
              className='pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='text-gray-500'>Loading matches...</div>
          </div>
        ) : filterMatches().length === 0 ? (
          <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
            <div className='inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-100 mb-4'>
              {activeView === 'confirmed' ? (
                <HandshakeIcon className='h-8 w-8 text-indigo-600' />
              ) : (
                <SparklesIcon className='h-8 w-8 text-indigo-600' />
              )}
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {activeView === 'confirmed'
                ? 'No confirmed matches yet'
                : 'No suggested matches available'}
            </h3>
            <p className='text-gray-600 max-w-md mx-auto mb-6'>
              {activeView === 'confirmed'
                ? 'When you and a partner both express interest in a match, it will appear here.'
                : "We'll notify you when we find new potential matches based on your profile."}
            </p>
            {activeView === 'confirmed' && (
              <Button
                variant='primary'
                onClick={() => setActiveView('suggested')}
                className='flex items-center mx-auto'
              >
                <SparklesIcon className='h-4 w-4 mr-2' />
                View Suggestions
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Matches grid/list */}
            <div
              className={
                displayMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }
            >
              {filterMatches().map((match) => (
                <div
                  key={match.id}
                  className={`bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 transition-all hover:shadow-md ${
                    activeView === 'suggested' &&
                    savedSuggestions.includes(match.id)
                      ? 'ring-2 ring-indigo-500'
                      : ''
                  }`}
                >
                  {/* Match card content */}
                  <div className='p-5'>
                    {/* Header with logos and match score */}
                    <div className='flex justify-between items-start mb-4'>
                      <div className='flex items-center'>
                        {/* Brand logo */}
                        <div className='h-12 w-12 rounded-full overflow-hidden mr-2 bg-gray-200'>
                          {match.brandLogo ? (
                            <img
                              src={match.brandLogo}
                              alt={match.brandName}
                              className='h-full w-full object-cover'
                            />
                          ) : (
                            <div className='h-full w-full flex items-center justify-center bg-blue-100 text-blue-800 font-bold'>
                              {match.brandName.charAt(0)}
                            </div>
                          )}
                        </div>
                        {/* Connection icon */}
                        <div className='flex flex-col items-center mx-1'>
                          <div className='w-5 h-0.5 bg-gray-300'></div>
                          <div className='my-1 text-gray-400'>×</div>
                          <div className='w-5 h-0.5 bg-gray-300'></div>
                        </div>
                        {/* Organizer logo */}
                        <div className='h-12 w-12 rounded-full overflow-hidden ml-2 bg-gray-200'>
                          {match.organizerLogo ? (
                            <img
                              src={match.organizerLogo}
                              alt={match.organizerName}
                              className='h-full w-full object-cover'
                            />
                          ) : (
                            <div className='h-full w-full flex items-center justify-center bg-green-100 text-green-800 font-bold'>
                              {match.organizerName.charAt(0)}
                            </div>
                          )}
                        </div>
                      </div>
                      {activeView === 'suggested' && (
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                            match.score
                          )}`}
                        >
                          {match.score}% Match
                        </div>
                      )}
                    </div>
                    {/* Names */}
                    <div className='flex justify-between items-start mb-4'>
                      <div className='w-1/2 pr-2'>
                        <h3 className='font-medium text-gray-900 text-sm'>
                          {match.brandName}
                        </h3>
                        <p className='text-xs text-gray-600 truncate'>
                          {match.productName}
                        </p>
                      </div>
                      <div className='w-1/2 pl-2'>
                        <h3 className='font-medium text-gray-900 text-sm'>
                          {match.organizerName}
                        </h3>
                        <p className='text-xs text-gray-600 truncate'>
                          {match.eventName}
                        </p>
                      </div>
                    </div>
                    {/* Match criteria (for suggested matches) */}
                    {activeView === 'suggested' && (
                      <div className='mb-4'>
                        <h4 className='text-xs font-medium text-gray-500 mb-2'>
                          Why you match:
                        </h4>
                        <ul className='space-y-1'>
                          {match.matchCriteria
                            .slice(0, 3)
                            .map((criterion, index) => (
                              <li
                                key={index}
                                className='flex items-center text-sm text-gray-700'
                              >
                                <CheckIcon className='h-4 w-4 text-green-500 mr-2 flex-shrink-0' />
                                <span className='truncate'>{criterion}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                    {/* Actions */}
                    <div className='flex justify-between items-center mt-4'>
                      {activeView === 'confirmed' ? (
                        <>
                          <div>
                            <span className='text-xs text-gray-500'>
                              Matched on{' '}
                              {new Date(match.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <Link
                            to={`/dashboard/${userType}/matches/${match.id}`}
                            className='inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                          >
                            View Details
                            <ArrowRightIcon className='ml-1 h-3 w-3' />
                          </Link>
                        </>
                      ) : (
                        <div className='flex space-x-2 w-full'>
                          {savedSuggestions.includes(match.id) ? (
                            <Button
                              variant='primary'
                              className='flex-1'
                              onClick={() => {
                                // In a real app, this would open a conversation
                                // For now, we'll just remove from saved
                                const newSavedItems = savedSuggestions.filter(
                                  (id) => id !== match.id
                                )
                                setSavedSuggestions(newSavedItems)
                                localStorage.setItem(
                                  `user_${currentUser?.id}_savedMatches`,
                                  JSON.stringify(newSavedItems)
                                )
                              }}
                            >
                              Express Interest
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant='outline'
                                className='flex items-center flex-1'
                                onClick={() => handleSaveSuggestion(match.id)}
                              >
                                <StarIcon className='h-4 w-4 mr-1' />
                                Save
                              </Button>
                              <Button
                                variant='primary'
                                className='flex-1'
                                onClick={() => {
                                  // In a real app, this would open a conversation
                                  handleSaveSuggestion(match.id)
                                }}
                              >
                                Express Interest
                              </Button>
                              <button
                                className='p-2 text-gray-400 hover:text-gray-600'
                                onClick={() =>
                                  handleDismissSuggestion(match.id)
                                }
                                title='Dismiss'
                              >
                                <XIcon className='h-5 w-5' />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
