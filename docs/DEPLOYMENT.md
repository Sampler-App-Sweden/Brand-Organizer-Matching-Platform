
# SponsrAI Deployment Guide

## Domain: www.sponsrai.se
## Server IP: 149.248.202.188

This guide will walk you through deploying SponsrAI to your production server.

---

## Prerequisites

- Access to your domain registrar (for DNS configuration)
- SSH access to server at 149.248.202.188
- Node.js 16+ installed on server
- Nginx or Apache web server
- SSL certificate (Let's Encrypt recommended)
- Supabase production project set up

---

## Step 1: DNS Configuration

### A. Point Domain to Server

Log into your domain registrar (where you purchased sponsrai.se) and add these DNS records:

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

**DNS Propagation:** Changes can take 1-48 hours to propagate globally.

**Verify DNS:** After configuration, verify with:
```bash
dig www.sponsrai.se
nslookup www.sponsrai.se
```

---

## Step 2: Server Setup

### A. Connect to Server

```bash
ssh root@149.248.202.188
# or
ssh your_username@149.248.202.188
```

### B. Install Dependencies

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
```

### C. Create Application Directory

```bash
sudo mkdir -p /var/www/sponsrai
sudo chown -R $USER:$USER /var/www/sponsrai
cd /var/www/sponsrai
```

---

## Step 3: Deploy Application

### A. Clone Repository

```bash
# If using Git
git clone your_repository_url .

# Or upload files via SCP from local machine:
# scp -r ./build/* user@149.248.202.188:/var/www/sponsrai/
```

### B. Install Dependencies

```bash
npm install --production
```

### C. Configure Environment

```bash
# Copy production environment file
cp .env.production .env

# Edit with your actual values
nano .env
```

**Required values:**
- Supabase URL and keys
- EmailJS credentials
- Analytics IDs (if using)

### D. Build Application

```bash
npm run build
```

This creates an optimized production build in the `build/` directory.

---

## Step 4: Configure Nginx

### A. Create Nginx Configuration

```bash
sudo nano /etc/nginx/sites-available/sponsrai.se
```

Add this configuration:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name sponsrai.se www.sponsrai.se;
    
    return 301 https://www.sponsrai.se$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.sponsrai.se;
    
    # SSL Configuration (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/www.sponsrai.se/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/www.sponsrai.se/privkey.pem;
    
    # Root directory
    root /var/www/sponsrai/build;
    index index.html;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # React Router - serve index.html for all routes
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API proxy (if you have a backend API)
    # location /api {
    #     proxy_pass http://localhost:3001;
    #     proxy_http_version 1.1;
    #     proxy_set_header Upgrade $http_upgrade;
    #     proxy_set_header Connection 'upgrade';
    #     proxy_set_header Host $host;
    #     proxy_cache_bypass $http_upgrade;
    # }
}

# Redirect non-www to www
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name sponsrai.se;
    
    # SSL Configuration (will be added by Certbot)
    # ssl_certificate /etc/letsencrypt/live/sponsrai.se/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/sponsrai.se/privkey.pem;
    
    return 301 https://www.sponsrai.se$request_uri;
}
```

### B. Enable Site

```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/sponsrai.se /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

---

## Step 5: SSL Certificate (HTTPS)

### A. Obtain Certificate

```bash
# Get certificate for both domains
sudo certbot --nginx -d sponsrai.se -d www.sponsrai.se
```

Follow the prompts:
- Enter your email
- Agree to terms
- Choose to redirect HTTP to HTTPS (recommended)

### B. Auto-renewal

Certbot automatically sets up renewal. Test it:

```bash
sudo certbot renew --dry-run
```

---

## Step 6: Firewall Configuration

```bash
# Allow HTTP and HTTPS
sudo ufw allow 'Nginx Full'

# Allow SSH (if not already allowed)
sudo ufw allow OpenSSH

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

---

## Step 7: Verify Deployment

### A. Check Service Status

```bash
# Nginx status
sudo systemctl status nginx

# Check if site is accessible
curl -I https://www.sponsrai.se
```

### B. Test in Browser

1. Visit https://www.sponsrai.se
2. Check SSL certificate (should show green lock)
3. Test all major features:
   - Registration/Login
   - Dashboard access
   - Form submissions
   - Navigation

### C. Monitor Logs

```bash
# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log
```

---

## Step 8: Post-Deployment

### A. Set Up Monitoring

Consider adding:
- **Uptime monitoring:** UptimeRobot, Pingdom
- **Error tracking:** Sentry
- **Analytics:** Google Analytics (already configured)
- **Performance monitoring:** New Relic, DataDog

### B. Backup Strategy

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

# Keep only last 7 days of backups
find $BACKUP_DIR -name "sponsrai_*.tar.gz" -mtime +7 -delete
```

Make executable and schedule:
```bash
sudo chmod +x /usr/local/bin/backup-sponsrai.sh
sudo crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-sponsrai.sh
```

### C. Update Process

For future updates:

```bash
cd /var/www/sponsrai
git pull origin main  # or your branch
npm install
npm run build
sudo systemctl reload nginx
```

---

## Troubleshooting

### DNS Not Resolving
- Wait 24-48 hours for propagation
- Clear DNS cache: `sudo systemd-resolve --flush-caches`
- Check with: `dig www.sponsrai.se`

### 502 Bad Gateway
- Check Nginx status: `sudo systemctl status nginx`
- Check error logs: `sudo tail -f /var/log/nginx/error.log`
- Verify build directory exists: `ls -la /var/www/sponsrai/build`

### SSL Certificate Issues
- Renew manually: `sudo certbot renew`
- Check certificate: `sudo certbot certificates`
- Verify ports 80 and 443 are open

### Application Not Loading
- Check browser console for errors
- Verify environment variables in `.env`
- Check Supabase connection
- Verify API endpoints are accessible

---

## Security Checklist

- [ ] SSL certificate installed and auto-renewing
- [ ] Firewall configured (UFW)
- [ ] Security headers added in Nginx
- [ ] Environment variables secured (not in Git)
- [ ] Regular backups scheduled
- [ ] Server updates automated
- [ ] SSH key authentication (disable password login)
- [ ] Fail2ban installed for brute-force protection
- [ ] Database backups configured
- [ ] Monitoring and alerts set up

---

## Performance Optimization

### A. Enable Brotli Compression (Optional)

```bash
sudo apt install -y nginx-module-brotli
```

Add to Nginx config:
```nginx
brotli on;
brotli_comp_level 6;
brotli_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

### B. CDN Setup (Optional)

Consider using Cloudflare for:
- DDoS protection
- Global CDN
- Additional caching
- Free SSL

---

## Support

For issues:
1. Check logs: `/var/log/nginx/error.log`
2. Review Supabase dashboard for API errors
3. Check browser console for frontend errors
4. Verify environment variables are set correctly

---

## Quick Reference

**Start/Stop Services:**
```bash
sudo systemctl start nginx
sudo systemctl stop nginx
sudo systemctl restart nginx
sudo systemctl reload nginx
```

**View Logs:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

**Update Application:**
```bash
cd /var/www/sponsrai
git pull
npm install
npm run build
sudo systemctl reload nginx
```

**Renew SSL:**
```bash
sudo certbot renew
```

---

## Next Steps After Deployment

1. **Test thoroughly** - All features, forms, authentication
2. **Set up monitoring** - Uptime, errors, performance
3. **Configure backups** - Database and files
4. **Update DNS TTL** - Lower TTL before making changes
5. **Document** - Keep deployment notes for team
6. **Monitor** - Watch logs for first 24-48 hours
7. **Announce** - Let users know the site is live!

---

**Deployment Date:** _________________
**Deployed By:** _________________
**Version:** _________________
