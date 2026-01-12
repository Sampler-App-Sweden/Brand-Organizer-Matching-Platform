import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { DashboardLayout } from '../../components/layout'
import { FormField, Button, LoadingSpinner } from '../../components/ui'
import { useAuth } from '../../context/AuthContext'
import { ImageUpload } from '../../components/media/ImageUpload'
import { ProfileCompletenessIndicator } from '../../components/profile'
import {
  getBrandByUserId,
  getOrganizerByUserId
} from '../../services/dataService'
import { supabase } from '../../services/supabaseClient'
import { uploadFile } from '../../services/edgeFunctions'

import type { Brand, Organizer } from '../../types'
import type { ProductImage } from '../../types/sponsorship'

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
  const [logoImages, setLogoImages] = useState<ProductImage[]>([])
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
      const effectiveLogo = data?.logo_url || fallbackProfile?.logo_url || ''
      setLogoImages(
        effectiveLogo
          ? [
              {
                id: 'logo_existing',
                url: effectiveLogo
              }
            ]
          : []
      )

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

  const uploadLogoIfNeeded = async (): Promise<string> => {
    if (!currentUser?.id) return ''
    const currentImage = logoImages[0]
    if (!currentImage) return ''

    // Reuse existing URL when no new file is added
    if (!currentImage.file) return currentImage.url

    const file = currentImage.file

    try {
      // Use edge function for secure upload with optimization
      const publicUrl = await uploadFile(file, 'brand-logos', {
        onOptimizationComplete: (result) => {
          const optimizationMsg = `Image optimized: ${(result.originalSize / 1024).toFixed(1)}KB → ${(result.optimizedSize / 1024).toFixed(1)}KB (${result.savings.toFixed(1)}% saved)`
          showToast(optimizationMsg, 'success')
        }
      })
      return publicUrl
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error(`Failed to upload logo: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const logoUrl = logoImages.length ? await uploadLogoIfNeeded() : ''

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
        logo_url: logoUrl,
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
          <LoadingSpinner size={64} />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userType={currentUser?.type || 'brand'}>
      <div className='max-w-2xl mx-auto'>
        {/* Profile Completeness Indicator */}
        <ProfileCompletenessIndicator
          profile={{
            description: profile.description,
            role: currentUser?.type === 'organizer' ? 'Organizer' : 'Brand',
            whatTheySeek: {
              sponsorshipTypes: [],
              budgetRange: null,
              audienceTags: [],
              eventTypes: []
            }
          }}
          className='mb-6'
        />

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

            <div className='space-y-2'>
              <label className='block text-sm font-medium text-gray-700'>
                Logo / Photo
              </label>
              <ImageUpload
                images={logoImages}
                onImagesChange={setLogoImages}
                maxImages={1}
              />
            </div>

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
