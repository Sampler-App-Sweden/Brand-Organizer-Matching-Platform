import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout'
import { useAuth } from '../../context/AuthContext'
import {
  getBrandById,
  getOrganizerById,
  updateMatchStatus
} from '../../services/dataService'
import {
  getOrCreateConversation,
  sendMessage
} from '../../services/chatService'
import { Match } from '../../services/matchingService'
import { Message } from '../../services/chatService'
import { Button } from '../../components/ui'
import {
  CheckIcon,
  XIcon,
  MessageSquareIcon,
  ArrowLeftIcon,
  FileTextIcon,
  CheckCircleIcon
} from 'lucide-react'
import { ContractForm, ContractDetails } from '../../components/ContractForm'
export function MatchDetails() {
  const { matchId } = useParams<{
    matchId: string
  }>()
  const { currentUser } = useAuth()
  const navigate = useNavigate()
  const [match, setMatch] = useState<Match | null>(null)
  const [brand, setBrand] = useState<any | null>(null)
  const [organizer, setOrganizer] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [userType, setUserType] = useState<'brand' | 'organizer'>('brand')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [conversation, setConversation] = useState<any | null>(null)
  const [showContractForm, setShowContractForm] = useState(false)
  const [contract, setContract] = useState<any | null>(null)
  useEffect(() => {
    const loadData = async () => {
      if (!matchId || !currentUser) return
      // Get match data
      const matches = JSON.parse(
        localStorage.getItem('matches') || '[]'
      ) as Match[]
      const foundMatch = matches.find((m) => m.id === matchId)
      if (!foundMatch) {
        navigate('/dashboard')
        return
      }
      setMatch(foundMatch)
      // Get brand and organizer data
      const brandData = getBrandById(foundMatch.brandId)
      const organizerData = getOrganizerById(foundMatch.organizerId)
      setBrand(brandData)
      setOrganizer(organizerData)
      // Determine user type
      if (brandData && brandData.userId === currentUser.id) {
        setUserType('brand')
      } else if (organizerData && organizerData.userId === currentUser.id) {
        setUserType('organizer')
      }
      // Get conversation
      if (brandData && organizerData) {
        const conv = getOrCreateConversation(brandData.id, organizerData.id)
        setConversation(conv)
        setMessages(conv.messages)
      }
      // Check if there's an existing contract
      const contracts = JSON.parse(localStorage.getItem('contracts') || '[]')
      const existingContract = contracts.find((c: any) => c.matchId === matchId)
      if (existingContract) {
        setContract(existingContract)
      }
      setLoading(false)
    }
    loadData()
  }, [matchId, currentUser, navigate])
  const handleStatusChange = (status: 'accepted' | 'rejected') => {
    if (!match) return
    const updatedMatch = updateMatchStatus(match.id, status)
    setMatch(updatedMatch)
  }
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!conversation || !newMessage.trim() || !currentUser) return
    sendMessage(conversation.id, currentUser.id, userType, newMessage)
    setNewMessage('')
    // Refresh messages
    const conv = JSON.parse(localStorage.getItem('conversations') || '[]').find(
      (c: any) => c.id === conversation.id
    )
    if (conv) {
      setMessages(conv.messages)
    }
  }
  const handleContractCreated = (contractData: any) => {
    setContract(contractData)
    setShowContractForm(false)
  }
  if (loading) {
    return (
      <DashboardLayout userType={userType}>
        <div className='flex justify-center items-center h-64'>
          <div className='text-gray-500'>Laddar...</div>
        </div>
      </DashboardLayout>
    )
  }
  if (!match || !brand || !organizer) {
    return (
      <DashboardLayout userType={userType}>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h2 className='text-xl font-bold text-gray-900 mb-2'>
            Match hittades inte
          </h2>
          <p className='text-gray-600 mb-4'>
            Matchen du letar efter finns inte eller så har du inte behörighet
            att visa den.
          </p>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center text-indigo-600 hover:text-indigo-800'
          >
            <ArrowLeftIcon className='h-4 w-4 mr-1' />
            Gå tillbaka
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
          Tillbaka till matchningar
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
                    ? 'Ny sponsringsmöjlighet'
                    : 'Ny sponsormatch'}
                </h3>
                <div className='mt-2 text-sm text-yellow-700'>
                  <p>
                    {userType === 'brand'
                      ? 'Du har matchats med detta event baserat på dina preferenser och krav.'
                      : 'Du har matchats med detta varumärke baserat på dina eventdetaljer och deras sponsringskriterier.'}
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
                      Acceptera match
                    </Button>
                    <Button
                      variant='secondary'
                      onClick={() => handleStatusChange('rejected')}
                      className='flex items-center'
                    >
                      <XIcon className='h-4 w-4 mr-1' />
                      Avböj
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
                  Match accepterad
                </h3>
                <div className='mt-2 text-sm text-green-700'>
                  <p>
                    {userType === 'brand'
                      ? 'Du har accepterat denna sponsringsmöjlighet. Använd meddelandesystemet nedan för att diskutera detaljer.'
                      : 'Detta varumärke har bekräftats som sponsor för ditt event. Använd meddelandesystemet nedan för att diskutera detaljer.'}
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
                      Skapa sponsringsavtal
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
                  Match avböjd
                </h3>
                <div className='mt-2 text-sm text-red-700'>
                  <p>
                    {userType === 'brand'
                      ? 'Du har avböjt denna sponsringsmöjlighet.'
                      : 'Detta varumärke har avböjt att sponsra ditt event.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Match reasons */}
        <div className='mb-6'>
          <h2 className='text-lg font-semibold text-gray-900 mb-3'>
            Varför ni matchade
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
                Eventdetaljer
              </h2>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Eventnamn
                  </h3>
                  <p className='text-gray-900'>{organizer.eventName}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Eventbeskrivning
                  </h3>
                  <p className='text-gray-900'>{organizer.elevatorPitch}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Datum</h3>
                  <p className='text-gray-900'>
                    {new Date(organizer.eventDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Plats</h3>
                  <p className='text-gray-900'>{organizer.location}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Publikstorlek
                  </h3>
                  <p className='text-gray-900'>
                    {organizer.attendeeCount === 'under_100'
                      ? 'Under 100'
                      : organizer.attendeeCount === '100_500'
                      ? '100 - 500'
                      : organizer.attendeeCount === '500_1000'
                      ? '500 - 1 000'
                      : organizer.attendeeCount === '1000_5000'
                      ? '1 000 - 5 000'
                      : organizer.attendeeCount === '5000_plus'
                      ? '5 000+'
                      : 'Ej angivet'}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Publikbeskrivning
                  </h3>
                  <p className='text-gray-900'>
                    {organizer.audienceDescription}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Kontaktinformation
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
                  <h3 className='text-sm font-medium text-gray-500'>Adress</h3>
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
                Varumärkesdetaljer
              </h2>
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Företagsnamn
                  </h3>
                  <p className='text-gray-900'>{brand.companyName}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Produkt</h3>
                  <p className='text-gray-900'>{brand.productName}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Produktbeskrivning
                  </h3>
                  <p className='text-gray-900'>{brand.productDescription}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>Bransch</h3>
                  <p className='text-gray-900'>
                    {brand.industry === 'food_beverage'
                      ? 'Livsmedel & Dryck'
                      : brand.industry === 'beauty_cosmetics'
                      ? 'Skönhet & Kosmetika'
                      : brand.industry === 'health_wellness'
                      ? 'Hälsa & Välmående'
                      : brand.industry === 'tech'
                      ? 'Teknik'
                      : brand.industry === 'fashion'
                      ? 'Mode & Kläder'
                      : brand.industry === 'home_goods'
                      ? 'Hem & Inredning'
                      : brand.industry === 'sports_fitness'
                      ? 'Sport & Fitness'
                      : brand.industry === 'entertainment'
                      ? 'Underhållning'
                      : 'Annat'}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Sponsringstyp
                  </h3>
                  <p className='text-gray-900'>
                    {brand.sponsorshipType
                      .map((type: string) =>
                        type === 'product_sampling'
                          ? 'Produktprovning'
                          : type === 'financial_sponsorship'
                          ? 'Finansiell sponsring'
                          : type === 'in_kind_goods'
                          ? 'Varor'
                          : type === 'merchandise'
                          ? 'Merchandise'
                          : type === 'experience'
                          ? 'Varumärkesupplevelse'
                          : type
                      )
                      .join(', ')}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Kontaktinformation
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
                  <h3 className='text-sm font-medium text-gray-500'>Adress</h3>
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
              {userType === 'brand' ? 'Vad de behöver' : 'Vad de erbjuder'}
            </h2>
            {userType === 'brand' ? (
              <div className='space-y-4'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Sponsringsbehov
                  </h3>
                  <p className='text-gray-900'>{organizer.sponsorshipNeeds}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Erbjudanden för sponsorer
                  </h3>
                  <p className='text-gray-900'>
                    {organizer.offeringTypes
                      .map((type: string) =>
                        type === 'brand_visibility'
                          ? 'Varumärkessynlighet'
                          : type === 'content_creation'
                          ? 'Innehållsskapande'
                          : type === 'lead_generation'
                          ? 'Leadgenerering'
                          : type === 'product_sampling'
                          ? 'Produktprovning'
                          : type === 'product_feedback'
                          ? 'Produktfeedback'
                          : type === 'merchandise_sales'
                          ? 'Merchandise-försäljning'
                          : type
                      )
                      .join(', ')}
                  </p>
                </div>
                {organizer.brandVisibility && (
                  <div>
                    <h3 className='text-sm font-medium text-gray-500'>
                      Detaljer om varumärkessynlighet
                    </h3>
                    <p className='text-gray-900'>{organizer.brandVisibility}</p>
                  </div>
                )}
                {organizer.bonusValueDetails && (
                  <div>
                    <h3 className='text-sm font-medium text-gray-500'>
                      Ytterligare värde
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
                    Marknadsföringsmål
                  </h3>
                  <p className='text-gray-900'>{brand.marketingGoals}</p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Budgetintervall
                  </h3>
                  <p className='text-gray-900'>
                    {brand.budget === 'under_10000'
                      ? 'Under 10 000 kr'
                      : brand.budget === '10000_50000'
                      ? '10 000 - 50 000 kr'
                      : brand.budget === '50000_100000'
                      ? '50 000 - 100 000 kr'
                      : brand.budget === '100000_250000'
                      ? '100 000 - 250 000 kr'
                      : brand.budget === '250000_plus'
                      ? '250 000 kr+'
                      : 'Ej angivet'}
                  </p>
                </div>
                <div>
                  <h3 className='text-sm font-medium text-gray-500'>
                    Tillgänglig kvantitet
                  </h3>
                  <p className='text-gray-900'>
                    {brand.productQuantity || 'Ej angivet'}
                  </p>
                </div>
                {brand.hasTestPanels === 'yes' && (
                  <div>
                    <h3 className='text-sm font-medium text-gray-500'>
                      Testpaneler & Samplingaktiviteter
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
          <h2 className='text-lg font-semibold text-gray-900'>Meddelanden</h2>
        </div>
        <div className='border rounded-lg mb-4'>
          <div className='h-64 overflow-y-auto p-4 space-y-3'>
            {messages.length === 0 ? (
              <div className='text-center text-gray-500 py-8'>
                Inga meddelanden än. Starta konversationen!
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
                        AI Assistent
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
              placeholder='Skriv ett meddelande...'
              className='flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={match.status === 'rejected'}
            />
            <Button
              type='submit'
              variant='primary'
              className='ml-2'
              disabled={!newMessage.trim() || match.status === 'rejected'}
            >
              Skicka
            </Button>
          </form>
        </div>
        <div className='text-xs text-gray-500'>
          <p>
            Behöver du hjälp med din konversation? Vår AI-assistent kommer att
            föreslå hjälpsamma svar när du ställer frågor.
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
