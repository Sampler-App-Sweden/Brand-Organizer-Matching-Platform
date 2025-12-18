# Supabase Edge Functions Setup Guide

This guide explains how to set up and deploy the Supabase Edge Functions for the Brand Organizer Matching Platform.

## Overview

We've migrated critical business logic from the client to server-side Edge Functions for:

- **Security**: Matching algorithms and business rules are hidden from users
- **Performance**: Server-side processing is faster for compute-intensive operations
- **Integration**: Secure integration with third-party services (email, payments)
- **Scalability**: Better resource management and scaling

## Available Edge Functions

### 1. `generate-matches`
Calculates match scores between brands and organizers using our proprietary algorithm.

**Location**: `supabase/functions/generate-matches/index.ts`

**Request**:
```json
{
  "type": "brand" | "organizer",
  "entityId": "uuid-of-brand-or-organizer"
}
```

**Response**:
```json
{
  "success": true,
  "matchCount": 5,
  "matches": [...]
}
```

### 2. `send-email`
Sends templated emails for notifications and communications.

**Location**: `supabase/functions/send-email/index.ts`

**Templates Available**:
- `welcome` - New user welcome email
- `new_match` - Notify users of new matches
- `match_accepted` - Notify when a match is accepted
- `support_ticket` - Confirmation for support tickets
- `custom` - Custom HTML email

**Request**:
```json
{
  "to": "user@example.com",
  "subject": "Welcome!",
  "template": "welcome",
  "data": {
    "name": "John Doe",
    "userType": "brand"
  }
}
```

### 3. `process-payment`
Handles payment processing (Stripe integration - currently a stub).

**Location**: `supabase/functions/process-payment/index.ts`

**Request**:
```json
{
  "amount": 5000,
  "currency": "usd",
  "userId": "uuid",
  "description": "Premium subscription",
  "metadata": {}
}
```

## Prerequisites

1. **Supabase CLI** - Install it:
   ```bash
   npm install -g supabase
   ```

2. **Supabase Project** - You need an active Supabase project

3. **Environment Variables** - Set these up in your Supabase project

## Installation Steps

### Step 1: Initialize Supabase (if not already done)

```bash
# Login to Supabase
supabase login

# Link to your existing project
supabase link --project-ref your-project-ref
```

### Step 2: Set Environment Variables

In your Supabase project dashboard (Settings > Edge Functions), add these secrets:

```bash
# For email functionality (using Resend)
RESEND_API_KEY=your_resend_api_key

# For payment processing (using Stripe)
STRIPE_SECRET_KEY=your_stripe_secret_key
```

Or use the CLI:

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key
supabase secrets set STRIPE_SECRET_KEY=your_stripe_secret_key
```

### Step 3: Deploy Edge Functions

Deploy all functions:

```bash
# Deploy all functions
supabase functions deploy generate-matches
supabase functions deploy send-email
supabase functions deploy process-payment
```

Or deploy individually:

```bash
supabase functions deploy generate-matches
```

### Step 4: Test Locally (Optional)

Run functions locally for testing:

```bash
# Start local Supabase
supabase start

# Serve a function locally
supabase functions serve generate-matches

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/generate-matches' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"type":"brand","entityId":"some-uuid"}'
```

## Usage in Frontend

### Using the Helper Service

```typescript
import { generateMatches, sendEmail, processPayment } from '@/services/edgeFunctions'

// Generate matches
const result = await generateMatches('brand', brandId)
console.log(`Generated ${result.matchCount} matches`)

// Send welcome email
await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to BOMP!',
  template: 'welcome',
  data: {
    name: 'John Doe',
    userType: 'brand',
    dashboardUrl: 'https://your-app.com/dashboard'
  }
})

// Process payment
const payment = await processPayment({
  amount: 5000, // $50.00
  currency: 'usd',
  userId: currentUser.id,
  description: 'Premium subscription'
})
```

### Direct Supabase Client Call

```typescript
import { supabase } from '@/services/supabaseClient'

const { data, error } = await supabase.functions.invoke('generate-matches', {
  body: { type: 'brand', entityId: brandId }
})
```

## Email Service Setup (Resend)

1. Sign up at [resend.com](https://resend.com)
2. Get your API key
3. Verify your sending domain
4. Add the API key to Supabase secrets:
   ```bash
   supabase secrets set RESEND_API_KEY=re_...
   ```
5. Update the `from` email in `send-email/index.ts`:
   ```typescript
   from: 'BOMP <noreply@your-verified-domain.com>'
   ```

## Payment Service Setup (Stripe)

1. Sign up at [stripe.com](https://stripe.com)
2. Get your secret key (test mode for development)
3. Add to Supabase secrets:
   ```bash
   supabase secrets set STRIPE_SECRET_KEY=sk_test_...
   ```
4. Uncomment the Stripe integration code in `process-payment/index.ts`
5. Create a `payments` table in your database:
   ```sql
   CREATE TABLE payments (
     id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
     user_id UUID REFERENCES auth.users(id),
     amount INTEGER NOT NULL,
     currency TEXT NOT NULL,
     description TEXT,
     stripe_payment_intent_id TEXT,
     status TEXT,
     metadata JSONB,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
   );
   ```

## Monitoring and Logs

View function logs in the Supabase Dashboard:
- Go to Edge Functions section
- Click on a function
- View "Logs" tab

Or use the CLI:

```bash
supabase functions logs generate-matches
```

## Security Considerations

1. **Never expose service role keys** - These are only used in Edge Functions
2. **Use RLS policies** - Even though Edge Functions use service role, still implement RLS
3. **Validate input** - All Edge Functions validate their inputs
4. **Rate limiting** - Consider implementing rate limiting for production
5. **CORS** - Adjust CORS headers in `_shared/cors.ts` for production

## Troubleshooting

### Function not found
- Ensure the function is deployed: `supabase functions list`
- Check the function name matches exactly

### CORS errors
- Check `_shared/cors.ts` configuration
- Ensure your frontend domain is allowed

### Authentication errors
- Verify you're passing the correct Authorization header
- Check Supabase project URL and keys

### Function timeout
- Edge Functions have a 150s timeout limit
- Consider breaking up long-running operations

## Migration from Client-Side

The following client-side code has been migrated to Edge Functions:

### Before (Client-Side):
```typescript
// In dataService.ts
const organizers = await fetchAllOrganizers()
const matches = findMatchesForBrand(newBrand, organizers)
await insertMatchSuggestions(matches)
```

### After (Edge Function):
```typescript
// In dataService.ts
const { data } = await supabase.functions.invoke('generate-matches', {
  body: { type: 'brand', entityId: newBrand.id }
})
```

**Benefits**:
- Matching algorithm is now server-side (protected)
- No need to fetch all organizers to the client
- Faster execution
- Lower client bandwidth usage

## Next Steps

1. **Deploy to production** - Use production API keys
2. **Set up monitoring** - Track function usage and errors
3. **Implement webhooks** - For Stripe events (payment confirmations, etc.)
4. **Add more functions** - As your platform grows:
   - Analytics aggregation
   - Report generation
   - Data exports
   - Third-party API integrations

## Additional Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Resend API Docs](https://resend.com/docs)
- [Stripe API Docs](https://stripe.com/docs/api)
