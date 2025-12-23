# Interest Expression System - Setup Guide

## Overview
The interest expression system allows brands and organizers to express interest in each other's profiles. When both parties express interest, it creates a mutual match and enables messaging.

---

## 🚀 Quick Start

### Step 1: Run Database Migration

You need to run the SQL migration to create the `interests` table and update the `matches` table.

**Option A: Via Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file: `database/add-interests-table.sql`
4. Copy the entire SQL content
5. Paste it into the SQL Editor
6. Click **Run** to execute the migration

**Option B: Via Supabase CLI**
```bash
supabase db push
```

### Step 2: Verify Migration

After running the migration, verify it was successful:

```sql
-- Check if interests table was created
SELECT * FROM information_schema.tables
WHERE table_name = 'interests';

-- Check if match_source column was added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'matches' AND column_name = 'match_source';

-- Verify RLS policies
SELECT * FROM pg_policies WHERE tablename = 'interests';
```

### Step 3: Test the System

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Navigate to the Interests page:**
   - Login as a brand or organizer
   - Click on **Interests** in the sidebar navigation
   - You should see three tabs: Sent, Received, Mutual

3. **Test expressing interest:**
   - Go to the directory (Brands or Organizers page)
   - Find a profile to express interest in
   - Click the "Express Interest" button
   - Verify the button changes to "Interest Sent"

4. **Test mutual interest flow:**
   - Create two accounts (one brand, one organizer)
   - Have each express interest in the other
   - Verify both receive notifications
   - Check that a match is created automatically
   - Verify messaging is enabled

---

## 📁 Files Created

### Database
- ✅ `database/add-interests-table.sql` - Migration file

### Types
- ✅ `src/types/interest.ts` - Interest type definitions
- ✅ `src/types/match.ts` - Updated with MatchSource type

### Services
- ✅ `src/services/interestService.ts` - Core interest logic
- ✅ `src/services/notificationService.ts` - Updated with interest notifications
- ✅ `src/services/dataService.ts` - Updated with manual match creation
- ✅ `src/services/chatService.ts` - Updated with access control

### Components & Pages
- ✅ `src/components/interests/InterestCard.tsx` - Interest display component
- ✅ `src/hooks/useInterests.ts` - Interest state management hook
- ✅ `src/pages/dashboard/InterestsPage.tsx` - Main interests page
- ✅ `src/components/directory/DirectoryCard.tsx` - Updated with Express Interest button

### Navigation
- ✅ `src/components/layout/sidebarItems.ts` - Added Interests link
- ✅ `src/App.tsx` - Added Interests route

---

## 🔧 Configuration

### Database Schema

**interests table:**
- Stores one-way interest expressions
- Tracks sender, receiver, brand_id, organizer_id
- Status: pending, accepted, rejected, withdrawn
- Includes RLS policies for security

**matches table updates:**
- Added `match_source` column: 'ai', 'manual', 'hybrid'
- AI matches are from the algorithm
- Manual matches are from mutual interests
- Hybrid matches have both

### Access Control

**Messaging requires:**
- Either an accepted match (AI or manual)
- OR mutual interest (both users expressed interest)

This is enforced in `chatService.ts` via the `canStartConversation()` function.

---

## 🎯 User Flow

### 1. Express Interest
```
User browses directory
→ Sees "Express Interest" button
→ Clicks button
→ System creates interest record
→ Checks for mutual interest
→ If mutual: creates match + conversation + notifies both
→ If not mutual: notifies receiver only
```

### 2. Receive Interest
```
User receives notification
→ Goes to Interests page
→ Sees interest in "Received" tab
→ Can Accept or Reject
→ If accept + sender also interested: creates match
→ Messaging becomes available
```

### 3. Mutual Match
```
Both users express interest
→ Both interests updated to 'accepted'
→ Match created with match_source='manual'
→ Conversation created
→ Both users receive "It's a Match!" notification
→ Users can start messaging
```

---

## 🧪 Testing Checklist

### Basic Functionality
- [ ] Can express interest from directory
- [ ] Interest button shows correct status (none/sent/received/mutual)
- [ ] Interests appear in sent tab
- [ ] Interests appear in received tab for recipient
- [ ] Can accept interest
- [ ] Can reject interest
- [ ] Can withdraw pending interest

### Mutual Interest Flow
- [ ] Mutual interest creates match automatically
- [ ] Both users receive notifications
- [ ] Match appears in Matches page
- [ ] Messaging becomes available
- [ ] Conversation can be started

### Hybrid Matching
- [ ] If AI match exists, manual interest marks it as 'hybrid'
- [ ] Hybrid matches show both badges
- [ ] Priority sorting for hybrid matches

### Edge Cases
- [ ] Cannot express interest in self
- [ ] Cannot express interest in same type (brand→brand)
- [ ] Cannot create duplicate interest
- [ ] Withdrawn interests can be re-expressed
- [ ] Access control blocks messaging without mutual match/interest

### Notifications
- [ ] "Someone is interested!" notification on interest received
- [ ] "Interest Accepted!" notification when interest is accepted
- [ ] "It's a Match!" notification on mutual interest
- [ ] Notification links work correctly

---

## 🐛 Troubleshooting

### Interest button not showing
- Check `showInterestAction` prop is set to `true` on DirectoryCard
- Verify user is logged in
- Check if interest status is being passed correctly

### Cannot express interest
- Check console for errors
- Verify database migration ran successfully
- Check RLS policies are enabled
- Ensure user has opposite type (brand/organizer)

### Messaging still blocked after mutual interest
- Check both interests have status='accepted' or 'pending'
- Verify `checkMutualInterest()` function is working
- Check browser console for access control errors

### Interests not loading
- Check Supabase connection
- Verify RLS policies allow user to read their interests
- Check for JavaScript errors in browser console

---

## 📊 Database Queries

### Check all interests for a user
```sql
SELECT * FROM interests
WHERE sender_id = 'user-id-here' OR receiver_id = 'user-id-here'
ORDER BY created_at DESC;
```

### Check mutual interests
```sql
SELECT i1.*, i2.id as reverse_interest_id
FROM interests i1
JOIN interests i2 ON i1.sender_id = i2.receiver_id
  AND i1.receiver_id = i2.sender_id
WHERE i1.sender_id = 'user-id-here'
  AND i1.status IN ('pending', 'accepted')
  AND i2.status IN ('pending', 'accepted');
```

### Check matches by source
```sql
SELECT match_source, COUNT(*)
FROM matches
GROUP BY match_source;
```

### Find hybrid matches
```sql
SELECT * FROM matches
WHERE match_source = 'hybrid';
```

---

## 🎨 UI Customization

### Interest Button Colors
Edit `DirectoryCard.tsx` to customize button colors for different states:
- `none` - Indigo (default CTA)
- `sent` - Gray (disabled)
- `received` - Indigo light (indicator)
- `mutual` - Pink (highlight)

### Notification Messages
Edit `notificationService.ts` to customize notification text:
- `notifyInterestReceived()` - When someone expresses interest
- `notifyInterestAccepted()` - When interest is accepted
- `notifyMutualMatch()` - When mutual match is created

---

## 🔐 Security

### Row Level Security (RLS)
All policies are in `database/add-interests-table.sql`:

- Users can only create interests they send
- Users can view interests they sent or received
- Users can only update interests they received (to accept/reject)
- Users can withdraw their own pending interests

### Access Control
- Chat service enforces mutual match/interest requirement
- Cannot message without access
- Cannot create interests for others
- Cannot see other users' interests

---

## 🚧 Future Enhancements

Potential additions to consider:

1. **Interest Expiration**
   - Auto-expire old pending interests (e.g., after 30 days)
   - Add edge function to clean up expired interests

2. **Interest Analytics**
   - Track interest expression rates
   - Measure acceptance rates
   - Identify popular profiles

3. **Batch Operations**
   - Accept/reject multiple interests at once
   - Filter interests by date range

4. **Advanced Notifications**
   - Email notifications for interests
   - Push notifications support
   - Daily digest of received interests

5. **Interest Notes**
   - Allow users to add a note when expressing interest
   - Display notes in the interest card

---

## 📝 Next Steps

### Remaining Integration Tasks

1. **Update directory pages** to fetch and pass interest status
   - Modify BrandsDirectoryPage.tsx
   - Modify OrganizersDirectoryPage.tsx
   - Fetch interest status for each profile
   - Pass to DirectoryCard component

2. **Update matches page** with match source badges
   - Add filter for AI/Manual/Hybrid matches
   - Show badge on MatchCard component
   - Priority sort for hybrid matches

---

## 💡 Tips

- **Demo the feature:** Create two accounts and test the complete flow
- **Check notifications:** Make sure notifications are working correctly
- **Test edge cases:** Try expressing interest multiple times, withdrawing, etc.
- **Monitor performance:** Watch database query performance with many interests

---

## 🆘 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review browser console for JavaScript errors
3. Check Supabase logs for database errors
4. Verify RLS policies are correctly configured

For questions or issues, review the implementation in:
- `src/services/interestService.ts` - Core logic
- `database/add-interests-table.sql` - Database schema
