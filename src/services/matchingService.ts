import type { Brand, Organizer } from './dataService'

// This service handles the AI matching logic between brands and organizers
type MatchScore = {
  score: number
  reasons: string[]
}
export interface Match {
  id: string
  brandId: string
  organizerId: string
  score: number
  matchReasons: string[]
  createdAt: Date
  status: 'pending' | 'accepted' | 'rejected'
}

// Calculate match score between a brand and an organizer
export const calculateMatchScore = (
  brand: Brand,
  organizer: Organizer
): MatchScore => {
  let score = 0
  const reasons: string[] = []
  // Target audience matching
  if (
    brand.targetAudience &&
    organizer.audienceDescription &&
    hasKeywordMatch(brand.targetAudience, organizer.audienceDescription)
  ) {
    score += 20
    reasons.push('Audience alignment')
  }
  // Age demographics matching
  if (
    brand.ageRange &&
    organizer.audienceDemographics &&
    hasAgeRangeOverlap(brand.ageRange, organizer.audienceDemographics)
  ) {
    score += 15
    reasons.push('Demographic fit')
  }
  // Industry relevance
  if (
    brand.industry &&
    organizer.eventType &&
    isIndustryRelevant(brand.industry, organizer.eventType)
  ) {
    score += 15
    reasons.push('Industry relevance')
  }
  // Marketing goals alignment with event offerings
  if (
    brand.marketingGoals &&
    organizer.offeringTypes &&
    hasMarketingGoalMatch(brand.marketingGoals, organizer.offeringTypes)
  ) {
    score += 25
    reasons.push('Marketing goals alignment')
  }
  // Budget appropriateness for event size
  if (
    brand.budget &&
    organizer.attendeeCount &&
    isBudgetAppropriate(brand.budget, organizer.attendeeCount)
  ) {
    score += 15
    reasons.push('Budget fit')
  }
  // Sponsorship type match
  if (
    brand.sponsorshipType &&
    organizer.sponsorshipNeeds &&
    hasSponsorshipTypeMatch(brand.sponsorshipType, organizer.sponsorshipNeeds)
  ) {
    score += 10
    reasons.push('Sponsorship type alignment')
  }
  return {
    score,
    reasons
  }
}

// Helper functions for matching logic
const hasKeywordMatch = (text1: string, text2: string): boolean => {
  // In a real implementation, this would use NLP to find semantic matches
  // For now, we'll do a simple keyword matching
  const keywords1 = text1.toLowerCase().split(/\s+/)
  const keywords2 = text2.toLowerCase().split(/\s+/)
  return keywords1.some(
    (word) =>
      keywords2.includes(word) && word.length > 3 && !commonWords.includes(word)
  )
}
const hasAgeRangeOverlap = (
  brandAgeRange: string | string[],
  organizerDemographics: string | string[]
): boolean => {
  const brandAges = Array.isArray(brandAgeRange)
    ? brandAgeRange
    : [brandAgeRange]
  const organizerAges = Array.isArray(organizerDemographics)
    ? organizerDemographics
    : [organizerDemographics]
  // If either contains 'all', it's a match
  if (brandAges.includes('all') || organizerAges.includes('all')) {
    return true
  }
  // Check for overlaps
  return brandAges.some((bAge) => organizerAges.includes(bAge))
}

const isIndustryRelevant = (industry: string, eventType: string): boolean => {
  // Industry-event type relevance mapping (simplified)
  const relevanceMap: Record<string, string[]> = {
    food_beverage: ['festival', 'community', 'sports', 'concert'],
    beauty_cosmetics: ['expo', 'festival', 'networking'],
    health_wellness: ['expo', 'workshop', 'sports', 'community'],
    tech: ['conference', 'expo', 'workshop', 'networking'],
    fashion: ['expo', 'festival', 'networking'],
    home_goods: ['expo', 'community'],
    sports_fitness: ['sports', 'community', 'festival'],
    entertainment: ['concert', 'festival', 'community']
  }
  return relevanceMap[industry]?.includes(eventType) || false
}

const hasMarketingGoalMatch = (goals: string, offerings: string[]): boolean => {
  // Simple keyword matching between goals and offerings
  const goalKeywords = goals.toLowerCase().split(/\s+/)
  const offeringKeywords: Record<string, string[]> = {
    brand_visibility: ['awareness', 'visibility', 'exposure', 'brand'],
    content_creation: ['content', 'social', 'media', 'video', 'photo'],
    lead_generation: ['leads', 'contacts', 'prospects', 'customers'],
    product_sampling: ['sample', 'try', 'test', 'experience'],
    product_feedback: ['feedback', 'review', 'opinion', 'improve']
  }
  return offerings.some((offering) => {
    const keywords = offeringKeywords[offering] || []
    return goalKeywords.some((goal) => keywords.includes(goal))
  })
}

const isBudgetAppropriate = (
  budget: string,
  attendeeCount: string
): boolean => {
  const budgetRanges: Record<string, number> = {
    under_1000: 1000,
    '1000_5000': 5000,
    '5000_10000': 10000,
    '10000_25000': 25000,
    '25000_plus': 50000
  }

  const attendeeRanges: Record<string, number> = {
    under_100: 100,
    '100_500': 500,
    '500_1000': 1000,
    '1000_5000': 5000,
    '5000_plus': 10000
  }
  const budgetValue = budgetRanges[budget] || 0
  const attendeeValue = attendeeRanges[attendeeCount] || 0
  // Simple heuristic: budget should scale with attendee count
  const budgetPerAttendee = budgetValue / attendeeValue
  return budgetPerAttendee >= 5 && budgetPerAttendee <= 50
}

const hasSponsorshipTypeMatch = (
  brandTypes: string[],
  organizerNeeds: string
): boolean => {
  const typeKeywords: Record<string, string[]> = {
    product_sampling: ['sample', 'product', 'try', 'give', 'distribute'],
    financial_sponsorship: ['money', 'cash', 'fund', 'financial', 'payment'],
    in_kind_goods: ['provide', 'goods', 'items', 'supplies'],
    merchandise: ['merch', 'swag', 'giveaway', 't-shirt', 'product'],
    experience: ['experience', 'activity', 'interactive', 'engage']
  }
  return brandTypes.some((type) => {
    const keywords = typeKeywords[type] || []
    return keywords.some((keyword) =>
      organizerNeeds.toLowerCase().includes(keyword)
    )
  })
}

// Common words to ignore in matching
const commonWords = [
  'and',
  'the',
  'for',
  'with',
  'that',
  'this',
  'have',
  'from',
  'they',
  'will',
  'would',
  'about',
  'there',
  'their',
  'what',
  'when',
  'make',
  'like',
  'time',
  'just',
  'know',
  'people',
  'year',
  'your',
  'good',
  'some',
  'could',
  'them',
  'than',
  'then',
  'look',
  'only',
  'come',
  'over',
  'think',
  'also',
  'back',
  'after',
  'work',
  'first',
  'well',
  'even',
  'want',
  'because',
  'these',
  'give'
]

// Function to find matches for a brand
export const findMatchesForBrand = (
  brand: Brand,
  organizers: Organizer[]
): Match[] => {
  return organizers
    .map((organizer) => {
      const { score, reasons } = calculateMatchScore(brand, organizer)
      // Only consider matches above a certain threshold
      if (score < 50) return null
      return {
        id: `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        brandId: brand.id,
        organizerId: organizer.id,
        score,
        matchReasons: reasons,
        createdAt: new Date(),
        status: 'pending'
      }
    })
    .filter(Boolean) as Match[]
}

// Function to find matches for an organizer
export const findMatchesForOrganizer = (
  organizer: Organizer,
  brands: Brand[]
): Match[] => {
  return brands
    .map((brand) => {
      const { score, reasons } = calculateMatchScore(brand, organizer)
      // Only consider matches above a certain threshold
      if (score < 50) return null
      return {
        id: `match-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        brandId: brand.id,
        organizerId: organizer.id,
        score,
        matchReasons: reasons,
        createdAt: new Date(),
        status: 'pending'
      }
    })
    .filter(Boolean) as Match[]
}
