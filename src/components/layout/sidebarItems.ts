import {
  Bookmark,
  HandshakeIcon,
  HomeIcon,
  LogOut,
  MessageSquareIcon,
  Package,
  UsersIcon
} from 'lucide-react'
import { createElement, ReactElement } from 'react'

export type SidebarAction = 'logout'
export interface SidebarItem {
  label: string
  icon: ReactElement
  path?: string
  action?: SidebarAction
  matchExact?: boolean
}

export type SidebarCollection = {
  brand: SidebarItem[]
  organizer: SidebarItem[]
  admin: SidebarItem[]
  common: SidebarItem[]
}

// Dashboard sidebar items
export const sidebarItems: SidebarCollection = {
  brand: [
    {
      label: 'Dashboard',
      icon: createElement(HomeIcon, { className: 'h-5 w-5' }),
      path: '/dashboard/brand',
      matchExact: true
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
      label: 'Products',
      icon: createElement(Package, { className: 'h-5 w-5' }),
      path: '/dashboard/products'
    },
    {
      label: 'Messages',
      icon: createElement(MessageSquareIcon, { className: 'h-5 w-5' }),
      path: '/dashboard/messages'
    },
    {
      label: 'Saved',
      icon: createElement(Bookmark, { className: 'h-5 w-5' }),
      path: '/dashboard/saved'
    }
  ],
  organizer: [
    {
      label: 'Dashboard',
      icon: createElement(HomeIcon, { className: 'h-5 w-5' }),
      path: '/dashboard/organizer',
      matchExact: true
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
    },
    {
      label: 'Saved',
      icon: createElement(Bookmark, { className: 'h-5 w-5' }),
      path: '/dashboard/saved'
    }
  ],
  admin: [
    {
      label: 'Dashboard',
      icon: createElement(HomeIcon, { className: 'h-5 w-5' }),
      path: '/admin',
      matchExact: true
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
      icon: createElement(LogOut, { className: 'h-5 w-5' }),
      action: 'logout'
    }
  ]
}
