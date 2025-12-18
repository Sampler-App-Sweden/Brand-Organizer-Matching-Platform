# Security Cleanup - Matching Algorithm

## What Was Done

Removed client-side exposure of the proprietary matching algorithm to keep business logic secure.

## Changes Made

### 1. Created Centralized Type Definition
**New File:** [`src/types/match.ts`](../src/types/match.ts)
- Moved Match interface from service to types folder
- Added to type exports in `src/types/index.ts`

### 2. Updated All Imports
Updated 7 files to import `Match` from `../types` instead of `matchingService`:
- ✅ [`src/services/dataService.ts`](../src/services/dataService.ts)
- ✅ [`src/types/matches.ts`](../src/types/matches.ts)
- ✅ [`src/hooks/useOrganizerDashboard.ts`](../src/hooks/useOrganizerDashboard.ts)
- ✅ [`src/pages/dashboard/BrandDashboard.tsx`](../src/pages/dashboard/BrandDashboard.tsx)
- ✅ [`src/pages/dashboard/MatchDetails.tsx`](../src/pages/dashboard/MatchDetails.tsx)
- ✅ [`src/pages/dashboard/MatchRow.tsx`](../src/pages/dashboard/MatchRow.tsx)
- ✅ [`src/pages/dashboard/OrganizerDashboard.tsx`](../src/pages/dashboard/OrganizerDashboard.tsx)

### 3. Removed Service Exports
**Updated:** [`src/services/index.ts`](../src/services/index.ts)
- Removed `export * from './matchingService'`
- Added comment explaining algorithm is server-side only

### 4. Deleted Client-Side Algorithm
**Deleted:** `src/services/matchingService.ts`
- ❌ Removed 285 lines of proprietary matching logic
- ❌ Removed scoring weights and industry mappings
- ❌ Removed helper functions exposing business rules

## Security Impact

### Before Cleanup
```typescript
// Client-side code (visible to anyone)
export const calculateMatchScore = (brand, organizer) => {
  let score = 0

  // EXPOSED: Scoring weights
  if (audienceMatch) score += 20
  if (demographicFit) score += 15
  if (industryRelevant) score += 15
  if (goalsAlign) score += 25  // ← Competitors can see this!
  if (budgetFits) score += 15
  if (sponsorshipMatch) score += 10

  // EXPOSED: Industry mappings
  const relevanceMap = {
    food_beverage: ['festival', 'community', 'sports'],
    tech: ['conference', 'expo', 'workshop']
  }

  return { score, reasons }
}
```

### After Cleanup
```typescript
// Client only has the type definition
export interface Match {
  id: string
  brandId: string
  organizerId: string
  score: number  // ← Only sees the result
  matchReasons: string[]
  status: 'pending' | 'accepted' | 'rejected'
}

// Matching algorithm is PRIVATE
// Lives in: supabase/functions/generate-matches/index.ts
// Runs server-side only
// Not accessible to client
```

## What's Now Protected

✅ **Scoring Weights** - Competitors can't see how you weight different factors
✅ **Industry Mappings** - Your market knowledge stays private
✅ **Matching Logic** - Algorithm improvements remain proprietary
✅ **Business Rules** - Budget calculations and thresholds are hidden
✅ **Keyword Strategies** - Marketing goal detection logic is secure

## Matching Still Works

The matching functionality hasn't changed from a user perspective:

1. **Brand/Organizer creates profile**
2. **Frontend calls Edge Function:**
   ```typescript
   const { data } = await supabase.functions.invoke('generate-matches', {
     body: { type: 'brand', entityId: brandId }
   })
   ```
3. **Server runs algorithm** (private, secure)
4. **Client receives results** (score + reasons only)

## Verification

Run these checks to verify security:

```bash
# Should find NO matches (algorithm is server-side only)
grep -r "calculateMatchScore" src/

# Should find ONLY type definitions
grep -r "interface Match" src/

# Should find Edge Function usage
grep -r "generate-matches" src/services/
```

## Next Steps

Consider these additional security improvements:

1. **Rate Limiting** - Prevent users from generating matches too frequently
2. **Audit Logging** - Track who generates matches and when
3. **A/B Testing** - Test algorithm improvements server-side without exposing changes
4. **Algorithm Updates** - Now you can update matching logic without redeploying frontend

## Documentation

- **Edge Function:** [`supabase/functions/generate-matches/index.ts`](../supabase/functions/generate-matches/index.ts)
- **Type Definition:** [`src/types/match.ts`](../src/types/match.ts)
- **Usage Guide:** [`docs/EDGE_FUNCTIONS_SETUP.md`](./EDGE_FUNCTIONS_SETUP.md)
