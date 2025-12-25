import { Calendar, Handshake, Package, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { EditProfileForm } from '../../components/forms/EditProfileForm'
import { DASHBOARD_SPACING } from '../../constants/dashboardStyles.constants'
import { DashboardLayout } from '../../components/layout'
import {
  BrandSponsorshipPanel,
  OrganizerSponsorshipPanel,
  ProductSponsorshipManager
} from '../../components/sponsorship'
import { EventsManager } from '../../components/events'
import { useAuth } from '../../context/AuthContext'
import {
  getBrandByUserId,
  getOrganizerByUserId
} from '../../services/dataService'
import { LoadingSpinner } from '../../components/ui'

type TabId = 'profile' | 'products' | 'events' | 'sponsorship'

export function AccountPage() {
  const { currentUser } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const userType = currentUser?.type
  const [brandId, setBrandId] = useState<string | null>(null)
  const [organizerId, setOrganizerId] = useState<string | null>(null)

  // Fetch brand or organizer ID based on user type
  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return

      if (userType === 'brand') {
        const brand = await getBrandByUserId(currentUser.id)
        setBrandId(brand?.id || null)
      } else if (userType === 'organizer') {
        const organizer = await getOrganizerByUserId(currentUser.id)
        setOrganizerId(organizer?.id || null)
      }
    }

    fetchUserData()
  }, [currentUser, userType])

  // Get tab from URL or default to profile
  const tabParam = searchParams.get('tab') as TabId | null
  const [activeTab, setActiveTab] = useState<TabId>(tabParam || 'profile')

  // Update URL when tab changes
  useEffect(() => {
    if (
      tabParam &&
      ['profile', 'products', 'events', 'sponsorship'].includes(tabParam)
    ) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId)
    setSearchParams({ tab: tabId })
  }

  // Define tabs based on user type
  const tabs = [
    {
      id: 'profile' as TabId,
      label: 'Profile',
      icon: <User className='h-4 w-4' />,
      visible: true
    },
    {
      id: 'products' as TabId,
      label: 'Products',
      icon: <Package className='h-4 w-4' />,
      visible: userType === 'brand'
    },
    {
      id: 'sponsorship' as TabId,
      label: 'Sponsorship',
      icon: <Handshake className='h-4 w-4' />,
      visible: userType === 'brand' || userType === 'organizer'
    },
    {
      id: 'events' as TabId,
      label: 'Events',
      icon: <Calendar className='h-4 w-4' />,
      visible: userType === 'organizer'
    }
  ].filter((tab) => tab.visible)

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTabContent />
      case 'products':
        return userType === 'brand' ? (
          <ProductsTabContent brandId={brandId} />
        ) : null
      case 'sponsorship':
        if (userType === 'brand') {
          return <BrandSponsorshipTabContent brandId={brandId} />
        } else if (userType === 'organizer') {
          return <OrganizerSponsorshipTabContent organizerId={organizerId} />
        }
        return null
      case 'events':
        return userType === 'organizer' ? (
          <EventsTabContent organizerId={organizerId} />
        ) : null
      default:
        return <ProfileTabContent />
    }
  }

  return (
    <DashboardLayout userType={userType || 'brand'}>
      <div className='flex flex-col'>
        {/* Header */}
        <div className={DASHBOARD_SPACING.headerMargin}>
          <h1 className='text-2xl font-bold text-gray-900'>Account</h1>
          <p className='text-gray-600 mt-1 hidden sm:block'>
            Manage your profile
            {userType === 'brand'
              ? ', products, and sponsorship offerings'
              : ', events, and sponsorship needs'}
          </p>
        </div>

        {/* Mobile Dropdown - Visible only on mobile */}
        <div className='mb-6 md:hidden'>
          <select
            value={activeTab}
            onChange={(e) => handleTabChange(e.target.value as TabId)}
            className='w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm'
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Tabs - Hidden on mobile */}
        <div className='border-b border-gray-200 mb-6 hidden md:block'>
          <nav className='-mb-px flex space-x-8'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className='flex-1'>{renderTabContent()}</div>
      </div>
    </DashboardLayout>
  )
}

// Profile Tab - Renders EditProfilePage content without DashboardLayout wrapper
function ProfileTabContent() {
  return <EditProfileForm />
}

// Products Tab - For brands only
function ProductsTabContent({ brandId }: { brandId: string | null }) {
  if (!brandId) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-white z-50'>
        <LoadingSpinner size={48} />
      </div>
    )
  }

  return (
    <div className={DASHBOARD_SPACING.formSectionSpacing}>
      <h2 className='text-xl font-semibold mb-4'>Product Catalog</h2>
      <ProductSponsorshipManager brandId={brandId} />
    </div>
  )
}

// Events Tab - For organizers only
function EventsTabContent({ organizerId }: { organizerId: string | null }) {
  if (!organizerId) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-white z-50'>
        <LoadingSpinner size={48} />
      </div>
    )
  }

  return <EventsManager organizerId={organizerId} />
}

// Sponsorship Tab - For brands
function BrandSponsorshipTabContent({ brandId }: { brandId: string | null }) {
  if (!brandId) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-white z-50'>
        <LoadingSpinner size={48} />
      </div>
    )
  }

  return (
    <div className={DASHBOARD_SPACING.formSectionSpacing}>
      <div>
        <h2 className='text-xl font-semibold mb-4'>Sponsorship Offerings</h2>
        <BrandSponsorshipPanel brandId={brandId} />
      </div>
    </div>
  )
}

// Sponsorship Tab - For organizers
function OrganizerSponsorshipTabContent({
  organizerId
}: {
  organizerId: string | null
}) {
  if (!organizerId) {
    return (
      <div className='fixed inset-0 flex items-center justify-center bg-white z-50'>
        <LoadingSpinner size={48} />
      </div>
    )
  }

  return (
    <div className={DASHBOARD_SPACING.formSectionSpacing}>
      <h2 className='text-xl font-semibold mb-4'>Sponsorship Needs</h2>
      <OrganizerSponsorshipPanel organizerId={organizerId} />
    </div>
  )
}
