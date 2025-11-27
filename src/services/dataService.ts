// Data service for managing brand and organizer data
import { Match, findMatchesForBrand, findMatchesForOrganizer } from './matchingService';
import { User } from './authService';
// Brand data structure
export interface Brand {
  id: string;
  userId: string;
  companyName: string;
  contactName: string;
  contactTitle: string;
  email: string;
  phone: string;
  website: string;
  industry: string;
  productName: string;
  productDescription: string;
  productQuantity: string;
  targetAudience: string;
  ageRange: string;
  sponsorshipType: string[];
  marketingGoals: string;
  budget: string;
  eventMarketingBudget: string;
  interestedInSamplingTools: string;
  additionalInfo: string;
  createdAt: Date;
}
// Organizer data structure
export interface Organizer {
  id: string;
  userId: string;
  organizerName: string;
  contactName: string;
  email: string;
  phone: string;
  website: string;
  eventName: string;
  eventType: string;
  elevatorPitch: string;
  eventFrequency: string;
  eventDate: string;
  location: string;
  attendeeCount: string;
  audienceDescription: string;
  audienceDemographics: string[];
  sponsorshipNeeds: string;
  offeringTypes: string[];
  brandVisibility: string;
  contentCreation: string;
  leadGeneration: string;
  productFeedback: string;
  bonusValue: string[];
  bonusValueDetails: string;
  additionalInfo: string;
  mediaFiles: string[]; // URLs to media files
  createdAt: Date;
}
// Save brand data
export const saveBrand = (brandData: Omit<Brand, 'id' | 'createdAt'>): Brand => {
  const brands = JSON.parse(localStorage.getItem('brands') || '[]') as Brand[];
  const newBrand: Brand = {
    ...brandData,
    id: `brand-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date()
  };
  brands.push(newBrand);
  localStorage.setItem('brands', JSON.stringify(brands));
  // Find matches for this new brand
  const organizers = JSON.parse(localStorage.getItem('organizers') || '[]') as Organizer[];
  const matches = findMatchesForBrand(newBrand, organizers);
  if (matches.length > 0) {
    const allMatches = JSON.parse(localStorage.getItem('matches') || '[]') as Match[];
    localStorage.setItem('matches', JSON.stringify([...allMatches, ...matches]));
  }
  return newBrand;
};
// Save organizer data
export const saveOrganizer = (organizerData: Omit<Organizer, 'id' | 'createdAt'>): Organizer => {
  const organizers = JSON.parse(localStorage.getItem('organizers') || '[]') as Organizer[];
  const newOrganizer: Organizer = {
    ...organizerData,
    id: `organizer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    createdAt: new Date()
  };
  organizers.push(newOrganizer);
  localStorage.setItem('organizers', JSON.stringify(organizers));
  // Find matches for this new organizer
  const brands = JSON.parse(localStorage.getItem('brands') || '[]') as Brand[];
  const matches = findMatchesForOrganizer(newOrganizer, brands);
  if (matches.length > 0) {
    const allMatches = JSON.parse(localStorage.getItem('matches') || '[]') as Match[];
    localStorage.setItem('matches', JSON.stringify([...allMatches, ...matches]));
  }
  return newOrganizer;
};
// Get brand by user ID
export const getBrandByUserId = (userId: string): Brand | null => {
  const brands = JSON.parse(localStorage.getItem('brands') || '[]') as Brand[];
  return brands.find(b => b.userId === userId) || null;
};
// Get organizer by user ID
export const getOrganizerByUserId = (userId: string): Organizer | null => {
  const organizers = JSON.parse(localStorage.getItem('organizers') || '[]') as Organizer[];
  return organizers.find(o => o.userId === userId) || null;
};
// Get matches for a brand
export const getMatchesForBrand = (brandId: string): Match[] => {
  const matches = JSON.parse(localStorage.getItem('matches') || '[]') as Match[];
  return matches.filter(m => m.brandId === brandId);
};
// Get matches for an organizer
export const getMatchesForOrganizer = (organizerId: string): Match[] => {
  const matches = JSON.parse(localStorage.getItem('matches') || '[]') as Match[];
  return matches.filter(m => m.organizerId === organizerId);
};
// Update match status
export const updateMatchStatus = (matchId: string, status: 'accepted' | 'rejected'): Match => {
  const matches = JSON.parse(localStorage.getItem('matches') || '[]') as Match[];
  const updatedMatches = matches.map(m => {
    if (m.id === matchId) {
      return {
        ...m,
        status
      };
    }
    return m;
  });
  localStorage.setItem('matches', JSON.stringify(updatedMatches));
  return updatedMatches.find(m => m.id === matchId) as Match;
};
// Get brand by ID
export const getBrandById = (brandId: string): Brand | null => {
  const brands = JSON.parse(localStorage.getItem('brands') || '[]') as Brand[];
  return brands.find(b => b.id === brandId) || null;
};
// Get organizer by ID
export const getOrganizerById = (organizerId: string): Organizer | null => {
  const organizers = JSON.parse(localStorage.getItem('organizers') || '[]') as Organizer[];
  return organizers.find(o => o.id === organizerId) || null;
};