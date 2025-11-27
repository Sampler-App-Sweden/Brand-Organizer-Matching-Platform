import { createClient } from '@supabase/supabase-js'

// Safely access environment variables with fallbacks
const supabaseUrl =
  (typeof process !== 'undefined' && process.env?.REACT_APP_SUPABASE_URL) ||
  'https://your-project-url.supabase.co'

const supabaseAnonKey =
  (typeof process !== 'undefined' &&
    process.env?.REACT_APP_SUPABASE_ANON_KEY) ||
  'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
