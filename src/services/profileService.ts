import { supabase } from './supabaseClient'

export interface ProfileData {
  role: 'Brand' | 'Organizer'
  name: string
  logoURL?: string
  description: string
  whatTheySeek: {
    sponsorshipTypes: string[]
    budgetRange: string
    quantity?: number
    eventTypes?: string[]
    audienceTags?: string[]
    notes?: string
  }
}

export interface ProfileOverview {
  id: string
  role: 'Brand' | 'Organizer'
  name: string
  email: string
  logoURL?: string | null
  description?: string | null
  city?: string | null
  created_at: string
  updated_at: string
  whatTheySeek: {
    sponsorshipTypes: string[]
    budgetRange?: string | null
    quantity?: string | number | null
    eventTypes?: string[]
    audienceTags?: string[]
    notes?: string | null
  }
}

type ProfileOverviewRow = {
  id: string
  role: 'Brand' | 'Organizer'
  name: string
  email: string
  logo_url?: string | null
  description?: string | null
  city?: string | null
  created_at: string
  updated_at: string
  what_they_seek?: Record<string, unknown> | null
}

const toStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return []
  }
  return value
    .map((entry) => (typeof entry === 'string' ? entry.trim() : ''))
    .filter((entry): entry is string => Boolean(entry))
}

function normalizeWhatTheySeek(
  row: ProfileOverviewRow
): ProfileOverview['whatTheySeek'] {
  const raw = row.what_they_seek ?? {}
  const payload = raw as Record<string, unknown>
  return {
    sponsorshipTypes: toStringArray(payload.sponsorshipTypes),
    budgetRange:
      typeof payload.budgetRange === 'string'
        ? (payload.budgetRange as string)
        : (payload.budgetRange as string | null | undefined) ?? null,
    quantity: (payload.quantity as string | number | null | undefined) ?? null,
    eventTypes: toStringArray(payload.eventTypes),
    audienceTags: toStringArray(payload.audienceTags),
    notes: typeof payload.notes === 'string' ? (payload.notes as string) : null
  }
}

const mapRowToProfile = (row: ProfileOverviewRow): ProfileOverview => ({
  id: row.id,
  role: row.role,
  name: row.name,
  email: row.email,
  logoURL: row.logo_url,
  description: row.description,
  city: row.city,
  created_at: row.created_at,
  updated_at: row.updated_at,
  whatTheySeek: normalizeWhatTheySeek(row)
})

// Create a new profile
export async function createProfile(profileData: ProfileData) {
  // First, get the current user
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // Insert into profiles table
  const { data, error } = await supabase
    .from('profiles')
    .insert([
      {
        id: user.id,
        role: profileData.role,
        name: profileData.name,
        email: user.email,
        logo_url: profileData.logoURL,
        description: profileData.description
      }
    ])
    .select()
  if (error) {
    console.error('Error creating profile:', error)
    throw new Error(`Error creating profile: ${error.message}`)
  }

  // If it's a brand, insert into brands table
  if (profileData.role === 'Brand') {
    const brandData = {
      user_id: user.id,
      company_name: profileData.name,
      contact_name: profileData.name,
      // Default to profile name
      email: user.email,
      product_name: 'Default Product',
      // These would be updated later
      product_description: profileData.description,
      target_audience: profileData.whatTheySeek.audienceTags?.join(', ') || '',
      age_range: 'all',
      sponsorship_type: profileData.whatTheySeek.sponsorshipTypes,
      budget: profileData.whatTheySeek.budgetRange,
      marketing_goals: profileData.whatTheySeek.notes || ''
    }
    const { error: brandError } = await supabase
      .from('brands')
      .insert([brandData])
    if (brandError) {
      console.error('Error creating brand:', brandError)
      throw new Error(`Error creating brand: ${brandError.message}`)
    }
  }

  // If it's an organizer, insert into organizers table
  if (profileData.role === 'Organizer') {
    const organizerData = {
      user_id: user.id,
      organizer_name: profileData.name,
      contact_name: profileData.name,
      // Default to profile name
      email: user.email,
      event_name: 'Default Event',
      // These would be updated later
      event_type: profileData.whatTheySeek.eventTypes?.[0] || 'conference',
      event_date: new Date().toISOString().split('T')[0],
      // Today's date as default
      location: 'TBD',
      attendee_count: '100_500',
      // Default value
      audience_description: profileData.description,
      sponsorship_needs: profileData.whatTheySeek.notes || ''
    }
    const { error: organizerError } = await supabase
      .from('organizers')
      .insert([organizerData])
    if (organizerError) {
      console.error('Error creating organizer:', organizerError)
      throw new Error(`Error creating organizer: ${organizerError.message}`)
    }
  }
  return data?.[0]
}

// Get all profiles
export async function getProfiles(): Promise<ProfileOverview[]> {
  const { data, error } = await supabase.from('profile_overview').select('*')
  if (error) {
    console.error('Error fetching profiles:', error)
    throw new Error(`Error fetching profiles: ${error.message}`)
  }
  const rows = (data as ProfileOverviewRow[]) || []
  return rows.map(mapRowToProfile)
}

export async function getProfileOverviewById(
  id: string
): Promise<ProfileOverview | null> {
  const { data, error } = await supabase
    .from('profile_overview')
    .select('*')
    .eq('id', id)
    .maybeSingle<ProfileOverviewRow>()

  if (error) {
    console.error('Error fetching profile overview:', error)
    throw new Error(`Error fetching profile: ${error.message}`)
  }

  return data ? mapRowToProfile(data) : null
}

export async function getProfilesByIds(
  ids: string[]
): Promise<ProfileOverview[]> {
  if (!ids || ids.length === 0) {
    return []
  }

  const { data, error } = await supabase
    .from('profile_overview')
    .select('*')
    .in('id', ids)

  if (error) {
    console.error('Error fetching profiles by ids:', error)
    throw new Error(`Error fetching profiles: ${error.message}`)
  }

  const rows = (data as ProfileOverviewRow[]) || []
  const orderMap = new Map<string, number>()
  ids.forEach((profileId, index) => orderMap.set(profileId, index))

  return rows
    .map(mapRowToProfile)
    .sort(
      (a, b) => (orderMap.get(a.id) ?? Number.MAX_SAFE_INTEGER) - (orderMap.get(b.id) ?? Number.MAX_SAFE_INTEGER)
    )
}

export async function getProfileOverviewByName(
  name: string
): Promise<ProfileOverview | null> {
  if (!name) {
    return null
  }

  const { data, error } = await supabase
    .from('profile_overview')
    .select('*')
    .ilike('name', name)
    .maybeSingle<ProfileOverviewRow>()

  if (error) {
    console.error('Error fetching profile by name:', error)
    throw new Error(`Error fetching profile: ${error.message}`)
  }

  return data ? mapRowToProfile(data) : null
}

// Get profile by ID
export async function getProfileById(id: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()
  if (error) {
    console.error('Error fetching profile:', error)
    throw new Error(`Error fetching profile: ${error.message}`)
  }
  return data
}

// Get profiles by role
export async function getProfilesByRole(role: 'Brand' | 'Organizer') {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', role)
  if (error) {
    console.error('Error fetching profiles by role:', error)
    throw new Error(`Error fetching profiles by role: ${error.message}`)
  }
  return data || []
}

// Update a profile
export async function updateProfile(id: string, updates: Partial<ProfileData>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      name: updates.name,
      logo_url: updates.logoURL,
      description: updates.description,
      updated_at: new Date()
    })
    .eq('id', id)
    .select()
  if (error) {
    console.error('Error updating profile:', error)
    throw new Error(`Error updating profile: ${error.message}`)
  }
  return data?.[0]
}
