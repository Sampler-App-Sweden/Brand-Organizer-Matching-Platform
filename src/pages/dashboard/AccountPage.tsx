import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { User, Package, Calendar, Settings as SettingsIcon, LogOut } from 'lucide-react'
import { DashboardLayout } from '../../components/layout'
import { useAuth } from '../../context/AuthContext'
import { EditProfilePage } from './EditProfilePage'
import { ProductsPage } from './ProductsPage'
import { EventsPage } from './EventsPage'
import { supabase } from '../../services/supabaseClient'

type TabId = 'profile' | 'products' | 'events' | 'settings'

export function AccountPage() {
  const { currentUser, logout } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const userType = currentUser?.type

  // Get tab from URL or default to profile
  const tabParam = searchParams.get('tab') as TabId | null
  const [activeTab, setActiveTab] = useState<TabId>(
    tabParam || 'profile'
  )

  // Update URL when tab changes
  useEffect(() => {
    if (tabParam && ['profile', 'products', 'events', 'settings'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId)
    setSearchParams({ tab: tabId })
  }

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout()
      navigate('/login')
    }
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
      id: 'events' as TabId,
      label: 'Events',
      icon: <Calendar className='h-4 w-4' />,
      visible: userType === 'organizer'
    },
    {
      id: 'settings' as TabId,
      label: 'Settings',
      icon: <SettingsIcon className='h-4 w-4' />,
      visible: true
    }
  ].filter(tab => tab.visible)

  // Render tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return <ProfileTabContent />
      case 'products':
        return userType === 'brand' ? <ProductsTabContent /> : null
      case 'events':
        return userType === 'organizer' ? <EventsTabContent /> : null
      case 'settings':
        return <SettingsTabContent />
      default:
        return <ProfileTabContent />
    }
  }

  return (
    <DashboardLayout userType={userType || 'brand'}>
      <div className='flex flex-col'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>Account</h1>
          <p className='text-gray-600 mt-1'>
            Manage your profile, {userType === 'brand' ? 'products' : 'events'}, and account settings
          </p>
        </div>

        {/* Tabs */}
        <div className='border-b border-gray-200 mb-6'>
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
            <button
              onClick={handleLogout}
              className='flex items-center gap-2 py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-red-600 hover:border-red-300 font-medium text-sm transition-colors ml-auto'
            >
              <LogOut className='h-4 w-4' />
              <span>Log out</span>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className='flex-1'>
          {renderTabContent()}
        </div>
      </div>
    </DashboardLayout>
  )
}

// Profile Tab - Renders EditProfilePage content without DashboardLayout wrapper
function ProfileTabContent() {
  const { currentUser, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Import the EditProfilePage component logic here
  // For now, we'll just render the full EditProfilePage
  // In a production app, you'd extract the form into a reusable component

  return (
    <div>
      <p className='text-gray-500 mb-4'>
        This tab will contain the profile editing form. For now, you can access it via the Edit Profile page.
      </p>
      <p className='text-sm text-gray-400'>
        Note: To avoid code duplication, we recommend extracting the EditProfilePage form into a reusable component.
      </p>
    </div>
  )
}

// Products Tab - For brands only
function ProductsTabContent() {
  // The ProductsPage component already includes DashboardLayout
  // We need to render only its content
  // For now, we'll note this needs refactoring

  return (
    <div>
      <p className='text-gray-500 mb-4'>
        This tab will contain the products management interface.
      </p>
      <p className='text-sm text-gray-400'>
        Note: Navigate to /dashboard/account?tab=products after implementation is complete.
      </p>
    </div>
  )
}

// Events Tab - For organizers only
function EventsTabContent() {
  return (
    <div>
      <p className='text-gray-500 mb-4'>
        This tab will contain the events management interface.
      </p>
      <p className='text-sm text-gray-400'>
        Note: Navigate to /dashboard/account?tab=events after implementation is complete.
      </p>
    </div>
  )
}

// Settings Tab - Account preferences
function SettingsTabContent() {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Settings state
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setFeedback({ message: 'Passwords do not match', type: 'error' })
      return
    }

    if (newPassword.length < 6) {
      setFeedback({ message: 'Password must be at least 6 characters', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      setFeedback({ message: 'Password updated successfully', type: 'success' })
      setNewPassword('')
      setConfirmPassword('')
    } catch (error: any) {
      setFeedback({ message: error.message || 'Failed to update password', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='max-w-2xl space-y-6'>
      {/* Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-lg ${
            feedback.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {feedback.message}
        </div>
      )}

      {/* Account Information */}
      <section className='bg-white rounded-lg shadow-sm p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Account Information</h3>
        <div className='space-y-3'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Email</label>
            <input
              type='email'
              value={currentUser?.email || ''}
              disabled
              className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed'
            />
            <p className='text-xs text-gray-500 mt-1'>
              Your email address cannot be changed. Contact support if you need assistance.
            </p>
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Account Type</label>
            <input
              type='text'
              value={currentUser?.type?.charAt(0).toUpperCase() + currentUser?.type?.slice(1) || ''}
              disabled
              className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed'
            />
          </div>
        </div>
      </section>

      {/* Notification Preferences */}
      <section className='bg-white rounded-lg shadow-sm p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Notification Preferences</h3>
        <div className='space-y-4'>
          <label className='flex items-center gap-3'>
            <input
              type='checkbox'
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
            />
            <div>
              <div className='text-sm font-medium text-gray-700'>Email Notifications</div>
              <div className='text-xs text-gray-500'>Receive notifications about matches, interests, and messages</div>
            </div>
          </label>
          <label className='flex items-center gap-3'>
            <input
              type='checkbox'
              checked={marketingEmails}
              onChange={(e) => setMarketingEmails(e.target.checked)}
              className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
            />
            <div>
              <div className='text-sm font-medium text-gray-700'>Marketing Emails</div>
              <div className='text-xs text-gray-500'>Receive updates about new features and tips</div>
            </div>
          </label>
        </div>
      </section>

      {/* Change Password */}
      <section className='bg-white rounded-lg shadow-sm p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Change Password</h3>
        <form onSubmit={handlePasswordChange} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>New Password</label>
            <input
              type='password'
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder='Enter new password'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>Confirm Password</label>
            <input
              type='password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder='Confirm new password'
              className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
            />
          </div>
          <button
            type='submit'
            disabled={loading || !newPassword || !confirmPassword}
            className='px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </section>

      {/* Privacy Settings */}
      <section className='bg-white rounded-lg shadow-sm p-6'>
        <h3 className='text-lg font-semibold text-gray-900 mb-4'>Privacy</h3>
        <div className='space-y-3'>
          <p className='text-sm text-gray-600'>
            Your profile is visible to {currentUser?.type === 'brand' ? 'organizers' : 'brands'} on the platform.
          </p>
          <p className='text-sm text-gray-600'>
            For privacy concerns or to delete your account, please contact support.
          </p>
        </div>
      </section>
    </div>
  )
}
