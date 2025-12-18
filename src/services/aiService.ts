// This is a simplified mock implementation of AI services
// In a real application, this would connect to a backend API with ML models

import type { DraftProfile } from '../types/profile'

// Detect user intent from text input
export const detectIntent = async (input: string): Promise<{
  role: 'brand' | 'organizer' | 'community' | null;
  confidence: number;
}> => {
  // Simplified intent detection based on keywords
  const text = input.toLowerCase();
  // Brand signals
  const brandKeywords = ['brand', 'sponsor', 'product', 'company', 'sampling', 'promote', 'marketing', 'sell', 'advertise', 'showcase', 'launch', 'my business', 'our business', 'my company', 'our company', 'my product', 'our product'];
  let brandScore = 0;
  brandKeywords.forEach(keyword => {
    if (text.includes(keyword)) brandScore += 1;
  });
  // Organizer signals
  const organizerKeywords = ['event', 'organize', 'festival', 'conference', 'expo', 'exhibition', 'hosting', 'venue', 'attendees', 'planning', 'running', 'my event', 'our event', 'speakers', 'schedule', 'workshop', 'seminar'];
  let organizerScore = 0;
  organizerKeywords.forEach(keyword => {
    if (text.includes(keyword)) organizerScore += 1;
  });
  // Community member signals
  const communityKeywords = ['attend', 'participate', 'join', 'test', 'try', 'experience', 'interested in', 'as a consumer', 'as a customer', 'personally', 'myself', 'individual', 'test panel', 'feedback', 'review', 'opinion'];
  let communityScore = 0;
  communityKeywords.forEach(keyword => {
    if (text.includes(keyword)) communityScore += 1;
  });
  // Determine the highest score
  const scores = [{
    role: 'brand',
    score: brandScore
  }, {
    role: 'organizer',
    score: organizerScore
  }, {
    role: 'community',
    score: communityScore
  }];
  scores.sort((a, b) => b.score - a.score);
  // Calculate confidence as ratio of top score to second score
  const topScore = scores[0].score;
  const secondScore = scores[1].score;
  if (topScore === 0) {
    return {
      role: null,
      confidence: 0
    };
  }
  // If there's a clear winner
  if (topScore > secondScore) {
    const confidence = Math.min(0.5 + (topScore - secondScore) * 0.1, 0.95);
    return {
      role: scores[0].role as 'brand' | 'organizer' | 'community',
      confidence
    };
  }
  // If there's a tie or very close scores
  return {
    role: scores[0].role as 'brand' | 'organizer' | 'community',
    confidence: 0.5
  };
};
// Generate follow-up questions based on conversation and current draft profile
export const generateFollowUpQuestions = async (conversation: {
  role: string;
  content: string;
  timestamp: Date;
}[], detectedRole: 'brand' | 'organizer' | 'community', draftProfile: any): Promise<string> => {
  // In a real implementation, this would use an LLM to generate personalized follow-up questions
  // For this demo, we'll use a rule-based approach
  // Check what information is missing in the draft profile
  const missingFields: string[] = [];
  if (detectedRole === 'brand') {
    if (!draftProfile.name) missingFields.push('brand name');
    if (!draftProfile.email) missingFields.push('email');
    if (!draftProfile.description) missingFields.push('product description');
    if (!draftProfile.whatTheySeek?.sponsorshipTypes?.length) missingFields.push('sponsorship type');
    if (!draftProfile.whatTheySeek?.budgetRange) missingFields.push('budget range');
    if (!draftProfile.whatTheySeek?.audienceTags?.length) missingFields.push('target audience');
  } else if (detectedRole === 'organizer') {
    if (!draftProfile.name) missingFields.push('event name');
    if (!draftProfile.email) missingFields.push('email');
    if (!draftProfile.description) missingFields.push('event description');
    if (!draftProfile.eventDetails?.date) missingFields.push('event date');
    if (!draftProfile.eventDetails?.location) missingFields.push('event location');
    if (!draftProfile.eventDetails?.capacity) missingFields.push('attendee capacity');
    if (!draftProfile.whatTheySeek?.sponsorshipTypes?.length) missingFields.push('sponsorship needs');
  } else if (detectedRole === 'community') {
    if (!draftProfile.name) missingFields.push('name');
    if (!draftProfile.email) missingFields.push('email');
    if (!draftProfile.personalInfo?.age) missingFields.push('age range');
    if (!draftProfile.personalInfo?.location) missingFields.push('location');
    if (!draftProfile.personalInfo?.occupation) missingFields.push('occupation');
    if (!draftProfile.personalInfo?.interests?.length) missingFields.push('interests');
    if (draftProfile.personalInfo?.testPanelInterest === undefined) missingFields.push('test panel interest');
  }
  // Get the last user message
  const lastUserMessage = [...conversation].reverse().find(msg => msg.role === 'user')?.content.toLowerCase() || '';
  // Generate response based on missing fields and last message
  if (missingFields.length > 0) {
    if (detectedRole === 'brand') {
      if (missingFields.includes('brand name')) {
        return 'Great! Can you tell me the name of your brand or company?';
      } else if (missingFields.includes('email')) {
        return 'Thanks for that information. What email address would you like to use for your account?';
      } else if (missingFields.includes('product description')) {
        return 'Can you describe your product or service in a bit more detail? This will help us match you with relevant events.';
      } else if (missingFields.includes('target audience')) {
        return 'Who is your target audience? Please describe their demographics, interests, or any specific characteristics.';
      } else if (missingFields.includes('budget range')) {
        return "What's your approximate budget range for sponsorships or sampling opportunities?";
      } else if (missingFields.includes('sponsorship type')) {
        return 'What type of sponsorship are you interested in? For example: product sampling, financial sponsorship, in-kind goods, etc.';
      } else {
        return "Thanks for providing that information. Is there anything specific you're looking for in event partnerships that you'd like to share?";
      }
    } else if (detectedRole === 'organizer') {
      if (missingFields.includes('event name')) {
        return "Great! What's the name of your event?";
      } else if (missingFields.includes('email')) {
        return 'Thanks for that information. What email address would you like to use for your account?';
      } else if (missingFields.includes('event description')) {
        return 'Can you describe your event in a bit more detail? This will help us match you with relevant sponsors.';
      } else if (missingFields.includes('event date')) {
        return 'When is your event scheduled to take place?';
      } else if (missingFields.includes('event location')) {
        return 'Where will your event be held?';
      } else if (missingFields.includes('attendee capacity')) {
        return 'Approximately how many attendees do you expect at your event?';
      } else if (missingFields.includes('sponsorship needs')) {
        return 'What type of sponsorship are you looking for? For example: product samples, financial support, prizes, etc.';
      } else {
        return "Thanks for providing that information. Is there anything specific you're looking for in brand partnerships that you'd like to share?";
      }
    } else {
      if (missingFields.includes('name')) {
        return "Great! What's your name?";
      } else if (missingFields.includes('email')) {
        return 'Thanks for that information. What email address would you like to use for your account?';
      } else if (missingFields.includes('age range')) {
        return 'Which age group do you belong to?';
      } else if (missingFields.includes('location')) {
        return 'Where are you located?';
      } else if (missingFields.includes('occupation')) {
        return 'What do you do for work?';
      } else if (missingFields.includes('interests')) {
        return 'What are your interests or hobbies? This helps us match you with relevant events and test panels.';
      } else if (missingFields.includes('test panel interest')) {
        return 'Would you be interested in participating in test panels for new products?';
      } else {
        return "Thanks for providing that information. Is there anything specific you're looking for in events or test panels that you'd like to share?";
      }
    }
  } else {
    // If we have all the basic information
    if (detectedRole === 'brand') {
      return "Thanks for providing all that information! Your brand profile is looking good. Would you like to add any additional details about your marketing goals or specific types of events you're interested in?";
    } else if (detectedRole === 'organizer') {
      return "Thanks for providing all that information! Your event profile is looking good. Would you like to add any additional details about your audience demographics or specific types of brands you're interested in partnering with?";
    } else {
      return "Thanks for providing all that information! Your community profile is looking good. Would you like to add any additional details about specific types of events or products you're interested in?";
    }
  }
};
// Generate contextual suggestions based on conversation and role
export const generateSuggestions = async (conversation: {
  role: string;
  content: string;
  timestamp: Date;
}[], detectedRole: 'brand' | 'organizer' | 'community', draftProfile: any): Promise<string[]> => {
  // In a real implementation, this would use an LLM to generate personalized suggestions
  // For this demo, we'll use predefined suggestions based on role and profile completion
  if (detectedRole === 'brand') {
    if (!draftProfile.name) {
      return ['My brand name is...', 'I represent a company called...', 'Our product brand is...'];
    } else if (!draftProfile.description) {
      return ['Our product is...', 'We sell...', "We're launching a new..."];
    } else if (!draftProfile.whatTheySeek?.audienceTags?.length) {
      return ['Our target audience is...', "We're looking to reach people aged...", 'Our ideal customers are...'];
    } else if (!draftProfile.whatTheySeek?.budgetRange) {
      return ['Our budget is around...', 'We can spend approximately...', 'Our sponsorship budget is...'];
    } else {
      return ["We're interested in events that...", 'Our marketing goals include...', "We'd like to collect feedback on..."];
    }
  } else if (detectedRole === 'organizer') {
    if (!draftProfile.name) {
      return ['My event is called...', "I'm organizing...", "We're planning an event named..."];
    } else if (!draftProfile.description) {
      return ['Our event is about...', "It's a conference focused on...", "We're hosting a festival that..."];
    } else if (!draftProfile.eventDetails?.date || !draftProfile.eventDetails?.location) {
      return ['The event will be held on...', "It's taking place at...", 'The venue and date are...'];
    } else if (!draftProfile.whatTheySeek?.sponsorshipTypes?.length) {
      return ["We're looking for sponsors who...", 'We need brands that can provide...', 'Our sponsorship needs include...'];
    } else {
      return ['Our attendees are primarily...', 'The event capacity is...', 'Previous sponsors included...'];
    }
  } else {
    if (!draftProfile.name || !draftProfile.email) {
      return ['My name is... and my email is...', "I'm... and you can reach me at...", "I'd like to join as..."];
    } else if (!draftProfile.personalInfo?.age || !draftProfile.personalInfo?.location) {
      return ["I'm in the age group... and live in...", "I'm... years old from...", "I live in... and I'm in my..."];
    } else if (!draftProfile.personalInfo?.interests?.length) {
      return ["I'm interested in...", 'My hobbies include...', 'I enjoy events related to...'];
    } else {
      return ['I would like to try products in the category of...', "I'm available for test panels on...", 'I have experience with...'];
    }
  }
};
// Extract structured information from user input
export const extractProfileInfo = async (input: string, currentRole: 'brand' | 'organizer' | 'community'): Promise<Partial<DraftProfile>> => {
  // In a real implementation, this would use NLP to extract structured information
  // For this demo, we'll use a simplified approach with regex
  const extractedInfo: Partial<DraftProfile> = {};
  // Extract email
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const emails = input.match(emailRegex);
  if (emails && emails.length > 0) {
    extractedInfo.email = emails[0];
  }
  // Extract other information based on role
  if (currentRole === 'brand') {
    // Extract brand name
    const brandNameRegex = /(?:brand|company|product)(?:\s+name)?(?:\s+is)?\s+([A-Za-z0-9\s]+)(?:\.|\,|\s+and)/i;
    const brandMatch = input.match(brandNameRegex);
    if (brandMatch && brandMatch[1]) {
      extractedInfo.name = brandMatch[1].trim();
    }
    // Extract product description
    if (input.length > 30 && input.includes('product')) {
      extractedInfo.description = input;
    }
  } else if (currentRole === 'organizer') {
    // Extract event name
    const eventNameRegex = /(?:event|conference|festival)(?:\s+name)?(?:\s+is)?\s+([A-Za-z0-9\s]+)(?:\.|\,|\s+and)/i;
    const eventMatch = input.match(eventNameRegex);
    if (eventMatch && eventMatch[1]) {
      extractedInfo.name = eventMatch[1].trim();
    }
    // Extract event date
    const dateRegex = /(?:on|at|date|scheduled for)\s+([A-Za-z]+\s+\d{1,2}(?:st|nd|rd|th)?(?:,?\s+\d{4})?)/i;
    const dateMatch = input.match(dateRegex);
    if (dateMatch && dateMatch[1]) {
      extractedInfo.eventDate = dateMatch[1].trim();
    }
    // Extract event location
    const locationRegex = /(?:at|in|location|venue|place)\s+([A-Za-z\s]+)(?:\.|\,|\s+on)/i;
    const locationMatch = input.match(locationRegex);
    if (locationMatch && locationMatch[1]) {
      extractedInfo.location = locationMatch[1].trim();
    }
  } else if (currentRole === 'community') {
    // Extract name
    const nameRegex = /(?:my name is|I am|I'm)\s+([A-Za-z\s]+)(?:\.|\,|\s+and)/i;
    const nameMatch = input.match(nameRegex);
    if (nameMatch && nameMatch[1]) {
      extractedInfo.name = nameMatch[1].trim();
    }
    // Extract age
    const ageRegex = /(?:I am|I'm)\s+(\d+)(?:\s+years old)?/i;
    const ageMatch = input.match(ageRegex);
    if (ageMatch && ageMatch[1]) {
      extractedInfo.age = ageMatch[1].trim();
    }
    // Extract location
    const locationRegex = /(?:I live in|from|located in|based in)\s+([A-Za-z\s]+)(?:\.|\,|\s+and)/i;
    const locationMatch = input.match(locationRegex);
    if (locationMatch && locationMatch[1]) {
      extractedInfo.location = locationMatch[1].trim();
    }
  }
  return extractedInfo;
};