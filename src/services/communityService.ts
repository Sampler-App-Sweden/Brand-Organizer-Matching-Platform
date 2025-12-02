import { CommunityMember, CommunityQueryParams } from '../types/community'
import { supabase } from './supabaseClient'

type CommunityMemberRow = {
  id: string
  user_id: string | null
  type: 'brand' | 'organizer'
  name: string
  logo_url: string | null
  short_description: string | null
  description: string | null
  website: string | null
  email: string | null
  phone: string | null
  social_links: string | null
  featured: boolean | null
  date_registered: string | null
}

const COMMUNITY_TABLE = 'community_members'

const mapRowToMember = (row: CommunityMemberRow): CommunityMember => ({
  id: row.id,
  userId: row.user_id ?? '',
  type: row.type,
  name: row.name,
  logoUrl: row.logo_url,
  shortDescription: row.short_description ?? '',
  description: row.description ?? '',
  website: row.website ?? '',
  email: row.email ?? '',
  phone: row.phone ?? '',
  socialLinks: row.social_links ?? '',
  featured: row.featured ?? false,
  dateRegistered: row.date_registered ?? new Date().toISOString()
})

const sanitizeLikeTerm = (value?: string) =>
  (value ?? '').replace(/[%_]/g, '').replace(/'/g, "''").trim()

// Get all community members with pagination and filtering
export const getAllCommunityMembers = async (
  params: CommunityQueryParams = {}
): Promise<{ data: CommunityMember[]; totalPages: number }> => {
  const page = params.page ?? 1
  const limit = params.limit ?? 12

  let query = supabase
    .from(COMMUNITY_TABLE)
    .select('*', { count: 'exact' })
    .order('date_registered', { ascending: false })
    .range((page - 1) * limit, page * limit - 1)

  if (params.type) {
    query = query.eq('type', params.type)
  }

  if (params.featured) {
    query = query.eq('featured', true)
  }

  const applyFuzzyFilter = (column: string, value?: string) => {
    const sanitized = sanitizeLikeTerm(value)
    if (sanitized) {
      query = query.ilike(column, `%${sanitized}%`)
    }
  }

  if (params.search) {
    const search = sanitizeLikeTerm(params.search)
    if (search) {
      query = query.or(
        `name.ilike.%${search}%,short_description.ilike.%${search}%,description.ilike.%${search}%`
      )
    }
  }

  applyFuzzyFilter('short_description', params.category)
  applyFuzzyFilter('description', params.location)
  applyFuzzyFilter('description', params.eventType)
  applyFuzzyFilter('description', params.audienceSize)

  const { data, error, count } = await query

  if (error) {
    throw new Error(`Failed to load community members: ${error.message}`)
  }

  return {
    data: (data as CommunityMemberRow[]).map(mapRowToMember),
    totalPages: Math.max(1, Math.ceil((count ?? 0) / limit))
  }
}

export const getCommunityMembers = async (
  params: CommunityQueryParams = {}
): Promise<CommunityMember[]> => {
  const { data } = await getAllCommunityMembers(params)
  return data
}

export const getCommunityMemberById = async (
  id: string
): Promise<CommunityMember | null> => {
  const { data, error } = await supabase
    .from(COMMUNITY_TABLE)
    .select('*')
    .eq('id', id)
    .maybeSingle<CommunityMemberRow>()

  if (error) {
    throw new Error(`Failed to load community member: ${error.message}`)
  }

  return data ? mapRowToMember(data) : null
}

export const toggleFeatureStatus = async (
  memberId: string,
  featured: boolean
): Promise<void> => {
  const { error } = await supabase
    .from(COMMUNITY_TABLE)
    .update({ featured })
    .eq('id', memberId)

  if (error) {
    throw new Error(`Failed to update feature status: ${error.message}`)
  }
}

export const registerCommunityMember = async (
  memberData: Omit<CommunityMember, 'id' | 'dateRegistered' | 'featured'>
): Promise<CommunityMember> => {
  const payload = {
    user_id: memberData.userId || null,
    type: memberData.type,
    name: memberData.name,
    logo_url: memberData.logoUrl,
    short_description: memberData.shortDescription,
    description: memberData.description,
    website: memberData.website,
    email: memberData.email,
    phone: memberData.phone,
    social_links: memberData.socialLinks,
    featured: false
  }

  const { data, error } = await supabase
    .from(COMMUNITY_TABLE)
    .insert(payload)
    .select('*')
    .single<CommunityMemberRow>()

  if (error) {
    throw new Error(`Failed to register community member: ${error.message}`)
  }

  return mapRowToMember(data)
}

// Saved items still live locally for now
export const toggleSavedMember = (userId: string, memberId: string): void => {
  let savedMembers = JSON.parse(
    localStorage.getItem(`user_${userId}_savedMembers`) || '[]'
  ) as string[]
  if (savedMembers.includes(memberId)) {
    savedMembers = savedMembers.filter((id) => id !== memberId)
  } else {
    savedMembers.push(memberId)
  }
  localStorage.setItem(
    `user_${userId}_savedMembers`,
    JSON.stringify(savedMembers)
  )
}

export const isMemberSaved = (userId: string, memberId: string): boolean => {
  const savedMembers = JSON.parse(
    localStorage.getItem(`user_${userId}_savedMembers`) || '[]'
  ) as string[]
  return savedMembers.includes(memberId)
}

export const getSavedMembers = async (
  userId: string
): Promise<CommunityMember[]> => {
  const savedMemberIds = JSON.parse(
    localStorage.getItem(`user_${userId}_savedMembers`) || '[]'
  ) as string[]

  if (!savedMemberIds.length) return []

  const { data, error } = await supabase
    .from(COMMUNITY_TABLE)
    .select('*')
    .in('id', savedMemberIds)

  if (error) {
    throw new Error(`Failed to load saved members: ${error.message}`)
  }

  const orderMap = new Map<string, number>()
  savedMemberIds.forEach((id, index) => orderMap.set(id, index))

  return (data as CommunityMemberRow[])
    .map(mapRowToMember)
    .sort((a, b) => (orderMap.get(a.id) ?? 0) - (orderMap.get(b.id) ?? 0))
}

// Simple placeholder matches until matching service is wired up for the directory
export const getMemberMatches = (
  memberId: string,
  memberType: 'brand' | 'organizer'
) => {
  const brandMatches = [
    {
      id: `${memberId}-m1`,
      name: 'Stockholm Wellness Festival',
      date: 'May 18'
    },
    { id: `${memberId}-m2`, name: 'Urban Wellness Week', date: 'June 02' }
  ]

  const organizerMatches = [
    { id: `${memberId}-m1`, name: 'EcoRefresh Beverages', date: 'May 30' },
    { id: `${memberId}-m2`, name: 'PlantPulse Snacks', date: 'June 07' }
  ]

  const pool = memberType === 'brand' ? brandMatches : organizerMatches
  const matchCount = Math.floor(Math.random() * (pool.length + 1))
  return pool.slice(0, matchCount)
}
