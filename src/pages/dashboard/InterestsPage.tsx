import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useInterests } from '../../hooks/useInterests'
import { DashboardLayout } from '../../components/layout'
import { InterestCard } from '../../components/interests'
import { Heart, Send, Users } from 'lucide-react'

type TabView = 'sent' | 'received' | 'mutual'

export function InterestsPage() {
  const { currentUser } = useAuth()
  const [activeTab, setActiveTab] = useState<TabView>('received')

  const {
    sentInterests,
    receivedInterests,
    mutualInterests,
    stats,
    loading,
    error,
    acceptInterest,
    rejectInterest,
    withdrawPendingInterest,
    startConversation
  } = useInterests({ userId: currentUser?.id ?? null })

  const userType = currentUser?.type ?? null

  const getActiveInterests = () => {
    switch (activeTab) {
      case 'sent':
        return sentInterests
      case 'received':
        return receivedInterests
      case 'mutual':
        return mutualInterests
      default:
        return []
    }
  }

  const activeInterests = getActiveInterests()

  const tabs = [
    {
      id: 'received' as TabView,
      label: 'Received',
      icon: <Heart className='h-4 w-4' />,
      count: stats?.received.pending ?? 0,
      showBadge: (stats?.received.pending ?? 0) > 0
    },
    {
      id: 'sent' as TabView,
      label: 'Sent',
      icon: <Send className='h-4 w-4' />,
      count: stats?.sent.pending ?? 0,
      showBadge: (stats?.sent.pending ?? 0) > 0
    },
    {
      id: 'mutual' as TabView,
      label: 'Mutual',
      icon: <Users className='h-4 w-4' />,
      count: stats?.mutual ?? 0,
      showBadge: (stats?.mutual ?? 0) > 0
    }
  ]

  const handleAccept = async (id: string) => {
    try {
      await acceptInterest(id)
    } catch (err) {
      console.error('Failed to accept interest:', err)
      alert('Failed to accept interest. Please try again.')
    }
  }

  const handleReject = async (id: string) => {
    try {
      await rejectInterest(id)
    } catch (err) {
      console.error('Failed to reject interest:', err)
      alert('Failed to reject interest. Please try again.')
    }
  }

  const handleWithdraw = async (id: string) => {
    const interest = [...sentInterests, ...mutualInterests].find(i => i.id === id)

    if (!interest) return

    // Show confirmation for mutual matches
    if (interest.isMutual) {
      const confirmed = window.confirm(
        `Withdrawing from a mutual match will:\n\n` +
        `• Mark the match as inactive\n` +
        `• Archive your conversation\n` +
        `• Keep messages accessible (read-only)\n\n` +
        `Are you sure you want to withdraw?`
      )

      if (!confirmed) return
    }

    try {
      await withdrawPendingInterest(id)
    } catch (err) {
      console.error('Failed to withdraw interest:', err)
      alert('Failed to withdraw interest. Please try again.')
    }
  }

  const handleStartConversation = async (brandId: string, organizerId: string) => {
    try {
      await startConversation(brandId, organizerId)
    } catch (err) {
      console.error('Failed to start conversation:', err)
      alert('Failed to start conversation. Please try again.')
    }
  }

  return (
    <DashboardLayout userType={userType}>
      <div className='flex flex-col'>
        {/* Header */}
        <div className='mb-6'>
          <h1 className='text-2xl font-bold text-gray-900'>Interests</h1>
          <p className='text-gray-600 mt-1'>
            Manage your interest expressions and discover mutual connections
          </p>
        </div>

        {/* Tabs */}
        <div className='border-b border-gray-200 mb-6'>
          <nav className='-mb-px flex space-x-8'>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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
                {tab.showBadge && (
                  <span
                    className={`
                      ml-2 py-0.5 px-2 rounded-full text-xs font-medium
                      ${
                        activeTab === tab.id
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-gray-100 text-gray-600'
                      }
                    `}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {loading ? (
          <div className='flex justify-center items-center h-64'>
            <div className='text-gray-500'>Loading interests...</div>
          </div>
        ) : error ? (
          <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
            <p className='text-red-800'>{error}</p>
          </div>
        ) : activeInterests.length === 0 ? (
          <div className='bg-gray-50 border border-gray-200 rounded-lg p-12 text-center'>
            <div className='text-gray-400 mb-4'>
              {activeTab === 'received' && <Heart className='h-16 w-16 mx-auto' />}
              {activeTab === 'sent' && <Send className='h-16 w-16 mx-auto' />}
              {activeTab === 'mutual' && <Users className='h-16 w-16 mx-auto' />}
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>
              {activeTab === 'received' && 'No interests received yet'}
              {activeTab === 'sent' && 'No interests sent yet'}
              {activeTab === 'mutual' && 'No mutual interests yet'}
            </h3>
            <p className='text-gray-600'>
              {activeTab === 'received' && 'When others express interest in your profile, they\'ll appear here.'}
              {activeTab === 'sent' && 'Browse the directory and express interest in profiles to get started.'}
              {activeTab === 'mutual' && 'When you and another user both express interest, you\'ll see it here.'}
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            {activeInterests.map((interest) => (
              <InterestCard
                key={interest.id}
                interest={interest}
                viewType={activeTab}
                onAccept={handleAccept}
                onReject={handleReject}
                onWithdraw={handleWithdraw}
                onStartConversation={handleStartConversation}
              />
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {stats && !loading && (
          <div className='mt-8 pt-6 border-t border-gray-200'>
            <h3 className='text-sm font-medium text-gray-700 mb-4'>Summary</h3>
            <div className='grid grid-cols-3 gap-4'>
              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='text-2xl font-bold text-gray-900'>{stats.sent.total}</div>
                <div className='text-sm text-gray-600'>Sent</div>
                <div className='text-xs text-gray-500 mt-1'>
                  {stats.sent.pending} pending
                </div>
              </div>
              <div className='bg-gray-50 rounded-lg p-4'>
                <div className='text-2xl font-bold text-gray-900'>{stats.received.total}</div>
                <div className='text-sm text-gray-600'>Received</div>
                <div className='text-xs text-gray-500 mt-1'>
                  {stats.received.pending} pending
                </div>
              </div>
              <div className='bg-indigo-50 rounded-lg p-4'>
                <div className='text-2xl font-bold text-indigo-600'>{stats.mutual}</div>
                <div className='text-sm text-indigo-700'>Mutual</div>
                <div className='text-xs text-indigo-600 mt-1'>
                  Ready to message
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
