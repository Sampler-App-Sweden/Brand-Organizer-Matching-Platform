import { BookOpenIcon, CalendarIcon, PackageIcon } from 'lucide-react'
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
    path: '/help',
    icon: <BookOpenIcon className='h-4 w-4 mr-0.5' />
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
    path: '/help',
    icon: <BookOpenIcon className='h-4 w-4 mr-0.5' />
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
 * @param role 'brand' | 'organizer' | 'admin' | undefined
 */
export function getMobileNavLinks(role?: string): NavLink[] {
  // Main nav links (always visible)
  const mainLinks: NavLink[] = [
    { label: 'Brands', path: '/brands' },
    { label: 'Organizers', path: '/organizers' },
    { label: 'Help', path: '/help' },
    { label: 'Contact', path: '/contact' }
  ];

  // Dashboard-only links (not visible in dashboard sidebar for mobile)
  let dashboardLinks: NavLink[] = [];
  switch (role?.toLowerCase()) {
    case 'brand':
      dashboardLinks = [
        { label: 'Sponsorships', path: '/dashboard/brand/sponsorships' },
        { label: 'Matches', path: '/dashboard/brand/matches' },
        { label: 'Dashboard', path: '/dashboard/brand' }
      ];
      break;
    case 'organizer':
      dashboardLinks = [
        { label: 'Events', path: '/dashboard/organizer/events' },
        { label: 'Sponsors', path: '/dashboard/organizer/sponsors' },
        { label: 'Dashboard', path: '/dashboard/organizer' }
      ];
      break;
    case 'admin':
      dashboardLinks = [
        { label: 'Users', path: '/admin/users' },
        { label: 'Brands', path: '/admin/brands' },
        { label: 'Organizers', path: '/admin/organizers' },
        { label: 'Dashboard', path: '/admin' }
      ];
      break;
    default:
      dashboardLinks = [
        { label: 'Dashboard', path: '/dashboard' }
      ];
  }
  return [...mainLinks, ...dashboardLinks];
}
