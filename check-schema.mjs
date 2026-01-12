import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkSchema() {
  const userId = '3b5f48bc-b991-4318-975a-c2fda625c9c7'

  console.log('🔍 Checking actual profile data structure...\n')

  // Get the actual profile data
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (profileError) {
    console.error('❌ Error fetching profile:', profileError)
  } else {
    console.log('📋 Profile columns:')
    console.log(JSON.stringify(profile, null, 2))
  }

  console.log('\n🔍 Checking organizer data structure...\n')

  // Get the actual organizer data
  const { data: organizer, error: organizerError } = await supabase
    .from('organizers')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (organizerError) {
    console.error('❌ Error fetching organizer:', organizerError)
  } else {
    console.log('📋 Organizer columns:')
    console.log(JSON.stringify(organizer, null, 2))
  }
}

checkSchema().catch(console.error)