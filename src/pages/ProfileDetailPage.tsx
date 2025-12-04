import {
  ArrowLeftIcon,
  BadgeDollarSign,
  Building2Icon,
  LinkIcon,
  MailIcon,
  SparklesIcon,
  UsersIcon
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { Layout } from '../components/layout'
import { Button } from '../components/ui/Button'
import {
  getProfileOverviewById,
  ProfileOverview
} from '../services/profileService'

export function ProfileDetailPage() {
  const { profileId } = useParams<{ profileId: string }>()
  const navigate = useNavigate()
  const [profile, setProfile] = useState<ProfileOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      if (!profileId) {
        setError('Missing profile id')
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const data = await getProfileOverviewById(profileId)
        if (!data) {
          setError('Profile not found')
          setProfile(null)
        } else {
          setProfile(data)
          setError(null)
        }
      } catch (err) {
        console.error('Failed to load profile', err)
        setError(
          'Unable to load this profile right now. Please try again later.'
        )
      } finally {
        setLoading(false)
      }
    }
    loadProfile()
  }, [profileId])

  const metaTags = useMemo(() => {
    if (!profile) {
      return []
    }
    const sponsorship = profile.whatTheySeek?.sponsorshipTypes ?? []
    const tags =
      profile.role === 'Brand'
        ? profile.whatTheySeek?.audienceTags ?? []
        : profile.whatTheySeek?.eventTypes ?? []
    return [sponsorship, tags].filter((section) => section?.length).flat()
  }, [profile])

  const handleBack = () => {
    if (profile?.role === 'Brand') {
      navigate('/brands')
    } else if (profile?.role === 'Organizer') {
      navigate('/organizers')
    } else {
      navigate(-1)
    }
  }

  return (
    <Layout>
      <div className='max-w-5xl mx-auto px-4 py-10'>
        <div className='flex items-center justify-between mb-6'>
          <Button variant='ghost' onClick={handleBack}>
            <ArrowLeftIcon className='h-4 w-4 mr-2' />
            Back
          </Button>
          <div className='text-sm text-gray-500'>
            Powered by community profile insights
          </div>
        </div>
        {loading ? (
          <div className='flex items-center justify-center h-64'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500'></div>
          </div>
        ) : error ? (
          <div className='bg-white rounded-lg shadow-sm p-10 text-center'>
            <h2 className='text-xl font-semibold text-gray-900 mb-2'>
              Something went wrong
            </h2>
            <p className='text-gray-600 mb-6'>{error}</p>
            <Button onClick={handleBack}>Go Back</Button>
          </div>
        ) : profile ? (
          <div className='space-y-8'>
            <div className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden'>
              <div className='p-6 sm:p-10'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-6'>
                  <div className='flex items-start gap-4'>
                    <div className='h-20 w-20 rounded-xl overflow-hidden bg-indigo-50 flex items-center justify-center text-3xl font-bold text-indigo-600'>
                      {profile.logoURL ? (
                        <img
                          src={profile.logoURL}
                          alt={profile.name}
                          className='h-full w-full object-cover'
                        />
                      ) : (
                        profile.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <div className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wide mb-3 bg-indigo-100 text-indigo-700'>
                        {profile.role}
                      </div>
                      <h1 className='text-3xl font-bold text-gray-900'>
                        {profile.name}
                      </h1>
                      <p className='text-gray-600 mt-3 max-w-2xl'>
                        {profile.description || 'No description provided yet.'}
                      </p>
                    </div>
                  </div>
                  <div className='space-y-3 w-full md:w-auto'>
                    <Button
                      className='w-full md:w-auto'
                      onClick={() =>
                        window.open(`mailto:${profile.email}`, '_blank')
                      }
                    >
                      <MailIcon className='h-4 w-4 mr-2' />
                      Contact {profile.role === 'Brand' ? 'Brand' : 'Organizer'}
                    </Button>
                    <div className='text-sm text-gray-500 flex items-center gap-2 justify-center md:justify-end'>
                      <LinkIcon className='h-4 w-4' />
                      Profile ID: {profile.id}
                    </div>
                  </div>
                </div>
              </div>
              {metaTags.length > 0 && (
                <div className='px-6 py-4 border-t border-gray-100 bg-gray-50'>
                  <div className='flex flex-wrap gap-2'>
                    {metaTags.map((tag) => (
                      <span
                        key={tag}
                        className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white shadow-sm border border-gray-200'
                      >
                        <SparklesIcon className='h-3 w-3 text-indigo-500 mr-1' />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4'>
                <div className='flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide'>
                  <Building2Icon className='h-4 w-4 text-indigo-500' />
                  Overview
                </div>
                <div className='space-y-2 text-sm text-gray-700'>
                  <p>
                    <span className='font-semibold text-gray-900'>Email:</span>{' '}
                    <a
                      href={`mailto:${profile.email}`}
                      className='text-indigo-600 hover:text-indigo-800'
                    >
                      {profile.email}
                    </a>
                  </p>
                  <p>
                    <span className='font-semibold text-gray-900'>Joined:</span>{' '}
                    {new Date(profile.created_at).toLocaleDateString()}
                  </p>
                  <p>
                    <span className='font-semibold text-gray-900'>
                      Last updated:
                    </span>{' '}
                    {new Date(profile.updated_at).toLocaleDateString()}
                  </p>
                </div>
                {profile.whatTheySeek?.notes && (
                  <div>
                    <p className='text-sm text-gray-500 uppercase font-semibold tracking-wide mb-2'>
                      Collaboration Notes
                    </p>
                    <p className='text-gray-700 leading-relaxed'>
                      {profile.whatTheySeek.notes}
                    </p>
                  </div>
                )}
              </div>
              <div className='bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4'>
                <div className='flex items-center gap-2 text-sm font-semibold text-gray-700 uppercase tracking-wide'>
                  <BadgeDollarSign className='h-4 w-4 text-amber-500' />
                  Sponsorship Preferences
                </div>
                <div className='space-y-3 text-sm text-gray-700'>
                  <div>
                    <p className='text-xs text-gray-500 uppercase mb-1'>
                      Budget Range
                    </p>
                    <p className='text-base font-semibold text-gray-900'>
                      {profile.whatTheySeek?.budgetRange || 'Not specified'}
                    </p>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 uppercase mb-1'>
                      Sponsorship Types
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {(profile.whatTheySeek?.sponsorshipTypes ?? []).length ? (
                        profile.whatTheySeek?.sponsorshipTypes?.map((type) => (
                          <span
                            key={type}
                            className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700'
                          >
                            {type}
                          </span>
                        ))
                      ) : (
                        <span className='text-gray-500'>
                          No preferences shared.
                        </span>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className='text-xs text-gray-500 uppercase mb-1'>
                      Focus Areas
                    </p>
                    <div className='flex flex-wrap gap-2'>
                      {(profile.role === 'Brand'
                        ? profile.whatTheySeek?.audienceTags
                        : profile.whatTheySeek?.eventTypes) &&
                      (profile.role === 'Brand'
                        ? profile.whatTheySeek?.audienceTags?.length
                        : profile.whatTheySeek?.eventTypes?.length) ? (
                        (profile.role === 'Brand'
                          ? profile.whatTheySeek?.audienceTags
                          : profile.whatTheySeek?.eventTypes
                        )?.map((entry) => (
                          <span
                            key={entry}
                            className='inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800'
                          >
                            <UsersIcon className='h-3 w-3 text-purple-500 mr-1' />
                            {entry}
                          </span>
                        ))
                      ) : (
                        <span className='text-gray-500'>
                          Not specified yet.
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </Layout>
  )
}
