import { supabase } from './supabaseClient';
import { createProfile } from './profileService';
import { DraftProfile } from '../types/profile';

// Generate a unique ID for a draft
export const generateDraftId = (): string => {
  return `draft-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

// Get a single draft by ID
export const getDraft = async (id: string): Promise<any> => {
  try {
    const {
      data,
      error
    } = await supabase.from('drafts').select('*').eq('id', id).single();
    if (error) {
      console.error('Error fetching draft:', error);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error in getDraft:', error);
    return null;
  }
};

// Get drafts by user ID
export const getDraftsByUserId = async (userId: string): Promise<any[]> => {
  try {
    const {
      data,
      error
    } = await supabase.from('drafts').select('*').eq('userId', userId).order('updatedAt', {
      ascending: false
    });
    if (error) {
      console.error('Error fetching drafts by user ID:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error in getDraftsByUserId:', error);
    return [];
  }
};

// Get drafts by email
export const getDraftsByEmail = async (email: string): Promise<any[]> => {
  try {
    const {
      data,
      error
    } = await supabase.from('drafts').select('*').eq('email', email).order('updatedAt', {
      ascending: false
    });
    if (error) {
      console.error('Error fetching drafts by email:', error);
      return [];
    }
    return data || [];
  } catch (error) {
    console.error('Error in getDraftsByEmail:', error);
    return [];
  }
};

// Save a draft profile
export const saveDraft = async (id: string | null, profile: any, role: string, userId?: string): Promise<string> => {
  try {
    const draftData = {
      profile,
      role,
      userId: userId || null,
      updatedAt: new Date().toISOString()
    };
    if (id) {
      // Update existing draft
      const {
        data,
        error
      } = await supabase.from('drafts').update(draftData).eq('id', id).select();
      if (error) throw error;
      return data[0].id;
    } else {
      // Create new draft
      const {
        data,
        error
      } = await supabase.from('drafts').insert({
        ...draftData,
        createdAt: new Date().toISOString()
      }).select();
      if (error) throw error;
      return data[0].id;
    }
  } catch (error) {
    console.error('Error saving draft:', error);
    // For demo purposes, save to localStorage as fallback
    const draftId = id || `draft-${Date.now()}`;
    localStorage.setItem(`draft-${draftId}`, JSON.stringify({
      id: draftId,
      profile,
      role,
      userId,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    }));
    return draftId;
  }
};

// Delete a draft
export const deleteDraft = async (id: string): Promise<boolean> => {
  try {
    const {
      error
    } = await supabase.from('drafts').delete().eq('id', id);
    if (error) {
      console.error('Error deleting draft:', error);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error in deleteDraft:', error);
    return false;
  }
};

// Convert a draft profile to a permanent profile
export const convertDraftToProfile = async (draftId: string, userId: string): Promise<boolean> => {
  try {
    // Get the draft
    const draft = await getDraft(draftId);
    if (!draft) {
      throw new Error('Draft not found');
    }
    // Convert draft profile to the format expected by profileService
    const profileData = {
      role: draft.role,
      name: draft.profile.name || '',
      description: draft.profile.description || '',
      whatTheySeek: {
        sponsorshipTypes: draft.profile.sponsorshipTypes || [],
        budgetRange: draft.profile.budget || '',
        quantity: parseInt(draft.profile.productQuantity) || 0,
        eventTypes: draft.profile.eventTypes || [],
        audienceTags: draft.profile.targetAudience ? [draft.profile.targetAudience] : [],
        notes: draft.profile.additionalInfo || ''
      }
    };
    // Create the permanent profile
    await createProfile(profileData);
    // Delete the draft since it's been converted
    await deleteDraft(draftId);
    return true;
  } catch (error) {
    console.error('Error converting draft to profile:', error);
    return false;
  }
};