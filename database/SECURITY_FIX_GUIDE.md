# Supabase Security Warnings - Fix Guide

This guide explains the security warnings from Supabase Security Advisor and how to fix them.

## Summary

- **Total Warnings**: 17
  - Function Search Path Mutable: 10 warnings (WARN)
  - RLS Policy Always True: 6 warnings (WARN)
  - Leaked Password Protection Disabled: 1 warning (WARN)

---

## 1. Function Search Path Mutable (10 Functions)

### What is the Issue?

When PostgreSQL functions don't have a fixed `search_path`, they're vulnerable to **search path injection attacks**. An attacker could create malicious tables or functions in a different schema and trick the database into using them.

### Affected Functions

1. `update_organizer_events_updated_at`
2. `get_published_events_by_organizer`
3. `count_organizer_events`
4. `update_connections_updated_at`
5. `sync_brand_to_profile`
6. `sync_organizer_to_profile`
7. `sync_profile_to_related`
8. `update_last_login`
9. `handle_new_user`
10. `update_drafts_updated_at`

### The Fix

Add `SET search_path = public` to each function definition. This locks the function to only use objects from the `public` schema.

**Before:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- function body
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

**After:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public  -- ✅ Added this line
AS $$
BEGIN
  -- function body
END;
$$;
```

### Remediation

Run the migration file: [fix-security-warnings.sql](./fix-security-warnings.sql)

```bash
# Apply via Supabase CLI
supabase db push

# Or run in Supabase SQL Editor
```

---

## 2. RLS Policy Always True (6 Policies)

### What is the Issue?

Row Level Security (RLS) policies that use `true` for UPDATE, INSERT, or DELETE operations effectively bypass security checks. This means any user with the specified role can perform these operations on **any row**, which is usually not intended.

### Affected Tables & Policies

#### A. Service Role Policies (Expected Behavior)

These policies are for the service role and are **intentionally permissive**:

1. **`brands`** - "Enable update for service role"
2. **`community_members`** - "Enable update for service role"
3. **`organizers`** - "Enable update for service role"

**Status**: ✅ These are OK - service role needs unrestricted access for backend operations.

**The Fix**: Explicitly scope these policies to `service_role` only (already done in migration).

#### B. Overly Permissive User Policies

These policies need to be **tightened**:

4. **`matches`** - "Allow authenticated users to create matches"
   - **Current Issue**: Any authenticated user can create any match
   - **Fix**: Restrict to users creating matches for their own brand/organizer profile

5. **`notifications`** - "Allow authenticated users to create notifications"
   - **Current Issue**: Any authenticated user can create notifications for anyone
   - **Fix**: Add validation that notifications are for valid users

6. **`support_tickets`** - "Allow anyone to create support tickets"
   - **Current Issue**: `true` allows unlimited ticket creation
   - **Status**: ⚠️ This is **intentional** for a support form but could be rate-limited at the application level

### The Fix

**matches table:**
```sql
-- OLD: Too permissive
CREATE POLICY "Allow authenticated users to create matches"
  ON public.matches FOR INSERT
  TO authenticated
  WITH CHECK (true);  -- ❌ Any authenticated user can create any match

-- NEW: Properly restricted
CREATE POLICY "Allow authenticated users to create matches"
  ON public.matches FOR INSERT
  TO authenticated
  WITH CHECK (
    -- ✅ User must be either the brand or organizer in the match
    brand_id IN (SELECT id FROM public.brands WHERE user_id = auth.uid())
    OR organizer_id IN (SELECT id FROM public.organizers WHERE user_id = auth.uid())
  );
```

**notifications table:**
```sql
-- OLD: Too permissive
CREATE POLICY "Allow authenticated users to create notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (true);  -- ❌ Can create notifications for anyone

-- NEW: Properly restricted
CREATE POLICY "Allow authenticated users to create notifications"
  ON public.notifications FOR INSERT
  TO authenticated
  WITH CHECK (
    -- ✅ Notification must be for a valid user
    user_id IN (SELECT id FROM auth.users)
  );
```

### Remediation

Run the migration file: [fix-security-warnings.sql](./fix-security-warnings.sql)

---

## 3. Leaked Password Protection Disabled

### What is the Issue?

Supabase can check user passwords against the [HaveIBeenPwned](https://haveibeenpwned.com/) database of compromised passwords. This feature is currently disabled, which means users can sign up with passwords that have been leaked in data breaches.

### The Fix

This requires **manual configuration** in the Supabase Dashboard (cannot be done via SQL).

### Remediation Steps

1. Go to your [Supabase Dashboard](https://app.supabase.com/)
2. Select your project
3. Navigate to **Authentication** → **Policies**
4. Find the section for **"Password Requirements"**
5. Enable **"Check against leaked password database"**
6. (Optional) Configure minimum password strength requirements

### Documentation

https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

---

## How to Apply Fixes

### Step 1: Run the SQL Migration

```bash
# Option A: Via Supabase CLI
cd database
supabase db push

# Option B: Via Supabase Dashboard
# 1. Copy contents of fix-security-warnings.sql
# 2. Go to Supabase Dashboard → SQL Editor
# 3. Paste and run
```

### Step 2: Enable Leaked Password Protection

Follow the manual steps in Section 3 above.

### Step 3: Verify Fixes

Run the security linter again:

```bash
# Via Supabase CLI
supabase db lint

# Or check in Supabase Dashboard → Database → Linter
```

You should see:
- ✅ 0 function search path warnings
- ✅ 0 or fewer RLS policy warnings (service role policies may still appear but are intentional)
- ✅ 0 leaked password warnings (after enabling in dashboard)

---

## Additional Security Recommendations

Beyond fixing these warnings, consider:

1. **Rate Limiting**: Add rate limiting for support ticket creation to prevent spam
2. **Input Validation**: Ensure all user inputs are validated before insertion
3. **Audit Logging**: Monitor admin actions via the `admin_audit_log` table
4. **Regular Security Reviews**: Run the linter periodically
5. **Review Service Role Usage**: Ensure service role is only used in secure backend code

---

## Questions?

If you encounter issues applying these fixes:

1. Check the Supabase logs for error messages
2. Verify you have proper permissions to modify functions and policies
3. Review the [Supabase Security Best Practices](https://supabase.com/docs/guides/database/database-linter)
