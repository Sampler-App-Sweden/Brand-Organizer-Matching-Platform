export interface CommunityMember {
  id: string;
  userId: string;
  type: 'brand' | 'organizer';
  name: string;
  logoUrl: string | null;
  shortDescription: string;
  description: string;
  website: string;
  email: string;
  phone: string;
  socialLinks: string;
  featured: boolean;
  dateRegistered: string;
}
export interface CommunityQueryParams {
  page?: number;
  limit?: number;
  featured?: boolean;
  type?: 'brand' | 'organizer';
  search?: string;
  category?: string;
  location?: string;
  eventType?: string;
  audienceSize?: string;
}