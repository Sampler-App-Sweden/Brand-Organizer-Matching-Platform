// AI Services
export * from './aiService'

// Analytics
export { trackEvent, EVENTS } from './analyticsService'

// Auth Services
export * from './authService'
export * from './supabaseAuthService'

// Chat
export * from './chatService'

// Community
export * from './communityService'

// Collaboration
export * from './collaborationService'

// Data & Profile Services
export * from './dataService'
export * from './profileService'
export * from './draftService'

// Email
export { initEmailJS, sendDataByEmail } from './emailService'

// Matching & Experiments
// Note: Match algorithm moved to Edge Functions (server-side only)
// Match type available from '../types'
export * from './experimentService'
export * from './matchPreferencesService'

// Supabase Client
export { supabase } from './supabaseClient'
