// Supabase Edge Function to get storage configuration
// Returns file size limits and allowed types for frontend validation

import { corsHeaders } from '../_shared/cors.ts'
import { STORAGE_CONFIG, STORAGE_LIMITS } from '../_shared/storage-config.ts'

Deno.serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Return storage configuration
    return new Response(
      JSON.stringify({
        success: true,
        config: STORAGE_LIMITS,
        buckets: Object.keys(STORAGE_CONFIG.buckets)
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
