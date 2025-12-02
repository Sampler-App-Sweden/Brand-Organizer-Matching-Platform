import { createElement } from 'react'
import {
  HandshakeIcon,
  HomeIcon,
  MessageSquareIcon,
  UsersIcon
} from 'lucide-react'

// Dashboard sidebar items
export const sidebarItems = {
  brand: [
    {
      label: 'Dashboard',
      icon: createElement(HomeIcon, { className: 'h-5 w-5' }),
      path: '/dashboard/brand'
    },
    {
      label: 'Sponsorships',
      icon: createElement(HandshakeIcon, { className: 'h-5 w-5' }),
      path: '/dashboard/sponsorships'
    },
    {
      label: 'Matches',
      icon: createElement(UsersIcon, { className: 'h-5 w-5' }),
      path: '/dashboard/matches'
    },
    {
      label: 'Messages',
      icon: createElement(MessageSquareIcon, { className: 'h-5 w-5' }),
      path: '/dashboard/messages'
    }
  ],
  organizer: [
    {
      label: 'Dashboard',
      icon: createElement(HomeIcon, { className: 'h-5 w-5' }),
      path: '/dashboard/organizer'
    },
    {
      label: 'Sponsorships',
      icon: createElement(HandshakeIcon, { className: 'h-5 w-5' }),
      path: '/dashboard/sponsorships'
    },
    {
      label: 'Matches',
      icon: createElement(UsersIcon, { className: 'h-5 w-5' }),
      path: '/dashboard/matches'
    },
    {
      label: 'Messages',
      icon: createElement(MessageSquareIcon, { className: 'h-5 w-5' }),
      path: '/dashboard/messages'
    }
  ],
  admin: [
    {
      label: 'Dashboard',
      icon: createElement(HomeIcon, { className: 'h-5 w-5' }),
      path: '/admin'
    },
    {
      label: 'Brands',
      icon: createElement(UsersIcon, { className: 'h-5 w-5' }),
      path: '/admin/brands'
    },
    {
      label: 'Organizers',
      icon: createElement(UsersIcon, { className: 'h-5 w-5' }),
      path: '/admin/organizers'
    },
    {
      label: 'Matches',
      icon: createElement(HandshakeIcon, { className: 'h-5 w-5' }),
      path: '/admin/matches'
    }
  ],
  common: [
    {
      label: 'Profile',
      icon: createElement(UsersIcon, { className: 'h-5 w-5' }),
      path: '/dashboard/edit-profile'
    },
    {
      label: 'Log out',
      icon: createElement(MessageSquareIcon, { className: 'h-5 w-5' }),
      path: '/logout'
    }
  ]
}
