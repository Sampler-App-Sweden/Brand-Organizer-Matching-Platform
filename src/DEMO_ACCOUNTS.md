
# SponsrAI Demo Accounts

Quick reference for demo login credentials to test the platform.

---

## 🎭 Demo Account Credentials

### Brand Account
**Purpose:** Test brand/sponsor features and dashboard

```
Email:    brand@demo.com
Password: demo123
Name:     EcoRefresh Beverages
```

**Pre-configured Profile:**
- Company: EcoRefresh Beverages
- Product: Organic Energy Drink
- Industry: Food & Beverage
- Target Audience: Health-conscious active adults (25-34)
- Budget: 50,000-100,000 SEK
- Marketing Goals: Brand awareness among fitness enthusiasts
- Sponsorship Types: Product sampling, Financial sponsorship

**Features to Test:**
- View brand dashboard
- See AI-powered matches with events
- Browse organizer directory
- Send messages to organizers
- Manage sponsorship opportunities
- Track product sampling campaigns

---

### Organizer Account
**Purpose:** Test event organizer features and dashboard

```
Email:    organizer@demo.com
Password: demo123
Name:     Active Life Events
```

**Pre-configured Profile:**
- Organization: Active Life Events
- Event: Stockholm Fitness Festival
- Event Type: Annual Festival
- Expected Attendance: 1,000-5,000
- Audience: Fitness enthusiasts, health professionals
- Location: Stockholm Exhibition Center
- Seeking: Food & beverage sponsors, financial sponsorship

**Features to Test:**
- View organizer dashboard
- See AI-powered matches with brands
- Browse brand directory
- Send messages to brands
- Manage sponsorship offerings
- Coordinate product sampling opportunities

---

### Community Account
**Purpose:** Test community member features

```
Email:    community@demo.com
Password: demo123
Name:     Sarah Johnson
```

**Pre-configured Profile:**
- Member: Sarah Johnson
- Role: Test panel participant
- Interests: Fitness, wellness, healthy living
- Availability: Weekends and evenings
- Location: Stockholm area

**Features to Test:**
- View community dashboard
- Browse available test panels
- Sign up for product sampling events
- Provide feedback on products
- Connect with brands and organizers
- Track participation history

---

## 🚀 Quick Login

### From Login Page
The login page displays all demo accounts with:
- One-click "Quick Login" buttons
- Copy-to-clipboard for credentials
- Account descriptions and features

### Direct URLs
After logging in, you'll be redirected to:
- **Brand:** `/dashboard/brand`
- **Organizer:** `/dashboard/organizer`
- **Community:** `/community`

---

## 🎯 Testing Scenarios

### Scenario 1: Brand-Organizer Match
1. Login as **Brand** (brand@demo.com)
2. View dashboard - see match with Stockholm Fitness Festival
3. Click on match to view details
4. Send message to organizer
5. Logout and login as **Organizer** (organizer@demo.com)
6. View received message
7. Respond to brand
8. Explore collaboration opportunities

### Scenario 2: Product Sampling Campaign
1. Login as **Brand**
2. Navigate to "Matches" page
3. Select Stockholm Fitness Festival match
4. Propose product sampling opportunity
5. Logout and login as **Organizer**
6. Review sampling proposal
7. Accept and coordinate details
8. Logout and login as **Community** member
9. View available sampling opportunity
10. Sign up to participate

### Scenario 3: Directory Exploration
1. Login as any account type
2. Navigate to "For Brands" or "For Organizers" directory
3. Use filters to search
4. View detailed profiles
5. Save interesting profiles
6. Send connection requests

---

## 📊 Pre-loaded Data

### Match Data
The demo accounts have a pre-configured match:
- **Match Score:** 92%
- **Brand:** EcoRefresh Beverages
- **Event:** Stockholm Fitness Festival
- **Match Reasons:**
  - Target audience age range matches
  - Industry aligns with event needs
  - Budget fits sponsorship requirements
  - Product sampling opportunity available
  - Health-focused brand matches fitness theme

### Sample Messages
Some demo conversations are pre-loaded to showcase the messaging system.

### Analytics Data
Demo dashboards show sample analytics:
- Match statistics
- Engagement metrics
- Campaign performance
- Audience insights

---

## 🔄 Resetting Demo Data

### Clear All Data
To reset demo accounts to initial state:

```javascript
// Run in browser console
localStorage.clear()
location.reload()
```

### Reinitialize Demo Accounts
Demo accounts are automatically created on first page load if they don't exist.

---

## 🛠️ For Developers

### Creating Additional Demo Accounts

Edit `services/authService.ts` and add to `defaultUsers` array:

```typescript
{
  id: 'unique-id',
  email: 'demo@example.com',
  password: 'demo123',
  type: 'brand' | 'organizer' | 'community',
  name: 'Display Name',
  createdAt: new Date(),
}
```

### Adding Demo Profile Data

Edit `services/authService.ts` in the `initializeTestData()` function to add:
- Brand profiles
- Organizer profiles
- Community member profiles
- Matches between accounts
- Sample messages

---

## 🎨 Demo Account Features

### Brand Dashboard
- Match recommendations with AI scoring
- Event directory with advanced filters
- Messaging system
- Sponsorship opportunity manager
- Product sampling campaign tracker
- Analytics and insights

### Organizer Dashboard
- Brand match recommendations
- Brand directory with filters
- Messaging system
- Sponsorship offering manager
- Event promotion tools
- Attendee insights

### Community Dashboard
- Available test panels
- Product sampling opportunities
- Feedback submission
- Participation history
- Rewards and incentives
- Community events calendar

---

## 📱 Mobile Testing

All demo accounts work on mobile devices:
- Responsive design
- Touch-optimized interface
- Mobile-friendly navigation
- Quick actions and shortcuts

Test on:
- iOS Safari
- Android Chrome
- Tablet devices

---

## 🔐 Security Note

**Important:** These are demo accounts for testing purposes only.

- Passwords are intentionally simple (demo123)
- Data is stored in browser localStorage
- Not suitable for production use
- Real accounts will use Supabase authentication
- Production passwords must be strong and hashed

---

## 💡 Tips for Demos

### For Sales/Marketing
- Start with brand account to show sponsor perspective
- Highlight AI matching algorithm
- Demonstrate messaging and collaboration
- Show analytics and ROI tracking

### For Product Demos
- Use all three account types to show full platform
- Walk through complete sponsorship lifecycle
- Highlight unique features and differentiators
- Show mobile responsiveness

### For User Testing
- Let users explore freely with demo accounts
- Observe which features they discover
- Note any confusion or friction points
- Gather feedback on UI/UX

---

## 🚀 Quick Start for Demos

1. **Navigate to:** https://www.sponsrai.se/login
2. **Choose a demo account** from the left panel
3. **Click "Quick Login"** button
4. **Explore the platform** features
5. **Switch accounts** to see different perspectives

---

## 📞 Support

For questions about demo accounts:
- **Email:** support@sponsrai.se
- **Documentation:** See README.md
- **Issues:** Check troubleshooting guide

---

**Last Updated:** 2024
**Version:** 1.0.0
