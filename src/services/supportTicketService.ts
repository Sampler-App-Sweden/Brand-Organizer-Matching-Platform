import { supabase } from './supabaseClient'

export interface SupportTicket {
  id: string
  name: string
  email: string
  category: string
  message: string
  attachments: string[]
  user_agent: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
  resolved_at?: string
  notes?: string
}

/**
 * Get all support tickets from Supabase
 */
export const getAllSupportTickets = async (): Promise<SupportTicket[]> => {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching support tickets:', error)
    return []
  }

  return data || []
}

/**
 * Get a single support ticket by ID
 */
export const getSupportTicketById = async (
  id: string
): Promise<SupportTicket | null> => {
  const { data, error } = await supabase
    .from('support_tickets')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching support ticket:', error)
    return null
  }

  return data
}

/**
 * Save a new support ticket to Supabase
 */
export const saveSupportTicket = async (
  ticketData: Omit<
    SupportTicket,
    'id' | 'status' | 'priority' | 'created_at' | 'updated_at'
  >
): Promise<SupportTicket | null> => {
  const { data, error } = await supabase
    .from('support_tickets')
    .insert([
      {
        name: ticketData.name,
        email: ticketData.email,
        category: ticketData.category,
        message: ticketData.message,
        attachments: ticketData.attachments,
        user_agent: ticketData.user_agent,
        notes: ticketData.notes,
        status: 'open',
        priority: 'medium'
      }
    ])
    .select()
    .single()

  if (error) {
    console.error('Error saving support ticket:', error)
    return null
  }

  return data
}

/**
 * Update a support ticket's status
 */
export const updateSupportTicketStatus = async (
  id: string,
  status: SupportTicket['status']
): Promise<SupportTicket | null> => {
  const updateData: {
    status: string
    updated_at: string
    resolved_at?: string
  } = {
    status,
    updated_at: new Date().toISOString()
  }

  if (status === 'resolved' || status === 'closed') {
    updateData.resolved_at = new Date().toISOString()
  }

  const { data, error } = await supabase
    .from('support_tickets')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating support ticket status:', error)
    return null
  }

  return data
}

/**
 * Update a support ticket's priority
 */
export const updateSupportTicketPriority = async (
  id: string,
  priority: SupportTicket['priority']
): Promise<SupportTicket | null> => {
  const { data, error } = await supabase
    .from('support_tickets')
    .update({
      priority,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating support ticket priority:', error)
    return null
  }

  return data
}

/**
 * Add notes to a support ticket
 */
export const addSupportTicketNotes = async (
  id: string,
  notes: string
): Promise<SupportTicket | null> => {
  const { data, error } = await supabase
    .from('support_tickets')
    .update({
      notes,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error adding notes to support ticket:', error)
    return null
  }

  return data
}

/**
 * Delete a support ticket
 */
export const deleteSupportTicket = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from('support_tickets').delete().eq('id', id)

  if (error) {
    console.error('Error deleting support ticket:', error)
    return false
  }

  return true
}
