// Supabase Edge Function for analytics tracking
// Securely tracks user events, errors, and metrics server-side
// Sanitizes PII and integrates with analytics providers

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

interface AnalyticsEvent {
  event: string
  userId?: string
  sessionId?: string
  properties?: Record<string, any>
  timestamp?: string
}

interface ErrorEvent {
  type: string
  message: string
  stack?: string
  userId?: string
  metadata?: Record<string, any>
  timestamp?: string
}

// Sanitize PII from event data
function sanitizeData(data: any): any {
  if (!data || typeof data !== 'object') return data

  const sanitized = { ...data }
  const piiFields = ['password', 'ssn', 'credit_card', 'api_key', 'secret', 'token']

  for (const key in sanitized) {
    // Check if field name indicates PII
    if (piiFields.some(pii => key.toLowerCase().includes(pii))) {
      sanitized[key] = '[REDACTED]'
      continue
    }

    // Recursively sanitize nested objects
    if (typeof sanitized[key] === 'object') {
      sanitized[key] = sanitizeData(sanitized[key])
    }

    // Sanitize email to hash
    if (key === 'email' && typeof sanitized[key] === 'string') {
      // Keep domain but hash local part for privacy
      const email = sanitized[key]
      const [local, domain] = email.split('@')
      if (local && domain) {
        sanitized[key] = `${hashString(local)}@${domain}`
      }
    }
  }

  return sanitized
}

// Simple hash function for anonymization
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 16)
}

// Get user IP for geolocation (anonymized)
function getAnonymizedIP(req: Request): string {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
              req.headers.get('x-real-ip') ||
              'unknown'

  // Anonymize IP by removing last octet
  const parts = ip.split('.')
  if (parts.length === 4) {
    return `${parts[0]}.${parts[1]}.${parts[2]}.0`
  }
  return 'unknown'
}

// Get user agent info
function getUserAgentInfo(req: Request): any {
  const ua = req.headers.get('user-agent') || ''

  return {
    browser: extractBrowser(ua),
    os: extractOS(ua),
    device: extractDevice(ua),
    mobile: /mobile/i.test(ua)
  }
}

function extractBrowser(ua: string): string {
  if (/chrome/i.test(ua)) return 'Chrome'
  if (/firefox/i.test(ua)) return 'Firefox'
  if (/safari/i.test(ua)) return 'Safari'
  if (/edge/i.test(ua)) return 'Edge'
  return 'Unknown'
}

function extractOS(ua: string): string {
  if (/windows/i.test(ua)) return 'Windows'
  if (/mac/i.test(ua)) return 'macOS'
  if (/linux/i.test(ua)) return 'Linux'
  if (/android/i.test(ua)) return 'Android'
  if (/ios|iphone|ipad/i.test(ua)) return 'iOS'
  return 'Unknown'
}

function extractDevice(ua: string): string {
  if (/mobile/i.test(ua)) return 'Mobile'
  if (/tablet|ipad/i.test(ua)) return 'Tablet'
  return 'Desktop'
}

// Main Edge Function handler
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const eventType = body.type || 'event'

    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    if (eventType === 'event') {
      // Track analytics event
      const event: AnalyticsEvent = body.data

      // Sanitize event data
      const sanitizedProperties = sanitizeData(event.properties || {})

      // Get context data
      const context = {
        ip: getAnonymizedIP(req),
        userAgent: getUserAgentInfo(req),
        timestamp: event.timestamp || new Date().toISOString()
      }

      // Store in database
      const { error } = await supabaseClient.from('analytics_events').insert({
        event_name: event.event,
        user_id: event.userId || null,
        session_id: event.sessionId || null,
        properties: sanitizedProperties,
        context: context,
        created_at: context.timestamp
      })

      if (error) {
        console.error('Failed to store analytics event:', error)
        // Don't fail the request, just log it
      }

      // TODO: Send to external analytics service (optional)
      const ANALYTICS_SERVICE_KEY = Deno.env.get('ANALYTICS_SERVICE_KEY')

      if (ANALYTICS_SERVICE_KEY) {
        // Example: Send to PostHog, Mixpanel, Amplitude, etc.
        /*
        await fetch('https://analytics-service.com/track', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${ANALYTICS_SERVICE_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            event: event.event,
            userId: event.userId,
            properties: sanitizedProperties,
            context: context
          })
        })
        */
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Event tracked' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    } else if (eventType === 'error') {
      // Track error event
      const error: ErrorEvent = body.data

      // Sanitize error data
      const sanitizedMetadata = sanitizeData(error.metadata || {})

      // Get context
      const context = {
        ip: getAnonymizedIP(req),
        userAgent: getUserAgentInfo(req),
        timestamp: error.timestamp || new Date().toISOString()
      }

      // Store in database
      const { error: dbError } = await supabaseClient.from('error_logs').insert({
        error_type: error.type,
        error_message: error.message,
        stack_trace: error.stack || null,
        user_id: error.userId || null,
        metadata: sanitizedMetadata,
        context: context,
        created_at: context.timestamp
      })

      if (dbError) {
        console.error('Failed to store error event:', dbError)
      }

      // TODO: Send to error tracking service (Sentry, Rollbar, etc.)
      const SENTRY_DSN = Deno.env.get('SENTRY_DSN')

      if (SENTRY_DSN) {
        // Send to Sentry
        /*
        await fetch('https://sentry.io/api/...', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: error.message,
            level: 'error',
            exception: { type: error.type, value: error.message }
          })
        })
        */
      }

      return new Response(
        JSON.stringify({ success: true, message: 'Error tracked' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    } else {
      throw new Error(`Unknown event type: ${eventType}`)
    }
  } catch (error) {
    console.error('Analytics tracking error:', error)

    // Don't fail analytics tracking - return success to not break the app
    return new Response(
      JSON.stringify({ success: true, message: 'Event received (degraded)' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  }
})

/*
 * Database Schema Required:
 *
 * CREATE TABLE analytics_events (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   event_name TEXT NOT NULL,
 *   user_id UUID REFERENCES auth.users(id),
 *   session_id TEXT,
 *   properties JSONB,
 *   context JSONB,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
 * );
 *
 * CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
 * CREATE INDEX idx_analytics_events_event ON analytics_events(event_name);
 * CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);
 *
 * CREATE TABLE error_logs (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   error_type TEXT NOT NULL,
 *   error_message TEXT NOT NULL,
 *   stack_trace TEXT,
 *   user_id UUID REFERENCES auth.users(id),
 *   metadata JSONB,
 *   context JSONB,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
 * );
 *
 * CREATE INDEX idx_error_logs_user ON error_logs(user_id);
 * CREATE INDEX idx_error_logs_type ON error_logs(error_type);
 * CREATE INDEX idx_error_logs_created ON error_logs(created_at DESC);
 */
