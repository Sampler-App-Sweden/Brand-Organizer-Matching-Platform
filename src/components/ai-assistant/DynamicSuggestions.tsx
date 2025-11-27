import React, { useEffect, useState } from 'react';
import { generateSuggestions } from '../../services/aiService';
import { DraftProfile, UserRole } from '../../types/profile';
import { SparklesIcon } from 'lucide-react';
interface DynamicSuggestionsProps {
  draftProfile: DraftProfile | null;
  inferredRole: UserRole | null;
  onSuggestionClick: (suggestion: string) => void;
}
export function DynamicSuggestions({
  draftProfile,
  inferredRole,
  onSuggestionClick
}: DynamicSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [rotationIndex, setRotationIndex] = useState(0);
  // Generate suggestions when profile or role changes
  useEffect(() => {
    const loadSuggestions = async () => {
      if (!draftProfile) {
        // Default suggestions for new users
        setSuggestions(["I'm looking for brands to sponsor my event", 'I want to find events where I can sample my product', "I'd like to join product test panels", "I'm organizing a music festival and need sponsors"]);
        return;
      }
      setIsLoading(true);
      try {
        const newSuggestions = await generateSuggestions(draftProfile, inferredRole);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Error generating suggestions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadSuggestions();
  }, [draftProfile, inferredRole]);
  // Rotate suggestions every 8 seconds
  useEffect(() => {
    if (suggestions.length <= 3) return;
    const interval = setInterval(() => {
      setRotationIndex(prev => (prev + 1) % (suggestions.length - 2));
    }, 8000);
    return () => clearInterval(interval);
  }, [suggestions]);
  // Get current visible suggestions (3 at a time)
  const visibleSuggestions = suggestions.length > 0 ? [suggestions[rotationIndex % suggestions.length], suggestions[(rotationIndex + 1) % suggestions.length], suggestions[(rotationIndex + 2) % suggestions.length]] : [];
  if (isLoading || visibleSuggestions.length === 0) {
    return null;
  }
  return <div className="mt-4">
      <div className="flex items-center text-sm text-gray-500 mb-2">
        <SparklesIcon className="h-4 w-4 mr-1 text-indigo-500" />
        <span>You can ask:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {visibleSuggestions.map((suggestion, index) => <button key={index} className="px-3 py-1.5 text-sm bg-indigo-50 text-indigo-700 rounded-full hover:bg-indigo-100 transition-colors" onClick={() => onSuggestionClick(suggestion)}>
            {suggestion}
          </button>)}
      </div>
    </div>;
}