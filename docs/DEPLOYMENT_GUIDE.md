# Deployment Guide - Netlify + One.com Domain

## Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push origin main
```

## Step 2: Deploy to Netlify

1. Go to [netlify.com](https://app.netlify.com) and sign up/login
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" and authorize Netlify
4. Select your repository: `Sampler-App-Sweden/Brand-Organizer-Matching-Platform`
5. Configure build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
   - **Node version:** 18
6. Click "Deploy site"

## Step 3: Add Environment Variables in Netlify

1. Go to Site settings → Environment variables
2. Add the following variables:
   - `VITE_SUPABASE_URL` = `https://bckowauyxekuqqkaexaq.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = (your anon key from Supabase)
3. Click "Redeploy" to apply changes

## Step 4: Connect One.com Domain to Netlify

### In Netlify:
1. Go to Site settings → Domain management
2. Click "Add custom domain"
3. Enter your domain (e.g., `yourdomain.com`)
4. Netlify will provide DNS records to configure

### In One.com Control Panel:
1. Log in to [one.com](https://www.one.com/admin/)
2. Go to your domain → DNS settings
3. Update DNS records with Netlify's values:

**Option A - Use Netlify DNS (Recommended):**
- Change nameservers to Netlify's nameservers (provided in Netlify dashboard)
- This gives Netlify full control and enables automatic SSL

**Option B - Use One.com DNS:**
Add these records in One.com:
- **A Record:** `@` → Netlify's load balancer IP (provided by Netlify)
- **CNAME Record:** `www` → `your-site.netlify.app`

4. Wait 24-48 hours for DNS propagation (usually faster)

## Step 5: Enable HTTPS

1. In Netlify → Domain settings
2. Wait for SSL certificate to provision (automatic with Let's Encrypt)
3. Enable "Force HTTPS" to redirect HTTP to HTTPS

## Step 6: Update Supabase Allowed URLs

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add your custom domain to:
   - **Site URL:** `https://yourdomain.com`
   - **Redirect URLs:** Add `https://yourdomain.com/**`

## Continuous Deployment

Once set up, Netlify will automatically:
- Build and deploy when you push to GitHub
- Show deploy previews for pull requests
- Provide build logs and error messages

## Useful Netlify Commands

```bash
# Install Netlify CLI (optional)
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy manually
netlify deploy --prod

# View site
netlify open
```

## Troubleshooting

### Build fails:
- Check environment variables are set correctly
- Review build logs in Netlify dashboard
- Ensure `package.json` scripts are correct

### Domain not working:
- Verify DNS records are correct
- Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net/)
- Try clearing browser cache or incognito mode

### 404 errors on refresh:
- Ensure `netlify.toml` has the redirect rule (already included)

### API errors:
- Verify Supabase environment variables
- Check Supabase allowed URLs include your domain
