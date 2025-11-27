import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout'
import { useAuth } from '../../context/AuthContext'
import { FormField } from '../../components/ui'
import { Button } from '../../components/ui'
import { supabase } from '../../services/supabaseClient'

export function EditProfilePage() {
  const { currentUser, refreshUser } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    description: '',
    logo_url: ''
  })
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error'
  })

  const loadProfile = async () => {
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .single()

      if (error) throw error

      if (data) {
        setProfile({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          description: data.description || '',
          logo_url: data.logo_url || ''
        })
      }
    } catch (error) {
      console.error('Error loading profile:', error)
      showToast('Failed to load profile', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          name: profile.name,
          phone: profile.phone,
          description: profile.description,
          logo_url: profile.logo_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentUser?.id)

      if (error) throw error

      // Refresh user data in AuthContext
      await refreshUser()

      showToast('Profile updated successfully!', 'success')
    } catch (error) {
      console.error('Error updating profile:', error)
      showToast('Failed to update profile', 'error')
    } finally {
      setSaving(false)
    }
  }

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type })
    setTimeout(
      () => setToast({ show: false, message: '', type: 'success' }),
      3000
    )
  }

  if (loading) {
    return (
      <DashboardLayout userType={currentUser?.type || 'brand'}>
        <div className='flex justify-center items-center h-64'>
          <div className='text-gray-500'>Loading...</div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType={currentUser?.type || 'brand'}>
      <div className='max-w-2xl mx-auto'>
        <div className='bg-white rounded-lg shadow-sm p-6'>
          <h1 className='text-2xl font-bold text-gray-900 mb-6'>
            Edit Profile
          </h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <FormField
              label='Name'
              id='name'
              type='text'
              required
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              placeholder='Your name or company name'
            />

            <FormField
              label='Email'
              id='email'
              type='email'
              disabled
              value={profile.email}
              onChange={() => {
                /* Email is read-only */
              }}
              helpText='Email cannot be changed'
            />

            <FormField
              label='Phone'
              id='phone'
              type='tel'
              value={profile.phone}
              onChange={(e) =>
                setProfile({ ...profile, phone: e.target.value })
              }
              placeholder='+1 (555) 000-0000'
            />

            <div className='space-y-2'>
              <label
                htmlFor='description'
                className='block text-sm font-medium text-gray-700'
              >
                Description
              </label>
              <textarea
                id='description'
                rows={4}
                className='block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
                value={profile.description}
                onChange={(e) =>
                  setProfile({ ...profile, description: e.target.value })
                }
                placeholder='Tell us about yourself or your organization...'
              />
            </div>

            <FormField
              label='Logo/Photo URL'
              id='logo_url'
              type='url'
              value={profile.logo_url}
              onChange={(e) =>
                setProfile({ ...profile, logo_url: e.target.value })
              }
              placeholder='https://example.com/logo.png'
            />

            <div className='flex gap-4'>
              <Button
                type='submit'
                variant='primary'
                disabled={saving}
                className='flex-1'
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button
                type='button'
                variant='outline'
                onClick={() => navigate(-1)}
                className='flex-1'
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>

        {/* Toast Notification */}
        {toast.show && (
          <div
            className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
              toast.type === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {toast.message}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
