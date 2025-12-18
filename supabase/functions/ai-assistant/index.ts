// Supabase Edge Function for AI-powered assistance
// Handles intent detection, profile extraction, and LLM interactions
// Keeps AI prompts and business logic server-side

import { corsHeaders } from '../_shared/cors.ts'

interface AIRequest {
  type: 'detect-intent' | 'extract-profile' | 'generate-questions' | 'generate-suggestions'
  input: string
  context?: {
    role?: 'brand' | 'organizer' | 'community'
    draftProfile?: any
    conversation?: Array<{ role: string; content: string; timestamp: string }>
  }
}

// AI prompts (kept server-side for security)
const AI_PROMPTS = {
  intentDetection: `Analyze the user's input and determine if they are:
- A BRAND looking to sponsor events
- An ORGANIZER planning events
- A COMMUNITY member wanting to attend events/test products

Return JSON: { "role": "brand"|"organizer"|"community", "confidence": 0.0-1.0 }`,

  profileExtraction: `Extract structured information from the user's message.
Focus on: name, email, company/event name, dates, locations, budget, audience.
Return JSON with extracted fields.`,

  questionGeneration: `Based on the conversation and missing profile fields, generate a natural follow-up question.
Be conversational and helpful.`,

  suggestionGeneration: `Generate 3 suggestion prompts the user might want to say next.
Make them specific and actionable.`
}

// Detect user intent (brand, organizer, or community)
function detectIntent(input: string): { role: 'brand' | 'organizer' | 'community' | null; confidence: number } {
  const text = input.toLowerCase()

  // Brand signals
  const brandKeywords = ['brand', 'sponsor', 'product', 'company', 'sampling', 'promote', 'marketing', 'sell', 'advertise']
  const brandScore = brandKeywords.filter(k => text.includes(k)).length

  // Organizer signals
  const organizerKeywords = ['event', 'organize', 'festival', 'conference', 'expo', 'hosting', 'venue', 'attendees', 'planning']
  const organizerScore = organizerKeywords.filter(k => text.includes(k)).length

  // Community signals
  const communityKeywords = ['attend', 'participate', 'join', 'test', 'try', 'experience', 'interested in', 'consumer']
  const communityScore = communityKeywords.filter(k => text.includes(k)).length

  const scores = [
    { role: 'brand' as const, score: brandScore },
    { role: 'organizer' as const, score: organizerScore },
    { role: 'community' as const, score: communityScore }
  ]

  scores.sort((a, b) => b.score - a.score)

  if (scores[0].score === 0) {
    return { role: null, confidence: 0 }
  }

  const confidence = scores[0].score > scores[1].score
    ? Math.min(0.5 + (scores[0].score - scores[1].score) * 0.1, 0.95)
    : 0.5

  return { role: scores[0].role, confidence }
}

// Extract profile information from text
function extractProfileInfo(input: string, role: string): any {
  const extracted: any = {}

  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  const emails = input.match(emailRegex)
  if (emails?.[0]) {
    extracted.email = emails[0]
  }

  // Extract phone (basic)
  const phoneRegex = /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g
  const phones = input.match(phoneRegex)
  if (phones?.[0]) {
    extracted.phone = phones[0]
  }

  // Role-specific extraction
  if (role === 'brand') {
    const brandNameRegex = /(?:brand|company|product)(?:\s+name)?(?:\s+is)?\s+([A-Za-z0-9\s]+?)(?:\.|,|\s+and)/i
    const brandMatch = input.match(brandNameRegex)
    if (brandMatch?.[1]) {
      extracted.name = brandMatch[1].trim()
    }
  } else if (role === 'organizer') {
    const eventNameRegex = /(?:event|conference|festival)(?:\s+name)?(?:\s+is)?\s+([A-Za-z0-9\s]+?)(?:\.|,|\s+and)/i
    const eventMatch = input.match(eventNameRegex)
    if (eventMatch?.[1]) {
      extracted.name = eventMatch[1].trim()
    }

    // Extract date
    const dateRegex = /(?:on|at|date|scheduled for)\s+([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/i
    const dateMatch = input.match(dateRegex)
    if (dateMatch?.[1]) {
      if (!extracted.eventDetails) extracted.eventDetails = {}
      extracted.eventDetails.date = dateMatch[1].trim()
    }
  }

  return extracted
}

// Generate follow-up questions
function generateFollowUpQuestions(
  conversation: any[],
  role: string,
  draftProfile: any
): string {
  // Determine missing fields
  const missingFields: string[] = []

  if (role === 'brand') {
    if (!draftProfile?.name) missingFields.push('brand name')
    if (!draftProfile?.email) missingFields.push('email')
    if (!draftProfile?.description) missingFields.push('product description')
    if (!draftProfile?.whatTheySeek?.budgetRange) missingFields.push('budget')
  } else if (role === 'organizer') {
    if (!draftProfile?.name) missingFields.push('event name')
    if (!draftProfile?.email) missingFields.push('email')
    if (!draftProfile?.eventDetails?.date) missingFields.push('event date')
    if (!draftProfile?.eventDetails?.location) missingFields.push('location')
  }

  // Generate appropriate question
  if (missingFields.length > 0) {
    const field = missingFields[0]
    const questions: Record<string, string> = {
      'brand name': 'Great! What is the name of your brand or company?',
      'email': 'Thanks! What email address would you like to use?',
      'product description': 'Can you describe your product or service?',
      'budget': "What's your approximate budget range for sponsorships?",
      'event name': "What's the name of your event?",
      'event date': 'When is your event scheduled?',
      'location': 'Where will your event be held?'
    }
    return questions[field] || 'Tell me more about that.'
  }

  return "Thanks for all that information! Is there anything else you'd like to add?"
}

// Generate suggestions
function generateSuggestions(role: string, draftProfile: any): string[] {
  if (role === 'brand') {
    if (!draftProfile?.name) {
      return ['My brand name is...', 'I represent...', 'Our company is called...']
    }
    if (!draftProfile?.description) {
      return ['Our product is...', 'We sell...', "We're launching..."]
    }
    return ["We're looking for...", 'Our budget is...', 'Our target audience is...']
  } else if (role === 'organizer') {
    if (!draftProfile?.name) {
      return ['My event is called...', "I'm organizing...", 'Our event name is...']
    }
    return ['The event will be on...', "We're expecting... attendees", "We're looking for sponsors who..."]
  }

  return ['Tell me more', 'What else should I know?', "I'm interested in..."]
}

// Main Edge Function handler
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, input, context }: AIRequest = await req.json()

    if (!input) {
      throw new Error('Input is required')
    }

    let result: any

    switch (type) {
      case 'detect-intent':
        result = detectIntent(input)
        break

      case 'extract-profile':
        if (!context?.role) {
          throw new Error('Role is required for profile extraction')
        }
        result = extractProfileInfo(input, context.role)
        break

      case 'generate-questions':
        if (!context?.role || !context?.draftProfile) {
          throw new Error('Role and draftProfile are required')
        }
        result = generateFollowUpQuestions(
          context.conversation || [],
          context.role,
          context.draftProfile
        )
        break

      case 'generate-suggestions':
        if (!context?.role || !context?.draftProfile) {
          throw new Error('Role and draftProfile are required')
        }
        result = generateSuggestions(context.role, context.draftProfile)
        break

      default:
        throw new Error(`Unknown type: ${type}`)
    }

    return new Response(
      JSON.stringify({ success: true, result }),
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

/*
 * TODO: Integrate with real AI/LLM service
 *
 * For production, replace the simple keyword matching with:
 * - OpenAI API for intent detection and NLP
 * - Anthropic Claude for conversational AI
 * - Custom fine-tuned model for your specific use case
 *
 * Example OpenAI integration:
 *
 * const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
 *
 * const response = await fetch('https://api.openai.com/v1/chat/completions', {
 *   method: 'POST',
 *   headers: {
 *     'Authorization': `Bearer ${OPENAI_API_KEY}`,
 *     'Content-Type': 'application/json'
 *   },
 *   body: JSON.stringify({
 *     model: 'gpt-4',
 *     messages: [
 *       { role: 'system', content: AI_PROMPTS.intentDetection },
 *       { role: 'user', content: input }
 *     ]
 *   })
 * })
 */
