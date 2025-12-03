import React, { createContext, useContext, useEffect, useState } from 'react'

import { logoutAndRedirect as logoutService } from '../services/logoutService'
import {
  getCurrentUser,
  getSession,
  signIn,
  signUp
} from '../services/supabaseAuthService'
import { supabase } from '../services/supabaseClient'

interface User {
  id: string
  email: string
  type: 'brand' | 'organizer' | 'admin'
  name: string
}
interface AuthContextType {
  currentUser: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (
    email: string,
    password: string,
    type: 'brand' | 'organizer' | 'admin',
    name: string
  ) => Promise<User>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}
const AuthContext = createContext<AuthContextType | undefined>(undefined)
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const refreshUser = async () => {
    try {
      const user = await getCurrentUser()
      if (user) {
        // Fetch updated profile data from Supabase
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('name, role')
          .eq('id', user.id)
          .single()

        if (error) {
          console.error('Error fetching profile in refreshUser:', error)
          return
        }

        const updatedUser = {
          id: user.id,
          email: user.email || '',
          type:
            profile?.role?.toLowerCase() || user.user_metadata?.type || 'brand',
          name: profile?.name || user.user_metadata?.name || ''
        }

        console.log('Refreshing user with updated name:', updatedUser.name)
        setCurrentUser(updatedUser)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
    }
  }

  useEffect(() => {
    // Check for existing session on load
    const checkSession = async () => {
      try {
        const session = await getSession()
        if (session) {
          const user = await getCurrentUser()
          if (user) {
            // Fetch profile data from Supabase
            const { data: profile } = await supabase
              .from('profiles')
              .select('name, role')
              .eq('id', user.id)
              .single()

            setCurrentUser({
              id: user.id,
              email: user.email || '',
              type:
                profile?.role?.toLowerCase() ||
                user.user_metadata?.type ||
                'brand',
              name: profile?.name || user.user_metadata?.name || ''
            })
          }
        }
      } catch (error) {
        console.error('Session check error:', error)
      } finally {
        setLoading(false)
      }
    }
    checkSession()
  }, [])
  const login = async (email: string, password: string) => {
    try {
      const { user } = await signIn(email, password)
      if (user && user.user_metadata) {
        const loggedInUser = {
          id: user.id,
          email: user.email || '',
          type: user.user_metadata.type || 'brand',
          name: user.user_metadata.name || ''
        }
        setCurrentUser(loggedInUser)
        return loggedInUser
      }
      throw new Error('User metadata not found')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }
  const register = async (
    email: string,
    password: string,
    type: 'brand' | 'organizer' | 'admin',
    name: string
  ) => {
    try {
      // Sign up the user with metadata including role
      const { user } = await signUp(email, password, {
        type,
        name,
        role:
          type === 'brand'
            ? 'Brand'
            : type === 'organizer'
            ? 'Organizer'
            : 'Admin'
      })
      if (!user) {
        throw new Error('Registration failed')
      }
      // Profile is auto-created by database trigger
      // No need to call createProfile manually

      const newUser = {
        id: user.id,
        email: user.email || '',
        type,
        name
      }
      setCurrentUser(newUser)
      return newUser
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }
  const logout = async () => {
    try {
      setCurrentUser(null)
      await logoutService()
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }
  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        login,
        register,
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
