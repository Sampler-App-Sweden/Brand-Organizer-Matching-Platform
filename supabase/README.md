# Supabase Edge Functions

This directory contains all server-side Edge Functions for the Brand Organizer Matching Platform.

## Quick Start

```bash
# Install Supabase CLI
npm install -g supabase

# Login
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy all functions
supabase functions deploy generate-matches
supabase functions deploy send-email
supabase functions deploy process-payment
```

## Functions

| Function | Purpose | Status |
|----------|---------|--------|
| `generate-matches` | Calculate brand-organizer matches | ✅ Production Ready |
| `send-email` | Send templated emails | ✅ Production Ready |
| `process-payment` | Process payments via Stripe | 🚧 Stub (needs Stripe setup) |

## Directory Structure

```
supabase/
├── functions/
│   ├── _shared/
│   │   └── cors.ts           # Shared CORS configuration
│   ├── generate-matches/
│   │   └── index.ts          # Match generation logic
│   ├── send-email/
│   │   └── index.ts          # Email sending logic
│   └── process-payment/
│       └── index.ts          # Payment processing logic
└── README.md
```

## Required Environment Variables

Set these in your Supabase project (Settings > Edge Functions):

```bash
RESEND_API_KEY=your_resend_api_key        # For email functionality
STRIPE_SECRET_KEY=your_stripe_secret_key   # For payment processing
```

## Testing Locally

```bash
# Start local Supabase
supabase start

# Serve function
supabase functions serve generate-matches --env-file .env.local

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/generate-matches' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"brand","entityId":"uuid-here"}'
```

## Documentation

See [EDGE_FUNCTIONS_SETUP.md](../docs/EDGE_FUNCTIONS_SETUP.md) for detailed setup instructions.
