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

async function checkOrganizers() {
  console.log('\n🔍 Searching for Northern Lights Organizer...\n')

  // Check organizers table
  const { data: organizers, error: orgError } = await supabase
    .from('organizers')
    .select('*')
    .or('organizer_name.ilike.%northern%,contact_name.ilike.%northern%')

  if (orgError) {
    console.error('Error querying organizers:', orgError)
  } else {
    console.log(`Found ${organizers?.length || 0} organizers with "northern" in the name:`)
    organizers?.forEach(org => {
      console.log(`  - ${org.organizer_name || 'N/A'} (ID: ${org.id})`)
      console.log(`    Contact: ${org.contact_name || 'N/A'}`)
      console.log(`    Email: ${org.email || 'N/A'}`)
      console.log(`    User ID: ${org.user_id}`)
    })
  }

  console.log('\n📋 All organizers in database:')
  const { data: allOrganizers, error: allOrgError } = await supabase
    .from('organizers')
    .select('id, organizer_name, contact_name, email, user_id, created_at')
    .order('created_at', { ascending: false })

  if (allOrgError) {
    console.error('Error querying all organizers:', allOrgError)
  } else {
    console.log(`Total organizers: ${allOrganizers?.length || 0}`)
    allOrganizers?.forEach((org, idx) => {
      console.log(`  ${idx + 1}. ${org.organizer_name || 'N/A'} (User ID: ${org.user_id})`)
    })
  }

  // Check profiles table for organizers with logos
  console.log('\n🖼️  Checking profiles with logos...')
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('id, name, role, logo_url')
    .eq('role', 'Organizer')
    .not('logo_url', 'is', null)

  if (profileError) {
    console.error('Error querying profiles:', profileError)
  } else {
    console.log(`Found ${profiles?.length || 0} organizer profiles with logos:`)
    profiles?.forEach(profile => {
      console.log(`  - ${profile.name}: ${profile.logo_url}`)
    })
  }

  // List files in brand-logos storage
  console.log('\n📁 Checking brand-logos storage bucket...')
  const { data: files, error: storageError } = await supabase
    .storage
    .from('brand-logos')
    .list('', {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    })

  if (storageError) {
    console.error('Error listing storage files:', storageError)
  } else {
    console.log(`Found ${files?.length || 0} files in brand-logos bucket:`)
    files?.forEach(file => {
      console.log(`  - ${file.name} (${(file.metadata?.size / 1024).toFixed(2)} KB) - ${new Date(file.created_at).toLocaleString()}`)
    })
  }
}

checkOrganizers().catch(console.error)