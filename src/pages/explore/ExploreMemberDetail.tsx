import {
  ArrowLeftIcon,
  CalendarIcon,
  ExternalLinkIcon,
  GlobeIcon,
  PackageIcon,
  PhoneIcon,
  SparklesIcon,
  StarIcon,
  TargetIcon,
  UsersIcon
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { InterestOfferWizard } from '../../components/community/InterestOfferWizard'
import { Layout } from '../../components/layout'
import { Button } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { getCommunityMemberById } from '../../services/communityService'
import { CommunityMember } from '../../types/community'

export function ExploreMemberDetail() {
  const { memberId } = useParams<{ memberId: string }>()
  const [member, setMember] = useState<CommunityMember | null>(null)
  const [loading, setLoading] = useState(true)
  const [showWizard, setShowWizard] = useState(false)
  const { currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMember = async () => {
      if (!memberId) return
      try {
        setLoading(true)
        const data = await getCommunityMemberById(memberId)
        setMember(data)
      } catch (error) {
        console.error('Failed to fetch community member:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMember()
  }, [memberId])
  // Get CTA text based on user type and member type
  const getCtaText = () => {
    if (!currentUser) return 'Register to Connect'
    if (currentUser.type === 'organizer' && member?.type === 'brand') {
      return 'Express Interest'
    }
    if (currentUser.type === 'brand' && member?.type === 'organizer') {
      return 'Offer Sponsorship'
    }
    return 'Connect'
  }
  // Handle CTA button click
  const handleCtaClick = () => {
    if (!currentUser) {
      // Redirect to registration
      navigate('/register', {
        state: {
          returnUrl: `/community/${memberId}`
        }
      })
      return
    }
    // Show the wizard for logged-in users
    setShowWizard(true)
  }
  if (loading) {
    return (
      <Layout>
        <div className='container mx-auto px-4 py-12 flex justify-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600'></div>
        </div>
      </Layout>
    )
  }
  if (!member) {
    return (
      <Layout>
        <div className='container mx-auto px-4 py-12 text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-4'>
            Member Not Found
          </h2>
          <p className='text-gray-600 mb-6'>
            The community member you're looking for doesn't exist or has been
            removed.
          </p>
          <Link to='/community'>
            <Button variant='primary'>Back to Community</Button>
          </Link>
        </div>
      </Layout>
    )
  }
  return (
    <Layout>
      <div className='bg-white min-h-screen'>
        {/* Back button */}
        <div className='container mx-auto px-4 py-6'>
          <Link
            to='/community'
            className='inline-flex items-center text-indigo-600 hover:text-indigo-800'
          >
            <ArrowLeftIcon className='h-4 w-4 mr-1' />
            Back to Community
          </Link>
        </div>
        <div className='container mx-auto px-4 pb-12'>
          {/* Profile Header */}
          <div className='bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 md:p-8 mb-8 relative overflow-hidden'>
            {/* Mystical decorative elements */}
            <div className='absolute top-0 right-0 w-40 h-40 bg-indigo-100 rounded-full -mr-20 -mt-20 opacity-30'></div>
            <div className='absolute bottom-0 left-0 w-32 h-32 bg-purple-100 rounded-full -ml-16 -mb-16 opacity-30'></div>
            <div className='relative z-10 flex flex-col md:flex-row items-center md:items-start'>
              <div className='w-32 h-32 md:w-40 md:h-40 mb-4 md:mb-0 md:mr-6 relative'>
                {member.logoUrl ? (
                  <img
                    src={member.logoUrl}
                    alt={member.name}
                    className='w-full h-full object-contain rounded-lg shadow-md border border-gray-100 bg-white p-2'
                  />
                ) : (
                  <div
                    className={`w-full h-full rounded-lg flex items-center justify-center text-white font-bold text-4xl ${
                      member.type === 'brand' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}
                  >
                    {member.name.charAt(0)}
                  </div>
                )}
                {member.featured && (
                  <div
                    className='absolute -top-2 -right-2 bg-yellow-400 text-yellow-800 rounded-full p-1.5'
                    title='Featured Member'
                  >
                    <StarIcon className='h-4 w-4 fill-current' />
                  </div>
                )}
              </div>
              <div className='text-center md:text-left md:flex-1'>
                <div className='flex flex-col md:flex-row md:items-center md:justify-between'>
                  <div>
                    <h1 className='text-3xl font-bold text-gray-900 mb-1'>
                      {member.name}
                    </h1>
                    <div className='flex items-center justify-center md:justify-start mb-3'>
                      <span
                        className={`text-sm px-3 py-1 rounded-full ${
                          member.type === 'brand'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-purple-800'
                        }`}
                      >
                        {member.type === 'brand' ? 'Brand' : 'Organizer'}
                      </span>
                      <span className='text-sm text-gray-500 ml-3'>
                        Joined{' '}
                        {new Date(member.dateRegistered).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className='mt-4 md:mt-0'>
                    <Button
                      variant='primary'
                      className='bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 group relative overflow-hidden'
                      onClick={handleCtaClick}
                    >
                      <span className='relative z-10 flex items-center'>
                        <SparklesIcon className='h-4 w-4 mr-2' />
                        {getCtaText()}
                      </span>
                      <div className='absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
                    </Button>
                  </div>
                </div>
                <p className='text-gray-600 mt-2'>{member.shortDescription}</p>
                <div className='flex flex-wrap justify-center md:justify-start gap-4 mt-4'>
                  {member.website && (
                    <a
                      href={member.website}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800'
                    >
                      <GlobeIcon className='h-4 w-4 mr-1' />
                      Website
                      <ExternalLinkIcon className='h-3 w-3 ml-1' />
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className='inline-flex items-center text-sm text-indigo-600 hover:text-indigo-800'
                    >
                      <PhoneIcon className='h-4 w-4 mr-1' />
                      Phone
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
            {/* About Section */}
            <div className='lg:col-span-2'>
              <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8 relative overflow-hidden'>
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-100 via-purple-200 to-indigo-100'></div>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                  About
                </h2>
                <div className='prose max-w-none'>
                  <p className='text-gray-700 whitespace-pre-wrap'>
                    {member.description}
                  </p>
                </div>
              </div>
              {/* What They Offer Section */}
              <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8 relative overflow-hidden'>
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-100 via-purple-200 to-indigo-100'></div>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                  {member.type === 'brand'
                    ? 'What They Offer'
                    : 'Events & Opportunities'}
                </h2>
                {member.type === 'brand' ? (
                  <div className='space-y-4'>
                    <div className='bg-blue-50 rounded-lg p-4 border border-blue-100'>
                      <div className='flex items-start'>
                        <PackageIcon className='h-5 w-5 text-blue-500 mr-3 mt-0.5' />
                        <div>
                          <h3 className='font-medium text-blue-900'>
                            Sponsorship Products
                          </h3>
                          <p className='text-blue-700 text-sm'>
                            Sample products, merchandise, or financial support
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Placeholder for actual brand products - in a real implementation, these would come from the brand's profile */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-200 hover:shadow-sm transition-all'>
                        <h4 className='font-medium text-gray-900'>
                          Product Samples
                        </h4>
                        <p className='text-sm text-gray-600 mt-1'>
                          Available for distribution at events to increase brand
                          awareness.
                        </p>
                      </div>
                      <div className='bg-white rounded-lg border border-gray-200 p-4 hover:border-blue-200 hover:shadow-sm transition-all'>
                        <h4 className='font-medium text-gray-900'>
                          Branded Merchandise
                        </h4>
                        <p className='text-sm text-gray-600 mt-1'>
                          T-shirts, water bottles, and other branded items for
                          event attendees.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <div className='bg-purple-50 rounded-lg p-4 border border-purple-100'>
                      <div className='flex items-start'>
                        <CalendarIcon className='h-5 w-5 text-purple-500 mr-3 mt-0.5' />
                        <div>
                          <h3 className='font-medium text-purple-900'>
                            Upcoming Events
                          </h3>
                          <p className='text-purple-700 text-sm'>
                            Opportunities for brands to connect with our
                            audience
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Placeholder for actual organizer events - in a real implementation, these would come from the organizer's profile */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                      <div className='bg-white rounded-lg border border-gray-200 p-4 hover:border-purple-200 hover:shadow-sm transition-all'>
                        <div className='flex justify-between items-start'>
                          <h4 className='font-medium text-gray-900'>
                            Summer Festival
                          </h4>
                          <span className='text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full'>
                            Upcoming
                          </span>
                        </div>
                        <p className='text-sm text-gray-500 mt-1'>
                          June 15, 2023 • Stockholm
                        </p>
                        <p className='text-sm text-gray-600 mt-1'>
                          An outdoor event with 500+ attendees focused on
                          wellness and sustainability.
                        </p>
                      </div>
                      <div className='bg-white rounded-lg border border-gray-200 p-4 hover:border-purple-200 hover:shadow-sm transition-all'>
                        <div className='flex justify-between items-start'>
                          <h4 className='font-medium text-gray-900'>
                            Winter Conference
                          </h4>
                          <span className='text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full'>
                            Planning
                          </span>
                        </div>
                        <p className='text-sm text-gray-500 mt-1'>
                          December 10, 2023 • Gothenburg
                        </p>
                        <p className='text-sm text-gray-600 mt-1'>
                          Indoor networking event with 200+ industry
                          professionals.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* What They Seek Section */}
            <div className='lg:col-span-1'>
              <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8 relative overflow-hidden'>
                <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-100 via-purple-200 to-indigo-100'></div>
                <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                  What They Seek
                </h2>
                {member.type === 'brand' ? (
                  <div className='space-y-4'>
                    <div className='flex items-start'>
                      <CalendarIcon className='h-5 w-5 text-indigo-500 mr-2 mt-0.5' />
                      <div>
                        <h3 className='font-medium text-gray-900'>
                          Preferred Event Types
                        </h3>
                        <p className='text-sm text-gray-600'>
                          Wellness festivals, food markets, sports events
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start'>
                      <UsersIcon className='h-5 w-5 text-indigo-500 mr-2 mt-0.5' />
                      <div>
                        <h3 className='font-medium text-gray-900'>
                          Target Audience
                        </h3>
                        <p className='text-sm text-gray-600'>
                          Health-conscious adults, ages 25-45, urban
                          professionals
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start'>
                      <TargetIcon className='h-5 w-5 text-indigo-500 mr-2 mt-0.5' />
                      <div>
                        <h3 className='font-medium text-gray-900'>
                          Sampling Goals
                        </h3>
                        <p className='text-sm text-gray-600'>
                          Product feedback, brand awareness, lead generation
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    <div className='flex items-start'>
                      <PackageIcon className='h-5 w-5 text-indigo-500 mr-2 mt-0.5' />
                      <div>
                        <h3 className='font-medium text-gray-900'>
                          Sponsorship Types Needed
                        </h3>
                        <p className='text-sm text-gray-600'>
                          Product samples, branded merchandise, financial
                          support
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start'>
                      <UsersIcon className='h-5 w-5 text-indigo-500 mr-2 mt-0.5' />
                      <div>
                        <h3 className='font-medium text-gray-900'>
                          Audience Demographics
                        </h3>
                        <p className='text-sm text-gray-600'>
                          Diverse group of wellness enthusiasts, families,
                          professionals
                        </p>
                      </div>
                    </div>
                    <div className='flex items-start'>
                      <TargetIcon className='h-5 w-5 text-indigo-500 mr-2 mt-0.5' />
                      <div>
                        <h3 className='font-medium text-gray-900'>
                          Budget Range
                        </h3>
                        <p className='text-sm text-gray-600'>
                          10,000 - 50,000 SEK per event
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                {/* CTA Button for sidebar */}
                <div className='mt-6'>
                  <Button
                    variant='primary'
                    className='w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 group relative overflow-hidden'
                    onClick={handleCtaClick}
                  >
                    <span className='relative z-10 flex items-center justify-center'>
                      <SparklesIcon className='h-4 w-4 mr-2' />
                      {getCtaText()}
                    </span>
                    <div className='absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300'></div>
                  </Button>
                </div>
              </div>
              {/* Social Media Links */}
              {member.socialLinks && (
                <div className='bg-white rounded-lg shadow-sm border border-gray-100 p-6 relative overflow-hidden'>
                  <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-100 via-purple-200 to-indigo-100'></div>
                  <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                    Connect
                  </h2>
                  <div className='space-y-2'>
                    {member.socialLinks.split('\n').map((link, index) => (
                      <a
                        key={index}
                        href={link}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='flex items-center text-indigo-600 hover:text-indigo-800'
                      >
                        <ExternalLinkIcon className='h-4 w-4 mr-2' />
                        {getSocialMediaName(link)}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Interest/Offer Wizard Modal */}
      {showWizard && (
        <InterestOfferWizard
          member={member}
          currentUser={currentUser}
          onClose={() => setShowWizard(false)}
        />
      )}
    </Layout>
  )
}

// Helper function to extract social media name from URL
function getSocialMediaName(url: string): string {
  try {
    const hostname = new URL(url).hostname
    if (hostname.includes('instagram')) return 'Instagram'
    if (hostname.includes('facebook')) return 'Facebook'
    if (hostname.includes('twitter')) return 'Twitter'
    if (hostname.includes('linkedin')) return 'LinkedIn'
    return hostname.replace('www.', '')
  } catch (error) {
    return url
  }
}
