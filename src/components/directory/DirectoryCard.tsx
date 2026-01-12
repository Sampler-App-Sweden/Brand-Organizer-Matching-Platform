import {
  BadgeDollarSign,
  BookmarkIcon,
  Heart,
  MapPinIcon,
  PackageIcon,
  UsersIcon
} from 'lucide-react'
import { MouseEvent, useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

import { useAuth } from '../../context/AuthContext'
import { ProfileOverview } from '../../services/profileService'
import {
  isProfileSaved,
  toggleSavedProfile
} from '../../services/savedProfilesService'
import { Badge, IconButton } from '../ui'

type InterestStatus = 'none' | 'sent' | 'received' | 'mutual'

interface DirectoryCardProps {
  profile: ProfileOverview
  initialSaved?: boolean
  showSaveAction?: boolean
  showInterestAction?: boolean
  interestStatus?: InterestStatus
  onExpressInterest?: (profileId: string) => void
  isExpressingInterest?: boolean
}

export function DirectoryCard({
  profile,
  initialSaved,
  showSaveAction = true,
  showInterestAction = false,
  interestStatus = 'none',
  onExpressInterest,
  isExpressingInterest = false
}: DirectoryCardProps) {
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const userId = currentUser?.id ?? null
  const isBrand = profile.role === 'Brand'
  const sponsorshipTypes = profile.whatTheySeek?.sponsorshipTypes ?? []
  const eventOrAudience = isBrand
    ? profile.whatTheySeek?.audienceTags ?? []
    : profile.whatTheySeek?.eventTypes ?? []

  // Check if this profile belongs to the current user
  const isOwnProfile = currentUser?.id === profile.id
  const [isSaved, setIsSaved] = useState<boolean>(initialSaved ?? false)
  const [isCheckingSaved, setIsCheckingSaved] = useState<boolean>(
    showSaveAction && initialSaved === undefined && Boolean(userId)
  )
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (!showSaveAction) {
      return
    }

    if (!userId) {
      setIsSaved(false)
      setIsCheckingSaved(false)
      return
    }

    if (initialSaved !== undefined) {
      setIsSaved(initialSaved)
      setIsCheckingSaved(false)
      return
    }

    let isMounted = true
    setIsCheckingSaved(true)

    isProfileSaved(userId, profile.id)
      .then((saved) => {
        if (isMounted) {
          setIsSaved(saved)
        }
      })
      .catch((error) => {
        console.error('Failed to load saved state', error)
      })
      .finally(() => {
        if (isMounted) {
          setIsCheckingSaved(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [userId, profile.id, initialSaved, showSaveAction])

  const handleToggleSave = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!showSaveAction) {
      return
    }

    if (!currentUser) {
      navigate('/login', {
        state: { returnUrl: `${location.pathname}${location.search}` }
      })
      return
    }

    try {
      setIsSaving(true)
      const nextState = await toggleSavedProfile(currentUser.id, profile.id)
      setIsSaved(nextState)
    } catch (error) {
      console.error('Failed to toggle saved profile', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleExpressInterest = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    event.stopPropagation()

    if (!showInterestAction || isOwnProfile) {
      return
    }

    if (!currentUser) {
      navigate('/login', {
        state: { returnUrl: `${location.pathname}${location.search}` }
      })
      return
    }

    onExpressInterest?.(profile.id)
  }

  return (
    <Link
      to={`/profiles/${profile.id}`}
      className='group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
    >
      <article className='relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all group-hover:shadow-md group-hover:border-indigo-100'>
        {showSaveAction && (
          <IconButton
            type='button'
            variant='solid'
            size='md'
            colorScheme='gray'
            rounded='full'
            icon={
              isCheckingSaved ? (
                <span className='h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin'></span>
              ) : (
                <BookmarkIcon
                  className={`h-4 w-4 ${
                    isSaved ? 'fill-indigo-500 text-indigo-500' : ''
                  }`}
                />
              )
            }
            onClick={handleToggleSave}
            disabled={isCheckingSaved || isSaving}
            aria-label={isSaved ? 'Unsave profile' : 'Save profile'}
            className={`absolute top-3 right-3 bg-white/90 shadow-sm border ${
              isSaved ? 'text-indigo-500 border-indigo-200' : 'text-gray-500 border-gray-200'
            } hover:text-indigo-600 hover:border-indigo-200`}
          />
        )}
        <div className='p-6 space-y-4'>
          <div className='flex items-start'>
            <div className='relative h-16 w-16 mr-4 flex-shrink-0'>
              {profile.logoURL ? (
                <img
                  src={profile.logoURL}
                  alt={profile.name}
                  className='h-full w-full object-cover rounded-md'
                />
              ) : (
                <div
                  className={`h-full w-full rounded-md flex items-center justify-center text-white font-bold text-2xl ${
                    isBrand ? 'bg-blue-500' : 'bg-emerald-500'
                  }`}
                >
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>
            <div className='flex-grow'>
              <div className='flex items-center justify-between'>
                <h3 className='text-lg font-semibold text-gray-900'>
                  {profile.name}
                </h3>
                <Badge variant={isBrand ? 'brand' : 'organizer'} size='xs' rounded='full'>
                  {profile.role}
                </Badge>
              </div>
              <p className='mt-1 text-sm text-gray-600 line-clamp-2'>
                {profile.description || 'No description provided yet.'}
              </p>
              {profile.city && (
                <div className='mt-1 flex items-center text-xs text-gray-500'>
                  <MapPinIcon className='h-3 w-3 mr-1' />
                  {profile.city}
                </div>
              )}
            </div>
          </div>
          <div className='border-t border-gray-100 pt-4 space-y-3'>
            <div>
              <div className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2'>
                <PackageIcon className='h-4 w-4 text-indigo-500' />
                Sponsorship Types
              </div>
              <div className='flex flex-wrap gap-2'>
                {sponsorshipTypes.length ? (
                  sponsorshipTypes.map((type) => (
                    <Badge key={type} variant='primary' size='sm'>
                      {type}
                    </Badge>
                  ))
                ) : (
                  <span className='text-xs text-gray-400'>
                    No preferences shared.
                  </span>
                )}
              </div>
            </div>
            <div className='flex items-center justify-between text-sm text-gray-700'>
              <div className='flex items-center gap-2'>
                <BadgeDollarSign className='h-4 w-4 text-amber-500' />
                <span className='font-medium'>Budget</span>
              </div>
              <span>
                {profile.whatTheySeek?.budgetRange || 'Not specified'}
              </span>
            </div>
            {eventOrAudience.length > 0 && (
              <div>
                <div className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-2'>
                  <UsersIcon className='h-4 w-4 text-purple-500' />
                  {isBrand ? 'Target Audience' : 'Event Types'}
                </div>
                <div className='flex flex-wrap gap-2'>
                  {eventOrAudience.map((entry) => (
                    <Badge key={entry} variant='secondary' size='sm'>
                      {entry}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {profile.whatTheySeek?.notes && (
              <div>
                <div className='text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1'>
                  Collaboration Notes
                </div>
                <p className='text-sm text-gray-700 line-clamp-3'>
                  {profile.whatTheySeek.notes}
                </p>
              </div>
            )}
          </div>

          {/* Express Interest Action */}
          {showInterestAction && (
            <div className='mt-4 pt-4 border-t border-gray-100'>
              <button
                onClick={handleExpressInterest}
                disabled={isOwnProfile || interestStatus !== 'none' || isExpressingInterest}
                className={`
                  w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md font-medium text-sm transition-colors
                  ${
                    isOwnProfile
                      ? 'bg-gray-50 text-gray-400 border border-gray-200 cursor-not-allowed'
                      : interestStatus === 'mutual'
                      ? 'bg-pink-50 text-pink-700 border border-pink-200 cursor-default'
                      : interestStatus === 'sent'
                      ? 'bg-gray-50 text-gray-500 border border-gray-200 cursor-not-allowed'
                      : interestStatus === 'received'
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 cursor-default'
                      : isExpressingInterest
                      ? 'bg-indigo-400 text-white border border-transparent cursor-not-allowed'
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 border border-transparent'
                  }
                `}
              >
                {isExpressingInterest ? (
                  <>
                    <span className='h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin'></span>
                    Sending...
                  </>
                ) : (
                  <>
                    <Heart
                      className={`h-4 w-4 ${
                        interestStatus === 'mutual' ? 'fill-pink-500 text-pink-500' : ''
                      }`}
                    />
                    {isOwnProfile && 'Your Profile'}
                    {!isOwnProfile && interestStatus === 'mutual' && 'Mutual Interest'}
                    {!isOwnProfile && interestStatus === 'sent' && 'Interest Sent'}
                    {!isOwnProfile && interestStatus === 'received' && 'Interested in You'}
                    {!isOwnProfile && interestStatus === 'none' && 'Express Interest'}
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
