# Edge Functions API Quick Reference

Quick reference for calling Edge Functions from the frontend.

## Setup

```typescript
import { supabase } from '@/services/supabaseClient'
// Or use helper functions:
import { generateMatches, sendEmail, processPayment } from '@/services/edgeFunctions'
```

## Generate Matches

**Endpoint**: `generate-matches`

**When to use**: After creating or updating a brand/organizer profile

**Example**:
```typescript
// Using helper function
const result = await generateMatches('brand', brandId)
console.log(`Generated ${result.matchCount} matches`)

// Or direct call
const { data, error } = await supabase.functions.invoke('generate-matches', {
  body: {
    type: 'brand',        // or 'organizer'
    entityId: 'uuid-here'
  }
})
```

**Response**:
```typescript
{
  success: true,
  matchCount: 5,
  matches: [
    {
      brand_id: 'uuid',
      organizer_id: 'uuid',
      score: 75,
      match_reasons: ['Audience alignment', 'Budget fit'],
      status: 'pending'
    },
    // ...
  ]
}
```

---

## Send Email

**Endpoint**: `send-email`

**When to use**: User registration, match notifications, support tickets, etc.

**Templates**: `welcome`, `new_match`, `match_accepted`, `support_ticket`, `custom`

### Welcome Email
```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Welcome to BOMP!',
  template: 'welcome',
  data: {
    name: 'John Doe',
    userType: 'brand', // or 'organizer'
    dashboardUrl: 'https://your-app.com/dashboard'
  }
})
```

### New Match Notification
```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'New Match Found!',
  template: 'new_match',
  data: {
    recipientName: 'Jane Smith',
    matchName: 'Tech Conference 2024',
    score: 85,
    reasons: ['Audience alignment', 'Budget fit', 'Industry relevance'],
    matchUrl: 'https://your-app.com/matches/uuid'
  }
})
```

### Match Accepted Notification
```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Match Accepted!',
  template: 'match_accepted',
  data: {
    recipientName: 'John Doe',
    matchName: 'Brand XYZ',
    chatUrl: 'https://your-app.com/chat/uuid'
  }
})
```

### Support Ticket Confirmation
```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Support Ticket Received',
  template: 'support_ticket',
  data: {
    name: 'John Doe',
    ticketId: 'TICKET-12345',
    category: 'Technical Issue'
  }
})
```

### Custom Email
```typescript
await sendEmail({
  to: 'user@example.com',
  subject: 'Custom Message',
  template: 'custom',
  html: '<h1>Hello!</h1><p>Your custom HTML here</p>'
})
```

---

## Process Payment

**Endpoint**: `process-payment`

**When to use**: Premium subscriptions, paid features, etc.

**Note**: Currently a stub - requires Stripe setup

**Example**:
```typescript
const payment = await processPayment({
  amount: 5000,         // $50.00 (in cents)
  currency: 'usd',
  userId: currentUser.id,
  description: 'Premium Subscription - Monthly',
  metadata: {
    plan: 'premium',
    interval: 'monthly'
  }
})

console.log('Payment Intent ID:', payment.paymentIntentId)
console.log('Client Secret:', payment.clientSecret) // Use this with Stripe Elements
```

**Response** (after Stripe setup):
```typescript
{
  success: true,
  paymentIntentId: 'pi_xxx',
  clientSecret: 'pi_xxx_secret_xxx',
  status: 'requires_payment_method' | 'succeeded' | ...
}
```

---

## Error Handling

All Edge Functions return errors in a consistent format:

```typescript
try {
  const result = await generateMatches('brand', brandId)
  // Success
} catch (error) {
  console.error('Error:', error.message)
  // Handle error
}
```

**Error Response**:
```typescript
{
  error: 'Error message here'
}
```

---

## Common Patterns

### In a React Component

```typescript
import { useState } from 'react'
import { generateMatches } from '@/services/edgeFunctions'

function ProfileForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (data) => {
    setLoading(true)
    try {
      // Save profile first
      const profile = await saveBrand(data)

      // Generate matches (happens automatically in dataService)
      // But you can also call manually:
      // const matches = await generateMatches('brand', profile.id)

      toast.success('Profile saved and matches generated!')
    } catch (error) {
      toast.error('Error: ' + error.message)
    } finally {
      setLoading(false)
    }
  }
}
```

### After User Registration

```typescript
import { sendEmail } from '@/services/edgeFunctions'

async function handleRegistration(email, name, userType) {
  // ... registration logic ...

  // Send welcome email
  await sendEmail({
    to: email,
    subject: 'Welcome to Brand Organizer Matching Platform!',
    template: 'welcome',
    data: { name, userType, dashboardUrl: window.location.origin + '/dashboard' }
  })
}
```

### When Match is Accepted

```typescript
async function acceptMatch(matchId) {
  // Update match status
  await updateMatchStatus(matchId, 'accepted')

  // Get match details
  const match = await getMatchById(matchId)
  const brand = await getBrandById(match.brandId)
  const organizer = await getOrganizerById(match.organizerId)

  // Notify both parties
  await sendEmail({
    to: brand.email,
    subject: 'Match Accepted!',
    template: 'match_accepted',
    data: {
      recipientName: brand.contactName,
      matchName: organizer.organizerName,
      chatUrl: `${window.location.origin}/chat/${matchId}`
    }
  })

  await sendEmail({
    to: organizer.email,
    subject: 'Match Accepted!',
    template: 'match_accepted',
    data: {
      recipientName: organizer.contactName,
      matchName: brand.companyName,
      chatUrl: `${window.location.origin}/chat/${matchId}`
    }
  })
}
```

---

## Development vs Production

**Development** (no API keys configured):
- Edge Functions will simulate responses
- Check console logs for what would have been sent
- Emails and payments will be logged but not actually processed

**Production** (with API keys):
- Set `RESEND_API_KEY` for real email sending
- Set `STRIPE_SECRET_KEY` for real payment processing
- Monitor usage in respective dashboards

---

## Monitoring

**View logs**:
```bash
# Recent logs
supabase functions logs generate-matches

# Follow logs (like tail -f)
supabase functions logs send-email --follow

# Limit number of logs
supabase functions logs process-payment --limit 100
```

**In Supabase Dashboard**:
1. Go to Edge Functions
2. Click on function name
3. View "Logs" tab

---

## Rate Limits

Default Supabase limits (adjust as needed):
- Free tier: 500K function invocations/month
- Pro tier: 2M function invocations/month
- Consider implementing your own rate limiting for production

---

## Security Notes

1. ✅ Edge Functions automatically validate JWT tokens
2. ✅ Use `SUPABASE_SERVICE_ROLE_KEY` only in Edge Functions (never in frontend)
3. ✅ Implement RLS policies even when using service role
4. ✅ Validate all inputs in Edge Functions
5. ⚠️ Be careful with CORS settings in production
