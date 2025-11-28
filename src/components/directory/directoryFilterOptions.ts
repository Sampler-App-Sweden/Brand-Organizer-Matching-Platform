export function getCategoryOptions(memberType: 'brand' | 'organizer') {
  return memberType === 'brand'
    ? [
        { value: '', label: 'All Categories' },
        { value: 'food_beverage', label: 'Food & Beverage' },
        { value: 'beauty_cosmetics', label: 'Beauty & Cosmetics' },
        { value: 'health_wellness', label: 'Health & Wellness' },
        { value: 'tech', label: 'Technology' },
        { value: 'fashion', label: 'Fashion & Apparel' },
        { value: 'home_goods', label: 'Home Goods' },
        { value: 'sports_fitness', label: 'Sports & Fitness' },
        { value: 'entertainment', label: 'Entertainment' }
      ]
    : [
        { value: '', label: 'All Categories' },
        { value: 'festival', label: 'Festival' },
        { value: 'conference', label: 'Conference' },
        { value: 'expo', label: 'Expo' },
        { value: 'workshop', label: 'Workshop' },
        { value: 'sports', label: 'Sports Event' },
        { value: 'community', label: 'Community Event' },
        { value: 'networking', label: 'Networking Event' },
        { value: 'concert', label: 'Concert' }
      ]
}

export const locationOptions = [
  { value: '', label: 'All Locations' },
  { value: 'stockholm', label: 'Stockholm' },
  { value: 'gothenburg', label: 'Gothenburg' },
  { value: 'malmo', label: 'Malmö' },
  { value: 'uppsala', label: 'Uppsala' },
  { value: 'other', label: 'Other' }
]

export const eventTypeOptions = [
  { value: '', label: 'All Event Types' },
  { value: 'festival', label: 'Festival' },
  { value: 'conference', label: 'Conference' },
  { value: 'expo', label: 'Expo' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'sports', label: 'Sports Event' },
  { value: 'community', label: 'Community Event' },
  { value: 'networking', label: 'Networking Event' },
  { value: 'concert', label: 'Concert' }
]

export const audienceSizeOptions = [
  { value: '', label: 'All Sizes' },
  { value: 'under_100', label: 'Under 100' },
  { value: '100_500', label: '100 - 500' },
  { value: '500_1000', label: '500 - 1,000' },
  { value: '1000_5000', label: '1,000 - 5,000' },
  { value: '5000_plus', label: '5,000+' }
]
