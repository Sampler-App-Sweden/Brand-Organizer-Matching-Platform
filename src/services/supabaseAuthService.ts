import { supabase } from './supabaseClient';
// Sign up a new user
export async function signUp(email: string, password: string, metadata: any = {}) {
  const {
    data,
    error
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
  if (error) {
    console.error('Error signing up:', error);
    throw new Error(error.message);
  }
  return data;
}
// Sign in a user
export async function signIn(email: string, password: string) {
  const {
    data,
    error
  } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  if (error) {
    console.error('Error signing in:', error);
    throw new Error(error.message);
  }
  return data;
}
// Sign out
export async function signOut() {
  const {
    error
  } = await supabase.auth.signOut();
  if (error) {
    console.error('Error signing out:', error);
    throw new Error(error.message);
  }
}
// Get the current user
export async function getCurrentUser() {
  const {
    data: {
      user
    }
  } = await supabase.auth.getUser();
  return user;
}
// Get user session
export async function getSession() {
  const {
    data,
    error
  } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    throw new Error(error.message);
  }
  return data.session;
}
// Reset password
export async function resetPassword(email: string) {
  const {
    error
  } = await supabase.auth.resetPasswordForEmail(email);
  if (error) {
    console.error('Error resetting password:', error);
    throw new Error(error.message);
  }
}
// Update user
export async function updateUser(updates: any) {
  const {
    data,
    error
  } = await supabase.auth.updateUser(updates);
  if (error) {
    console.error('Error updating user:', error);
    throw new Error(error.message);
  }
  return data;
}