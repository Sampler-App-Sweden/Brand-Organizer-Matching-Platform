import { supabase } from './supabaseClient'

// Data service for managing brand and organizer data
import {
  Match,
  findMatchesForBrand,
  findMatchesForOrganizer
} from './matchingService'

import { Brand, Organizer } from '../types'

type BrandRow = {
  id: string
  user_id: string | null
  company_name: string | null
  contact_name: string | null
  contact_title: string | null
  email: string | null
  phone: string | null
  website: string | null
  address: string | null
  postal_code: string | null
  city: string | null
  industry: string | null
  product_name: string | null
  product_description: string | null
  product_quantity: string | null
  target_audience: string | null
  age_range: string | null
  sponsorship_type: string[] | null
  marketing_goals: string | null
  budget: string | null
  event_marketing_budget: string | null
  interested_in_financial_sponsorship: boolean | null
  financial_sponsorship_amount: string | null
  success_metrics: string | null
  interested_in_sampling_tools: boolean | null
  has_test_panels: boolean | null
  test_panel_details: string | null
  additional_info: string | null
  created_at: string | null
}

type OrganizerRow = {
  id: string
  user_id: string | null
  organizer_name: string | null
  contact_name: string | null
  email: string | null
  phone: string | null
  website: string | null
  address: string | null
  postal_code: string | null
  city: string | null
  event_name: string | null
  event_type: string | null
  elevator_pitch: string | null
  event_frequency: string | null
  event_date: string | null
  location: string | null
  attendee_count: string | null
  audience_description: string | null
  audience_demographics: string[] | null
  sponsorship_needs: string | null
  seeking_financial_sponsorship: boolean | null
  financial_sponsorship_amount: string | null
  financial_sponsorship_offers: string | null
  offering_types: string[] | null
  brand_visibility: string | null
  content_creation: string | null
  lead_generation: string | null
  product_feedback: string | null
  bonus_value: string[] | null
  bonus_value_details: string | null
  additional_info: string | null
  media_files: string[] | null
  created_at: string | null
}

type MatchRow = {
  id: string
  brand_id: string
  organizer_id: string
  score: number
  match_reasons: string[] | null
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string | null
}

const booleanToYesNo = (value?: boolean | null): 'yes' | 'no' | '' => {
  if (value === true) return 'yes'
  if (value === false) return 'no'
  return ''
}

const yesNoToBoolean = (value?: string | null): boolean | null => {
  if (!value) return null
  if (value.toLowerCase() === 'yes') return true
  if (value.toLowerCase() === 'no') return false
  return null
}

const mapBrandRowToBrand = (row: BrandRow): Brand => ({
  id: row.id,
  userId: row.user_id ?? '',
  companyName: row.company_name ?? '',
  contactName: row.contact_name ?? '',
  contactTitle: row.contact_title ?? '',
  email: row.email ?? '',
  phone: row.phone ?? '',
  website: row.website ?? '',
  address: row.address ?? '',
  postalCode: row.postal_code ?? '',
  city: row.city ?? '',
  industry: row.industry ?? '',
  productName: row.product_name ?? '',
  productDescription: row.product_description ?? '',
  productQuantity: row.product_quantity ?? '',
  targetAudience: row.target_audience ?? '',
  ageRange: row.age_range ?? '',
  sponsorshipType: row.sponsorship_type ?? [],
  marketingGoals: row.marketing_goals ?? '',
  budget: row.budget ?? '',
  eventMarketingBudget: row.event_marketing_budget ?? '',
  interestedInFinancialSponsorship: booleanToYesNo(
    row.interested_in_financial_sponsorship
  ),
  financialSponsorshipAmount: row.financial_sponsorship_amount ?? '',
  successMetrics: row.success_metrics ?? '',
  interestedInSamplingTools: booleanToYesNo(row.interested_in_sampling_tools),
  hasTestPanels: booleanToYesNo(row.has_test_panels),
  testPanelDetails: row.test_panel_details ?? '',
  additionalInfo: row.additional_info ?? '',
  createdAt: row.created_at ? new Date(row.created_at) : new Date()
})

const mapOrganizerRowToOrganizer = (row: OrganizerRow): Organizer => ({
  id: row.id,
  userId: row.user_id ?? '',
  organizerName: row.organizer_name ?? '',
  contactName: row.contact_name ?? '',
  email: row.email ?? '',
  phone: row.phone ?? '',
  website: row.website ?? '',
  address: row.address ?? '',
  postalCode: row.postal_code ?? '',
  city: row.city ?? '',
  eventName: row.event_name ?? '',
  eventType: row.event_type ?? '',
  elevatorPitch: row.elevator_pitch ?? '',
  eventFrequency: row.event_frequency ?? '',
  eventDate: row.event_date ?? '',
  location: row.location ?? '',
  attendeeCount: row.attendee_count ?? '',
  audienceDescription: row.audience_description ?? '',
  audienceDemographics: row.audience_demographics ?? [],
  sponsorshipNeeds: row.sponsorship_needs ?? '',
  seekingFinancialSponsorship: booleanToYesNo(
    row.seeking_financial_sponsorship
  ),
  financialSponsorshipAmount: row.financial_sponsorship_amount ?? '',
  financialSponsorshipOffers: row.financial_sponsorship_offers ?? '',
  offeringTypes: row.offering_types ?? [],
  brandVisibility: row.brand_visibility ?? '',
  contentCreation: row.content_creation ?? '',
  leadGeneration: row.lead_generation ?? '',
  productFeedback: row.product_feedback ?? '',
  bonusValue: row.bonus_value ?? [],
  bonusValueDetails: row.bonus_value_details ?? '',
  additionalInfo: row.additional_info ?? '',
  mediaFiles: row.media_files ?? [],
  createdAt: row.created_at ? new Date(row.created_at) : new Date()
})

const mapMatchRowToMatch = (row: MatchRow): Match => ({
  id: row.id,
  brandId: row.brand_id,
  organizerId: row.organizer_id,
  score: row.score,
  matchReasons: row.match_reasons ?? [],
  createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  status: row.status
})

const buildBrandPayload = (brandData: Omit<Brand, 'id' | 'createdAt'>) => ({
  user_id: brandData.userId,
  company_name: brandData.companyName,
  contact_name: brandData.contactName,
  contact_title: brandData.contactTitle,
  email: brandData.email,
  phone: brandData.phone,
  website: brandData.website,
  address: brandData.address,
  postal_code: brandData.postalCode,
  city: brandData.city,
  industry: brandData.industry,
  product_name: brandData.productName,
  product_description: brandData.productDescription,
  product_quantity: brandData.productQuantity,
  target_audience: brandData.targetAudience,
  age_range: brandData.ageRange,
  sponsorship_type: brandData.sponsorshipType,
  marketing_goals: brandData.marketingGoals,
  budget: brandData.budget,
  event_marketing_budget: brandData.eventMarketingBudget,
  interested_in_financial_sponsorship: yesNoToBoolean(
    brandData.interestedInFinancialSponsorship
  ),
  financial_sponsorship_amount: brandData.financialSponsorshipAmount,
  success_metrics: brandData.successMetrics,
  interested_in_sampling_tools: yesNoToBoolean(
    brandData.interestedInSamplingTools
  ),
  has_test_panels: yesNoToBoolean(brandData.hasTestPanels),
  test_panel_details: brandData.testPanelDetails,
  additional_info: brandData.additionalInfo
})

const buildOrganizerPayload = (
  organizerData: Omit<Organizer, 'id' | 'createdAt'>
) => ({
  user_id: organizerData.userId,
  organizer_name: organizerData.organizerName,
  contact_name: organizerData.contactName,
  email: organizerData.email,
  phone: organizerData.phone,
  website: organizerData.website,
  address: organizerData.address,
  postal_code: organizerData.postalCode,
  city: organizerData.city,
  event_name: organizerData.eventName,
  event_type: organizerData.eventType,
  elevator_pitch: organizerData.elevatorPitch,
  event_frequency: organizerData.eventFrequency,
  event_date: organizerData.eventDate,
  location: organizerData.location,
  attendee_count: organizerData.attendeeCount,
  audience_description: organizerData.audienceDescription,
  audience_demographics: organizerData.audienceDemographics,
  sponsorship_needs: organizerData.sponsorshipNeeds,
  seeking_financial_sponsorship: yesNoToBoolean(
    organizerData.seekingFinancialSponsorship
  ),
  financial_sponsorship_amount: organizerData.financialSponsorshipAmount,
  financial_sponsorship_offers: organizerData.financialSponsorshipOffers,
  offering_types: organizerData.offeringTypes,
  brand_visibility: organizerData.brandVisibility,
  content_creation: organizerData.contentCreation,
  lead_generation: organizerData.leadGeneration,
  product_feedback: organizerData.productFeedback,
  bonus_value: organizerData.bonusValue,
  bonus_value_details: organizerData.bonusValueDetails,
  additional_info: organizerData.additionalInfo,
  media_files: organizerData.mediaFiles
})

const fetchAllOrganizers = async (): Promise<Organizer[]> => {
  const { data, error } = await supabase.from('organizers').select('*')
  if (error) {
    console.error('Failed to fetch organizers for matching:', error)
    return []
  }
  return (data as OrganizerRow[] | null)?.map(mapOrganizerRowToOrganizer) ?? []
}

const fetchAllBrands = async (): Promise<Brand[]> => {
  const { data, error } = await supabase.from('brands').select('*')
  if (error) {
    console.error('Failed to fetch brands for matching:', error)
    return []
  }
  return (data as BrandRow[] | null)?.map(mapBrandRowToBrand) ?? []
}

const insertMatchSuggestions = async (matches: Match[]) => {
  if (!matches.length) return

  const matchRows = matches.map((match) => ({
    brand_id: match.brandId,
    organizer_id: match.organizerId,
    score: match.score,
    match_reasons: match.matchReasons,
    status: match.status
  }))

  const { error } = await supabase.from('matches').insert(matchRows)
  if (error) {
    console.error('Failed to store match suggestions:', error)
  }
}

// Save brand data
export const saveBrand = async (
  brandData: Omit<Brand, 'id' | 'createdAt'>
): Promise<Brand> => {
  const { data, error } = await supabase
    .from('brands')
    .insert([buildBrandPayload(brandData)])
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(
      `Failed to save brand: ${error?.message ?? 'Unknown error'}`
    )
  }

  const newBrand = mapBrandRowToBrand(data as BrandRow)

  try {
    const organizers = await fetchAllOrganizers()
    const matches = findMatchesForBrand(newBrand, organizers)
    await insertMatchSuggestions(matches)
  } catch (matchError) {
    console.error('Failed to generate organizer matches for brand:', matchError)
  }

  return newBrand
}

// Save organizer data
export const saveOrganizer = async (
  organizerData: Omit<Organizer, 'id' | 'createdAt'>
): Promise<Organizer> => {
  const { data, error } = await supabase
    .from('organizers')
    .insert([buildOrganizerPayload(organizerData)])
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(
      `Failed to save organizer: ${error?.message ?? 'Unknown error'}`
    )
  }

  const newOrganizer = mapOrganizerRowToOrganizer(data as OrganizerRow)

  try {
    const brands = await fetchAllBrands()
    const matches = findMatchesForOrganizer(newOrganizer, brands)
    await insertMatchSuggestions(matches)
  } catch (matchError) {
    console.error('Failed to generate brand matches for organizer:', matchError)
  }

  return newOrganizer
}

export const updateBrand = async (
  brandId: string,
  brandData: Omit<Brand, 'id' | 'createdAt'>
): Promise<Brand> => {
  const { data, error } = await supabase
    .from('brands')
    .update(buildBrandPayload(brandData))
    .eq('id', brandId)
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(
      `Failed to update brand: ${error?.message ?? 'Unknown error'}`
    )
  }

  return mapBrandRowToBrand(data as BrandRow)
}

export const updateOrganizer = async (
  organizerId: string,
  organizerData: Omit<Organizer, 'id' | 'createdAt'>
): Promise<Organizer> => {
  const { data, error } = await supabase
    .from('organizers')
    .update(buildOrganizerPayload(organizerData))
    .eq('id', organizerId)
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(
      `Failed to update organizer: ${error?.message ?? 'Unknown error'}`
    )
  }

  return mapOrganizerRowToOrganizer(data as OrganizerRow)
}

// Get brand by user ID
export const getBrandByUserId = async (
  userId: string
): Promise<Brand | null> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to load brand: ${error.message}`)
  }

  return data ? mapBrandRowToBrand(data as BrandRow) : null
}

// Get organizer by user ID
export const getOrganizerByUserId = async (
  userId: string
): Promise<Organizer | null> => {
  const { data, error } = await supabase
    .from('organizers')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to load organizer: ${error.message}`)
  }

  return data ? mapOrganizerRowToOrganizer(data as OrganizerRow) : null
}

// Get matches for a brand
export const getMatchesForBrand = async (brandId: string): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('brand_id', brandId)

  if (error) {
    throw new Error(`Failed to load matches for brand: ${error.message}`)
  }

  return (data as MatchRow[] | null)?.map(mapMatchRowToMatch) ?? []
}

// Get matches for an organizer
export const getMatchesForOrganizer = async (
  organizerId: string
): Promise<Match[]> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('organizer_id', organizerId)

  if (error) {
    throw new Error(`Failed to load matches for organizer: ${error.message}`)
  }

  return (data as MatchRow[] | null)?.map(mapMatchRowToMatch) ?? []
}

export const getMatchById = async (matchId: string): Promise<Match | null> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('id', matchId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to load match: ${error.message}`)
  }

  return data ? mapMatchRowToMatch(data as MatchRow) : null
}

// Update match status
export const updateMatchStatus = async (
  matchId: string,
  status: 'accepted' | 'rejected'
): Promise<Match> => {
  const { data, error } = await supabase
    .from('matches')
    .update({ status })
    .eq('id', matchId)
    .select('*')
    .single()

  if (error || !data) {
    throw new Error(
      `Failed to update match: ${error?.message ?? 'Unknown error'}`
    )
  }

  return mapMatchRowToMatch(data as MatchRow)
}

// Get brand by ID
export const getBrandById = async (brandId: string): Promise<Brand | null> => {
  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .eq('id', brandId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to load brand: ${error.message}`)
  }

  return data ? mapBrandRowToBrand(data as BrandRow) : null
}

// Get organizer by ID
export const getOrganizerById = async (
  organizerId: string
): Promise<Organizer | null> => {
  const { data, error } = await supabase
    .from('organizers')
    .select('*')
    .eq('id', organizerId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to load organizer: ${error.message}`)
  }

  return data ? mapOrganizerRowToOrganizer(data as OrganizerRow) : null
}
