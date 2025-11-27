import React, { useEffect, useState, createContext, useContext } from 'react';
import { getDraft, saveDraft, generateDraftId } from '../services/draftService';
interface DraftProfileContextType {
  draftProfile: any;
  updateDraft: (updates: any) => void;
  saveDraft: () => void;
  clearDraft: () => void;
  getDraftId: () => string | null;
  loading: boolean;
}
const DraftProfileContext = createContext<DraftProfileContextType | undefined>(undefined);
export const DraftProfileProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [draftProfile, setDraftProfile] = useState<any>({});
  const [draftId, setDraftId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Load draft from storage on mount
  useEffect(() => {
    const loadDraft = async () => {
      try {
        if (draftId) {
          const draft = await getDraft(draftId);
          if (draft) {
            setDraftProfile(draft.profile);
          }
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      } finally {
        setLoading(false);
      }
    };
    loadDraft();
  }, [draftId]);
  const updateDraft = (updates: any) => {
    setDraftProfile((prev: any) => {
      // Handle nested updates for whatTheySeek
      if (updates.whatTheySeek) {
        return {
          ...prev,
          ...updates,
          whatTheySeek: {
            ...prev.whatTheySeek,
            ...updates.whatTheySeek
          }
        };
      }
      // Handle nested updates for eventDetails
      if (updates.eventDetails) {
        return {
          ...prev,
          ...updates,
          eventDetails: {
            ...prev.eventDetails,
            ...updates.eventDetails
          }
        };
      }
      // Handle nested updates for personalInfo
      if (updates.personalInfo) {
        return {
          ...prev,
          ...updates,
          personalInfo: {
            ...prev.personalInfo,
            ...updates.personalInfo
          }
        };
      }
      return {
        ...prev,
        ...updates
      };
    });
  };
  const handleSaveDraft = async () => {
    try {
      // Generate draft ID if needed
      const id = draftId || generateDraftId();
      if (!draftId) {
        setDraftId(id);
      }
      // Save draft using the unified saveDraft function
      await saveDraft(id, draftProfile, 'unknown');
    } catch (error) {
      console.error('Error saving draft:', error);
    }
  };
  const clearDraft = () => {
    setDraftProfile({});
    setDraftId(null);
    localStorage.removeItem('draftProfile');
    localStorage.removeItem('draftId');
  };
  const getDraftId = () => draftId;
  return <DraftProfileContext.Provider value={{
    draftProfile,
    updateDraft,
    saveDraft: handleSaveDraft,
    clearDraft,
    getDraftId,
    loading
  }}>
      {children}
    </DraftProfileContext.Provider>;
};
export const useDraftProfile = () => {
  const context = useContext(DraftProfileContext);
  if (context === undefined) {
    throw new Error('useDraftProfile must be used within a DraftProfileProvider');
  }
  return context;
};