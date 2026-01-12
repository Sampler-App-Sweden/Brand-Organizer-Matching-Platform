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

async function fixDescription() {
  const userId = '3b5f48bc-b991-4318-975a-c2fda625c9c7'

  console.log('🔧 Adding description to Northern Lights Events profile...\n')

  // Update the profiles table with a proper description
  const { data, error } = await supabase
    .from('profiles')
    .update({
      description: 'Premier concert and live music event organizer specializing in immersive entertainment experiences for music lovers and cultural enthusiasts.'
    })
    .eq('id', userId)
    .select()

  if (error) {
    console.error('❌ Error updating profile:', error)
    return
  }

  console.log('✅ Profile description updated successfully!')
  if (data && data.length > 0) {
    console.log('   New description:', data[0].description)
  }

  // Verify it shows up in profile_overview
  console.log('\n🔍 Verifying in profile_overview...')
  const { data: viewData, error: viewError } = await supabase
    .from('profile_overview')
    .select('*')
    .eq('id', userId)
    .single()

  if (viewError) {
    console.error('❌ Error checking profile_overview:', viewError)
  } else {
    console.log('✅ Profile in directory view:')
    console.log(`   Name: ${viewData.name}`)
    console.log(`   Description: ${viewData.description}`)
    console.log(`   Logo: ${viewData.logo_url ? '✅ Present' : '❌ Missing'}`)
    console.log(`   Audience Tags: ${JSON.stringify(viewData.what_they_seek?.audienceTags)}`)

    // Check if it would pass the isProfileComplete check
    const hasDescription = viewData.description && viewData.description.trim() !== ''
    const hasAudienceTags = viewData.what_they_seek?.audienceTags && viewData.what_they_seek.audienceTags.length > 0

    console.log(`\n📋 Profile completeness check:`)
    console.log(`   Has description: ${hasDescription ? '✅' : '❌'}`)
    console.log(`   Has audience tags: ${hasAudienceTags ? '✅' : '❌'}`)
    console.log(`   Would appear in directory: ${hasDescription && hasAudienceTags ? '✅ YES' : '❌ NO'}`)
  }
}

fixDescription().catch(console.error)