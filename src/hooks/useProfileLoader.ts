import { useCallback, useState } from 'react'

import { getBrandByUserId, getOrganizerByUserId } from '../services/dataService'
import { supabase } from '../services/supabaseClient'

import type { Brand, Organizer } from '../types'
import type { ProductImage } from '../types/sponsorship'

// Custom hook to load and manage profile data for a given user
export function useProfileLoader(currentUser: any) {
  const [loading, setLoading] = useState<boolean>(true)
  const [profile, setProfile] = useState<{
    name: string
    email: string
    phone: string
    description: string
    logo_url: string
  }>({
    name: '',
    email: '',
    phone: '',
    description: '',
    logo_url: ''
  })
  const [logoImages, setLogoImages] = useState<ProductImage[]>([])
  const [contactInfo, setContactInfo] = useState<{
    person: string
    email: string
  }>({
    person: '',
    email: ''
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

  const loadProfile = useCallback(async () => {
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

      let brandRecord = null
      let organizerRecord = null
      let fallbackProfile = null
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
      setProfile({
        name: '',
        email: '',
        phone: '',
        description: '',
        logo_url: ''
      })
      setLogoImages([])
      setContactInfo({ person: '', email: '' })
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  return {
    loading,
    profile,
    setProfile,
    logoImages,
    setLogoImages,
    contactInfo,
    setContactInfo,
    loadProfile
  }
}
