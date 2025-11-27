# SponsrAI - Brand & Organizer Matching Platform

A modern web application connecting brands with event organizers for sponsorship opportunities. Built with React, TypeScript, Vite, and Supabase.

## 🚀 Features

- **Dual Registration System**: Separate onboarding flows for brands and organizers
- **AI-Powered Matching**: Intelligent matching algorithm for brands and events
- **Real-time Notifications**: Live updates for matches, messages, and profile changes
- **Dashboard Management**: Dedicated dashboards for brands, organizers, and admins
- **Authentication**: Secure authentication with Supabase Auth
- **Profile Management**: Comprehensive profile creation and editing
- **Responsive Design**: Mobile-first design with TailwindCSS

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **UI Components**: Custom component library with Lucide icons
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Routing**: React Router v6
- **State Management**: React Context API
- **Form Handling**: Custom hooks with validation

## 📁 Project Structure

```
src/
├── components/
│   ├── ai-assistant/        # AI onboarding components
│   ├── community/           # Community features
│   ├── directory/           # Brand/organizer directories
│   ├── effects/             # Visual effects & animations
│   ├── forms/               # Form step components
│   │   ├── brand/          # Brand form steps
│   │   └── organizer/      # Organizer form steps
│   ├── landing/            # Landing page components
│   ├── layout/             # Layout components (Navbar, Footer, etc.)
│   ├── sponsorship/        # Sponsorship-related components
│   └── ui/                 # Reusable UI components
├── constants/              # Form options and static data
├── context/                # React Context providers
│   ├── AuthContext.tsx
│   ├── DraftProfileContext.tsx
│   └── NotificationsContext.tsx
├── hooks/                  # Custom React hooks
│   ├── useBrandForm.ts
│   └── useOrganizerForm.ts
├── lib/                    # Utility libraries
├── pages/                  # Page components
│   ├── admin/             # Admin pages
│   └── dashboard/         # Dashboard pages
├── services/              # API and service layer
├── styles/                # Global styles
├── types/                 # TypeScript type definitions
└── utils/                 # Utility functions
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Sampler-App-Sweden/Brand-Organizer-Matching-Platform.git
   cd Brand-Organizer-Matching-Platform
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up Supabase database**

   Run the SQL scripts in the `database/` folder in your Supabase SQL Editor:

   - `supabase-schema.sql` - Main database schema
   - `organizers_rls_policies.sql` - Row Level Security policies for organizers
   - `fix-rls-policies.sql` - Additional RLS fixes
   - `create-drafts-table.sql` - Draft profiles table

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**

   Navigate to `http://localhost:5173`

## 🔐 Authentication

The platform uses Supabase Authentication with the following user types:

- **Brand**: Companies looking for sponsorship opportunities
- **Organizer**: Event organizers seeking brand sponsors
- **Admin**: Platform administrators

### Demo Accounts

See `docs/DEMO_ACCOUNTS.md` for test credentials.

## 📊 Database Schema

Key tables:

- `profiles` - User profiles
- `brands` - Brand-specific information
- `organizers` - Organizer-specific information
- `matches` - Brand-organizer matches
- `notifications` - User notifications
- `drafts` - Draft profile data

## 🧩 Key Features Explained

### Form Architecture

Forms are now modularized with:

- **Custom Hooks** (`useBrandForm`, `useOrganizerForm`) - Handle state, validation, and submission
- **Step Components** - Each form step is a separate component
- **Constants** - Form options extracted to constant files
- **Type Safety** - Full TypeScript support throughout

### Notification System

Real-time notifications using Supabase Realtime:

- Match notifications
- Message notifications
- Profile update notifications
- System notifications

### Context Providers

- **AuthContext** - User authentication and session management
- **NotificationsContext** - Real-time notification handling
- **DraftProfileContext** - Draft profile saving

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Netlify

The project includes a `netlify.toml` configuration file. Simply connect your repository to Netlify for automatic deployments.

See `docs/DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

## 📖 Documentation

Additional documentation is available in the `docs/` folder:

- `DEPLOYMENT_GUIDE.md` - Deployment instructions
- `DEMO_ACCOUNTS.md` - Test account credentials
- `LAUNCH_CHECKLIST.md` - Pre-launch checklist
- `PROJECT_STRUCTURE.md` - Detailed project structure
- `QUICK_START.md` - Quick start guide
- `SECURITY.md` - Security best practices
- `TROUBLESHOOTING.md` - Common issues and solutions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary software owned by Sampler App Sweden.

## 🐛 Known Issues

- Email field in profile forms is read-only (managed by auth system)
- Organizer profile updates require unique constraint on `user_id`
- Form refactoring completed for better maintainability

## 🔄 Recent Updates

- **Nov 2025**: Major refactoring of BrandForm and OrganizerForm
  - Extracted form logic to custom hooks
  - Split forms into step components
  - Centralized form options in constants
  - Reduced main form files by 75%
- **Nov 2025**: Added NotificationsContext for real-time notifications
- **Nov 2025**: Implemented DashboardLayout with unified navigation
- **Nov 2025**: Fixed RLS policies for organizer profile updates

## 📞 Support

For support, email support@sponsrai.com or open an issue in the repository.

---

**Built with ❤️ by Sampler App Sweden**
