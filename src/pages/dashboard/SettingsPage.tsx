import { useState } from 'react'
import { DashboardLayout } from '../../components/layout'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabaseClient'

export function SettingsPage() {
  const { currentUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

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
      setFeedback({
        message: 'Password must be at least 6 characters',
        type: 'error'
      })
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
    } catch (error: unknown) {
      setFeedback({
        message:
          error && typeof error === 'object' && 'message' in error
            ? String((error as { message?: string }).message)
            : 'Failed to update password',
        type: 'error'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout userType={currentUser?.type || 'brand'}>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Settings</h1>
        <p className='text-gray-600 mt-1'>
          Manage your account preferences and security settings
        </p>
      </div>

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
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Account Information
          </h3>
          <div className='space-y-3'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Email
              </label>
              <input
                type='email'
                value={currentUser?.email || ''}
                disabled
                className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Your email address cannot be changed. Contact support if you need
                assistance.
              </p>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Account Type
              </label>
              <input
                type='text'
                value={
                  currentUser?.type
                    ? currentUser.type.charAt(0).toUpperCase() +
                      currentUser.type.slice(1)
                    : ''
                }
                disabled
                className='w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed'
              />
            </div>
          </div>
        </section>

        {/* Notification Preferences */}
        <section className='bg-white rounded-lg shadow-sm p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Notification Preferences
          </h3>
          <div className='space-y-4'>
            <label className='flex items-center gap-3'>
              <input
                type='checkbox'
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className='w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500'
              />
              <div>
                <div className='text-sm font-medium text-gray-700'>
                  Email Notifications
                </div>
                <div className='text-xs text-gray-500'>
                  Receive notifications about matches, interests, and messages
                </div>
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
                <div className='text-sm font-medium text-gray-700'>
                  Marketing Emails
                </div>
                <div className='text-xs text-gray-500'>
                  Receive updates about new features and tips
                </div>
              </div>
            </label>
          </div>
        </section>

        {/* Change Password */}
        <section className='bg-white rounded-lg shadow-sm p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Change Password
          </h3>
          <form onSubmit={handlePasswordChange} className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                New Password
              </label>
              <input
                type='password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder='Enter new password'
                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Confirm Password
              </label>
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
              Your profile is visible to{' '}
              {currentUser?.type === 'brand' ? 'organizers' : 'brands'} on the
              platform.
            </p>
            <p className='text-sm text-gray-600'>
              For privacy concerns or to delete your account, please contact
              support.
            </p>
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
