# Sensitive Edge Functions - Complete Guide

This guide covers all the **sensitive operations** that have been moved to Edge Functions for enhanced security, privacy, and compliance.

## Overview

We've created **8 Edge Functions** to handle all sensitive operations:

| Function | Purpose | Security Level |
|----------|---------|----------------|
| `generate-matches` | Match algorithm (business logic) | 🔴 Critical |
| `send-email` | Email notifications | 🟡 Moderate |
| `process-payment` | Payment processing | 🔴 Critical |
| `ai-assistant` | AI/LLM interactions | 🟡 Moderate |
| `track-analytics` | User tracking & error logging | 🟢 Low |
| `admin-operations` | Admin management | 🔴 Critical |
| `export-data` | GDPR & data exports | 🔴 Critical |
| `upload-file` | File uploads with validation | 🟡 Moderate |

---

## 1. AI Assistant (`ai-assistant`)

**Why it's sensitive:**
- Contains proprietary prompts and business logic
- Processes user inputs for intent detection
- NLP/ML models should be server-side

**Features:**
- ✅ Detect user intent (brand/organizer/community)
- ✅ Extract structured profile data from text
- ✅ Generate follow-up questions
- ✅ Generate suggestions
- ✅ Ready for OpenAI/Anthropic integration

**Usage:**
```typescript
import { callAIAssistant } from '@/services/edgeFunctions'

// Detect intent
const { result } = await callAIAssistant({
  type: 'detect-intent',
  input: "I'm looking to sponsor local events for my brand"
})
// result: { role: 'brand', confidence: 0.85 }

// Extract profile info
const { result } = await callAIAssistant({
  type: 'extract-profile',
  input: "My company is TechCorp, email: hello@techcorp.com",
  context: { role: 'brand' }
})
// result: { name: 'TechCorp', email: 'hello@techcorp.com' }

// Generate questions
const { result } = await callAIAssistant({
  type: 'generate-questions',
  input: "I have a product",
  context: {
    role: 'brand',
    draftProfile: { /* current profile */ },
    conversation: [/* chat history */]
  }
})
// result: "Can you describe your product in more detail?"
```

**Security Benefits:**
- AI prompts are hidden from client
- Can integrate with paid APIs without exposing keys
- Rate limiting at server level

---

## 2. Analytics Tracking (`track-analytics`)

**Why it's sensitive:**
- Contains user behavior data
- May include PII that needs sanitization
- Analytics API keys should be secret

**Features:**
- ✅ Automatic PII sanitization
- ✅ IP anonymization
- ✅ User agent parsing
- ✅ Event & error tracking
- ✅ Integration with PostHog, Mixpanel, Amplitude
- ✅ Sentry error tracking ready

**Usage:**
```typescript
import { trackEvent } from '@/services/edgeFunctions'

// Track event
await trackEvent({
  type: 'event',
  data: {
    event: 'profile_created',
    userId: user.id,
    sessionId: sessionStorage.getItem('sessionId'),
    properties: {
      userType: 'brand',
      completionStep: 3
    }
  }
})

// Track error
await trackEvent({
  type: 'error',
  data: {
    type: 'validation_error',
    message: 'Invalid email format',
    stack: error.stack,
    userId: user.id,
    metadata: { field: 'email', value: '...' }
  }
})
```

**Security Benefits:**
- PII is sanitized automatically (passwords, SSN, credit cards redacted)
- Emails are hashed
- IPs are anonymized (last octet removed)
- Analytics keys never exposed

**Database Required:**
```sql
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  session_id TEXT,
  properties JSONB,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE error_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  error_type TEXT NOT NULL,
  error_message TEXT NOT NULL,
  stack_trace TEXT,
  user_id UUID REFERENCES auth.users(id),
  metadata JSONB,
  context JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

---

## 3. Admin Operations (`admin-operations`)

**Why it's sensitive:**
- Destructive operations (delete users, ban, etc.)
- Requires strict authorization checks
- Must maintain audit trail

**Features:**
- ✅ User management (list, update role, delete, ban)
- ✅ Bulk operations
- ✅ System statistics
- ✅ Data purging
- ✅ Audit logging
- ✅ Admin-only authorization

**Usage:**
```typescript
import { adminOperation } from '@/services/edgeFunctions'

// Get all users
const { result } = await adminOperation({
  action: 'get-users',
  data: {
    filters: {
      role: 'Brand',
      search: 'john',
      status: 'active'
    }
  }
})

// Update user role
await adminOperation({
  action: 'update-user-role',
  data: {
    userId: '123',
    role: 'Admin'
  }
})

// Ban user
await adminOperation({
  action: 'ban-user',
  data: {
    userId: '456',
    reason: 'Violation of terms of service'
  }
})

// Get system stats
const { result } = await adminOperation({
  action: 'get-stats'
})
// result: { users: { total: 1000, newThisWeek: 50 }, ... }

// Purge old data
await adminOperation({
  action: 'purge-old-data',
  data: { daysOld: 90 }
})
```

**Security Benefits:**
- Verifies admin role before any operation
- All actions logged in audit trail
- Soft delete by default (can be recovered)
- Hard delete requires explicit flag

**Database Required:**
```sql
CREATE TABLE admin_audit_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT NOT NULL,
  details JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS ban_reason TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS banned_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS deactivated_at TIMESTAMP WITH TIME ZONE;
```

---

## 4. Data Export (`export-data`)

**Why it's sensitive:**
- GDPR compliance requires secure data export
- Contains all user PII
- Must validate authorization

**Features:**
- ✅ User data export (GDPR requests)
- ✅ Admin reports
- ✅ JSON & CSV formats
- ✅ Date range filtering
- ✅ Authorization checks
- ✅ Export logging

**Usage:**
```typescript
import { exportData } from '@/services/edgeFunctions'

// User requests their own data (GDPR)
const blob = await exportData({
  type: 'gdpr-request',
  format: 'json',
  userId: currentUser.id
})

// Download the file
const url = URL.createObjectURL(blob)
const a = document.createElement('a')
a.href = url
a.download = `my-data-${new Date().toISOString()}.json`
a.click()

// Admin export report
const blob = await exportData({
  type: 'admin-report',
  format: 'csv',
  filters: {
    dateFrom: '2025-01-01',
    dateTo: '2025-01-31'
  }
})
```

**Security Benefits:**
- Users can only export their own data (unless admin)
- All exports are logged
- Data is sanitized before export
- Rate limiting prevents abuse

**Database Required:**
```sql
CREATE TABLE export_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  export_type TEXT NOT NULL,
  export_for_user_id UUID REFERENCES auth.users(id),
  format TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

---

## 5. File Upload (`upload-file`)

**Why it's sensitive:**
- Files can contain malware
- Must validate file types and sizes
- Storage URLs should be signed

**Features:**
- ✅ File type validation
- ✅ File size limits
- ✅ Malware detection (basic)
- ✅ Safe filename generation
- ✅ Signed URLs for security
- ✅ Upload logging

**Supported Buckets:**
- `avatars` - 5MB max, images only
- `brand-logos` - 2MB max, images + SVG
- `event-media` - 10MB max, images + videos + PDFs
- `support-attachments` - 10MB max, images + PDFs + text

**Usage:**
```typescript
import { uploadFile } from '@/services/edgeFunctions'

// Simple upload (handles everything)
const publicUrl = await uploadFile(file, 'avatars')
console.log('File uploaded to:', publicUrl)

// Or manual process for more control
const { uploadUrl, publicUrl } = await getUploadURL({
  fileName: file.name,
  fileType: file.type,
  fileSize: file.size,
  bucket: 'brand-logos'
})

// Upload to signed URL
await fetch(uploadUrl, {
  method: 'PUT',
  body: file,
  headers: { 'Content-Type': file.type }
})

// Use the public URL
setLogoUrl(publicUrl)
```

**Security Benefits:**
- Validates file types before upload
- Blocks executable files
- Detects embedded scripts in images
- Generates safe filenames (prevents path traversal)
- Logs all uploads for audit

**Database Required:**
```sql
CREATE TABLE upload_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  bucket TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  status TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
```

---

## Security Best Practices

### 1. Environment Variables

All sensitive keys are stored as Supabase secrets:

```bash
# Email service
supabase secrets set RESEND_API_KEY=re_...

# Payments
supabase secrets set STRIPE_SECRET_KEY=sk_test_...

# AI/LLM
supabase secrets set OPENAI_API_KEY=sk-...
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...

# Analytics
supabase secrets set ANALYTICS_SERVICE_KEY=...
supabase secrets set SENTRY_DSN=...
```

### 2. Authorization Checks

Every Edge Function validates authorization:

```typescript
// Verify user is authenticated
const { data: { user }, error } = await supabase.auth.getUser(authHeader)

// Verify user is admin (for admin functions)
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single()

if (profile.role !== 'Admin') {
  return unauthorized()
}
```

### 3. Input Validation

All inputs are validated:

```typescript
// Check required fields
if (!userId || !action) {
  throw new Error('Missing required fields')
}

// Validate types
if (typeof amount !== 'number' || amount <= 0) {
  throw new Error('Invalid amount')
}

// Sanitize inputs
const safeFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
```

### 4. Rate Limiting

Implement rate limiting for production:

```typescript
// Example with upstash/redis
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
})

const { success } = await ratelimit.limit(userId)
if (!success) {
  return new Response('Rate limit exceeded', { status: 429 })
}
```

---

## Deployment Checklist

- [ ] Deploy all Edge Functions
- [ ] Set all environment variables
- [ ] Create required database tables
- [ ] Create storage buckets
- [ ] Configure RLS policies
- [ ] Test authorization flows
- [ ] Set up monitoring/alerts
- [ ] Enable rate limiting
- [ ] Configure CORS for production
- [ ] Review audit logs regularly

---

## Monitoring

Monitor Edge Functions in Supabase Dashboard or CLI:

```bash
# View logs
supabase functions logs ai-assistant --follow

# Check function status
supabase functions list

# View metrics
# Go to Supabase Dashboard > Edge Functions > [Function] > Metrics
```

---

## Cost Estimates

| Service | Free Tier | Paid Tier | Notes |
|---------|-----------|-----------|-------|
| Supabase Edge Functions | 500K invocations/mo | $2 per 1M | Very affordable |
| OpenAI API (optional) | - | ~$0.002 per request | For AI features |
| Resend Email | 3K emails/mo | $20/mo for 50K | Email notifications |
| Stripe Payments | Free | 2.9% + $0.30 per transaction | Payment processing |
| PostHog Analytics (optional) | 1M events/mo | $0.00045 per event | Analytics tracking |

---

## Summary

You now have **8 secure Edge Functions** that handle all sensitive operations:

✅ **Business Logic** - Match algorithm protected
✅ **AI/ML** - Server-side processing
✅ **Analytics** - PII sanitization
✅ **Admin** - Audit trail & authorization
✅ **GDPR** - Data export compliance
✅ **File Upload** - Malware detection
✅ **Email** - Secure integrations
✅ **Payments** - PCI compliance ready

All operations are **logged**, **authorized**, and **secure**! 🎉
