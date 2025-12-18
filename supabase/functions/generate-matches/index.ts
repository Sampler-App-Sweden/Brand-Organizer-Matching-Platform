// Supabase Edge Function for generating matches
// This runs on the server to keep the matching algorithm private and secure

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

// Types
interface Brand {
  id: string
  user_id: string
  company_name: string
  target_audience: string
  age_range: string
  industry: string
  sponsorship_type: string[]
  marketing_goals: string
  budget: string
}

interface Organizer {
  id: string
  user_id: string
  organizer_name: string
  event_type: string
  audience_description: string
  audience_demographics: string[]
  attendee_count: string
  offering_types: string[]
  sponsorship_needs: string
}

interface MatchScore {
  score: number
  reasons: string[]
}

// Calculate match score between a brand and an organizer
function calculateMatchScore(brand: Brand, organizer: Organizer): MatchScore {
  let score = 0
  const reasons: string[] = []

  // Target audience matching
  if (
    brand.target_audience &&
    organizer.audience_description &&
    hasKeywordMatch(brand.target_audience, organizer.audience_description)
  ) {
    score += 20
    reasons.push('Audience alignment')
  }

  // Age demographics matching
  if (
    brand.age_range &&
    organizer.audience_demographics &&
    hasAgeRangeOverlap(brand.age_range, organizer.audience_demographics)
  ) {
    score += 15
    reasons.push('Demographic fit')
  }

  // Industry relevance
  if (
    brand.industry &&
    organizer.event_type &&
    isIndustryRelevant(brand.industry, organizer.event_type)
  ) {
    score += 15
    reasons.push('Industry relevance')
  }

  // Marketing goals alignment with event offerings
  if (
    brand.marketing_goals &&
    organizer.offering_types &&
    hasMarketingGoalMatch(brand.marketing_goals, organizer.offering_types)
  ) {
    score += 25
    reasons.push('Marketing goals alignment')
  }

  // Budget appropriateness for event size
  if (
    brand.budget &&
    organizer.attendee_count &&
    isBudgetAppropriate(brand.budget, organizer.attendee_count)
  ) {
    score += 15
    reasons.push('Budget fit')
  }

  // Sponsorship type match
  if (
    brand.sponsorship_type &&
    organizer.sponsorship_needs &&
    hasSponsorshipTypeMatch(brand.sponsorship_type, organizer.sponsorship_needs)
  ) {
    score += 10
    reasons.push('Sponsorship type alignment')
  }

  return { score, reasons }
}

// Helper functions
const commonWords = [
  'and', 'the', 'for', 'with', 'that', 'this', 'have', 'from',
  'they', 'will', 'would', 'about', 'there', 'their'
]

function hasKeywordMatch(text1: string, text2: string): boolean {
  const keywords1 = text1.toLowerCase().split(/\s+/)
  const keywords2 = text2.toLowerCase().split(/\s+/)
  return keywords1.some(
    (word) =>
      keywords2.includes(word) && word.length > 3 && !commonWords.includes(word)
  )
}

function hasAgeRangeOverlap(
  brandAgeRange: string | string[],
  organizerDemographics: string | string[]
): boolean {
  const brandAges = Array.isArray(brandAgeRange) ? brandAgeRange : [brandAgeRange]
  const organizerAges = Array.isArray(organizerDemographics)
    ? organizerDemographics
    : [organizerDemographics]

  if (brandAges.includes('all') || organizerAges.includes('all')) {
    return true
  }

  return brandAges.some((bAge) => organizerAges.includes(bAge))
}

function isIndustryRelevant(industry: string, eventType: string): boolean {
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

function hasMarketingGoalMatch(goals: string, offerings: string[]): boolean {
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

function isBudgetAppropriate(budget: string, attendeeCount: string): boolean {
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
  const budgetPerAttendee = budgetValue / attendeeValue

  return budgetPerAttendee >= 5 && budgetPerAttendee <= 50
}

function hasSponsorshipTypeMatch(
  brandTypes: string[],
  organizerNeeds: string
): boolean {
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

// Main Edge Function handler
Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, entityId } = await req.json()

    // Create Supabase client with service role (has full access)
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    let matches: any[] = []

    if (type === 'brand') {
      // Fetch the brand
      const { data: brand, error: brandError } = await supabaseClient
        .from('brands')
        .select('*')
        .eq('id', entityId)
        .single()

      if (brandError) throw brandError

      // Fetch all organizers
      const { data: organizers, error: organizersError } = await supabaseClient
        .from('organizers')
        .select('*')

      if (organizersError) throw organizersError

      // Calculate matches
      matches = organizers
        .map((organizer: Organizer) => {
          const { score, reasons } = calculateMatchScore(brand, organizer)
          if (score < 50) return null

          return {
            brand_id: brand.id,
            organizer_id: organizer.id,
            score,
            match_reasons: reasons,
            status: 'pending'
          }
        })
        .filter(Boolean)
    } else if (type === 'organizer') {
      // Fetch the organizer
      const { data: organizer, error: organizerError } = await supabaseClient
        .from('organizers')
        .select('*')
        .eq('id', entityId)
        .single()

      if (organizerError) throw organizerError

      // Fetch all brands
      const { data: brands, error: brandsError } = await supabaseClient
        .from('brands')
        .select('*')

      if (brandsError) throw brandsError

      // Calculate matches
      matches = brands
        .map((brand: Brand) => {
          const { score, reasons } = calculateMatchScore(brand, organizer)
          if (score < 50) return null

          return {
            brand_id: brand.id,
            organizer_id: organizer.id,
            score,
            match_reasons: reasons,
            status: 'pending'
          }
        })
        .filter(Boolean)
    } else {
      throw new Error('Invalid type. Must be "brand" or "organizer"')
    }

    // Insert matches into database
    if (matches.length > 0) {
      const { error: insertError } = await supabaseClient
        .from('matches')
        .insert(matches)

      if (insertError) throw insertError
    }

    return new Response(
      JSON.stringify({
        success: true,
        matchCount: matches.length,
        matches
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
