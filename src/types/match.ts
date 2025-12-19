// Match type definition
// Matching algorithm is server-side only (see supabase/functions/generate-matches)

export type MatchSource = 'ai' | 'manual' | 'hybrid'

export interface Match {
  id: string
  brandId: string
  organizerId: string
  score: number
  matchReasons: string[]
  createdAt: Date
  status: 'pending' | 'accepted' | 'rejected' | 'inactive'
  matchSource?: MatchSource
}
