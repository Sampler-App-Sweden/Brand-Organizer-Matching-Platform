# SponsrAI Demo Accounts

Quick reference for demo login credentials to test the platform.

---

## 🎭 Demo Account Credentials

### Organizer Account

**Purpose:** Test event organizer features and dashboard

```
Email:    organizer@demo.com
Password: Demo123!
Name:     Active Life Events
```

### Brand Account

**Purpose:** Test brand/sponsor features and dashboard

```
Email:    brand@demo.com
Password: Demo123!
Name:     EcoRefresh Beverages
```

### Admin Account

**Purpose:** Test admin features

```
Email:    admin@demo.com
Password: Demo123!
Name:     Admin User
```

---

## 🔐 Security Note

**Important:** These are demo accounts using real Supabase authentication.

- Demo accounts must be created manually in Supabase Dashboard
- Passwords follow security requirements (minimum 8 characters)
- Data is stored in PostgreSQL database
- Row Level Security (RLS) policies protect user data
- Production-ready authentication system

---

## 🚀 Creating Demo Accounts

### In Supabase Dashboard:

1. Go to **Authentication → Users**
2. Click **Add User**
3. Enter email and password
4. Set user metadata:
   ```json
   {
     "type": "organizer",
     "name": "Active Life Events",
     "role": "Organizer"
   }
   ```
5. Click **Create User**
6. User can now log in and complete their profile

---

## 🔄 Resetting Demo Data

Demo accounts persist in the database. To reset:

1. Delete organizer/brand profile from respective table
2. User will see empty form on next login
3. Can re-fill profile information

---

**Last Updated:** November 27, 2025
**Version:** 2.0.0 (Supabase Authentication)
