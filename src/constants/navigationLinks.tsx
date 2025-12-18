import {
  CalendarIcon,
  PackageIcon,
  SparklesIcon
} from 'lucide-react'
import { ReactNode } from 'react'

export interface NavLink {
  label: string
  path: string
  icon?: ReactNode
}

/**
 * Marketing navigation links (shown when user is not authenticated)
 * Includes icons for visual enhancement
 */
export const MARKETING_NAV_LINKS: NavLink[] = [
  {
    label: 'Brands',
    path: '/brands'
  },
  {
    label: 'Organizers',
    path: '/organizers'
  }
]

/**
 * Dashboard navigation links (shown when user is authenticated)
 * Icons are optional and can be added per-link if needed
 */
export const DASHBOARD_NAV_LINKS: NavLink[] = [
  {
    label: 'Brands',
    path: '/brands'
  },
  {
    label: 'Organizers',
    path: '/organizers'
  },
  {
    label: 'Inspiration',
    path: '/dashboard/inspiration',
    icon: <SparklesIcon className='h-4 w-4 mr-0.5' />
  }
]

/**
 * Main navigation items with larger icons (used in DashboardNavbar)
 * These use h-5 w-5 icons for better visibility in the dashboard layout
 */
export const MAIN_NAV_ITEMS: NavLink[] = [
  {
    label: 'Brands',
    path: '/brands',
    icon: <PackageIcon className='h-5 w-5' />
  },
  {
    label: 'Organizers',
    path: '/organizers',
    icon: <CalendarIcon className='h-5 w-5' />
  },
  {
    label: 'Inspiration',
    path: '/dashboard/inspiration',
    icon: <SparklesIcon className='h-5 w-5' />
  }
]
