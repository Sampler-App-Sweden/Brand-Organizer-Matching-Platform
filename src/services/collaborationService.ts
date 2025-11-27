import { Collaboration } from '../types/collaboration';
// Initialize sample collaborations
export const initializeCollaborations = () => {
  const existingCollaborations = localStorage.getItem('collaborations');
  if (!existingCollaborations) {
    const sampleCollaborations: Collaboration[] = [{
      id: 'collab-1',
      title: 'EcoRefresh at Stockholm Wellness Festival',
      type: 'product_sampling',
      brandName: 'EcoRefresh Beverages',
      organizerName: 'Stockholm Wellness Festival',
      description: 'EcoRefresh provided organic energy drink samples to 3,000+ attendees at the Stockholm Wellness Festival, resulting in a 45% increase in brand awareness among health-conscious consumers.',
      imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80',
      metrics: {
        attendees: '5,000+',
        samples: '3,000+',
        leads: '800+',
        socialReach: '25,000+'
      },
      saved: false
    }, {
      id: 'collab-2',
      title: 'NutriSnack Protein Bar Launch',
      type: 'event_sponsorship',
      brandName: 'NutriSnack',
      organizerName: 'Urban Fitness Expo',
      description: 'NutriSnack sponsored the main stage at Urban Fitness Expo, launching their new protein bar line with exclusive tastings and branded merchandise, reaching over 10,000 fitness enthusiasts.',
      imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80',
      metrics: {
        attendees: '10,000+',
        samples: '5,000+',
        leads: '1,200+',
        socialReach: '50,000+'
      },
      saved: false
    }, {
      id: 'collab-3',
      title: 'SkinGlow Beauty Workshop Series',
      type: 'digital_campaign',
      brandName: 'SkinGlow Cosmetics',
      organizerName: 'Beauty Influencer Network',
      description: 'SkinGlow partnered with Beauty Influencer Network to create a series of virtual workshops, reaching over 100,000 viewers and generating significant social media engagement.',
      imageUrl: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80',
      metrics: {
        attendees: 'Virtual: 100,000+',
        samples: 'N/A',
        leads: '15,000+',
        socialReach: '500,000+'
      },
      saved: false
    }, {
      id: 'collab-4',
      title: 'Tech Innovators Branded Merchandise',
      type: 'merchandise',
      brandName: 'CloudTech Solutions',
      organizerName: 'Tech Innovators Conference',
      description: 'CloudTech created exclusive branded merchandise for Tech Innovators Conference attendees, including premium laptop sleeves and power banks that became highly sought-after items.',
      imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80',
      metrics: {
        attendees: '3,000+',
        samples: '2,000 merchandise items',
        leads: '950+',
        socialReach: '30,000+'
      },
      saved: false
    }, {
      id: 'collab-5',
      title: 'Organic Food Sampling at Market',
      type: 'product_sampling',
      brandName: "Nature's Harvest",
      organizerName: 'Urban Food Market',
      description: "Nature's Harvest introduced their new organic snack line at Urban Food Market, with interactive tasting stations and chef demonstrations that engaged thousands of food enthusiasts.",
      imageUrl: 'https://images.unsplash.com/photo-1506459225024-1428097a7e18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=500&q=80',
      metrics: {
        attendees: '4,000+',
        samples: '2,500+',
        leads: '600+',
        socialReach: '15,000+'
      },
      saved: false
    }];
    localStorage.setItem('collaborations', JSON.stringify(sampleCollaborations));
  }
};
// Get all collaborations
export const getAllCollaborations = async (): Promise<Collaboration[]> => {
  // Initialize collaborations if needed
  initializeCollaborations();
  // In a real app, this would be an API call
  return new Promise(resolve => {
    setTimeout(() => {
      const collaborations = JSON.parse(localStorage.getItem('collaborations') || '[]') as Collaboration[];
      resolve(collaborations);
    }, 500);
  });
};
// Get saved collaborations for a user
export const getSavedCollaborations = async (userId: string): Promise<Collaboration[]> => {
  // In a real app, this would be an API call
  return new Promise(resolve => {
    setTimeout(() => {
      const savedCollabIds = JSON.parse(localStorage.getItem(`user_${userId}_savedCollabs`) || '[]') as string[];
      const allCollaborations = JSON.parse(localStorage.getItem('collaborations') || '[]') as Collaboration[];
      const savedCollaborations = allCollaborations.filter(collab => savedCollabIds.includes(collab.id)).map(collab => ({
        ...collab,
        saved: true
      }));
      resolve(savedCollaborations);
    }, 500);
  });
};
// Toggle saved status for a collaboration
export const toggleSavedCollaboration = (userId: string, collabId: string): void => {
  let savedCollabs = JSON.parse(localStorage.getItem(`user_${userId}_savedCollabs`) || '[]') as string[];
  if (savedCollabs.includes(collabId)) {
    savedCollabs = savedCollabs.filter(id => id !== collabId);
  } else {
    savedCollabs.push(collabId);
  }
  localStorage.setItem(`user_${userId}_savedCollabs`, JSON.stringify(savedCollabs));
};