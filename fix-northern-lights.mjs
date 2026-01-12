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

async function fixNorthernLights() {
  const userId = '3b5f48bc-b991-4318-975a-c2fda625c9c7'

  console.log('🔧 Updating Northern Lights Events profile...\n')

  // Update the profiles table with a description and proper what_they_seek
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .update({
      description: 'Premier concert and live music event organizer specializing in immersive entertainment experiences for music lovers and cultural enthusiasts.',
      what_they_seek: {
        sponsorshipTypes: ['brand_visibility', 'lead_generation', 'content_collaboration'],
        eventTypes: ['concert', 'music_festival', 'live_performance'],
        audienceTags: ['Music lovers', 'Concert-goers', 'Entertainment enthusiasts', '18-45 age range'],
        budgetRange: '$5,000 - $15,000',
        notes: 'Looking for brand partnerships for concert series and live music events in Northern regions.'
      },
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()

  if (profileError) {
    console.error('❌ Error updating profile:', profileError)
  } else {
    console.log('✅ Profile updated successfully!')
  }

  // Also update the organizers table
  const { data: organizerData, error: organizerError } = await supabase
    .from('organizers')
    .update({
      elevator_pitch: 'Premier concert and live music event organizer specializing in immersive entertainment experiences.',
      audience_description: 'Music lovers, concert-goers, and entertainment enthusiasts aged 18-45',
      additional_info: 'Looking for brand partnerships for concert series and live music events in Northern regions.'
    })
    .eq('user_id', userId)
    .select()

  if (organizerError) {
    console.error('❌ Error updating organizer:', organizerError)
  } else {
    console.log('✅ Organizer record updated successfully!')
  }

  // Verify the update
  console.log('\n🔍 Verifying update...')
  const { data: verifyData, error: verifyError } = await supabase
    .from('profile_overview')
    .select('*')
    .eq('id', userId)
    .single()

  if (verifyError) {
    console.error('❌ Error verifying:', verifyError)
  } else {
    console.log('✅ Verified! Updated profile:')
    console.log(`   Name: ${verifyData.name}`)
    console.log(`   Description: ${verifyData.description}`)
    console.log(`   Logo URL: ${verifyData.logo_url ? '✅ Present' : '❌ Missing'}`)
    console.log(`   Audience Tags: ${JSON.stringify(verifyData.what_they_seek?.audienceTags)}`)
    console.log(`   Event Types: ${JSON.stringify(verifyData.what_they_seek?.eventTypes)}`)
  }
}

fixNorthernLights().catch(console.error)