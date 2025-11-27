import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ConversationalInput } from './ConversationalInput';
import { DynamicSuggestions } from './DynamicSuggestions';
import { ProfileSummary } from './ProfileSummary';
import { ProgressIndicator } from './ProgressIndicator';
import { Button } from '../Button';
import { useAuth } from '../../context/AuthContext';
import { saveDraft, getDraft } from '../../services/draftService';
import { processUserInput, inferUserRole, generateNextQuestions } from '../../services/aiService';
import { UserRole, DraftProfile } from '../../types/profile';
import { ArrowRightIcon, SaveIcon, UserIcon, BuildingIcon, CalendarIcon } from 'lucide-react';
import { TechCircuitLines } from '../TechEffects';
export function AIOnboardingAssistant() {
  const navigate = useNavigate();
  const {
    currentUser
  } = useAuth();
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState<{
    role: 'user' | 'assistant';
    content: string;
  }[]>([{
    role: 'assistant',
    content: "Welcome to SponsrAI! Tell me what you're looking for, and I'll help you get started."
  }]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [inferredRole, setInferredRole] = useState<UserRole | null>(null);
  const [draftProfile, setDraftProfile] = useState<DraftProfile | null>(null);
  const [draftId, setDraftId] = useState<string | null>(null);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [nextActions, setNextActions] = useState<{
    label: string;
    action: () => void;
    primary?: boolean;
  }[]>([]);
  const conversationEndRef = useRef<HTMLDivElement>(null);
  // Load draft profile from localStorage on component mount
  useEffect(() => {
    const loadDraft = async () => {
      const savedDraft = await getDraft(currentUser?.id);
      if (savedDraft) {
        setDraftProfile(savedDraft.profile);
        setDraftId(savedDraft.id);
        setInferredRole(savedDraft.role);
        // Calculate completion percentage
        const requiredFields = getRequiredFieldsForRole(savedDraft.role);
        const filledFields = Object.entries(savedDraft.profile).filter(([key, value]) => value !== undefined && value !== '' && requiredFields.includes(key)).length;
        setCompletionPercentage(Math.round(filledFields / requiredFields.length * 100));
        // Add a message about the existing draft
        setConversation(prev => [...prev, {
          role: 'assistant',
          content: `I found your draft ${savedDraft.role?.toLowerCase()} profile. Would you like to continue where you left off?`
        }]);
        // Set next actions
        updateNextActions(savedDraft.role, filledFields / requiredFields.length);
      }
    };
    loadDraft();
  }, [currentUser]);
  // Scroll to bottom of conversation when new messages are added
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  }, [conversation]);
  const handleUserInput = async (input: string) => {
    if (!input.trim()) return;
    // Add user message to conversation
    setConversation(prev => [...prev, {
      role: 'user',
      content: input
    }]);
    setUserInput('');
    setIsProcessing(true);
    try {
      // Process user input with AI service
      const response = await processUserInput(input, draftProfile, inferredRole);
      // If role not yet inferred, try to infer it
      const role = inferredRole || response.inferredRole || (await inferUserRole(input));
      if (role && !inferredRole) {
        setInferredRole(role);
        setConversation(prev => [...prev, {
          role: 'assistant',
          content: `I understand you're a ${getRoleName(role)}. Let me help you with that.`
        }]);
      }
      // Update draft profile with new information
      const updatedProfile = {
        ...draftProfile,
        ...response.extractedInfo
      };
      setDraftProfile(updatedProfile);
      // Save draft to localStorage and backend if email is provided
      if (updatedProfile.email || currentUser) {
        const newDraftId = await saveDraft(draftId, updatedProfile, role || 'unknown', currentUser?.id);
        if (!draftId) setDraftId(newDraftId);
      }
      // Calculate completion percentage
      if (role) {
        const requiredFields = getRequiredFieldsForRole(role);
        const filledFields = Object.entries(updatedProfile).filter(([key, value]) => value !== undefined && value !== '' && requiredFields.includes(key)).length;
        setCompletionPercentage(Math.round(filledFields / requiredFields.length * 100));
        // Update next actions based on completion
        updateNextActions(role, filledFields / requiredFields.length);
      }
      // Generate next question
      const nextQuestion = await generateNextQuestions(updatedProfile, role);
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: nextQuestion
      }]);
      // Show role switcher if we've gathered enough information
      if (completionPercentage > 30 && !showRoleSwitcher) {
        setShowRoleSwitcher(true);
      }
    } catch (error) {
      console.error('Error processing input:', error);
      setConversation(prev => [...prev, {
        role: 'assistant',
        content: "I'm sorry, I had trouble processing that. Could you try rephrasing or providing more details?"
      }]);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleSwitchRole = (newRole: UserRole) => {
    if (newRole === inferredRole) return;
    setInferredRole(newRole);
    setConversation(prev => [...prev, {
      role: 'assistant',
      content: `I'll help you create a ${getRoleName(newRole)} profile instead. Let's build on what you've already shared.`
    }]);
    // Recalculate completion percentage for new role
    if (draftProfile) {
      const requiredFields = getRequiredFieldsForRole(newRole);
      const filledFields = Object.entries(draftProfile).filter(([key, value]) => value !== undefined && value !== '' && requiredFields.includes(key)).length;
      setCompletionPercentage(Math.round(filledFields / requiredFields.length * 100));
      // Update next actions
      updateNextActions(newRole, filledFields / requiredFields.length);
    }
  };
  const updateNextActions = (role: UserRole, completionRatio: number) => {
    const actions = [];
    // Always offer to save draft
    actions.push({
      label: 'Save & continue later',
      action: () => {
        // If user is logged in, just save
        if (currentUser) {
          saveDraft(draftId, draftProfile, role, currentUser.id);
          setConversation(prev => [...prev, {
            role: 'assistant',
            content: 'Your progress has been saved. You can continue later from your dashboard.'
          }]);
        } else {
          // If not logged in, prompt to register or login
          setConversation(prev => [...prev, {
            role: 'assistant',
            content: "To save your progress, you'll need to create an account or log in. Would you like to do that now?"
          }]);
          actions.push({
            label: 'Register',
            action: () => navigate('/register', {
              state: {
                draftId
              }
            }),
            primary: true
          });
          actions.push({
            label: 'Login',
            action: () => navigate('/login', {
              state: {
                draftId
              }
            })
          });
        }
      }
    });
    // If profile is complete enough, offer to finalize
    if (completionRatio >= 0.7) {
      actions.push({
        label: `Complete ${getRoleName(role)} Profile`,
        action: () => {
          if (currentUser) {
            navigate(`/${role.toLowerCase()}`, {
              state: {
                draftProfile,
                draftId
              }
            });
          } else {
            setConversation(prev => [...prev, {
              role: 'assistant',
              content: "To complete your profile, you'll need to create an account first. Would you like to register now?"
            }]);
            setNextActions([{
              label: 'Register',
              action: () => navigate('/register', {
                state: {
                  draftId
                }
              }),
              primary: true
            }]);
          }
        },
        primary: true
      });
      // If very complete, offer to see matches
      if (completionRatio >= 0.9 && currentUser) {
        actions.push({
          label: 'See potential matches',
          action: () => navigate('/dashboard/matches'),
          primary: true
        });
      }
    }
    setNextActions(actions);
  };
  return <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden relative">
      {/* Tech decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
        <TechCircuitLines />
      </div>
      <div className="p-6 relative z-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Let's Get Started
        </h2>
        {/* Progress indicator */}
        {inferredRole && <div className="mb-6">
            <ProgressIndicator percentage={completionPercentage} role={inferredRole} />
          </div>}
        {/* Conversation history */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4 max-h-[400px] overflow-y-auto border border-gray-100">
          {conversation.map((message, index) => <div key={index} className={`mb-3 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block px-4 py-2 rounded-lg ${message.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-800'}`}>
                {message.content}
              </div>
            </div>)}
          <div ref={conversationEndRef} />
        </div>
        {/* Role switcher */}
        {showRoleSwitcher && <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              I want to create a profile as:
            </p>
            <div className="flex space-x-2">
              <Button variant={inferredRole === 'brand' ? 'primary' : 'outline'} onClick={() => handleSwitchRole('brand')} className="flex items-center" techEffect={inferredRole === 'brand'}>
                <BuildingIcon className="h-4 w-4 mr-2" />
                Brand / Sponsor
              </Button>
              <Button variant={inferredRole === 'organizer' ? 'primary' : 'outline'} onClick={() => handleSwitchRole('organizer')} className="flex items-center" techEffect={inferredRole === 'organizer'}>
                <CalendarIcon className="h-4 w-4 mr-2" />
                Event Organizer
              </Button>
              <Button variant={inferredRole === 'community' ? 'primary' : 'outline'} onClick={() => handleSwitchRole('community')} className="flex items-center" techEffect={inferredRole === 'community'}>
                <UserIcon className="h-4 w-4 mr-2" />
                Community Member
              </Button>
            </div>
          </div>}
        {/* Input field */}
        <ConversationalInput value={userInput} onChange={setUserInput} onSubmit={handleUserInput} isProcessing={isProcessing} placeholder="Tell us what you're looking for..." />
        {/* Dynamic suggestions */}
        <DynamicSuggestions draftProfile={draftProfile} inferredRole={inferredRole} onSuggestionClick={suggestion => setUserInput(suggestion)} />
        {/* Profile summary if we have data */}
        {draftProfile && Object.keys(draftProfile).length > 0 && <div className="mt-6">
            <ProfileSummary profile={draftProfile} role={inferredRole} />
          </div>}
        {/* Next actions */}
        {nextActions.length > 0 && <div className="mt-6 flex flex-wrap gap-3">
            {nextActions.map((action, index) => <Button key={index} variant={action.primary ? 'primary' : 'outline'} onClick={action.action} className="flex items-center" techEffect={action.primary}>
                {action.label.includes('Save') && <SaveIcon className="h-4 w-4 mr-2" />}
                {action.label.includes('Complete') && <ArrowRightIcon className="h-4 w-4 mr-2" />}
                {action.label}
              </Button>)}
          </div>}
      </div>
      {/* Bottom decoration */}
      <div className="h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-blue-400"></div>
    </div>;
}
// Helper functions
function getRoleName(role: UserRole): string {
  switch (role) {
    case 'brand':
      return 'Brand/Sponsor';
    case 'organizer':
      return 'Event Organizer';
    case 'community':
      return 'Community Member';
    default:
      return 'User';
  }
}
function getRequiredFieldsForRole(role: UserRole): string[] {
  switch (role) {
    case 'brand':
      return ['name', 'companyName', 'email', 'productName', 'productDescription', 'targetAudience', 'productQuantity', 'marketingGoals', 'budget'];
    case 'organizer':
      return ['name', 'organizerName', 'email', 'eventName', 'eventDate', 'location', 'audienceDescription', 'attendeeCount', 'sponsorshipNeeds'];
    case 'community':
      return ['name', 'email', 'age', 'occupation', 'interests', 'location', 'availability'];
    default:
      return ['name', 'email'];
  }
}