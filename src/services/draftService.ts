import { supabase } from './supabaseClient'
import { createProfile } from './profileService'
import { DraftProfile } from '../types/profile'

// Generate a unique ID for a draft
export const generateDraftId = (): string => {
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

// Get a single draft by ID
export const getDraft = async (id: string): Promise<DraftProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('id', id)
      .single()
    if (error) {
      console.error('Error fetching draft:', error)
      return null
    }
    return data as DraftProfile
  } catch (error) {
    console.error('Error in getDraft:', error)
    return null
  }
}

// Get drafts by user ID
export const getDraftsByUserId = async (userId: string): Promise<DraftProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', {
        ascending: false
      })
    if (error) {
      console.error('Error fetching drafts by user ID:', error)
      return []
    }
    return (data as DraftProfile[]) || []
  } catch (error) {
    console.error('Error in getDraftsByUserId:', error)
    return []
  }
}

// Get drafts by email
export const getDraftsByEmail = async (email: string): Promise<DraftProfile[]> => {
  try {
    const { data, error } = await supabase
      .from('drafts')
      .select('*')
      .eq('email', email)
      .order('updated_at', {
        ascending: false
      })
    if (error) {
      console.error('Error fetching drafts by email:', error)
      return []
    }
    return (data as DraftProfile[]) || []
  } catch (error) {
    console.error('Error in getDraftsByEmail:', error)
    return []
  }
}

// Save a draft profile
export const saveDraft = async (
  id: string | null,
  profile: Partial<DraftProfile>,
  role: string,
  userId?: string
): Promise<string> => {
  try {
    const draftData = {
      data: profile,
      type: role,
      user_id: userId || null,
      updated_at: new Date().toISOString()
    }
    if (id) {
      // Update existing draft
      const { data, error } = await supabase
        .from('drafts')
        .update(draftData)
        .eq('id', id)
        .select()
      if (error) throw error
      return data[0].id
    } else {
      // Create new draft
      const { data, error } = await supabase
        .from('drafts')
        .insert({
          ...draftData,
          created_at: new Date().toISOString()
        })
        .select()
      if (error) throw error
      return data[0].id
    }
  } catch (error) {
    console.error('Error saving draft:', error)
    // For demo purposes, save to localStorage as fallback
    const draftId = id || `draft-${Date.now()}`
    localStorage.setItem(
      `draft-${draftId}`,
      JSON.stringify({
        id: draftId,
        data: profile,
        type: role,
        user_id: userId,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString()
      })
    )
    return draftId
  }
}

// Delete a draft
export const deleteDraft = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('drafts').delete().eq('id', id)
    if (error) {
      console.error('Error deleting draft:', error)
      return false
    }
    return true
  } catch (error) {
    console.error('Error in deleteDraft:', error)
    return false
  }
}

// Convert a draft profile to a permanent profile
export const convertDraftToProfile = async (
  draftId: string,
  userId: string
): Promise<boolean> => {
  try {
    // Get the draft
    const draft = await getDraft(draftId)
    if (!draft) {
      throw new Error('Draft not found')
    }
    // Convert draft profile to the format expected by profileService
    const draftData = draft.data || draft.profile || {}
    const profileData = {
      role: draft.type || draft.role,
      name: draftData.name || '',
      description: draftData.description || '',
      whatTheySeek: {
        sponsorshipTypes: draftData.sponsorshipTypes || [],
        budgetRange: draftData.budget || '',
        quantity: parseInt(draftData.productQuantity) || 0,
        eventTypes: draftData.eventTypes || [],
        audienceTags: draftData.targetAudience
          ? [draftData.targetAudience]
          : [],
        notes: draftData.additionalInfo || ''
      }
    }
    // Create the permanent profile
    await createProfile(profileData)
    // Delete the draft since it's been converted
    await deleteDraft(draftId)
    return true
  } catch (error) {
    console.error('Error converting draft to profile:', error)
    return false
  }
}
