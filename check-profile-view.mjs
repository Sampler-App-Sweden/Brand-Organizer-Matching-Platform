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

async function checkProfileView() {
  console.log('\n🔍 Checking profile_overview view...\n')

  // Check if the view has Northern Lights
  const { data: profiles, error } = await supabase
    .from('profile_overview')
    .select('*')

  if (error) {
    console.error('Error querying profile_overview:', error)
    return
  }

  console.log(`Total profiles in view: ${profiles?.length || 0}`)

  const organizers = profiles?.filter(p => p.role === 'Organizer') || []
  console.log(`Total organizers in view: ${organizers.length}`)

  organizers.forEach((org, idx) => {
    console.log(`\n${idx + 1}. ${org.name || 'N/A'}`)
    console.log(`   ID: ${org.id}`)
    console.log(`   Email: ${org.email || 'N/A'}`)
    console.log(`   Logo URL: ${org.logo_url || 'None'}`)
    console.log(`   Description: ${org.description?.substring(0, 50) || 'None'}`)
    console.log(`   City: ${org.city || 'None'}`)
  })

  // Specifically search for Northern Lights
  console.log('\n\n🔍 Searching specifically for Northern Lights...')
  const northernLights = profiles?.find(p => p.name?.toLowerCase().includes('northern'))

  if (northernLights) {
    console.log('✅ FOUND Northern Lights in profile_overview:')
    console.log(JSON.stringify(northernLights, null, 2))
  } else {
    console.log('❌ NOT FOUND in profile_overview')

    // Check if it exists in profiles table
    console.log('\n🔍 Checking profiles table directly...')
    const { data: directProfiles, error: directError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'Organizer')

    if (directError) {
      console.error('Error querying profiles table:', directError)
    } else {
      const directNorthernLights = directProfiles?.find(p => p.name?.toLowerCase().includes('northern'))
      if (directNorthernLights) {
        console.log('✅ FOUND in profiles table:')
        console.log(JSON.stringify(directNorthernLights, null, 2))
      } else {
        console.log('❌ NOT FOUND in profiles table either')
      }
    }
  }
}

checkProfileView().catch(console.error)