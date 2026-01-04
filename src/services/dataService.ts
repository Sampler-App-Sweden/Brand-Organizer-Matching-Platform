import { supabase } from './supabaseClient'

// Data service for managing brand and organizer data
import { Brand, Organizer, Match } from '../types'
import { notifyNewMatch, notifyProfileUpdate } from './notificationService'

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
  created_at: string | null
}

type EventRow = {
  id: string
  organizer_id: string
  name: string | null
  event_type: string | null
  custom_event_type: string | null
  elevator_pitch: string | null
  frequency: string | null
  start_date: string | null
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
  updated_at: string | null
}

type MatchRow = {
  id: string
  brand_id: string
  organizer_id: string
  score: number
  match_reasons: string[] | null
  status: 'pending' | 'accepted' | 'rejected'
  match_source?: 'ai' | 'manual' | 'hybrid'
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

const mapOrganizerRowToOrganizer = (
  organizerRow: OrganizerRow,
  eventRow: EventRow | null = null
): Organizer => ({
  id: organizerRow.id,
  userId: organizerRow.user_id ?? '',
  organizerName: organizerRow.organizer_name ?? '',
  contactName: organizerRow.contact_name ?? '',
  email: organizerRow.email ?? '',
  phone: organizerRow.phone ?? '',
  website: organizerRow.website ?? '',
  address: organizerRow.address ?? '',
  postalCode: organizerRow.postal_code ?? '',
  city: organizerRow.city ?? '',
  eventName: eventRow?.name ?? '',
  eventType: eventRow?.event_type ?? '',
  customEventType: eventRow?.custom_event_type ?? '',
  elevatorPitch: eventRow?.elevator_pitch ?? '',
  eventFrequency: eventRow?.frequency ?? '',
  eventDate: eventRow?.start_date ?? '',
  location: eventRow?.location ?? '',
  attendeeCount: eventRow?.attendee_count ?? '',
  audienceDescription: eventRow?.audience_description ?? '',
  audienceDemographics: eventRow?.audience_demographics ?? [],
  sponsorshipNeeds: eventRow?.sponsorship_needs ?? '',
  seekingFinancialSponsorship: booleanToYesNo(
    eventRow?.seeking_financial_sponsorship
  ),
  financialSponsorshipAmount: eventRow?.financial_sponsorship_amount ?? '',
  financialSponsorshipOffers: eventRow?.financial_sponsorship_offers ?? '',
  offeringTypes: eventRow?.offering_types ?? [],
  brandVisibility: eventRow?.brand_visibility ?? '',
  contentCreation: eventRow?.content_creation ?? '',
  leadGeneration: eventRow?.lead_generation ?? '',
  productFeedback: eventRow?.product_feedback ?? '',
  bonusValue: eventRow?.bonus_value ?? [],
  bonusValueDetails: eventRow?.bonus_value_details ?? '',
  additionalInfo: eventRow?.additional_info ?? '',
  mediaFiles: eventRow?.media_files ?? [],
  createdAt: organizerRow.created_at ? new Date(organizerRow.created_at) : new Date(),
  productSampling: '' // This field exists in Organizer type but not in database
})

const mapMatchRowToMatch = (row: MatchRow): Match => ({
  id: row.id,
  brandId: row.brand_id,
  organizerId: row.organizer_id,
  score: row.score,
  matchReasons: row.match_reasons ?? [],
  createdAt: row.created_at ? new Date(row.created_at) : new Date(),
  status: row.status,
  matchSource: row.match_source
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
  city: organizerData.city
})

const buildEventPayload = (
  organizerId: string,
  organizerData: Omit<Organizer, 'id' | 'createdAt'>
) => ({
  organizer_id: organizerId,
  name: organizerData.eventName,
  event_type: organizerData.eventType,
  custom_event_type: organizerData.customEventType,
  elevator_pitch: organizerData.elevatorPitch,
  frequency: organizerData.eventFrequency,
  start_date: organizerData.eventDate || null,
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

// Helper to fetch the primary event for an organizer (most recent)
const fetchPrimaryEvent = async (organizerId: string): Promise<EventRow | null> => {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', organizerId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    console.error('Failed to fetch event for organizer:', error)
    return null
  }

  return data as EventRow | null
}

const fetchAllOrganizers = async (): Promise<Organizer[]> => {
  const { data, error } = await supabase.from('organizers').select('*')
  if (error) {
    console.error('Failed to fetch organizers for matching:', error)
    return []
  }

  const organizers = data as OrganizerRow[] | null
  if (!organizers) return []

  // Fetch events for all organizers
  const result: Organizer[] = []
  for (const org of organizers) {
    const event = await fetchPrimaryEvent(org.id)
    result.push(mapOrganizerRowToOrganizer(org, event))
  }

  return result
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
    return
  }

  // Notify both parties for each match (non-blocking)
  for (const match of matches) {
    notifyNewMatch(match.brandId, match.organizerId, match.id).catch(
      (error) => {
        console.error('Failed to create match notification:', error)
      }
    )
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

  // Generate matches using Edge Function (server-side)
  try {
    const { data: functionData, error: functionError } = await supabase.functions.invoke(
      'generate-matches',
      {
        body: { type: 'brand', entityId: newBrand.id }
      }
    )

    if (functionError) {
      console.error('Failed to generate matches via Edge Function:', functionError)
    } else {
      console.log(`Generated ${functionData.matchCount} matches for brand`)
    }
  } catch (matchError) {
    console.error('Failed to generate organizer matches for brand:', matchError)
  }

  return newBrand
}

// Save organizer data
export const saveOrganizer = async (
  organizerData: Omit<Organizer, 'id' | 'createdAt'>
): Promise<Organizer> => {
  // First, insert organizer
  const { data: organizerRow, error: organizerError } = await supabase
    .from('organizers')
    .insert([buildOrganizerPayload(organizerData)])
    .select('*')
    .single()

  if (organizerError || !organizerRow) {
    throw new Error(
      `Failed to save organizer: ${organizerError?.message ?? 'Unknown error'}`
    )
  }

  const organizerId = (organizerRow as OrganizerRow).id

  // Then, insert event if event data exists
  let eventRow: EventRow | null = null
  if (organizerData.eventName || organizerData.eventType) {
    const { data: newEvent, error: eventError } = await supabase
      .from('events')
      .insert([buildEventPayload(organizerId, organizerData)])
      .select('*')
      .single()

    if (eventError) {
      // If event creation fails, we should probably delete the organizer
      // But for now, just log the error
      console.error('Failed to save event for organizer:', eventError)
    } else {
      eventRow = newEvent as EventRow
    }
  }

  const newOrganizer = mapOrganizerRowToOrganizer(
    organizerRow as OrganizerRow,
    eventRow
  )

  // Generate matches using Edge Function (server-side)
  try {
    const { data: functionData, error: functionError } = await supabase.functions.invoke(
      'generate-matches',
      {
        body: { type: 'organizer', entityId: newOrganizer.id }
      }
    )

    if (functionError) {
      console.error('Failed to generate matches via Edge Function:', functionError)
    } else {
      console.log(`Generated ${functionData.matchCount} matches for organizer`)
    }
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

  const updatedBrand = mapBrandRowToBrand(data as BrandRow)

  // Notify users who saved this profile (non-blocking)
  if (updatedBrand.userId) {
    notifyProfileUpdate(
      updatedBrand.userId,
      updatedBrand.companyName,
      'brand profile'
    ).catch((error) => {
      console.error('Failed to create profile update notification:', error)
    })
  }

  return updatedBrand
}

export const updateOrganizer = async (
  organizerId: string,
  organizerData: Omit<Organizer, 'id' | 'createdAt'>
): Promise<Organizer> => {
  // Update organizer record
  const { data: organizerRow, error: organizerError } = await supabase
    .from('organizers')
    .update(buildOrganizerPayload(organizerData))
    .eq('id', organizerId)
    .select('*')
    .single()

  if (organizerError || !organizerRow) {
    throw new Error(
      `Failed to update organizer: ${organizerError?.message ?? 'Unknown error'}`
    )
  }

  // Update or create event record
  let eventRow: EventRow | null = null

  // Check if event already exists
  const existingEvent = await fetchPrimaryEvent(organizerId)

  if (existingEvent) {
    // Update existing event
    const { data: updatedEvent, error: eventError } = await supabase
      .from('events')
      .update(buildEventPayload(organizerId, organizerData))
      .eq('id', existingEvent.id)
      .select('*')
      .single()

    if (eventError) {
      console.error('Failed to update event for organizer:', eventError)
    } else {
      eventRow = updatedEvent as EventRow
    }
  } else if (organizerData.eventName || organizerData.eventType) {
    // Create new event if it doesn't exist
    const { data: newEvent, error: eventError } = await supabase
      .from('events')
      .insert([buildEventPayload(organizerId, organizerData)])
      .select('*')
      .single()

    if (eventError) {
      console.error('Failed to create event for organizer:', eventError)
    } else {
      eventRow = newEvent as EventRow
    }
  }

  const updatedOrganizer = mapOrganizerRowToOrganizer(
    organizerRow as OrganizerRow,
    eventRow
  )

  // Notify users who saved this profile (non-blocking)
  if (updatedOrganizer.userId) {
    notifyProfileUpdate(
      updatedOrganizer.userId,
      updatedOrganizer.organizerName,
      'organizer profile'
    ).catch((error) => {
      console.error('Failed to create profile update notification:', error)
    })
  }

  return updatedOrganizer
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

  if (!data) return null

  const organizerRow = data as OrganizerRow
  const eventRow = await fetchPrimaryEvent(organizerRow.id)

  return mapOrganizerRowToOrganizer(organizerRow, eventRow)
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

  if (!data) return null

  const organizerRow = data as OrganizerRow
  const eventRow = await fetchPrimaryEvent(organizerRow.id)

  return mapOrganizerRowToOrganizer(organizerRow, eventRow)
}

export const getOrganizersByIds = async (
  organizerIds: string[]
): Promise<Organizer[]> => {
  if (!organizerIds.length) return []

  const { data, error } = await supabase
    .from('organizers')
    .select('*')
    .in('id', organizerIds)

  if (error) {
    throw new Error(`Failed to load organizers: ${error.message}`)
  }

  const organizers = data as OrganizerRow[] | null
  if (!organizers) return []

  // Fetch events for all organizers
  const result: Organizer[] = []
  for (const org of organizers) {
    const event = await fetchPrimaryEvent(org.id)
    result.push(mapOrganizerRowToOrganizer(org, event))
  }

  return result
}

export const getBrandsByIds = async (brandIds: string[]): Promise<Brand[]> => {
  if (!brandIds.length) return []

  const { data, error } = await supabase
    .from('brands')
    .select('*')
    .in('id', brandIds)

  if (error) {
    throw new Error(`Failed to load brands: ${error.message}`)
  }

  return (data as BrandRow[] | null)?.map(mapBrandRowToBrand) ?? []
}

/**
 * Check if a match exists between a brand and organizer
 */
export const checkExistingMatch = async (
  brandId: string,
  organizerId: string
): Promise<Match | null> => {
  const { data, error } = await supabase
    .from('matches')
    .select('*')
    .eq('brand_id', brandId)
    .eq('organizer_id', organizerId)
    .maybeSingle()

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to check existing match: ${error.message}`)
  }

  return data ? mapMatchRowToMatch(data as MatchRow) : null
}

/**
 * Create a manual match from mutual interest
 */
export const createManualMatch = async (
  brandId: string,
  organizerId: string
): Promise<Match> => {
  const { data, error } = await supabase
    .from('matches')
    .insert({
      brand_id: brandId,
      organizer_id: organizerId,
      score: 0,
      match_reasons: ['Mutual interest expressed'],
      status: 'accepted',
      match_source: 'manual'
    })
    .select('*')
    .single()

  if (error) {
    throw new Error(`Failed to create manual match: ${error.message}`)
  }

  return mapMatchRowToMatch(data as MatchRow)
}

/**
 * Admin-only: Get all brands from the database
 */
export const getAllBrands = async (): Promise<Brand[]> => {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load all brands:', error.message)
      return []
    }

    return (data as BrandRow[] | null)?.map(mapBrandRowToBrand) ?? []
  } catch (error) {
    console.error('Error fetching all brands:', error)
    return []
  }
}

/**
 * Admin-only: Get all organizers from the database
 */
export const getAllOrganizers = async (): Promise<Organizer[]> => {
  try {
    const { data, error } = await supabase
      .from('organizers')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load all organizers:', error.message)
      return []
    }

    const organizers = data as OrganizerRow[] | null
    if (!organizers) return []

    // Fetch events for all organizers
    const result: Organizer[] = []
    for (const org of organizers) {
      const event = await fetchPrimaryEvent(org.id)
      result.push(mapOrganizerRowToOrganizer(org, event))
    }

    return result
  } catch (error) {
    console.error('Error fetching all organizers:', error)
    return []
  }
}

/**
 * Admin-only: Get all matches from the database
 */
export const getAllMatches = async (): Promise<Match[]> => {
  try {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Failed to load all matches:', error.message)
      return []
    }

    return (data as MatchRow[] | null)?.map(mapMatchRowToMatch) ?? []
  } catch (error) {
    console.error('Error fetching all matches:', error)
    return []
  }
}
