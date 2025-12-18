export const ADMIN_TABS = [
  { key: 'users', label: 'Users' },
  { key: 'brands', label: 'Brands' },
  { key: 'organizers', label: 'Organizers' },
  { key: 'matches', label: 'Matches' },
  { key: 'tickets', label: 'Support Tickets' }
] as const

export type AdminTabKey = typeof ADMIN_TABS[number]['key']
