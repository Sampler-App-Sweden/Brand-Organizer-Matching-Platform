import { getProfilesByIds, ProfileOverview } from './profileService'
import { supabase } from './supabaseClient'

const SAVED_PROFILES_TABLE = 'saved_profiles'

type SavedProfileRow = {
  user_id: string
  profile_id: string
  created_at: string
}

export const getSavedProfileIds = async (
  userId: string
): Promise<string[]> => {
  const { data, error } = await supabase
    .from(SAVED_PROFILES_TABLE)
    .select('profile_id')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to load saved profiles: ${error.message}`)
  }

  return (data as Pick<SavedProfileRow, 'profile_id'>[]).map(
    (row) => row.profile_id
  )
}

export const getSavedProfiles = async (
  userId: string
): Promise<ProfileOverview[]> => {
  const ids = await getSavedProfileIds(userId)
  return getProfilesByIds(ids)
}

export const isProfileSaved = async (
  userId: string,
  profileId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from(SAVED_PROFILES_TABLE)
    .select('profile_id')
    .eq('user_id', userId)
    .eq('profile_id', profileId)
    .maybeSingle<Pick<SavedProfileRow, 'profile_id'>>()

  if (error) {
    throw new Error(`Failed to check saved profile: ${error.message}`)
  }

  return Boolean(data)
}

export const toggleSavedProfile = async (
  userId: string,
  profileId: string
): Promise<boolean> => {
  const { data, error } = await supabase
    .from(SAVED_PROFILES_TABLE)
    .select('profile_id')
    .eq('user_id', userId)
    .eq('profile_id', profileId)
    .maybeSingle<Pick<SavedProfileRow, 'profile_id'>>()

  if (error) {
    throw new Error(`Failed to toggle saved profile: ${error.message}`)
  }

  if (data) {
    const { error: deleteError } = await supabase
      .from(SAVED_PROFILES_TABLE)
      .delete()
      .eq('user_id', userId)
      .eq('profile_id', profileId)

    if (deleteError) {
      throw new Error(`Failed to remove saved profile: ${deleteError.message}`)
    }

    return false
  }

  const { error: insertError } = await supabase
    .from(SAVED_PROFILES_TABLE)
    .insert({ user_id: userId, profile_id: profileId })

  if (insertError) {
    throw new Error(`Failed to save profile: ${insertError.message}`)
  }

  return true
}
