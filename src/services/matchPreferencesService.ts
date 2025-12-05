import { supabase } from './supabaseClient'

const MATCH_PREFERENCES_TABLE = 'match_preferences'

export type MatchPreferenceStatus = 'saved' | 'dismissed'

interface MatchPreferenceRow {
  user_id: string
  match_id: string
  status: MatchPreferenceStatus
  created_at: string
  updated_at: string
}

export interface MatchPreferences {
  saved: string[]
  dismissed: string[]
}

export async function getMatchPreferences(
  userId: string
): Promise<MatchPreferences> {
  const { data, error } = await supabase
    .from(MATCH_PREFERENCES_TABLE)
    .select('match_id, status')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(`Failed to load match preferences: ${error.message}`)
  }

  const rows = (data ?? []) as Pick<MatchPreferenceRow, 'match_id' | 'status'>[]

  return rows.reduce<MatchPreferences>(
    (acc, row) => {
      if (row.status === 'saved') {
        acc.saved.push(row.match_id)
      } else if (row.status === 'dismissed') {
        acc.dismissed.push(row.match_id)
      }
      return acc
    },
    { saved: [], dismissed: [] }
  )
}

export async function upsertMatchPreference(
  userId: string,
  matchId: string,
  status: MatchPreferenceStatus
): Promise<void> {
  const payload = {
    user_id: userId,
    match_id: matchId,
    status,
    updated_at: new Date().toISOString()
  }

  const { error } = await supabase
    .from(MATCH_PREFERENCES_TABLE)
    .upsert([payload], { onConflict: 'user_id,match_id' })

  if (error) {
    throw new Error(`Failed to update match preference: ${error.message}`)
  }
}

export async function deleteMatchPreference(
  userId: string,
  matchId: string
): Promise<void> {
  const { error } = await supabase
    .from(MATCH_PREFERENCES_TABLE)
    .delete()
    .eq('user_id', userId)
    .eq('match_id', matchId)

  if (error) {
    throw new Error(`Failed to delete match preference: ${error.message}`)
  }
}
