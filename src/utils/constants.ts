import { Building, Calendar, Users, LucideIcon } from 'lucide-react'

// Constants
export const APP_NAME = 'SponsrAI'
export const ADMIN_EMAIL = 'preslavnikolov@outlook.com'

// API Endpoints
export const API_ENDPOINTS = {
  BRANDS: '/api/brands',
  ORGANIZERS: '/api/organizers',
  MATCHES: '/api/matches',
  COMMUNITY: '/api/community'
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'sponsrai_auth_token',
  USER_DATA: 'sponsrai_user_data',
  DRAFT_PROFILE: 'sponsrai_draft_profile'
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50
} as const

// Feature Flags
export const FEATURES = {
  AI_ONBOARDING: true,
  COMMUNITY_SHOWCASE: true,
  HELP_CHAT: true
} as const

// Demo Accounts
export interface DemoAccount {
  type: string
  email: string
  password: string
  description: string
  icon: LucideIcon
}

export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    type: 'Brand Demo',
    email: 'brand@demo.com',
    password: 'demo123',
    description: 'EcoRefresh Beverages - Organic energy drink brand',
    icon: Building
  },
  {
    type: 'Organizer Demo',
    email: 'organizer@demo.com',
    password: 'demo123',
    description: 'Active Life Events - Stockholm Fitness Festival',
    icon: Calendar
  },
  {
    type: 'Community Demo',
    email: 'community@demo.com',
    password: 'demo123',
    description: 'Sarah Johnson - Test panel participant',
    icon: Users
  }
]
