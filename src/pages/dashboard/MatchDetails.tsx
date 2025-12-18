import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout'
import { useAuth } from '../../context/AuthContext'
import {
  getBrandById,
  getOrganizerById,
  getMatchById,
  updateMatchStatus
} from '../../services/dataService'
import {
  Conversation,
  Message,
  getOrCreateConversation,
  getConversationMessages,
  sendMessage
} from '../../services/chatService'
import { Button } from '../../components/ui'
import {
  CheckIcon,
  XIcon,
  MessageSquareIcon,
  ArrowLeftIcon,
  FileTextIcon,
  CheckCircleIcon
} from 'lucide-react'
import { ContractDetails, ContractForm } from '../../components/contract'
import type { Brand, Contract, Organizer, Match } from '../../types'

type StoredBrand = Brand & {
  address?: string
  postalCode?: string
  city?: string
  hasTestPanels?: string
  testPanelDetails?: string
}

type StoredOrganizer = Organizer & {
  address?: string
  postalCode?: string
  city?: string
}

export function MatchDetails() {
  const { matchId } = useParams<{
    matchId: string
  }>()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [match, setMatch] = useState<Match | null>(null)
  const [brand, setBrand] = useState<StoredBrand | null>(null)
  const [organizer, setOrganizer] = useState<StoredOrganizer | null>(null)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState<'brand' | 'organizer'>('brand')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [messagesLoading, setMessagesLoading] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [messageError, setMessageError] = useState<string | null>(null)
  const [showContractForm, setShowContractForm] = useState(false)
  const [contract, setContract] = useState<Contract | null>(null)
  useEffect(() => {
    const loadData = async () => {
      if (!matchId || !currentUser) return
      try {
        const foundMatch = await getMatchById(matchId)
        if (!foundMatch) {
          navigate('/dashboard')
          return
        }
        setMatch(foundMatch)

        const [brandData, organizerData] = await Promise.all([
          getBrandById(foundMatch.brandId),
          getOrganizerById(foundMatch.organizerId)
        ])

        setBrand(brandData as StoredBrand | null)
        setOrganizer(organizerData as StoredOrganizer | null)
        // Determine user type
        if (brandData && brandData.userId === currentUser.id) {
          setUserType('brand')
        } else if (organizerData && organizerData.userId === currentUser.id) {
          setUserType('organizer')
        }
        // Get conversation
        if (brandData && organizerData) {
          setMessagesLoading(true)
          try {
            const conv = await getOrCreateConversation(
              brandData.id,
              organizerData.id
            )
            setConversation(conv)
            setMessages(conv.messages)
          } finally {
            setMessagesLoading(false)
          }
        }
        // Check if there's an existing contract
        const contracts = JSON.parse(
          localStorage.getItem('contracts') || '[]'
        ) as Contract[]
        const existingContract = contracts.find((c) => c.matchId === matchId)
        if (existingContract) {
          setContract(existingContract)
        }
      } catch (error) {
        console.error('Failed to load match details:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [matchId, currentUser, navigate])
  const handleStatusChange = async (status: 'accepted' | 'rejected') => {
    if (!match) return
    try {
      const updatedMatch = await updateMatchStatus(match.id, status)
      setMatch(updatedMatch)
    } catch (error) {
      console.error('Failed to update match status:', error)
    }
  }
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!conversation || !newMessage.trim() || !currentUser) return

    try {
      setSendingMessage(true)
      setMessageError(null)
      await sendMessage(conversation.id, currentUser.id, userType, newMessage)
      setNewMessage('')
      const refreshedMessages = await getConversationMessages(conversation.id)
      setMessages(refreshedMessages)
    } catch (error) {
      console.error('Failed to send message:', error)
      setMessageError('Could not send the message. Please try again.')
    } finally {
      setSendingMessage(false)
    }
  }
  const handleContractCreated = (contractData: Contract) => {
    setContract(contractData)
    setShowContractForm(false)
  }
  if (loading) {
    return (
      <DashboardLayout userType={userType}>
        <div className='flex justify-center items-center h-64'>
          <div className='text-gray-500'>Loading...</div>
        </div>
      </DashboardLayout>
    )
  }
  if (!match || !brand || !organizer) {
    return (
      <DashboardLayout userType={userType}>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-xl font-bold text-gray-900 mb-2'>
            Match not found
          </h2>
          <p className='text-gray-600 mb-4'>
            The match you are looking for either does not exist or you don't
            have permission to view it.
          </p>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center text-indigo-600 hover:text-indigo-800'
          >
            <ArrowLeftIcon className='h-4 w-4 mr-1' />
            Go back
          </button>
        </div>
      </DashboardLayout>
    )
  }
  return (
    <DashboardLayout userType={userType}>
      <div className='mb-6'>
        <button
          onClick={() => navigate(-1)}
          className='flex items-center text-indigo-600 hover:text-indigo-800'
        >
          <ArrowLeftIcon className='h-4 w-4 mr-1' />
          Back to matches
        </button>
      </div>
      <div className='bg-white rounded-lg shadow-sm p-6 mb-6'>
        <div className='flex justify-between items-center mb-4'>
          <h1 className='text-2xl font-bold text-gray-900'>
            {userType === 'brand' ? organizer.eventName : brand.companyName}
          </h1>
          <div
            className={`px-3 py-1 inline-flex items-center rounded-full ${
              match.score >= 80
                ? 'bg-green-100 text-green-800'
                : match.score >= 60
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            <span className='text-sm font-medium'>{match.score}% Match</span>
          </div>
        </div>
        {/* Match status actions */}
        {match.status === 'pending' && (
          <div className='bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-6'>
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <AlertCircleIcon className='h-5 w-5 text-yellow-400' />
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-yellow-800'>
                  {userType === 'brand'
                    ? 'New sponsorship opportunity'
                    : 'New sponsor match'}
                </h3>
                <div className='mt-2 text-sm text-yellow-700'>
                  <p>
                    {userType === 'brand'
                      ? 'You have been matched with this event based on your preferences and requirements.'
                      : 'You have been matched with this brand based on your event details and their sponsorship criteria.'}
                  </p>
                </div>
                <div className='mt-4'>
                  <div className='flex space-x-3'>
                    <Button
                      variant='primary'
                      onClick={() => handleStatusChange('accepted')}
                      className='flex items-center'
                    >
                      <CheckIcon className='h-4 w-4 mr-1' />
                      Accept match
                    </Button>
                    <Button
                      variant='danger'
                      onClick={() => handleStatusChange('rejected')}
                      className='flex items-center'
                    >
                      <XIcon className='h-4 w-4 mr-1' />
                      Decline
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {match.status === 'accepted' && (
          <div className='bg-green-50 border border-green-200 rounded-md p-4 mb-6'>
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <CheckCircleIcon className='h-5 w-5 text-green-400' />
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-green-800'>
                  Match accepted
                </h3>
                <div className='mt-2 text-sm text-green-700'>
                  <p>
                    {userType === 'brand'
                      ? 'You have accepted this sponsorship opportunity. Use the messaging system below to discuss details.'
                      : 'This brand has been confirmed as a sponsor for your event. Use the messaging system below to discuss details.'}
                  </p>
                </div>
                {!contract && match.status === 'accepted' && (
                  <div className='mt-4'>
                    <Button
                      variant='outline'
                      onClick={() => setShowContractForm(true)}
                      className='flex items-center'
                    >
                      <FileTextIcon className='h-4 w-4 mr-1' />
                      Create sponsorship agreement
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {match.status === 'rejected' && (
          <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-6'>
            <div className='flex items-start'>
              <div className='flex-shrink-0'>
                <XIcon className='h-5 w-5 text-red-400' />
              </div>
              <div className='ml-3'>
                <h3 className='text-sm font-medium text-red-800'>
                  Match declined
                </h3>
                <div className='mt-2 text-sm text-red-700'>
                  <p>
                    {userType === 'brand'
                      ? 'You have declined this sponsorship opportunity.'
                      : 'This brand has declined to sponsor your event.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Match reasons */}
        <div className='mb-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-3'>
            Why you matched
          </h2>
          <ul className='space-y-2'>
            {match.matchReasons.map((reason, index) => (
              <li key={index} className='flex items-center'>
                <div className='bg-indigo-100 rounded-full p-1 mr-2'>
                  <CheckIcon className='h-4 w-4 text-indigo-600' />
                </div>
                <span className='text-gray-700'>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* Details */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {userType === 'brand' ? (
            <div>
              <h2 className='text-lg font-semibold text-gray-900 mb-3'>
                Event details
              </h2>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Event name
                  </h3>
                  <p className='text-gray-900'>{organizer.eventName}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Event description
                  </h3>
                  <p className='text-gray-900'>{organizer.elevatorPitch}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Date</h3>
                  <p className='text-gray-900'>
                    {new Date(organizer.eventDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Location
                  </h3>
                  <p className='text-gray-900'>{organizer.location}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Audience size
                  </h3>
                  <p className='text-gray-900'>
                    {organizer.attendeeCount === 'under_100'
                      ? 'Under 100'
                      : organizer.attendeeCount === '100_500'
                      ? '100 - 500'
                      : organizer.attendeeCount === '500_1000'
                      ? '500 - 1,000'
                      : organizer.attendeeCount === '1000_5000'
                      ? '1,000 - 5,000'
                      : organizer.attendeeCount === '5000_plus'
                      ? '5,000+'
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Audience description
                  </h3>
                  <p className='text-gray-900'>
                    {organizer.audienceDescription}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Contact information
                  </h3>
                  <p className='text-gray-900'>
                    {organizer.contactName}
                    <br />
                    {organizer.email}
                    <br />
                    {organizer.phone}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Address</h3>
                  <p className='text-gray-900'>
                    {organizer.address}
                    <br />
                    {organizer.postalCode} {organizer.city}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <h2 className='text-lg font-semibold text-gray-900 mb-3'>
                Brand details
              </h2>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Company name
                  </h3>
                  <p className='text-gray-900'>{brand.companyName}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Product</h3>
                  <p className='text-gray-900'>{brand.productName}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Product description
                  </h3>
                  <p className='text-gray-900'>{brand.productDescription}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Industry
                  </h3>
                  <p className='text-gray-900'>
                    {brand.industry === 'food_beverage'
                      ? 'Food & Beverage'
                      : brand.industry === 'beauty_cosmetics'
                      ? 'Beauty & Cosmetics'
                      : brand.industry === 'health_wellness'
                      ? 'Health & Wellness'
                      : brand.industry === 'tech'
                      ? 'Tech'
                      : brand.industry === 'fashion'
                      ? 'Fashion & Apparel'
                      : brand.industry === 'home_goods'
                      ? 'Home & Interior'
                      : brand.industry === 'sports_fitness'
                      ? 'Sports & Fitness'
                      : brand.industry === 'entertainment'
                      ? 'Entertainment'
                      : 'Other'}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Sponsorship type
                  </h3>
                  <p className='text-gray-900'>
                    {brand.sponsorshipType
                      .map((type: string) =>
                        type === 'product_sampling'
                          ? 'Product sampling'
                          : type === 'financial_sponsorship'
                          ? 'Financial sponsorship'
                          : type === 'in_kind_goods'
                          ? 'Goods'
                          : type === 'merchandise'
                          ? 'Merchandise'
                          : type === 'experience'
                          ? 'Brand experience'
                          : type
                      )
                      .join(', ')}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Contact information
                  </h3>
                  <p className='text-gray-900'>
                    {brand.contactName}
                    <br />
                    {brand.email}
                    <br />
                    {brand.phone}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Address</h3>
                  <p className='text-gray-900'>
                    {brand.address}
                    <br />
                    {brand.postalCode} {brand.city}
                  </p>
                </div>
              </div>
            </div>
          )}
          <div>
            <h2 className='text-lg font-semibold text-gray-900 mb-3'>
              {userType === 'brand' ? 'What they need' : 'What they offer'}
            </h2>
            {userType === 'brand' ? (
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Sponsorship needs
                  </h3>
                  <p className='text-gray-900'>{organizer.sponsorshipNeeds}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Sponsor offerings
                  </h3>
                  <p className='text-gray-900'>
                    {organizer.offeringTypes
                      .map((type: string) =>
                        type === 'brand_visibility'
                          ? 'Brand visibility'
                          : type === 'content_creation'
                          ? 'Content creation'
                          : type === 'lead_generation'
                          ? 'Lead generation'
                          : type === 'product_sampling'
                          ? 'Product sampling'
                          : type === 'product_feedback'
                          ? 'Product feedback'
                          : type === 'merchandise_sales'
                          ? 'Merchandise sales'
                          : type
                      )
                      .join(', ')}
                  </p>
                </div>
                {organizer.brandVisibility && (
                  <div>
                    <h3 className='text-sm font-medium text-gray-500'>
                      Brand visibility details
                    </h3>
                    <p className='text-gray-900'>{organizer.brandVisibility}</p>
                  </div>
                )}
                {organizer.bonusValueDetails && (
                  <div>
                    <h3 className='text-sm font-medium text-gray-500'>
                      Additional value
                    </h3>
                    <p className='text-gray-900'>
                      {organizer.bonusValueDetails}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Marketing goals
                  </h3>
                  <p className='text-gray-900'>{brand.marketingGoals}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Budget range
                  </h3>
                  <p className='text-gray-900'>
                    {brand.budget === 'under_10000'
                      ? 'Under 10,000 SEK'
                      : brand.budget === '10000_50000'
                      ? '10,000 - 50,000 SEK'
                      : brand.budget === '50000_100000'
                      ? '50,000 - 100,000 SEK'
                      : brand.budget === '100000_250000'
                      ? '100,000 - 250,000 SEK'
                      : brand.budget === '250000_plus'
                      ? '250,000 SEK+'
                      : 'Not specified'}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Available quantity
                  </h3>
                  <p className='text-gray-900'>
                    {brand.productQuantity || 'Not specified'}
                  </p>
                </div>
                {brand.hasTestPanels === 'yes' && (
                  <div>
                    <h3 className='text-sm font-medium text-gray-500'>
                      Test panels & sampling activities
                    </h3>
                    <p className='text-gray-900'>{brand.testPanelDetails}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Contract section */}
      {showContractForm && match.status === 'accepted' && (
        <div className='mb-6'>
          <ContractForm
            brandName={brand.companyName}
            organizerName={organizer.organizerName}
            eventName={organizer.eventName}
            matchId={match.id}
            onContractCreated={handleContractCreated}
          />
        </div>
      )}
      {contract && (
        <div className='mb-6'>
          <ContractDetails contract={contract} />
        </div>
      )}
      {/* Messaging */}
      <div className='bg-white rounded-lg shadow-sm p-6'>
        <div className='flex items-center mb-4'>
          <MessageSquareIcon className='h-5 w-5 text-indigo-600 mr-2' />
          <h2 className='text-lg font-semibold text-gray-900'>Messages</h2>
        </div>
        <div className='border rounded-lg mb-4'>
          <div className='h-64 overflow-y-auto p-4 space-y-3'>
            {messagesLoading ? (
              <div className='text-center text-gray-500 py-8'>
                Loading messages...
              </div>
            ) : messages.length === 0 ? (
              <div className='text-center text-gray-500 py-8'>
                No messages yet. Start the conversation!
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderType === userType
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-3/4 rounded-lg p-3 ${
                      message.senderType === 'ai'
                        ? 'bg-gray-100 text-gray-800'
                        : message.senderType === userType
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {message.senderType === 'ai' && (
                      <div className='text-xs font-medium text-gray-500 mb-1'>
                        AI Assistant
                      </div>
                    )}
                    <p className='text-sm'>{message.content}</p>
                    <div className='text-xs mt-1 text-right opacity-70'>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <form onSubmit={handleSendMessage} className='border-t p-3 flex'>
            <input
              type='text'
              placeholder='Type a message...'
              className='flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={match.status === 'rejected' || sendingMessage}
            />
            <Button
              type='submit'
              variant='primary'
              className='ml-2'
              disabled={
                !newMessage.trim() ||
                match.status === 'rejected' ||
                sendingMessage
              }
            >
              {sendingMessage ? 'Sending...' : 'Send'}
            </Button>
          </form>
          {messageError && (
            <div className='px-3 pb-3 text-sm text-red-600'>{messageError}</div>
          )}
        </div>
        <div className='text-xs text-gray-500'>
          <p>
            Need help with your conversation? Our AI assistant will suggest
            helpful replies whenever you ask questions.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <circle cx='12' cy='12' r='10' />
      <line x1='12' y1='8' x2='12' y2='12' />
      <line x1='12' y1='16' x2='12.01' y2='16' />
    </svg>
  )
}
