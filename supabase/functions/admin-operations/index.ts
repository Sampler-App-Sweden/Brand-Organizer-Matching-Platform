// Supabase Edge Function for admin operations
// Handles sensitive admin tasks with proper authorization
// Actions: user management, bulk operations, system configuration

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'
import { corsHeaders } from '../_shared/cors.ts'

interface AdminRequest {
  action: 'get-users' | 'update-user-role' | 'delete-user' | 'ban-user' |
          'bulk-delete' | 'get-stats' | 'purge-old-data' | 'backup-data'
  data?: Record<string, any>
}

// Verify user is admin
async function verifyAdmin(supabase: any, authHeader: string): Promise<{ isAdmin: boolean; userId: string | null }> {
  if (!authHeader) {
    return { isAdmin: false, userId: null }
  }

  // Get user from JWT
  const { data: { user }, error } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''))

  if (error || !user) {
    return { isAdmin: false, userId: null }
  }

  // Check if user has admin role
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profileError || !profile) {
    return { isAdmin: false, userId: user.id }
  }

  return {
    isAdmin: profile.role === 'Admin',
    userId: user.id
  }
}

// Log admin action for audit trail
async function logAdminAction(
  supabase: any,
  adminId: string,
  action: string,
  details: any
) {
  await supabase.from('admin_audit_log').insert({
    admin_id: adminId,
    action: action,
    details: details,
    timestamp: new Date().toISOString()
  })
}

// Get all users with filtering
async function getUsers(supabase: any, filters?: any) {
  let query = supabase
    .from('profiles')
    .select(`
      id,
      name,
      email,
      role,
      created_at,
      last_login,
      status
    `)
    .order('created_at', { ascending: false })

  if (filters?.role) {
    query = query.eq('role', filters.role)
  }

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  if (filters?.search) {
    query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
  }

  const { data, error } = await query

  if (error) throw error

  return data
}

// Update user role
async function updateUserRole(
  supabase: any,
  userId: string,
  newRole: 'Admin' | 'Brand' | 'Organizer'
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: newRole, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error

  return data
}

// Soft delete user (set status to inactive)
async function deleteUser(supabase: any, userId: string, hardDelete: boolean = false) {
  if (hardDelete) {
    // Hard delete - remove all user data (use with caution)
    // This should be a multi-step process with backups

    // 1. Delete related data
    await supabase.from('brands').delete().eq('user_id', userId)
    await supabase.from('organizers').delete().eq('user_id', userId)
    await supabase.from('messages').delete().eq('sender_id', userId)

    // 2. Delete profile
    const { error } = await supabase.from('profiles').delete().eq('id', userId)
    if (error) throw error

    // 3. Delete auth user
    const { error: authError } = await supabase.auth.admin.deleteUser(userId)
    if (authError) throw authError

    return { deleted: true, type: 'hard' }
  } else {
    // Soft delete - just mark as inactive
    const { error } = await supabase
      .from('profiles')
      .update({
        status: 'inactive',
        deactivated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) throw error

    return { deleted: true, type: 'soft' }
  }
}

// Ban user
async function banUser(supabase: any, userId: string, reason: string) {
  const { error } = await supabase
    .from('profiles')
    .update({
      status: 'banned',
      ban_reason: reason,
      banned_at: new Date().toISOString()
    })
    .eq('id', userId)

  if (error) throw error

  return { banned: true }
}

// Bulk delete operation
async function bulkDelete(supabase: any, userIds: string[]) {
  const results = []

  for (const userId of userIds) {
    try {
      await deleteUser(supabase, userId, false)
      results.push({ userId, success: true })
    } catch (error) {
      results.push({ userId, success: false, error: error.message })
    }
  }

  return results
}

// Get system statistics
async function getStats(supabase: any) {
  // Get counts
  const [
    { count: totalUsers },
    { count: totalBrands },
    { count: totalOrganizers },
    { count: totalMatches },
    { count: activeMatches },
    { count: totalMessages }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('brands').select('*', { count: 'exact', head: true }),
    supabase.from('organizers').select('*', { count: 'exact', head: true }),
    supabase.from('matches').select('*', { count: 'exact', head: true }),
    supabase.from('matches').select('*', { count: 'exact', head: true }).eq('status', 'accepted'),
    supabase.from('messages').select('*', { count: 'exact', head: true })
  ])

  // Get recent activity
  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('created_at')
    .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

  return {
    users: {
      total: totalUsers,
      newThisWeek: recentUsers?.length || 0
    },
    brands: { total: totalBrands },
    organizers: { total: totalOrganizers },
    matches: {
      total: totalMatches,
      active: activeMatches,
      matchRate: totalMatches > 0 ? (activeMatches / totalMatches * 100).toFixed(1) : 0
    },
    messages: { total: totalMessages }
  }
}

// Purge old data (e.g., old notifications, expired sessions)
async function purgeOldData(supabase: any, daysOld: number = 90) {
  const cutoffDate = new Date(Date.now() - daysOld * 24 * 60 * 60 * 1000).toISOString()

  const results: any = {}

  // Delete old notifications
  const { error: notifError, count: notifCount } = await supabase
    .from('notifications')
    .delete()
    .lt('created_at', cutoffDate)

  results.notifications = { deleted: notifCount || 0, error: notifError?.message }

  // Delete old analytics events (keep errors)
  const { error: analyticsError, count: analyticsCount } = await supabase
    .from('analytics_events')
    .delete()
    .lt('created_at', cutoffDate)

  results.analytics = { deleted: analyticsCount || 0, error: analyticsError?.message }

  return results
}

// Main Edge Function handler
Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Verify admin authorization
    const authHeader = req.headers.get('Authorization')
    const { isAdmin, userId } = await verifyAdmin(supabaseClient, authHeader || '')

    if (!isAdmin) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Admin access required.' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 403
        }
      )
    }

    const { action, data }: AdminRequest = await req.json()

    let result: any

    // Execute admin action
    switch (action) {
      case 'get-users':
        result = await getUsers(supabaseClient, data?.filters)
        break

      case 'update-user-role':
        if (!data?.userId || !data?.role) {
          throw new Error('userId and role are required')
        }
        result = await updateUserRole(supabaseClient, data.userId, data.role)
        await logAdminAction(supabaseClient, userId!, action, data)
        break

      case 'delete-user':
        if (!data?.userId) {
          throw new Error('userId is required')
        }
        result = await deleteUser(supabaseClient, data.userId, data.hardDelete || false)
        await logAdminAction(supabaseClient, userId!, action, data)
        break

      case 'ban-user':
        if (!data?.userId || !data?.reason) {
          throw new Error('userId and reason are required')
        }
        result = await banUser(supabaseClient, data.userId, data.reason)
        await logAdminAction(supabaseClient, userId!, action, data)
        break

      case 'bulk-delete':
        if (!data?.userIds || !Array.isArray(data.userIds)) {
          throw new Error('userIds array is required')
        }
        result = await bulkDelete(supabaseClient, data.userIds)
        await logAdminAction(supabaseClient, userId!, action, { count: data.userIds.length })
        break

      case 'get-stats':
        result = await getStats(supabaseClient)
        break

      case 'purge-old-data':
        result = await purgeOldData(supabaseClient, data?.daysOld || 90)
        await logAdminAction(supabaseClient, userId!, action, data)
        break

      default:
        throw new Error(`Unknown action: ${action}`)
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
 * Database Schema Required:
 *
 * CREATE TABLE admin_audit_log (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   admin_id UUID NOT NULL REFERENCES auth.users(id),
 *   action TEXT NOT NULL,
 *   details JSONB,
 *   timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
 * );
 *
 * CREATE INDEX idx_admin_audit_admin ON admin_audit_log(admin_id);
 * CREATE INDEX idx_admin_audit_action ON admin_audit_log(action);
 * CREATE INDEX idx_admin_audit_timestamp ON admin_audit_log(timestamp DESC);
 *
 * -- Add status and ban fields to profiles if not exists
 * ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
 * ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ban_reason TEXT;
 * ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP WITH TIME ZONE;
 * ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMP WITH TIME ZONE;
 * ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
 */
