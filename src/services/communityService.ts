import { CommunityMember, CommunityQueryParams } from '../types/community';

// Initialize sample community members
export const initializeCommunityMembers = () => {
  const existingMembers = localStorage.getItem('communityMembers');
  if (!existingMembers) {
    const sampleMembers: CommunityMember[] = [{
      id: 'brand-1',
      userId: 'user-brand-1',
      type: 'brand',
      name: 'EcoRefresh Beverages',
      logoUrl: 'https://images.unsplash.com/photo-1560472355-536de3962603?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&h=250&q=80',
      shortDescription: 'Organic energy drinks made with natural ingredients for health-conscious consumers.',
      description: 'EcoRefresh Beverages creates premium organic energy drinks using only natural ingredients. Our mission is to provide healthy energy alternatives without artificial additives or excessive sugar. Perfect for active lifestyles and environmentally conscious consumers.',
      website: 'https://example.com/ecorefresh',
      email: 'partnerships@ecorefresh.example',
      phone: '+46 70 123 4567',
      socialLinks: 'https://instagram.com/ecorefresh\nhttps://facebook.com/ecorefreshbeverages',
      featured: true,
      dateRegistered: new Date(2023, 0, 15).toISOString()
    }, {
      id: 'brand-2',
      userId: 'user-brand-2',
      type: 'brand',
      name: 'NutriSnack',
      logoUrl: 'https://images.unsplash.com/photo-1576489930061-6c77f8cefb74?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&h=250&q=80',
      shortDescription: 'Healthy protein bars and snacks for fitness enthusiasts and active individuals.',
      description: 'NutriSnack creates protein-rich, nutrient-dense snacks for people with active lifestyles. Our products are made with clean ingredients, no artificial preservatives, and sustainable packaging. We focus on both taste and nutrition to fuel your day.',
      website: 'https://example.com/nutrisnack',
      email: 'hello@nutrisnack.example',
      phone: '+46 70 234 5678',
      socialLinks: 'https://instagram.com/nutrisnack\nhttps://linkedin.com/company/nutrisnack',
      featured: false,
      dateRegistered: new Date(2023, 1, 20).toISOString()
    }, {
      id: 'brand-3',
      userId: 'user-brand-3',
      type: 'brand',
      name: 'SkinGlow Cosmetics',
      logoUrl: 'https://images.unsplash.com/photo-1570194065650-d99fb4ee0e57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&h=250&q=80',
      shortDescription: 'Vegan and cruelty-free skincare products for all skin types.',
      description: 'SkinGlow Cosmetics offers a range of vegan, cruelty-free skincare products designed for all skin types and concerns. We believe in transparent ingredient lists and sustainable packaging. Our mission is to help everyone achieve healthy, glowing skin without compromising on ethics.',
      website: 'https://example.com/skinglow',
      email: 'contact@skinglow.example',
      phone: '+46 70 345 6789',
      socialLinks: 'https://instagram.com/skinglowcosmetics\nhttps://tiktok.com/@skinglow',
      featured: true,
      dateRegistered: new Date(2023, 2, 5).toISOString()
    }, {
      id: 'organizer-1',
      userId: 'user-organizer-1',
      type: 'organizer',
      name: 'Stockholm Wellness Festival',
      logoUrl: 'https://images.unsplash.com/photo-1561489404-42f5a5c8e0eb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&h=250&q=80',
      shortDescription: 'Annual wellness and fitness event attracting 5,000+ health-conscious attendees.',
      description: 'Stockholm Wellness Festival is the largest health and wellness event in Sweden, bringing together fitness enthusiasts, health professionals, and wellness brands. The festival features workshops, classes, product sampling, and networking opportunities for the health-conscious community.',
      website: 'https://example.com/stockholmwellness',
      email: 'partners@stockholmwellness.example',
      phone: '+46 70 456 7890',
      socialLinks: 'https://instagram.com/stockholmwellness\nhttps://facebook.com/stockholmwellnessfestival',
      featured: true,
      dateRegistered: new Date(2023, 0, 10).toISOString()
    }, {
      id: 'organizer-2',
      userId: 'user-organizer-2',
      type: 'organizer',
      name: 'Tech Innovators Conference',
      logoUrl: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&h=250&q=80',
      shortDescription: 'Leading technology conference connecting startups, investors, and industry professionals.',
      description: 'Tech Innovators Conference is a premier technology event that brings together startups, established companies, investors, and industry experts. The conference includes keynote speeches, panel discussions, product demonstrations, and networking sessions focused on the latest tech trends and innovations.',
      website: 'https://example.com/techinnovators',
      email: 'sponsors@techinnovators.example',
      phone: '+46 70 567 8901',
      socialLinks: 'https://twitter.com/techinnovators\nhttps://linkedin.com/company/tech-innovators-conference',
      featured: false,
      dateRegistered: new Date(2023, 3, 12).toISOString()
    }, {
      id: 'organizer-3',
      userId: 'user-organizer-3',
      type: 'organizer',
      name: 'Urban Food Market',
      logoUrl: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=250&h=250&q=80',
      shortDescription: 'Monthly food festival showcasing local producers, food trucks, and culinary innovations.',
      description: 'Urban Food Market is a vibrant monthly event celebrating food culture and local producers. The market features food trucks, artisanal producers, cooking demonstrations, and tasting opportunities. It attracts food enthusiasts of all ages looking to discover new flavors and support local businesses.',
      website: 'https://example.com/urbanfoodmarket',
      email: 'vendors@urbanfoodmarket.example',
      phone: '+46 70 678 9012',
      socialLinks: 'https://instagram.com/urbanfoodmarket\nhttps://facebook.com/urbanfoodmarket',
      featured: true,
      dateRegistered: new Date(2023, 2, 25).toISOString()
    }];
    localStorage.setItem('communityMembers', JSON.stringify(sampleMembers));
  }
};

// Get all community members with pagination and filtering
export const getAllCommunityMembers = async (params: CommunityQueryParams = {}): Promise<{
  data: CommunityMember[];
  totalPages: number;
}> => {
  // In a real app, this would be an API call
  return new Promise(resolve => {
    setTimeout(() => {
      let members = JSON.parse(localStorage.getItem('communityMembers') || '[]') as CommunityMember[];
      // Apply filters
      if (params.type) {
        members = members.filter(m => m.type === params.type);
      }
      if (params.featured) {
        members = members.filter(m => m.featured);
      }
      if (params.search) {
        const searchTerm = params.search.toLowerCase();
        members = members.filter(m => m.name.toLowerCase().includes(searchTerm) || m.shortDescription.toLowerCase().includes(searchTerm));
      }
      // Apply category filter
      if (params.category) {
        // This is a simplified example - in a real app, you'd have category data
        members = members.filter(m => m.shortDescription.toLowerCase().includes(params.category!.toLowerCase()));
      }
      // Apply location filter
      if (params.location) {
        // This is a simplified example - in a real app, you'd have location data
        members = members.filter(m => m.description.toLowerCase().includes(params.location!.toLowerCase()));
      }
      // Apply event type filter (for organizers)
      if (params.eventType) {
        // This is a simplified example - in a real app, you'd have event type data
        members = members.filter(m => m.type === 'organizer' && m.description.toLowerCase().includes(params.eventType!.toLowerCase()));
      }
      // Apply audience size filter
      if (params.audienceSize) {
        // This is a simplified example - in a real app, you'd have audience size data
        members = members.filter(m => m.type === 'organizer' && m.description.toLowerCase().includes(params.audienceSize!.toLowerCase()));
      }
      // Pagination
      const page = params.page || 1;
      const limit = params.limit || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedMembers = members.slice(startIndex, endIndex);
      const totalPages = Math.ceil(members.length / limit);
      resolve({
        data: paginatedMembers,
        totalPages
      });
    }, 500); // Simulate network delay
  });
};

// Get a community member by ID
export const getCommunityMemberById = async (id: string): Promise<CommunityMember | null> => {
  // In a real app, this would be an API call
  return new Promise(resolve => {
    setTimeout(() => {
      const members = JSON.parse(localStorage.getItem('communityMembers') || '[]') as CommunityMember[];
      const member = members.find(m => m.id === id) || null;
      resolve(member);
    }, 300);
  });
};

// Toggle feature status (admin only)
export const toggleFeatureStatus = async (memberId: string, featured: boolean): Promise<void> => {
  // In a real app, this would be an API call with proper authentication
  return new Promise(resolve => {
    setTimeout(() => {
      const members = JSON.parse(localStorage.getItem('communityMembers') || '[]') as CommunityMember[];
      const updatedMembers = members.map(m => m.id === memberId ? {
        ...m,
        featured
      } : m);
      localStorage.setItem('communityMembers', JSON.stringify(updatedMembers));
      resolve();
    }, 300);
  });
};

// Save/unsave a community member
export const toggleSavedMember = (userId: string, memberId: string): void => {
  let savedMembers = JSON.parse(localStorage.getItem(`user_${userId}_savedMembers`) || '[]') as string[];
  if (savedMembers.includes(memberId)) {
    savedMembers = savedMembers.filter(id => id !== memberId);
  } else {
    savedMembers.push(memberId);
  }
  localStorage.setItem(`user_${userId}_savedMembers`, JSON.stringify(savedMembers));
};

// Check if a member is saved by user
export const isMemberSaved = (userId: string, memberId: string): boolean => {
  const savedMembers = JSON.parse(localStorage.getItem(`user_${userId}_savedMembers`) || '[]') as string[];
  return savedMembers.includes(memberId);
};

// Get all saved members for a user
export const getSavedMembers = async (userId: string): Promise<CommunityMember[]> => {
  // In a real app, this would be an API call
  return new Promise(resolve => {
    setTimeout(() => {
      const savedMemberIds = JSON.parse(localStorage.getItem(`user_${userId}_savedMembers`) || '[]') as string[];
      const allMembers = JSON.parse(localStorage.getItem('communityMembers') || '[]') as CommunityMember[];
      const savedMembers = allMembers.filter(member => savedMemberIds.includes(member.id));
      resolve(savedMembers);
    }, 500);
  });
};

// Get matches for a member (simplified mock implementation)
export const getMemberMatches = (memberId: string) => {
  // In a real app, this would be based on actual matching algorithm
  // For now, we'll return mock data
  const mockMatches = [{
    id: 'm1',
    name: memberId.startsWith('brand') ? 'Stockholm Wellness Festival' : 'EcoRefresh Beverages',
    date: 'June 15, 2023'
  }, {
    id: 'm2',
    name: memberId.startsWith('brand') ? 'Urban Food Market' : 'NutriSnack',
    date: 'July 22, 2023'
  }];
  // Return 0-2 matches randomly to simulate variety
  const matchCount = Math.floor(Math.random() * 3);
  return mockMatches.slice(0, matchCount);
};

// Added function to fix import error in CommunityPage.tsx
export const getCommunityMembers = async (params: CommunityQueryParams = {}): Promise<CommunityMember[]> => {
  const {
    data
  } = await getAllCommunityMembers(params);
  return data;
};

// Added function to fix import error in CommunityRegistration.tsx
export const registerCommunityMember = async (memberData: Omit<CommunityMember, 'id' | 'dateRegistered' | 'featured'>): Promise<CommunityMember> => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newMember: CommunityMember = {
        ...memberData,
        id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        dateRegistered: new Date().toISOString(),
        featured: false
      };
      const members = JSON.parse(localStorage.getItem('communityMembers') || '[]') as CommunityMember[];
      members.push(newMember);
      localStorage.setItem('communityMembers', JSON.stringify(members));
      resolve(newMember);
    }, 500);
  });
};