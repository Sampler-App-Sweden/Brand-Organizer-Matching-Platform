# Storage Configuration Workflow

## 📁 Single Source of Truth

All storage limits are defined in one place:
**[`supabase/functions/_shared/storage-config.ts`](../supabase/functions/_shared/storage-config.ts)**

## 🔄 Workflow: Updating Storage Limits

### Step 1: Edit the Config

Open [`storage-config.ts`](../supabase/functions/_shared/storage-config.ts):

```typescript
export const STORAGE_CONFIG = {
  buckets: {
    avatars: {
      name: 'avatars',
      public: true,
      maxSize: 2 * 1024 * 1024, // Change from 1MB to 2MB
      maxSizeLabel: '2MB',       // Update label
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
      description: 'User profile pictures'
    },
    // ... other buckets
  }
}
```

### Step 2: Sync to SQL File

Run the sync script to auto-generate the SQL:

```bash
# Option 1: Using npm
npm run sync-storage

# Option 2: Using deno directly
deno run --allow-read --allow-write supabase/scripts/sync-storage-config.ts
```

This updates [`database/setup-storage-buckets.sql`](../database/setup-storage-buckets.sql) automatically!

### Step 3: Deploy Changes

**Option A: Update Supabase Buckets (via SQL)**
1. Go to Supabase Dashboard → SQL Editor
2. Copy the generated SQL from `database/setup-storage-buckets.sql`
3. Run it (will update bucket limits)

**Option B: Update Supabase Buckets (via Dashboard)**
1. Go to Supabase Dashboard → Storage
2. Click on each bucket
3. Update file size limits manually

**Option C: Redeploy Edge Function**
```bash
supabase functions deploy upload-file
```
The Edge Function will use the new limits immediately!

### Step 4: Update Frontend (Optional)

Your frontend can fetch the latest limits:

```typescript
import { supabase } from '@/services/supabaseClient'

// Get current storage config
const { data } = await supabase.functions.invoke('get-storage-config')

// Show to user
console.log(data.config.avatars.maxSizeLabel) // "2MB"
```

## 📊 What Gets Auto-Synced

| File/Service | Auto-Synced? | How? |
|--------------|--------------|------|
| `storage-config.ts` | ✅ Source of truth | You edit this manually |
| `upload-file/index.ts` | ✅ Auto | Imports from config |
| `get-storage-config/index.ts` | ✅ Auto | Imports from config |
| `setup-storage-buckets.sql` | ⚠️ Semi-auto | Run `npm run sync-storage` |
| Supabase Buckets | ❌ Manual | Run SQL or update via Dashboard |

## 🎯 Quick Commands

```bash
# Sync config to SQL
npm run sync-storage

# View current config
cat supabase/functions/_shared/storage-config.ts

# Deploy updated Edge Function
supabase functions deploy upload-file
supabase functions deploy get-storage-config
```

## 📝 Example: Increasing Avatar Size Limit

**1. Edit config:**
```typescript
avatars: {
  maxSize: 2 * 1024 * 1024, // 2MB instead of 1MB
  maxSizeLabel: '2MB',
  // ...
}
```

**2. Sync:**
```bash
npm run sync-storage
```

**3. Deploy:**
```bash
# Update Supabase bucket (via SQL or Dashboard)
# Then redeploy function:
supabase functions deploy upload-file
```

**4. Done!** ✅
- Users can now upload 2MB avatars
- Frontend shows "Max: 2MB"
- Everything stays in sync

## 🔍 Checking Current Limits

**From Config File:**
```bash
cat supabase/functions/_shared/storage-config.ts | grep maxSize
```

**From Frontend:**
```typescript
const { data } = await supabase.functions.invoke('get-storage-config')
console.log(data.config)
```

**From Supabase Dashboard:**
1. Go to Storage
2. Click on bucket
3. View "File size limit"

## ⚠️ Important Notes

1. **Always run `npm run sync-storage`** after editing `storage-config.ts`
2. **Deploy Edge Functions** to apply changes immediately
3. **Update Supabase buckets** to enforce limits at storage level
4. **Test uploads** after making changes

## 🐛 Troubleshooting

**Q: I updated the config but uploads still fail**
A: Did you redeploy the `upload-file` Edge Function?

**Q: SQL file shows old limits**
A: Run `npm run sync-storage` to regenerate it

**Q: Frontend shows old limits**
A: Redeploy `get-storage-config` Edge Function

**Q: Supabase bucket still has old limit**
A: Update it manually via Dashboard or run the SQL

## 🚀 Best Practice

1. Edit `storage-config.ts`
2. Run `npm run sync-storage`
3. Commit both files
4. Deploy Edge Functions
5. Update Supabase buckets

This ensures everything stays in sync! 🎉
