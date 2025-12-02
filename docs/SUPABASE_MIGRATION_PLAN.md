# Supabase Migration Plan

_Last updated: 2 December 2025_

## Objectives

- Replace every browser-only data store (localStorage) with Supabase-backed tables and services.
- Establish a repeatable backfill strategy for any demo data we still need (brands, organizers, collaborations, etc.).
- Ensure RLS policies and client-side access patterns are defined before we start refactoring components.

---

## Workstream Summary

| #   | Feature / Local Key(s)                                                                          | Current Usage                                                         | Supabase Target                                                                           | App Updates                                                                                                                                          | Migration / Backfill Plan                                                                                                                                                      |
| --- | ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | Contracts (`contracts`)                                                                         | Match details, contract form, utils                                   | `public.contracts` (already in schema)                                                    | Create `contractService` to CRUD via Supabase; update MatchDetails + ContractForm to use service queries/mutations.                                  | Write a one-time script to push any seeded demo contracts (if desired). Browser-only drafts can be promoted once users resubmit.                                               |
| 2   | Conversations + Messages (`conversations`)                                                      | Chat service, MatchDetails messaging                                  | `public.conversations`, `public.messages` (defined)                                       | Replace chatService local array with Supabase RPC/service + realtime subscriptions; map message structure.                                           | Optional import script to seed curated example conversations for demos.                                                                                                        |
| 3   | Match preference lists (`user_${id}_savedMatches` / `user_${id}_dismissedMatches`)              | MatchesPage saved/dismissed cards, quick actions                      | **New table** `match_preferences` (user_id uuid, match_id uuid, status text, created_at). | Build `matchPreferenceService` to read/write statuses; update MatchesPage view/model logic.                                                          | Create migration SQL for table + policies; no backfill needed (per-user state currently only in that browser).                                                                 |
| 4   | Organizer/Brand caches (`organizers`, `brands`) + Admin datasets (`users`, `matches`)           | Dashboard listings, MatchRow, Admin dashboard                         | `public.organizers`, `public.brands`, `public.profiles`, `public.matches`                 | Update dataService/admin dashboards to query Supabase directly; delete seeding logic that stashes arrays in localStorage.                            | Provide SQL seeders (CSV → `COPY`) for demo brands/organizers if we still need demo identities.                                                                                |
| 5   | Community directory (`communityMembers`) + saved lists (`user_${id}_savedMembers`)              | Community pages/services                                              | `public.community_members` (exists) + **New** `community_saved_members` join table        | Replace initialization logic with Supabase fetch; expose service for save/unsave hitting join table.                                                 | Convert sample data to SQL seed or `supabase seed` script; optional UI import button for devs.                                                                                 |
| 6   | Collaboration gallery (`collaborations`, `user_${id}_savedCollabs`)                             | Collaboration service, saved stories                                  | **New tables** `collaborations` & `collaboration_saved`                                   | Create Supabase tables + service; update UI views to query Supabase.                                                                                 | Transform current mock data into SQL inserts; run via Supabase SQL or CLI seed.                                                                                                |
| 7   | Draft fallbacks (`draft-${id}`, `draftProfile`, `draftId`) + Registration debug flags (`token`) | DraftProfileContext, AI onboarding assistant, RegistrationDebugHelper | `public.drafts` (already defined) + Supabase auth session metadata                        | Remove local fallback once Supabase draft writes are stable; update debug helper to reference Supabase session info rather than localStorage tokens. | For logged-in users, automatically upload any existing local fallback draft the next time they load the assistant (detect local key, POST to Supabase, then delete local key). |
| 8   | Sponsorship data (✅)                                                                           | Product manager / Brand panel now Supabase-backed                     | `public.sponsorship_products`, `public.sponsorship_offers`                                | Already wired; continue hardening (optimistic updates, error banners).                                                                               | Keep `database/seed-sponsorship-products.sql` as canonical seed script.                                                                                                        |
| 9   | Misc runtime probes (`checkStorage`, `RegistrationDebugHelper`)                                 | Storage availability checks                                           | No Supabase storage; leave as-is                                                          | Ensure they no longer gate core flows once migrations finish.                                                                                        | n/a                                                                                                                                                                            |

---

## Detailed Plans

### 1. Contracts & Agreements

- **Schema**: Already covered by `public.contracts` with RLS tying rows to brand/organizer `user_id`.
- **Client tasks**:
  1. Introduce `contractService` (Supabase CRUD + helper for status transitions).
  2. Update `MatchDetails` to fetch contract via service (filter by `match_id`).
  3. Replace `saveContractToLocalStorage` with service calls; remove `localStorage` fallback entirely.
- **Migration**: No shared browser data. Optionally, craft `database/seed-contracts.sql` for demo matches.

### 2. Conversations & Messages

- **Schema**: `public.conversations` & `public.messages` already exist.
- **Client tasks**:
  1. Rebuild `chatService` to hit Supabase tables (insert conversation if none, insert message rows, subscribe via Supabase realtime on `messages`).
  2. Update `MatchDetails` message list to use service hook (with loading & retry states).
  3. Remove AI auto-response injection or re-implement server-side (e.g., on Edge Function) so messages stay consistent across clients.
- **Migration**: Since current data is per-browser, plan for a clean cutover: when user next opens a conversation, check if legacy `localStorage` conversation exists, POST it once to Supabase, then delete the local copy.

### 3. Match Preference Tracking

- **Schema addition**:

  ```sql
  CREATE TABLE public.match_preferences (
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    match_id uuid REFERENCES public.matches ON DELETE CASCADE,
    status text NOT NULL CHECK (status IN ('saved','dismissed')),
    created_at timestamptz DEFAULT timezone('utc', now()),
    PRIMARY KEY (user_id, match_id)
  );

  ALTER TABLE public.match_preferences ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Allow users to manage their match preferences"
    ON public.match_preferences
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  ```

- **Client tasks**: Build `matchPreferenceService` with `save`, `dismiss`, `clear`, and read helpers; update `MatchesPage` to subscribe to Supabase changes instead of local arrays.
- **Migration**: No global data to port—each client can recreate state as they interact. Optionally, detect old local keys and sync them on first load per browser.

### 4. Brands / Organizers / Admin Data

- **Schema**: Already defined (brands, organizers, profiles, matches).
- **Client tasks**:
  1. Ensure `dataService` functions call Supabase and cache results in React Query (or similar) rather than writing to localStorage.
  2. Update `DashboardListingsBar`, `MatchRow`, and `AdminDashboard` to use service hooks.
  3. Remove any mock data initializers.
- **Backfill**: Convert CSV samples (`sample-brands.csv`, etc.) to Supabase `COPY` commands, or build `database/seed-brands.sql` & `seed-organizers.sql`. Document run instructions alongside the sponsorship seed script.

### 5. Community Members & Saved Lists

- **Schema**: `public.community_members` already in schema; add join table:

  ```sql
  CREATE TABLE public.community_saved_members (
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    member_id uuid REFERENCES public.community_members ON DELETE CASCADE,
    created_at timestamptz DEFAULT timezone('utc', now()),
    PRIMARY KEY (user_id, member_id)
  );

  ALTER TABLE public.community_saved_members ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Allow users to manage saved members"
    ON public.community_saved_members
    FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  ```

- **Client tasks**: Replace initialization and toggling logic inside `communityService` with Supabase queries/mutations. Provide pagination via SQL (limit/offset) rather than slicing arrays.
- **Backfill**: Move existing mock objects into `database/seed-community-members.sql`. After running the SQL once, delete the initializer that populates localStorage.

### 6. Collaboration Stories & Saved State

- **Schema additions** similar to community saved logic:

  ```sql
  CREATE TABLE public.collaborations (
    id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    title text NOT NULL,
    type text NOT NULL,
    brand_name text,
    organizer_name text,
    description text,
    image_url text,
    metrics jsonb,
    created_at timestamptz DEFAULT timezone('utc', now())
  );

  CREATE TABLE public.collaboration_saved (
    user_id uuid REFERENCES auth.users ON DELETE CASCADE,
    collaboration_id uuid REFERENCES public.collaborations ON DELETE CASCADE,
    created_at timestamptz DEFAULT timezone('utc', now()),
    PRIMARY KEY (user_id, collaboration_id)
  );

  ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.collaboration_saved ENABLE ROW LEVEL SECURITY;

  CREATE POLICY "Allow public read" ON public.collaborations FOR SELECT USING (true);
  CREATE POLICY "Allow users to manage saved collaborations"
    ON public.collaboration_saved FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  ```

- **Client tasks**: Supabase-backed `collaborationService` with list, detail, toggle saved. Ensure saved toggles update UI via optimistic updates.
- **Backfill**: Convert the hard-coded `sampleCollaborations` array into SQL inserts.

### 7. Draft Profiles & Debug Helpers

- **Client tasks**:
  1. In `draftService.saveDraft`, remove the localStorage fallback once Supabase errors are handled upstream. Instead, surface toast/errors so the user knows to retry.
  2. When the AI onboarding assistant or Draft context mounts, detect any legacy `localStorage` entries (`draft-*`). If present, POST them to Supabase (using `saveDraft`) and delete local keys.
  3. `RegistrationDebugHelper` should reference Supabase auth state (e.g., `useAuth().currentUser`) instead of `localStorage.getItem('token')`.
- **Migration**: Provide a helper that runs once per user session to migrate any leftover local drafts.

### 8. Sponsorship Products & Offers (Status Update)

- Already using Supabase via `sponsorshipService`. Remaining tasks: add retry/backoff, skeleton states, and guard rails for missing brandId. Seed script (`database/seed-sponsorship-products.sql`) remains the canonical demo dataset.

### 9. Miscellaneous Local Storage References

- `checkStorage` (in `src/index.tsx`) can remain—it only verifies environment capabilities.
- Once all key data migrates, ensure no critical flow depends on `localStorage` availability; degrade gracefully when disabled.

---

## Execution Checklist

1. **Create missing tables & policies** (match preferences, saved community members, collaborations) via SQL migrations or Supabase CLI.
2. **Seed demo data** using dedicated SQL files (`database/seed-*.sql`), keeping each idempotent.
3. **Refactor services/components** feature-by-feature, deleting localStorage access as soon as a Supabase path exists.
4. **Backfill per-user state** where possible by syncing any legacy localStorage entries on first load after deploy.
5. **QA** each flow (brand dashboard, organizer dashboard, admin, community, collaborations) against Supabase data to confirm RLS rules and multi-device consistency.
6. **Update docs** (Quick Start / Deployment Guide) with new seed commands and references to Supabase data requirements.

---

This plan should be kept in sync as we finish each migration workstream. Update the summary table with statuses (e.g., ✅ for completed, 🚧 for in progress) so anyone can see how close we are to eliminating all browser-only persistence.
