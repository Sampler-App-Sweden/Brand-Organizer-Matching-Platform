
# SponsrAI Quick Start Deployment Guide

## 🚀 Fast Track to Production

This is a condensed version of the full deployment guide. For detailed instructions, see `DEPLOYMENT.md`.

---

## Prerequisites Checklist

Before you begin, ensure you have:
- [ ] Access to your domain registrar (for sponsrai.se)
- [ ] SSH access to server: `149.248.202.188`
- [ ] Supabase production project created
- [ ] EmailJS account set up (optional)
- [ ] 2-3 hours for deployment

---

## Step 1: Configure DNS (Do This First!)

**Time Required:** 5 minutes (+ 24-48 hours propagation)

1. Log into your domain registrar
2. Add these DNS records:

```
Type: A
Name: @
Value: 149.248.202.188
TTL: 3600

Type: A  
Name: www
Value: 149.248.202.188
TTL: 3600
```

3. Wait 24-48 hours for propagation
4. Verify: `dig www.sponsrai.se`

**⚠️ Do this first! DNS takes time to propagate.**

---

## Step 2: Server Setup

**Time Required:** 30 minutes

### Connect to Server

```bash
ssh root@149.248.202.188
# or
ssh your_username@149.248.202.188
```

### Install Everything

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Nginx
sudo apt install -y nginx

# Install Certbot for SSL
sudo apt install -y certbot python3-certbot-nginx

# Install Git
sudo apt install -y git

# Verify installations
node --version  # Should show v18.x
nginx -v        # Should show nginx version
```

---

## Step 3: Deploy Application

**Time Required:** 15 minutes

### Create Directory

```bash
sudo mkdir -p /var/www/sponsrai
sudo chown -R $USER:$USER /var/www/sponsrai
cd /var/www/sponsrai
```

### Upload Your Code

**Option A: Using Git**
```bash
git clone your_repository_url .
```

**Option B: Using SCP (from your local machine)**
```bash
# Run this from your LOCAL machine, not the server
scp -r ./build/* user@149.248.202.188:/var/www/sponsrai/
```

### Install & Build

```bash
cd /var/www/sponsrai
npm install --production
cp .env.production .env
nano .env  # Edit with your actual values
npm run build
```

**Required .env values:**
- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anon key
- `REACT_APP_EMAILJS_SERVICE_ID` - Your EmailJS service ID
- `REACT_APP_EMAILJS_TEMPLATE_ID` - Your EmailJS template ID
- `REACT_APP_EMAILJS_PUBLIC_KEY` - Your EmailJS public key

---

## Step 4: Configure Nginx

**Time Required:** 10 minutes

### Create Configuration

```bash
sudo nano /etc/nginx/sites-available/sponsrai.se
```

**Copy the entire content from `nginx.conf` file into this file.**

### Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/sponsrai.se /etc/nginx/sites-enabled/

# Remove default site
sudo rm /etc/nginx/sites-enabled/default

# Test configuration
sudo nginx -t

# If test passes, reload Nginx
sudo systemctl reload nginx
```

---

## Step 5: Get SSL Certificate

**Time Required:** 5 minutes

```bash
# Get certificate for both domains
sudo certbot --nginx -d sponsrai.se -d www.sponsrai.se
```

Follow prompts:
1. Enter your email
2. Agree to terms (Y)
3. Redirect HTTP to HTTPS? → Yes (2)

**Test auto-renewal:**
```bash
sudo certbot renew --dry-run
```

---

## Step 6: Configure Firewall

**Time Required:** 5 minutes

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Allow SSH (important!)
sudo ufw allow OpenSSH

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Step 7: Verify Deployment

**Time Required:** 10 minutes

### Check Services

```bash
# Nginx status
sudo systemctl status nginx

# Test site
curl -I https://www.sponsrai.se
```

### Test in Browser

1. Visit: `https://www.sponsrai.se`
2. Check SSL (green lock icon)
3. Test registration
4. Test login
5. Test dashboard

### Monitor Logs

```bash
# Watch for errors
sudo tail -f /var/log/nginx/error.log

# Watch access
sudo tail -f /var/log/nginx/access.log
```

---

## Step 8: Set Up Backups

**Time Required:** 5 minutes

```bash
# Create backup script
sudo nano /usr/local/bin/backup-sponsrai.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/sponsrai"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/sponsrai_$DATE.tar.gz /var/www/sponsrai/
find $BACKUP_DIR -name "sponsrai_*.tar.gz" -mtime +7 -delete
```

Make executable and schedule:
```bash
sudo chmod +x /usr/local/bin/backup-sponsrai.sh
sudo crontab -e
# Add this line:
0 2 * * * /usr/local/bin/backup-sponsrai.sh
```

---

## 🎉 You're Live!

Your site should now be accessible at:
- https://www.sponsrai.se
- https://sponsrai.se (redirects to www)

---

## Common Issues & Solutions

### DNS Not Resolving
**Problem:** Site not loading after DNS configuration  
**Solution:** Wait 24-48 hours for DNS propagation. Check with `dig www.sponsrai.se`

### 502 Bad Gateway
**Problem:** Nginx shows 502 error  
**Solution:** 
```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log
ls -la /var/www/sponsrai/build  # Verify build exists
```

### SSL Certificate Failed
**Problem:** Certbot fails to get certificate  
**Solution:**
- Ensure DNS is propagated first
- Check ports 80 and 443 are open: `sudo ufw status`
- Verify Nginx is running: `sudo systemctl status nginx`

### Application Not Loading
**Problem:** White screen or errors in browser  
**Solution:**
- Check browser console for errors
- Verify .env variables are set correctly
- Check Supabase connection
- Review Nginx error logs

---

## Next Steps

1. **Set up monitoring:** UptimeRobot, Google Analytics
2. **Configure backups:** Already done in Step 8
3. **Security hardening:** See `SECURITY.md`
4. **Performance optimization:** Enable Cloudflare CDN
5. **Complete checklist:** Review `LAUNCH_CHECKLIST.md`

---

## Useful Commands

```bash
# Restart Nginx
sudo systemctl restart nginx

# View error logs
sudo tail -100 /var/log/nginx/error.log

# Check disk space
df -h

# Check memory
free -h

# Update application
cd /var/www/sponsrai
git pull
npm install
npm run build
sudo systemctl reload nginx

# Renew SSL
sudo certbot renew
```

---

## Emergency Rollback

If something goes wrong:

```bash
# 1. Restore from backup
cd /var/www/sponsrai
sudo tar -xzf /var/backups/sponsrai/sponsrai_YYYYMMDD_HHMMSS.tar.gz

# 2. Reload Nginx
sudo systemctl reload nginx

# 3. Verify
curl -I https://www.sponsrai.se
```

---

## Support Resources

- **Full Deployment Guide:** `DEPLOYMENT.md`
- **Security Guide:** `SECURITY.md`
- **Launch Checklist:** `LAUNCH_CHECKLIST.md`
- **Nginx Config:** `nginx.conf`
- **Environment Template:** `.env.production`

---

## Estimated Total Time

- DNS Configuration: 5 min (+ 24-48 hours wait)
- Server Setup: 30 min
- Application Deployment: 15 min
- Nginx Configuration: 10 min
- SSL Certificate: 5 min
- Firewall Setup: 5 min
- Verification: 10 min
- Backups: 5 min

**Total Active Time:** ~1.5 hours  
**Total with DNS Wait:** 24-48 hours

---

## Final Checklist

Before announcing launch:
- [ ] DNS propagated and resolving
- [ ] SSL certificate installed (green lock)
- [ ] All pages load correctly
- [ ] Registration/login works
- [ ] Forms submit successfully
- [ ] Mobile responsive
- [ ] Backups configured
- [ ] Monitoring set up
- [ ] Error logs clean

---

**Questions or Issues?**

1. Check the detailed guides in this repository
2. Review error logs: `/var/log/nginx/error.log`
3. Verify all steps were completed
4. Check Supabase dashboard for API errors

**Good luck with your launch! 🚀**
