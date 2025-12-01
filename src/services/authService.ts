import { supabase } from './supabaseClient'

// Authentication service backed by Supabase
export interface User {
  id: string
  email: string
  type: 'brand' | 'organizer' | 'admin' | 'community'
  name: string
  createdAt?: Date
  password?: string
}

type ProfileRow = {
  id: string
  email: string | null
  name: string | null
  role: string | null
  created_at: string | null
}

const mapTypeToRole = (type: User['type']): 'Brand' | 'Organizer' | 'Admin' => {
  switch (type) {
    case 'organizer':
    case 'community':
      return 'Organizer'
    case 'admin':
      return 'Admin'
    default:
      return 'Brand'
  }
}

const resolveUserType = (
  profileRole?: string | null,
  metadataType?: string | null
): User['type'] => {
  if (
    metadataType === 'brand' ||
    metadataType === 'organizer' ||
    metadataType === 'admin' ||
    metadataType === 'community'
  ) {
    return metadataType
  }

  switch ((profileRole || '').toLowerCase()) {
    case 'organizer':
      return 'organizer'
    case 'admin':
      return 'admin'
    default:
      return 'brand'
  }
}

const mapProfileToUser = (
  profile: ProfileRow,
  fallbackEmail?: string,
  metadataType?: string | null
): User => ({
  id: profile.id,
  email: profile.email ?? fallbackEmail ?? '',
  type: resolveUserType(profile.role, metadataType),
  name: profile.name ?? '',
  createdAt: profile.created_at ? new Date(profile.created_at) : undefined
})

const fetchProfile = async (userId: string): Promise<ProfileRow | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, email, name, role, created_at')
    .eq('id', userId)
    .maybeSingle()

  if (error) {
    console.error('Failed to fetch profile:', error)
    throw new Error(error.message)
  }

  return data ?? null
}

// Sign in a user via Supabase Auth
export const login = async (
  email: string,
  password: string
): Promise<User | null> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) {
    if (error.message.toLowerCase().includes('invalid login')) {
      return null
    }
    console.error('Supabase login error:', error)
    throw new Error(error.message)
  }

  const supabaseUser = data.user
  if (!supabaseUser) {
    return null
  }

  const profile = await fetchProfile(supabaseUser.id)
  if (profile) {
    return mapProfileToUser(
      profile,
      supabaseUser.email ?? email,
      (supabaseUser.user_metadata?.type as string) ?? null
    )
  }

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? email,
    type: resolveUserType(
      (supabaseUser.user_metadata?.role as string) ?? null,
      (supabaseUser.user_metadata?.type as string) ?? null
    ),
    name: (supabaseUser.user_metadata?.name as string) || '',
    createdAt: supabaseUser.created_at
      ? new Date(supabaseUser.created_at)
      : undefined
  }
}

// Register a new user directly in Supabase Auth
export const register = async (
  email: string,
  password: string,
  type: 'brand' | 'organizer' | 'community',
  name: string
): Promise<User> => {
  const supabaseRole = mapTypeToRole(type)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        type,
        role: supabaseRole
      }
    }
  })

  if (error) {
    console.error('Supabase registration error:', error)
    throw new Error(error.message)
  }

  const supabaseUser = data.user
  if (!supabaseUser) {
    throw new Error('Registration failed. No user returned from Supabase.')
  }

  const profile = await fetchProfile(supabaseUser.id)
  if (profile) {
    return mapProfileToUser(profile, supabaseUser.email ?? email, type)
  }

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? email,
    type,
    name,
    createdAt: supabaseUser.created_at
      ? new Date(supabaseUser.created_at)
      : undefined
  }
}

// Get user profile by ID via Supabase
export const getUserById = async (id: string): Promise<User | null> => {
  const profile = await fetchProfile(id)
  if (!profile) {
    return null
  }

  return mapProfileToUser(profile)
}

// Users and seed data are provisioned through Supabase migrations now
export const initializeUsers = (): void => {
  console.info(
    'User initialization is handled via Supabase seed scripts (see database folder).'
  )
}
