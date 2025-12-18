# Supabase Setup - Step by Step Guide

Follow these steps to set up everything in Supabase for the Edge Functions.

## Step 1: Set Up Database Tables

1. Go to your Supabase Dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the entire contents of `database/setup-edge-functions-tables.sql`
5. Click **Run** (or press `Ctrl+Enter`)

You should see: ✅ "All Edge Function tables created successfully!"

## Step 2: Set Up Storage Buckets

### Option A: Using SQL (Recommended)

1. In the SQL Editor, click **New Query**
2. Copy and paste the entire contents of `database/setup-storage-buckets.sql`
3. Click **Run**

You should see: ✅ "All storage buckets created successfully!"

### Option B: Using Dashboard

1. Go to **Storage** (left sidebar)
2. Click **New Bucket** for each:

**Bucket 1: avatars**
- Name: `avatars`
- Public: ✅ Yes
- File size limit: `5 MB`
- Allowed MIME types: `image/jpeg, image/png, image/webp, image/gif`

**Bucket 2: brand-logos**
- Name: `brand-logos`
- Public: ✅ Yes
- File size limit: `2 MB`
- Allowed MIME types: `image/jpeg, image/png, image/svg+xml, image/webp`

**Bucket 3: event-media**
- Name: `event-media`
- Public: ✅ Yes
- File size limit: `10 MB`
- Allowed MIME types: `image/jpeg, image/png, image/webp, video/mp4, application/pdf`

**Bucket 4: support-attachments**
- Name: `support-attachments`
- Public: ❌ No (Private)
- File size limit: `10 MB`
- Allowed MIME types: `image/jpeg, image/png, image/webp, application/pdf, text/plain`

## Step 3: Set Up Environment Variables

1. Go to **Edge Functions** > **Settings** (or **Project Settings** > **Edge Functions**)
2. Add these secrets:

```bash
# Email Service (Resend)
RESEND_API_KEY=re_your_api_key_here

# Payment Service (Stripe) - Use test keys for development
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key

# AI/LLM Services (Optional)
OPENAI_API_KEY=sk-your_openai_key
ANTHROPIC_API_KEY=sk-ant-your_anthropic_key

# Analytics (Optional)
ANALYTICS_SERVICE_KEY=your_analytics_key
SENTRY_DSN=your_sentry_dsn
```

### To Get API Keys:

**Resend (Email):**
1. Go to [resend.com](https://resend.com)
2. Sign up / Log in
3. Go to API Keys > Create API Key
4. Copy the key

**Stripe (Payments):**
1. Go to [stripe.com](https://stripe.com)
2. Sign up / Log in
3. Go to Developers > API Keys
4. Copy the **Secret Key** (starts with `sk_test_` for testing)

**OpenAI (Optional):**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Go to API Keys
3. Create new secret key

## Step 4: Deploy Edge Functions

### Using the deploy script:

```bash
cd supabase
chmod +x deploy.sh
./deploy.sh all
```

### Or deploy individually:

```bash
supabase functions deploy generate-matches
supabase functions deploy send-email
supabase functions deploy process-payment
supabase functions deploy ai-assistant
supabase functions deploy track-analytics
supabase functions deploy admin-operations
supabase functions deploy export-data
supabase functions deploy upload-file
```

## Step 5: Verify Everything Works

Run this in the SQL Editor to verify all tables exist:

```sql
SELECT
  tablename,
  'Created ✅' as status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'analytics_events',
    'error_logs',
    'admin_audit_log',
    'export_logs',
    'upload_logs'
  )
ORDER BY tablename;
```

You should see 5 rows with "Created ✅" status.

Check storage buckets:

```sql
SELECT
  name,
  public,
  CASE
    WHEN public THEN 'Public ✅'
    ELSE 'Private 🔒'
  END as access
FROM storage.buckets
WHERE name IN ('avatars', 'brand-logos', 'event-media', 'support-attachments')
ORDER BY name;
```

You should see 4 buckets.

## Step 6: Test Edge Functions

### Test in the Dashboard:

1. Go to **Edge Functions**
2. Click on a function (e.g., `generate-matches`)
3. Click **Invoke Function**
4. Add test payload and click **Send**

### Test from your app:

```typescript
import { generateMatches } from '@/services/edgeFunctions'

// Test match generation
const result = await generateMatches('brand', 'some-brand-id')
console.log(result)
```

## Troubleshooting

### Tables not created?

- Make sure you ran the SQL script completely
- Check for errors in the SQL Editor output
- Verify you have the right permissions

### Storage buckets not created?

- Try creating them manually via the Dashboard
- Make sure you enable RLS on the `storage.objects` table
- Run the storage policies SQL separately

### Edge Functions not working?

- Check the function logs: `supabase functions logs [function-name]`
- Verify environment variables are set
- Make sure you're passing the Authorization header

### RLS blocking access?

- Verify your user has the correct role in the `profiles` table
- Check the RLS policies: `SELECT * FROM pg_policies WHERE tablename = 'your_table'`
- Temporarily disable RLS to test: `ALTER TABLE your_table DISABLE ROW LEVEL SECURITY`

## Security Checklist

Before going to production:

- [ ] All tables have RLS enabled
- [ ] Storage buckets have proper policies
- [ ] Environment variables are set (use production keys)
- [ ] CORS is configured for your domain
- [ ] Rate limiting is enabled
- [ ] Backup strategy is in place
- [ ] Monitoring/alerts are configured
- [ ] Test all Edge Functions
- [ ] Review audit logs regularly

## Next Steps

1. ✅ Database tables created
2. ✅ Storage buckets configured
3. ✅ Environment variables set
4. ✅ Edge Functions deployed
5. 🚀 Start using the secure API!

Check out the [API Quick Reference](./API_QUICK_REFERENCE.md) for usage examples.
