import {
  BellIcon,
  BookOpenIcon,
  Bookmark,
  CalendarIcon,
  HandshakeIcon,
  Heart,
  MessageSquareIcon,
  PackageIcon,
  UsersIcon
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
  },
  {
    label: 'Help',
    path: '/help'
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
    label: 'Help',
    path: '/help'
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
    label: 'Help',
    path: '/help',
    icon: <BookOpenIcon className='h-5 w-5' />
  }
]

export const FOOTER_NAV_LINKS: NavLink[] = [
  {
    label: 'About',
    path: '/about'
  },
  {
    label: 'Privacy',
    path: '/privacy'
  },
  {
    label: 'Terms',
    path: '/terms'
  },
  {
    label: 'Help',
    path: '/help'
  },
  {
    label: 'Contact',
    path: '/contact'
  }
]

/**
 * Returns mobile nav links based on user role.
 * Matches desktop sidebar links with icons for consistency.
 * @param role 'brand' | 'organizer' | 'admin' | undefined
 */
export function getMobileNavLinks(role?: string): NavLink[] {
  // Main nav links (always visible for all users)
  const mainLinks: NavLink[] = [
    { label: 'Brands', path: '/brands' },
    { label: 'Organizers', path: '/organizers' },
    { label: 'Help', path: '/help' },
    { label: 'Contact', path: '/contact' }
  ]

  // Role-specific dashboard links (matches desktop sidebar)
  let dashboardLinks: NavLink[] = []
  switch (role?.toLowerCase()) {
    case 'brand':
      dashboardLinks = [
        {
          label: 'Connections',
          path: '/dashboard/connections',
          icon: <Heart className='h-4 w-4' />
        },
        {
          label: 'Saved',
          path: '/dashboard/saved',
          icon: <Bookmark className='h-4 w-4' />
        }
      ]
      break
    case 'organizer':
      dashboardLinks = [
        {
          label: 'Connections',
          path: '/dashboard/connections',
          icon: <Heart className='h-4 w-4' />
        },
        {
          label: 'Saved',
          path: '/dashboard/saved',
          icon: <Bookmark className='h-4 w-4' />
        }
      ]
      break
    case 'admin':
      dashboardLinks = [
        {
          label: 'Brands',
          path: '/admin/brands',
          icon: <UsersIcon className='h-4 w-4' />
        },
        {
          label: 'Organizers',
          path: '/admin/organizers',
          icon: <UsersIcon className='h-4 w-4' />
        },
        {
          label: 'Matches',
          path: '/admin/matches',
          icon: <HandshakeIcon className='h-4 w-4' />
        }
      ]
      break
    default:
      dashboardLinks = []
  }

  // Common links (shown for all authenticated users)
  const commonLinks: NavLink[] =
    role && role !== ''
      ? [
          {
            label: 'Messages',
            path: '/dashboard/messages',
            icon: <MessageSquareIcon className='h-4 w-4' />
          },
          {
            label: 'Notifications',
            path: '/dashboard/notifications',
            icon: <BellIcon className='h-4 w-4' />
          }
        ]
      : []

  return [...mainLinks, ...dashboardLinks, ...commonLinks]
}
