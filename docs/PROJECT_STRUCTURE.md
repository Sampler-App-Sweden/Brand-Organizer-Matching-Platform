# Project Structure

This document describes the organization and architecture of the SponsrAI codebase.

## 📁 Directory Structure

```
Brand-Organizer-Matching-Platform/
├── .env.example              # Environment variables template
├── .env.production           # Production environment config
├── .gitignore
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── index.html
│
├── config/                   # Server & deployment configs
│   ├── nginx.conf
│   └── .htaccess
│
├── database/                 # Database schemas
│   └── supabase-schema.sql
│
├── docs/                     # Documentation
│   ├── README.md
│   ├── DEPLOYMENT.md
│   ├── DEMO_ACCOUNTS.md
│   ├── LAUNCH_CHECKLIST.md
│   ├── LOGIN_CREDENTIALS.txt
│   ├── QUICK_START.md
│   ├── SECURITY.md
│   ├── SSL_INSTALLATION_GUIDE.md
│   ├── TROUBLESHOOTING.md
│   └── PROJECT_STRUCTURE.md (this file)
│
├── scripts/                  # Build & deployment scripts
│   └── install-ssl.sh
│
├── public/                   # Static assets
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
│
└── src/                      # Source code
    ├── index.tsx             # Application entry point
    ├── App.tsx               # Root component with routing
│
    ├── components/           # React components
│   ├── index.ts          # Barrel exports for all components
│   │
│   ├── ui/               # Basic UI components
│   │   ├── index.ts
│   │   ├── Button.tsx
│   │   ├── FormField.tsx
│   │   ├── Toast.tsx
│   │   ├── StepIndicator.tsx
│   │   └── SelectionCard.tsx
│   │
│   ├── layout/           # Layout & navigation components
│   │   ├── index.ts
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── DashboardLayout.tsx
│   │   ├── Footer.tsx
│   │   ├── DashboardListingsBar.tsx
│   │   └── sidebarItems.ts
│   │
│   ├── landing/          # Landing page specific components
│   │   ├── index.ts
│   │   ├── TechHero.tsx
│   │   ├── TechCard.tsx
│   │   └── TechFeatureSection.tsx
│   │
│   ├── effects/          # Visual effects & animations
│   │   ├── index.ts
│   │   └── TechEffects.tsx
│   │
│   ├── ai-assistant/     # AI onboarding components
│   │   ├── index.ts
│   │   ├── AIOnboardingAssistant.tsx
│   │   ├── ConversationalInput.tsx
│   │   ├── DynamicSuggestions.tsx
│   │   ├── ProfileSummary.tsx
│   │   └── ProgressIndicator.tsx
│   │
│   ├── community/        # Community feature components
│   │   ├── index.ts
│   │   ├── AdminToggle.tsx
│   │   ├── CommunityCard.tsx
│   │   ├── CommunityDropdown.tsx
│   │   ├── CommunityShowcase.tsx
│   │   ├── HomeCommunityCTA.tsx
│   │   └── InterestOfferWizard.tsx
│   │
│   ├── directory/        # Directory listing components
│   │   ├── index.ts
│   │   ├── DirectoryCard.tsx
│   │   ├── DirectoryFilters.tsx
│   │   ├── DirectoryGrid.tsx
│   │   └── Pagination.tsx
│   │
│   ├── sponsorship/      # Sponsorship management
│   │   ├── index.ts
│   │   ├── BrandSponsorshipPanel.tsx
│   │   ├── OrganizerSponsorshipPanel.tsx
│   │   └── ProductSponsorshipManager.tsx
│   │
│   ├── ErrorBoundary.tsx
│   ├── HelpChat.tsx
│   ├── ContractForm.tsx
│   ├── RegistrationDebugHelper.tsx
│   └── dashboard/         # Dashboard-specific widgets
│       └── matches/        # Matches feature components
│           ├── MatchCard.tsx
│           ├── MatchesFilters.tsx
│           └── MatchesEmptyState.tsx
│
    ├── pages/                # Page components
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── AiOnboarding.tsx
│   ├── BrandForm.tsx
│   ├── OrganizerForm.tsx
│   ├── CommunityPage.tsx
│   ├── CommunityRegistration.tsx
│   ├── CommunityMemberDetail.tsx
│   ├── BrandsDirectoryPage.tsx
│   ├── OrganizersDirectoryPage.tsx
│   ├── ProfilesExplorer.tsx
│   ├── LoginTroubleshooting.tsx
│   │
│   ├── dashboard/        # Dashboard pages
│   │   ├── BrandDashboard.tsx
│   │   ├── OrganizerDashboard.tsx
│   │   ├── MatchDetails.tsx
│   │   ├── MatchesPage.tsx
│   │   ├── MessagesPage.tsx
│   │   ├── SavedItemsPage.tsx
│   │   └── InspirationBoardPage.tsx
│   │
│   └── admin/            # Admin pages
│       └── AdminDashboard.tsx
│
    ├── context/              # React Context providers
│   ├── index.ts
│   ├── AuthContext.tsx
│   └── DraftProfileContext.tsx
│
    ├── hooks/                # Custom React hooks (ready for use)
│   ├── useInspirationBoard.ts
│   └── useMatchesPage.ts
│
    ├── services/             # Business logic & API calls
│   ├── index.ts
│   ├── aiService.ts
│   ├── analyticsService.ts
│   ├── authService.ts
│   ├── chatService.ts
│   ├── collaborationService.ts
│   ├── communityService.ts
│   ├── dataService.ts
│   ├── draftService.ts
│   ├── emailService.ts
│   ├── experimentService.ts
│   ├── matchingService.ts
│   ├── profileService.ts
│   ├── supabaseAuthService.ts
│   └── supabaseClient.ts
│
    ├── types/                # TypeScript type definitions
│   ├── index.ts
│   ├── profile.ts
│   ├── community.ts
│   └── collaboration.ts
│
    ├── utils/                # Utility functions
│   ├── index.ts
│   ├── constants.ts      # App-wide constants
│   ├── formatting.ts     # Formatting helpers
│   └── validation.ts     # Validation functions
│
    ├── lib/                  # Third-party library configs
│   └── index.ts
│
    └── styles/               # Global styles
        └── tech-effects.css
```

## 🎯 Key Organizational Principles

### 1. Barrel Exports (index.ts)

All major folders include `index.ts` files for clean imports:

```typescript
// ❌ Before
import { Button } from '../../../components/Button'
import { FormField } from '../../../components/FormField'

// ✅ After
import { Button, FormField } from '../../components/ui'
```

### 2. Component Categorization

#### **UI Components** (`components/ui/`)

Basic, reusable UI elements:

- Buttons
- Form fields
- Toasts
- Step indicators
- Selection cards

#### **Layout Components** (`components/layout/`)

Structural components for page layout:

- Main layout wrapper
- Navigation bar
- Dashboard layout
- Technical layout (for landing pages)
- Dashboard listings bar

#### **Landing Components** (`components/landing/`)

Specific to the landing/marketing pages:

- Hero sections
- Feature cards
- Feature sections

#### **Effects Components** (`components/effects/`)

Visual effects and animations:

- Technical effects
- Background animations
- Circuit lines

#### **Feature-Specific Components**

- `ai-assistant/` - AI onboarding flow
- `community/` - Community features
- `directory/` - Brand/organizer listings
- `sponsorship/` - Sponsorship management

### 3. Page Organization

Pages are organized by access level:

- **Public pages** - Root level (`/pages`)
- **Dashboard pages** - User-specific (`/pages/dashboard`)
- **Admin pages** - Admin only (`/pages/admin`)

### 4. Services Layer

All business logic and API calls are in the `services/` folder:

- Each service handles a specific domain
- Services are stateless
- Import via barrel exports

### 5. Utilities

Common helper functions organized by purpose:

- **constants.ts** - App-wide constants, config values
- **formatting.ts** - Date, currency, text formatting
- **validation.ts** - Input validation, sanitization

## 📦 Import Patterns

### Using Barrel Exports

```typescript
// Components
import { Button, FormField, Toast } from '@/components/ui'
import { Layout, Navbar } from '@/components/layout'
import { CommunityCard } from '@/components/community'

// Services
import { trackEvent, EVENTS } from '@/services'
import { getCommunityMembers } from '@/services/communityService'

// Types
import { BrandProfile, OrganizerProfile } from '@/types'

// Utils
import { formatDate, formatCurrency } from '@/utils'
```

## 🔧 Configuration Files

- **Root Level**: Project-wide configs (package.json, tsconfig.json, vite.config.ts)
- **config/**: Server and deployment configs
- **database/**: Database schemas
- **scripts/**: Build and deployment scripts

## 📚 Documentation

All documentation is centralized in the `docs/` folder:

- User guides
- Deployment instructions
- Security guidelines
- Troubleshooting guides
- This structure document

## 🚀 Benefits of This Structure

1. **Scalability** - Easy to add new features without cluttering
2. **Maintainability** - Related code is grouped together
3. **Developer Experience** - Clean imports, easy navigation
4. **Team Collaboration** - Clear conventions for where code belongs
5. **Build Optimization** - Better tree-shaking with barrel exports

## 🔄 Adding New Code

### New Component

```typescript
// 1. Create component in appropriate folder
src / components / ui / NewButton.tsx

// 2. Export from folder's index.ts
export { NewButton } from './NewButton'

// 3. Use anywhere with clean import
import { NewButton } from '@/components/ui'
```

### New Service

```typescript
// 1. Create service file
src / services / notificationService.ts

// 2. Export from services/index.ts
export * from './notificationService'

// 3. Import and use
import { sendNotification } from '@/services'
```

### New Utility

```typescript
// 1. Add to existing utility file or create new one
src / utils / arrayHelpers.ts

// 2. Export from utils/index.ts
export * from './arrayHelpers'

// 3. Import and use
import { unique, sortBy } from '@/utils'
```

## 📊 Project Statistics

- **Total Components**: 50+
- **Total Pages**: 20+
- **Total Services**: 14
- **Total Utils**: 3 files
- **Build Size**: ~716 KB (minified)

---

**Last Updated**: December 9, 2025
**Maintained By**: Development Team
