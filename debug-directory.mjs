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

async function debugDirectory() {
  console.log('\n🔍 Debugging Organizers Directory Page...\n')

  // Simulate what the page does - get all profiles
  const { data: profiles, error } = await supabase
    .from('profile_overview')
    .select('*')

  if (error) {
    console.error('❌ Error querying profile_overview:', error)
    return
  }

  console.log(`✅ Total profiles fetched: ${profiles?.length || 0}`)

  // Filter by role 'Organizer' (same as the page does)
  const organizers = profiles?.filter(p => p.role === 'Organizer') || []
  console.log(`✅ Total organizers after filtering: ${organizers.length}`)

  // Check if Northern Lights is in there
  const northernLights = organizers.find(p => p.name?.toLowerCase().includes('northern'))

  if (northernLights) {
    console.log('\n✅ Northern Lights FOUND in filtered results!')
    console.log('Full data:')
    console.log(JSON.stringify(northernLights, null, 2))
  } else {
    console.log('\n❌ Northern Lights NOT FOUND in filtered results')
    console.log('\nAll organizer names:')
    organizers.forEach((org, idx) => {
      console.log(`  ${idx + 1}. ${org.name} (ID: ${org.id})`)
    })
  }

  // Check the what_they_seek field which might cause filtering issues
  console.log('\n📋 Checking what_they_seek fields for all organizers:')
  organizers.forEach(org => {
    console.log(`\n${org.name}:`)
    console.log(`  sponsorshipTypes: ${JSON.stringify(org.what_they_seek?.sponsorshipTypes)}`)
    console.log(`  eventTypes: ${JSON.stringify(org.what_they_seek?.eventTypes)}`)
    console.log(`  budgetRange: ${org.what_they_seek?.budgetRange}`)
    console.log(`  audienceTags: ${JSON.stringify(org.what_they_seek?.audienceTags)}`)
  })

  // Check if there's a description
  console.log('\n📝 Checking descriptions:')
  organizers.forEach(org => {
    console.log(`${org.name}: "${org.description || '(empty)'}"`)
  })
}

debugDirectory().catch(console.error)