export interface Collaboration {
  id: string;
  title: string;
  type: 'product_sampling' | 'event_sponsorship' | 'digital_campaign' | 'merchandise';
  brandName: string;
  organizerName: string;
  description: string;
  imageUrl: string;
  metrics: {
    attendees: string;
    samples: string;
    leads?: string;
    socialReach?: string;
  };
  saved: boolean;
}