import { Building, Calendar, Users, LucideIcon } from 'lucide-react'

export interface DemoAccount {
  type: string
  email: string
  password: string
  description: string
  icon: LucideIcon
}

export const demoAccounts: DemoAccount[] = [
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
