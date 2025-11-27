// Authentication service for handling user login and registration
export interface User {
  id: string;
  email: string;
  password: string;
  type: 'brand' | 'organizer' | 'admin' | 'community';
  name: string;
  createdAt: Date;
}

// In a real app, this would be a database call
export const login = (email: string, password: string): User | null => {
  const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
  const user = users.find(u => u.email === email && u.password === password);
  return user || null;
};

// Register a new user
export const register = (email: string, password: string, type: 'brand' | 'organizer' | 'community', name: string): User => {
  const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
  // Check if user already exists
  if (users.some(u => u.email === email)) {
    throw new Error('User already exists');
  }
  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email,
    password,
    // In a real app, this would be hashed
    type,
    name,
    createdAt: new Date()
  };
  users.push(newUser);
  localStorage.setItem('users', JSON.stringify(users));
  return newUser;
};

// Get user by ID
export const getUserById = (id: string): User | null => {
  const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
  return users.find(u => u.id === id) || null;
};

// Initialize some default users if none exist
export const initializeUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    if (users.length === 0) {
      const defaultUsers: User[] = [{
        id: 'admin-1',
        email: 'admin@sponsrai.se',
        password: 'admin123',
        type: 'admin',
        name: 'System Admin',
        createdAt: new Date()
      }, {
        id: 'brand-demo',
        email: 'brand@demo.com',
        password: 'demo123',
        type: 'brand',
        name: 'EcoRefresh Beverages',
        createdAt: new Date()
      }, {
        id: 'organizer-demo',
        email: 'organizer@demo.com',
        password: 'demo123',
        type: 'organizer',
        name: 'Active Life Events',
        createdAt: new Date()
      }, {
        id: 'community-demo',
        email: 'community@demo.com',
        password: 'demo123',
        type: 'community',
        name: 'Sarah Johnson',
        createdAt: new Date()
      }];
      try {
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        // Initialize test brand and organizer data
        initializeTestData();
      } catch (error) {
        console.warn('Failed to initialize users:', error);
        // Provide fallback behavior or show user-friendly error
      }
    }
  } catch (error) {
    console.warn('Failed to access localStorage:', error);
    // Provide fallback behavior or show user-friendly error
  }
};

// Initialize test data for brand and organizer
const initializeTestData = () => {
  // Check if we already have test data
  const brands = JSON.parse(localStorage.getItem('brands') || '[]');
  const organizers = JSON.parse(localStorage.getItem('organizers') || '[]');
  if (brands.length === 0 && organizers.length === 0) {
    // Create test brand
    const testBrand = {
      id: 'brand-test-1',
      userId: 'brand-demo',
      companyName: 'EcoRefresh Beverages',
      contactName: 'Demo Brand User',
      contactTitle: 'Marketing Manager',
      email: 'brand@demo.com',
      phone: '0701234567',
      website: 'https://ecofreshbeverages.example',
      address: 'Testgatan 1',
      postalCode: '12345',
      city: 'Stockholm',
      industry: 'food_beverage',
      productName: 'Organic Energy Drink',
      productDescription: 'A refreshing organic energy drink made with natural ingredients. Perfect for active consumers looking for a healthy energy boost.',
      productQuantity: '500 samples',
      targetAudience: 'Health-conscious active adults who care about natural ingredients and sustainability.',
      ageRange: '25-34',
      sponsorshipType: ['product_sampling', 'financial_sponsorship'],
      marketingGoals: 'Increase brand awareness among fitness enthusiasts and collect feedback on our new flavor.',
      budget: '50000_100000',
      eventMarketingBudget: '250000',
      interestedInFinancialSponsorship: 'yes',
      financialSponsorshipAmount: '75000',
      successMetrics: 'At least 300 product samples distributed, 100 email signups, and direct feedback from at least 50 consumers.',
      interestedInSamplingTools: 'yes',
      hasTestPanels: 'yes',
      testPanelDetails: 'We are looking for fitness enthusiasts to try our new flavors and provide feedback in July-August.',
      additionalInfo: 'We can also provide branded reusable water bottles as giveaways.',
      createdAt: new Date()
    };
    // Create test organizer
    const testOrganizer = {
      id: 'organizer-test-1',
      userId: 'organizer-demo',
      organizerName: 'Active Life Events',
      contactName: 'Demo Organizer User',
      email: 'organizer@demo.com',
      phone: '0709876543',
      website: 'https://activelifeevents.example',
      address: 'Eventvägen 5',
      postalCode: '12345',
      city: 'Stockholm',
      eventName: 'Stockholm Fitness Festival',
      eventType: 'festival',
      elevatorPitch: 'The largest fitness and wellness event in Stockholm, bringing together fitness enthusiasts, health professionals, and wellness brands.',
      eventFrequency: 'annual',
      eventDate: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split('T')[0],
      location: 'Stockholm Exhibition Center',
      attendeeCount: '1000_5000',
      audienceDescription: 'Fitness enthusiasts, health-conscious consumers, personal trainers, and wellness professionals.',
      audienceDemographics: ['18-24', '25-34', '35-44'],
      sponsorshipNeeds: 'We are looking for food and beverage brands that align with our healthy lifestyle focus, particularly organic and natural products.',
      seekingFinancialSponsorship: 'yes',
      financialSponsorshipAmount: '75000',
      financialSponsorshipOffers: 'Main stage branding, dedicated sampling area, inclusion in all marketing materials, and VIP access passes for brand representatives.',
      offeringTypes: ['brand_visibility', 'product_sampling', 'content_creation', 'lead_generation'],
      brandVisibility: 'Logo on main stage, dedicated booth space, inclusion in event program and website.',
      contentCreation: 'Professional photos and videos of your brand activation, social media coverage during the event.',
      leadGeneration: 'Optional lead collection through our event app for attendees who visit your booth.',
      productFeedback: 'We can distribute feedback forms to attendees who sample your products.',
      bonusValue: ['media_coverage', 'industry_network'],
      bonusValueDetails: "Our event is covered by major fitness publications and social media influencers. You'll also have access to our network of fitness professionals.",
      additionalInfo: 'We expect around 3,000 attendees based on previous years, with 70% being between 25-40 years old.',
      mediaFiles: [],
      createdAt: new Date()
    };
    // Save test data
    localStorage.setItem('brands', JSON.stringify([testBrand]));
    localStorage.setItem('organizers', JSON.stringify([testOrganizer]));
    // Create a match between the test brand and organizer
    const testMatch = {
      id: 'match-test-1',
      brandId: 'brand-test-1',
      organizerId: 'organizer-test-1',
      score: 92,
      status: 'pending',
      matchReasons: ['Target audience age range matches', 'Industry (food & beverage) aligns with event needs', 'Budget range fits with sponsorship requirements', 'Product sampling opportunity matches event offerings', 'Health-focused brand matches fitness event theme'],
      createdAt: new Date()
    };
    localStorage.setItem('matches', JSON.stringify([testMatch]));
  }
};