import React, { useEffect, useState, createContext, useContext } from 'react';
import { signIn, signUp, signOut, getCurrentUser, getSession } from '../services/supabaseAuthService';
import { createProfile } from '../services/profileService';
interface User {
  id: string;
  email: string;
  type: 'brand' | 'organizer' | 'admin';
  name: string;
}
interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string, type: 'brand' | 'organizer', name: string) => Promise<User>;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Check for existing session on load
    const checkSession = async () => {
      try {
        const session = await getSession();
        if (session) {
          const user = await getCurrentUser();
          if (user && user.user_metadata) {
            setCurrentUser({
              id: user.id,
              email: user.email || '',
              type: user.user_metadata.type || 'brand',
              name: user.user_metadata.name || ''
            });
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);
  const login = async (email: string, password: string) => {
    try {
      const {
        user
      } = await signIn(email, password);
      if (user && user.user_metadata) {
        const loggedInUser = {
          id: user.id,
          email: user.email || '',
          type: user.user_metadata.type || 'brand',
          name: user.user_metadata.name || ''
        };
        setCurrentUser(loggedInUser);
        return loggedInUser;
      }
      throw new Error('User metadata not found');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  const register = async (email: string, password: string, type: 'brand' | 'organizer', name: string) => {
    try {
      // Sign up the user with metadata
      const {
        user
      } = await signUp(email, password, {
        type,
        name
      });
      if (!user) {
        throw new Error('Registration failed');
      }
      // Create a profile for the new user
      await createProfile({
        role: type === 'brand' ? 'Brand' : 'Organizer',
        name,
        description: '',
        whatTheySeek: {
          sponsorshipTypes: [],
          budgetRange: ''
        }
      });
      const newUser = {
        id: user.id,
        email: user.email || '',
        type,
        name
      };
      setCurrentUser(newUser);
      return newUser;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };
  const logout = async () => {
    try {
      await signOut();
      setCurrentUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };
  return <AuthContext.Provider value={{
    currentUser,
    loading,
    login,
    register,
    logout
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}