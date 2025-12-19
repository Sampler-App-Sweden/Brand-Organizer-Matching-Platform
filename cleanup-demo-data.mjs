import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import * as readline from 'readline'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
dotenv.config({ path: join(__dirname, '.env') })

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve)
  })
}

async function cleanupDemoData() {
  console.log('=== Demo Data Cleanup Tool ===\n')
  console.log('This will help you clean up interests, matches, and conversations')
  console.log('so you can test the mutual interest flow from scratch.\n')

  const answer = await question('Do you want to delete ALL interests, matches, and conversations? (yes/no): ')

  if (answer.toLowerCase() !== 'yes') {
    console.log('Cleanup cancelled.')
    rl.close()
    process.exit(0)
  }

  console.log('\nDeleting data...\n')

  // Delete all interests
  const { error: interestsError, count: interestsCount } = await supabase
    .from('interests')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

  if (interestsError) {
    console.error('Error deleting interests:', interestsError.message)
  } else {
    console.log(`✓ Deleted interests`)
  }

  // Delete all matches
  const { error: matchesError, count: matchesCount } = await supabase
    .from('matches')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

  if (matchesError) {
    console.error('Error deleting matches:', matchesError.message)
  } else {
    console.log(`✓ Deleted matches`)
  }

  // Delete all conversations (this will also cascade delete messages due to foreign key)
  const { error: convsError, count: convsCount } = await supabase
    .from('conversations')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000') // Delete all

  if (convsError) {
    console.error('Error deleting conversations:', convsError.message)
  } else {
    console.log(`✓ Deleted conversations (and their messages)`)
  }

  console.log('\n✅ Cleanup complete! You can now test the mutual interest flow from scratch.\n')

  console.log('Next steps:')
  console.log('1. Go to the brand directory as the demo organizer')
  console.log('2. Express interest in the demo brand')
  console.log('3. Switch to the demo brand account')
  console.log('4. Go to Interests page → Received tab')
  console.log('5. Click "Accept" on the organizer\'s interest')
  console.log('6. Check that the match appears in Interests → Mutual tab and Matches → Confirmed tab')

  rl.close()
  process.exit(0)
}

cleanupDemoData().catch(err => {
  console.error('Error:', err)
  rl.close()
  process.exit(1)
})
