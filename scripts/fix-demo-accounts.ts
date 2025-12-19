import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase credentials. Please check your .env file.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

const DEMO_ACCOUNTS = [
  {
    email: 'brand@demo.com',
    password: 'demo123',
    type: 'brand',
    name: 'Demo Brand',
    role: 'Brand'
  },
  {
    email: 'organizer@demo.com',
    password: 'demo123',
    type: 'organizer',
    name: 'Demo Organizer',
    role: 'Organizer'
  }
]

async function fixDemoAccounts() {
  console.log('🔍 Checking demo accounts...\n')

  for (const account of DEMO_ACCOUNTS) {
    console.log(`Checking ${account.email}...`)

    // Check if user exists in auth.users
    const { data: users, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
      console.error(`❌ Error listing users: ${listError.message}`)
      continue
    }

    const existingUser = users.users.find(u => u.email === account.email)

    if (!existingUser) {
      console.log(`  ⚠️  User not found in auth.users, creating...`)

      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,
        user_metadata: {
          type: account.type,
          name: account.name,
          role: account.role
        }
      })

      if (createError) {
        console.error(`  ❌ Error creating user: ${createError.message}`)
        continue
      }

      console.log(`  ✅ Created user: ${newUser.user?.id}`)
    } else {
      console.log(`  ✅ User exists in auth.users: ${existingUser.id}`)

      // Check if profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', existingUser.id)
        .maybeSingle()

      if (profileError) {
        console.error(`  ❌ Error checking profile: ${profileError.message}`)
        continue
      }

      if (!profile) {
        console.log(`  ⚠️  Profile missing, creating...`)

        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: existingUser.id,
            role: account.role,
            name: account.name,
            email: account.email
          })

        if (insertError) {
          console.error(`  ❌ Error creating profile: ${insertError.message}`)
          continue
        }

        console.log(`  ✅ Created profile`)
      } else {
        console.log(`  ✅ Profile exists: ${profile.name} (${profile.role})`)
      }

      // Update user metadata to match
      const { error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          user_metadata: {
            type: account.type,
            name: account.name,
            role: account.role
          }
        }
      )

      if (updateError) {
        console.error(`  ⚠️  Warning: Could not update metadata: ${updateError.message}`)
      } else {
        console.log(`  ✅ Updated user metadata`)
      }
    }

    console.log()
  }

  console.log('✅ Demo accounts check complete!')
  console.log('\nYou can now try logging in with:')
  console.log('  • brand@demo.com / demo123')
  console.log('  • organizer@demo.com / demo123')
}

fixDemoAccounts().catch((error) => {
  console.error('❌ Script failed:', error)
  process.exit(1)
})
