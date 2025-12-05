import {
  BadgeDollarSign,
  BookmarkIcon,
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

interface DirectoryCardProps {
  profile: ProfileOverview
  initialSaved?: boolean
  showSaveAction?: boolean
}

export function DirectoryCard({
  profile,
  initialSaved,
  showSaveAction = true
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

  return (
    <Link
      to={`/profiles/${profile.id}`}
      className='group block rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white'
    >
      <article className='relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 transition-all group-hover:shadow-md group-hover:border-indigo-100'>
        {showSaveAction && (
          <button
            type='button'
            onClick={handleToggleSave}
            disabled={isCheckingSaved || isSaving}
            aria-pressed={isSaved}
            className='absolute top-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gray-500 shadow-sm border border-gray-200 hover:text-indigo-600 hover:border-indigo-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500'
            title={isSaved ? 'Unsave profile' : 'Save profile'}
          >
            {isCheckingSaved ? (
              <span className='h-4 w-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin'></span>
            ) : (
              <BookmarkIcon
                className={`h-4 w-4 ${
                  isSaved ? 'fill-indigo-500 text-indigo-500' : 'text-gray-500'
                }`}
              />
            )}
            <span className='sr-only'>
              {isSaved ? 'Unsave profile' : 'Save profile'}
            </span>
          </button>
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
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    isBrand
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                  }`}
                >
                  {profile.role}
                </span>
              </div>
              <p className='mt-1 text-sm text-gray-600 line-clamp-2'>
                {profile.description || 'No description provided yet.'}
              </p>
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
                    <span
                      key={type}
                      className='inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700'
                    >
                      {type}
                    </span>
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
                    <span
                      key={entry}
                      className='inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700'
                    >
                      {entry}
                    </span>
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
        </div>
      </article>
    </Link>
  )
}
