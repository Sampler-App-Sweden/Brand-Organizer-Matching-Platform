
# SponsrAI Troubleshooting Guide

## 🔒 SSL Certificate Error (Safari Privacy Warning)

### Problem
Safari shows: "Den här anslutningen är inte privat" (This connection is not private)
- Invalid certificate for sponsrai.se
- Connection cannot be verified

### Root Causes

1. **SSL Certificate Not Installed**
   - Certbot hasn't been run yet
   - Certificate installation failed

2. **DNS Not Propagated**
   - Domain not pointing to server yet
   - Takes 24-48 hours after DNS configuration

3. **Server Not Configured**
   - Nginx not running
   - Wrong server configuration

---

## ✅ Solution Steps

### Step 1: Verify DNS Propagation

```bash
# Check if domain resolves to your server
dig www.sponsrai.se

# Should show:
# www.sponsrai.se.  3600  IN  A  149.248.202.188
```

**If DNS doesn't resolve:**
- Wait 24-48 hours after configuring DNS
- Check your domain registrar settings
- Verify A records are correct

### Step 2: Check Server Status

```bash
# SSH into server
ssh root@149.248.202.188

# Check if Nginx is running
sudo systemctl status nginx

# Check if port 80 and 443 are open
sudo netstat -tlnp | grep -E ':80|:443'
```

### Step 3: Install SSL Certificate

**Only run this AFTER DNS has propagated:**

```bash
# SSH into server
ssh root@149.248.202.188

# Install Certbot if not already installed
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate
sudo certbot --nginx -d sponsrai.se -d www.sponsrai.se

# Follow prompts:
# 1. Enter your email
# 2. Agree to terms (Y)
# 3. Redirect HTTP to HTTPS? → Yes (2)
```

### Step 4: Verify SSL Installation

```bash
# Check certificate
sudo certbot certificates

# Should show:
# Certificate Name: sponsrai.se
# Domains: sponsrai.se www.sponsrai.se
# Expiry Date: [future date]
```

### Step 5: Test in Browser

1. Clear browser cache
2. Visit: `https://www.sponsrai.se`
3. Should show green lock icon
4. No privacy warnings

---

## 🚨 Quick Fix: Bypass Warning (Temporary)

**For Testing Only - Not Recommended for Production**

In Safari:
1. Click "Show Details"
2. Click "visit this website"
3. Enter your Mac password
4. Click "Visit Website"

**Important:** This is only for testing. Install proper SSL certificate for production.

---

## 🔍 Detailed Diagnostics

### Check DNS Resolution

```bash
# From your local machine
nslookup www.sponsrai.se
dig www.sponsrai.se +short

# Should return: 149.248.202.188
```

### Check Server Accessibility

```bash
# Test if server responds on port 80
curl -I http://149.248.202.188

# Test if server responds on port 443
curl -I https://149.248.202.188
```

### Check Nginx Configuration

```bash
# SSH into server
ssh root@149.248.202.188

# Test Nginx config
sudo nginx -t

# View error logs
sudo tail -50 /var/log/nginx/error.log

# View access logs
sudo tail -50 /var/log/nginx/access.log
```

### Check Firewall

```bash
# Check if ports are open
sudo ufw status

# Should show:
# 80/tcp    ALLOW
# 443/tcp   ALLOW
```

---

## 📋 Common Issues & Solutions

### Issue 1: DNS Not Propagated

**Symptoms:**
- Domain doesn't resolve
- `dig` returns no results
- Browser shows "Server not found"

**Solution:**
- Wait 24-48 hours after DNS configuration
- Check DNS settings at registrar
- Use `dig` to monitor propagation

### Issue 2: Certbot Fails

**Symptoms:**
- Certbot returns error
- "Failed authorization procedure"
- "Connection refused"

**Solution:**
```bash
# Ensure Nginx is running
sudo systemctl start nginx

# Ensure port 80 is open
sudo ufw allow 80/tcp

# Try again
sudo certbot --nginx -d sponsrai.se -d www.sponsrai.se
```

### Issue 3: Certificate Expired

**Symptoms:**
- Was working, now shows warning
- Certificate date in past

**Solution:**
```bash
# Renew certificate
sudo certbot renew

# Restart Nginx
sudo systemctl reload nginx
```

### Issue 4: Mixed Content Warnings

**Symptoms:**
- Page loads but some content blocked
- Console shows "Mixed Content" errors

**Solution:**
- Ensure all resources use HTTPS
- Check external scripts/images
- Update API endpoints to HTTPS

---

## 🛠️ Step-by-Step First-Time Setup

### Before You Start
- [ ] DNS configured and propagated (24-48 hours)
- [ ] Server accessible via SSH
- [ ] Domain resolves to 149.248.202.188

### Setup Process

**1. Connect to Server**
```bash
ssh root@149.248.202.188
```

**2. Install Dependencies**
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

**3. Deploy Application**
```bash
# Create directory
sudo mkdir -p /var/www/sponsrai
cd /var/www/sponsrai

# Upload your build files here
# (via Git, SCP, or FTP)
```

**4. Configure Nginx**
```bash
# Copy nginx.conf to sites-available
sudo nano /etc/nginx/sites-available/sponsrai.se
# Paste content from nginx.conf file

# Enable site
sudo ln -s /etc/nginx/sites-available/sponsrai.se /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

**5. Get SSL Certificate**
```bash
sudo certbot --nginx -d sponsrai.se -d www.sponsrai.se
```

**6. Configure Firewall**
```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

**7. Test**
```bash
# Test HTTPS
curl -I https://www.sponsrai.se

# Should return: HTTP/2 200
```

---

## 🔄 If You Need to Start Over

### Reset SSL Certificate

```bash
# Remove existing certificates
sudo certbot delete --cert-name sponsrai.se

# Get new certificate
sudo certbot --nginx -d sponsrai.se -d www.sponsrai.se
```

### Reset Nginx Configuration

```bash
# Remove site
sudo rm /etc/nginx/sites-enabled/sponsrai.se
sudo rm /etc/nginx/sites-available/sponsrai.se

# Reload Nginx
sudo systemctl reload nginx

# Start fresh with new config
```

---

## 📞 Getting Help

### Check Logs

**Nginx Error Log:**
```bash
sudo tail -100 /var/log/nginx/error.log
```

**Nginx Access Log:**
```bash
sudo tail -100 /var/log/nginx/access.log
```

**Certbot Log:**
```bash
sudo tail -100 /var/log/letsencrypt/letsencrypt.log
```

### Test SSL Certificate

**Online Tools:**
- SSL Labs: https://www.ssllabs.com/ssltest/analyze.html?d=www.sponsrai.se
- SSL Checker: https://www.sslshopper.com/ssl-checker.html

### Verify Server Configuration

```bash
# Check Nginx version
nginx -v

# Check Certbot version
certbot --version

# Check system status
systemctl status nginx
systemctl status certbot.timer
```

---

## ⚡ Quick Reference

### Most Common Solution

**If you just deployed and see SSL warning:**

1. **Wait for DNS** (24-48 hours after configuration)
2. **Install SSL:**
   ```bash
   ssh root@149.248.202.188
   sudo certbot --nginx -d sponsrai.se -d www.sponsrai.se
   ```
3. **Test:** Visit https://www.sponsrai.se

### Emergency Commands

```bash
# Restart Nginx
sudo systemctl restart nginx

# Renew SSL
sudo certbot renew --force-renewal

# Check what's listening on ports
sudo netstat -tlnp | grep -E ':80|:443'

# View real-time logs
sudo tail -f /var/log/nginx/error.log
```

---

## 📊 Verification Checklist

Before contacting support, verify:

- [ ] DNS resolves to 149.248.202.188
- [ ] Server is accessible via SSH
- [ ] Nginx is running (`systemctl status nginx`)
- [ ] Ports 80 and 443 are open
- [ ] Application files are in /var/www/sponsrai
- [ ] SSL certificate is installed (`certbot certificates`)
- [ ] Firewall allows HTTP/HTTPS traffic
- [ ] No errors in Nginx logs

---

## 🎯 Expected Timeline

**From Zero to Production:**

- Day 0: Configure DNS → 5 minutes
- Day 1-2: Wait for DNS propagation → 24-48 hours
- Day 2: Deploy application → 30 minutes
- Day 2: Install SSL → 5 minutes
- Day 2: Test and verify → 15 minutes

**Total Active Time:** ~1 hour
**Total Elapsed Time:** 24-48 hours (mostly waiting for DNS)

---

**Last Updated:** 2024
**For:** SponsrAI (www.sponsrai.se)
