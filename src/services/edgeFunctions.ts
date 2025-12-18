// Helper service for calling Supabase Edge Functions
import { supabase } from './supabaseClient'

/**
 * Generate matches for a brand or organizer
 */
export const generateMatches = async (
  type: 'brand' | 'organizer',
  entityId: string
): Promise<{ success: boolean; matchCount: number; matches: any[] }> => {
  const { data, error } = await supabase.functions.invoke('generate-matches', {
    body: { type, entityId }
  })

  if (error) {
    console.error('Error calling generate-matches function:', error)
    throw error
  }

  return data
}

/**
 * Send an email using templates
 */
export const sendEmail = async (params: {
  to: string
  subject: string
  template: 'welcome' | 'new_match' | 'match_accepted' | 'support_ticket' | 'custom'
  data?: Record<string, any>
  html?: string
}): Promise<{ success: boolean; emailId?: string; message: string }> => {
  const { data, error } = await supabase.functions.invoke('send-email', {
    body: params
  })

  if (error) {
    console.error('Error calling send-email function:', error)
    throw error
  }

  return data
}

/**
 * Process a payment (Stripe integration)
 */
export const processPayment = async (params: {
  amount: number // in cents
  currency: string
  userId: string
  description: string
  metadata?: Record<string, any>
}): Promise<{
  success: boolean
  paymentIntentId?: string
  clientSecret?: string
  status?: string
  message?: string
}> => {
  const { data, error } = await supabase.functions.invoke('process-payment', {
    body: params
  })

  if (error) {
    console.error('Error calling process-payment function:', error)
    throw error
  }

  return data
}
