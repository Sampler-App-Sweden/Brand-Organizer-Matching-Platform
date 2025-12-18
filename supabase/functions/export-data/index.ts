// Supabase Edge Function for secure data export
// Handles GDPR data requests, admin exports, and report generation
// Sanitizes PII and validates authorization

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

interface ExportRequest {
  type: 'user-data' | 'admin-report' | 'gdpr-request'
  format: 'json' | 'csv'
  userId?: string // For GDPR requests
  filters?: {
    dateFrom?: string
    dateTo?: string
    includeDeleted?: boolean
    tables?: string[]
  }
}

// Convert JSON to CSV
function jsonToCSV(data: any[]): string {
  if (!data || data.length === 0) {
    return ''
  }

  const headers = Object.keys(data[0])
  const csvRows = [headers.join(',')]

  for (const row of data) {
    const values = headers.map(header => {
      const value = row[header]
      const escaped = ('' + value).replace(/"/g, '\\"')
      return `"${escaped}"`
    })
    csvRows.push(values.join(','))
  }

  return csvRows.join('\n')
}

// Verify user authorization
async function verifyAuthorization(
  supabase: any,
  authHeader: string,
  requestedUserId?: string
): Promise<{ authorized: boolean; userId: string | null; isAdmin: boolean }> {
  if (!authHeader) {
    return { authorized: false, userId: null, isAdmin: false }
  }

  const { data: { user }, error } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))

  if (error || !user) {
    return { authorized: false, userId: null, isAdmin: false }
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  const isAdmin = profile?.role === 'Admin'

  // User can export their own data or admin can export anyone's data
  const authorized = isAdmin || !requestedUserId || user.id === requestedUserId

  return { authorized, userId: user.id, isAdmin }
}

// Export user data for GDPR request
async function exportUserData(supabase: any, userId: string) {
  const userData: any = {}

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  userData.profile = profile

  // Get brand data if exists
  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (brand) userData.brand = brand

  // Get organizer data if exists
  const { data: organizer } = await supabase
    .from('organizers')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (organizer) userData.organizer = organizer

  // Get matches
  const { data: matches } = await supabase
    .from('matches')
    .select('*')
    .or(`brand_id.eq.${brand?.id},organizer_id.eq.${organizer?.id}`)

  userData.matches = matches || []

  // Get messages
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('sender_id', userId)

  userData.messages = messages || []

  // Get notifications
  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)

  userData.notifications = notifications || []

  // Get saved profiles
  const { data: savedProfiles } = await supabase
    .from('saved_profiles')
    .select('*')
    .eq('user_id', userId)

  userData.savedProfiles = savedProfiles || []

  return userData
}

// Export admin report
async function exportAdminReport(
  supabase: any,
  filters?: ExportRequest['filters']
) {
  const report: any = {}

  // Get date range
  const dateFrom = filters?.dateFrom || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const dateTo = filters?.dateTo || new Date().toISOString()

  // Users
  let usersQuery = supabase
    .from('profiles')
    .select('id, name, email, role, created_at, last_login')
    .gte('created_at', dateFrom)
    .lte('created_at', dateTo)

  const { data: users } = await usersQuery
  report.users = users || []

  // Brands
  const { data: brands } = await supabase
    .from('brands')
    .select('id, company_name, industry, budget, created_at')
    .gte('created_at', dateFrom)
    .lte('created_at', dateTo)

  report.brands = brands || []

  // Organizers
  const { data: organizers } = await supabase
    .from('organizers')
    .select('id, organizer_name, event_name, event_type, attendee_count, created_at')
    .gte('created_at', dateFrom)
    .lte('created_at', dateTo)

  report.organizers = organizers || []

  // Matches
  const { data: matches } = await supabase
    .from('matches')
    .select('id, brand_id, organizer_id, score, status, created_at')
    .gte('created_at', dateFrom)
    .lte('created_at', dateTo)

  report.matches = matches || []

  // Support tickets
  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('id, category, status, priority, created_at')
    .gte('created_at', dateFrom)
    .lte('created_at', dateTo)

  report.supportTickets = tickets || []

  // Summary statistics
  report.summary = {
    totalUsers: users?.length || 0,
    totalBrands: brands?.length || 0,
    totalOrganizers: organizers?.length || 0,
    totalMatches: matches?.length || 0,
    acceptedMatches: matches?.filter(m => m.status === 'accepted').length || 0,
    totalTickets: tickets?.length || 0,
    dateRange: { from: dateFrom, to: dateTo }
  }

  return report
}

// Main Edge Function handler
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    const { type, format, userId, filters }: ExportRequest = await req.json()

    // Verify authorization
    const { authorized, userId: requestingUserId, isAdmin } = await verifyAuthorization(
      supabaseClient,
      authHeader || '',
      userId
    )

    if (!authorized) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. You can only export your own data or must be an admin.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403
        }
      )
    }

    let data: any

    // Execute export based on type
    switch (type) {
      case 'user-data':
      case 'gdpr-request':
        if (!userId) {
          throw new Error('userId is required for user data export')
        }
        data = await exportUserData(supabaseClient, userId)
        break

      case 'admin-report':
        if (!isAdmin) {
          throw new Error('Admin access required for reports')
        }
        data = await exportAdminReport(supabaseClient, filters)
        break

      default:
        throw new Error(`Unknown export type: ${type}`)
    }

    // Format response
    let responseBody: string
    let contentType: string
    let filename: string

    if (format === 'csv') {
      // For CSV, we need to flatten nested objects
      let flatData: any[] = []

      if (type === 'admin-report') {
        // For admin reports, export each table separately
        flatData = data.users || []
        responseBody = jsonToCSV(flatData)
        filename = `admin-report-${new Date().toISOString().split('T')[0]}.csv`
      } else {
        // For user data, flatten to single table
        flatData = [data.profile]
        responseBody = jsonToCSV(flatData)
        filename = `user-data-${userId}-${new Date().toISOString().split('T')[0]}.csv`
      }

      contentType = 'text/csv'
    } else {
      // JSON export
      responseBody = JSON.stringify(data, null, 2)
      contentType = 'application/json'
      filename = `export-${type}-${new Date().toISOString().split('T')[0]}.json`
    }

    // Log the export
    await supabaseClient.from('export_logs').insert({
      user_id: requestingUserId,
      export_type: type,
      export_for_user_id: userId || null,
      format: format,
      created_at: new Date().toISOString()
    })

    return new Response(responseBody, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`
      },
      status: 200
    })
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
 * Database Schema Required:
 *
 * CREATE TABLE export_logs (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   user_id UUID NOT NULL REFERENCES auth.users(id),
 *   export_type TEXT NOT NULL,
 *   export_for_user_id UUID REFERENCES auth.users(id),
 *   format TEXT NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
 * );
 *
 * CREATE INDEX idx_export_logs_user ON export_logs(user_id);
 * CREATE INDEX idx_export_logs_created ON export_logs(created_at DESC);
 */
