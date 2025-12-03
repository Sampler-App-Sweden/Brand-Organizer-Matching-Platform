import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DashboardLayout } from '../../components/layout'
import { FormField } from '../../components/ui'
import { Button } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import {
  getBrandByUserId,
  getOrganizerByUserId
} from '../../services/dataService'
import { supabase } from '../../services/supabaseClient'

import type { Brand, Organizer } from '../../types'

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
  const [contactInfo, setContactInfo] = useState({
    person: '',
    email: ''
  })
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error'
  })

  const buildProfileFromBrand = (
    brand: Brand,
    fallbackEmail: string | undefined
  ) => ({
    name: brand.companyName || brand.contactName || '',
    email: brand.email || fallbackEmail || '',
    phone: brand.phone || '',
    description:
      brand.additionalInfo ||
      brand.productDescription ||
      brand.marketingGoals ||
      '',
    logo_url: ''
  })

  const buildProfileFromOrganizer = (
    organizer: Organizer,
    fallbackEmail: string | undefined
  ) => ({
    name: organizer.organizerName || organizer.contactName || '',
    email: organizer.email || fallbackEmail || '',
    phone: organizer.phone || '',
    description:
      organizer.elevatorPitch ||
      organizer.additionalInfo ||
      organizer.sponsorshipNeeds ||
      '',
    logo_url: ''
  })

  const loadProfile = async () => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle()

      if (error && error.code !== 'PGRST116') throw error

      let brandRecord: Brand | null = null
      let organizerRecord: Organizer | null = null
      let fallbackProfile: typeof profile | null = null
      if (currentUser.type === 'brand') {
        brandRecord = await getBrandByUserId(currentUser.id)
        if (brandRecord) {
          fallbackProfile = buildProfileFromBrand(
            brandRecord,
            currentUser.email
          )
        }
      } else if (currentUser.type === 'organizer') {
        organizerRecord = await getOrganizerByUserId(currentUser.id)
        if (organizerRecord) {
          fallbackProfile = buildProfileFromOrganizer(
            organizerRecord,
            currentUser.email
          )
        }
      }

      setProfile({
        name: data?.name || fallbackProfile?.name || currentUser.name || '',
        email: data?.email || fallbackProfile?.email || currentUser.email || '',
        phone: data?.phone || fallbackProfile?.phone || '',
        description: data?.description || fallbackProfile?.description || '',
        logo_url: data?.logo_url || fallbackProfile?.logo_url || ''
      })

      const contactDefaults = (() => {
        if (currentUser.type === 'brand' && brandRecord) {
          return {
            person: brandRecord.contactName || '',
            email: brandRecord.email || currentUser.email || ''
          }
        }
        if (currentUser.type === 'organizer' && organizerRecord) {
          return {
            person: organizerRecord.contactName || '',
            email: organizerRecord.email || currentUser.email || ''
          }
        }
        return {
          person: currentUser.name || '',
          email: currentUser.email || ''
        }
      })()

      setContactInfo(contactDefaults)
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
      const { error } = await supabase.from('profiles').upsert({
        id: currentUser?.id,
        role:
          currentUser?.type === 'organizer'
            ? 'Organizer'
            : currentUser?.type === 'admin'
            ? 'Admin'
            : 'Brand',
        name: profile.name,
        email: profile.email,
        phone: profile.phone,
        description: profile.description,
        logo_url: profile.logo_url,
        updated_at: new Date().toISOString()
      })

      if (error) throw error

      if (currentUser?.type === 'brand') {
        await supabase
          .from('brands')
          .update({
            contact_name: contactInfo.person || null,
            email: contactInfo.email || null
          })
          .eq('user_id', currentUser.id)
      } else if (currentUser?.type === 'organizer') {
        await supabase
          .from('organizers')
          .update({
            contact_name: contactInfo.person || null,
            email: contactInfo.email || null
          })
          .eq('user_id', currentUser.id)
      }

      // Refresh user data in AuthContext
      await refreshUser()

      showToast('Profile updated successfully!', 'success')
    } catch (error) {
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

            {currentUser?.type !== 'admin' && (
              <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
                <FormField
                  label='Contact person'
                  id='contact_person'
                  type='text'
                  value={contactInfo.person}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      person: e.target.value
                    })
                  }
                  placeholder='Who should brands speak to?'
                />
                <FormField
                  label='Contact email'
                  id='contact_email'
                  type='email'
                  value={contactInfo.email}
                  onChange={(e) =>
                    setContactInfo({
                      ...contactInfo,
                      email: e.target.value
                    })
                  }
                  placeholder='contact@example.com'
                />
              </div>
            )}

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
