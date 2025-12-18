import { Match } from './match'

export type MatchView = 'confirmed' | 'suggested'
export type DisplayMode = 'grid' | 'list'

export interface EnhancedMatch extends Match {
  brandName: string
  brandLogo?: string
  organizerName: string
  organizerLogo?: string
  eventName: string
  productName: string
  matchCriteria: string[]
}
