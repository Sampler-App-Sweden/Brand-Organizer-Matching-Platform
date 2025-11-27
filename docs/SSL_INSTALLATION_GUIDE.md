
# SSL Certificate Installation Guide

## Quick Install (Automated)

I've created a script that will automatically install your SSL certificate.

### Step 1: Upload Script to Server

```bash
# From your local machine, upload the script
scp install-ssl.sh root@149.248.202.188:/root/
```

### Step 2: Run the Script

```bash
# SSH into your server
ssh root@149.248.202.188

# Make script executable
chmod +x install-ssl.sh

# Run the script
sudo bash install-ssl.sh
```

The script will:
- ✓ Check if DNS is propagated
- ✓ Install Certbot
- ✓ Get SSL certificate from Let's Encrypt
- ✓ Configure Nginx automatically
- ✓ Set up auto-renewal

---

## Manual Installation (If You Prefer)

### Step 1: SSH into Server

```bash
ssh root@149.248.202.188
```

### Step 2: Install Certbot

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx -y
```

### Step 3: Get SSL Certificate

```bash
sudo certbot --nginx -d sponsrai.se -d www.sponsrai.se
```

Follow the prompts:
1. Enter email: `your@email.com`
2. Agree to terms: `Y`
3. Share email: `N` (optional)
4. Redirect HTTP to HTTPS: `2` (Yes)

### Step 4: Verify Installation

```bash
# Check certificate
sudo certbot certificates

# Test website
curl -I https://www.sponsrai.se
```

---

## What the SSL Certificate Does

- 🔒 **Encrypts traffic** between users and your server
- ✓ **Shows green lock** in browser
- ✓ **Removes privacy warnings**
- ✓ **Improves SEO** (Google ranks HTTPS sites higher)
- ✓ **Builds trust** with users

---

## Troubleshooting

### Error: "DNS doesn't resolve"

**Solution:** Wait 24-48 hours for DNS propagation

Check DNS status:
```bash
dig www.sponsrai.se
```

### Error: "Port 80 not accessible"

**Solution:** Open firewall port
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### Error: "Nginx not running"

**Solution:** Start Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Error: "Certificate already exists"

**Solution:** Renew or delete existing certificate
```bash
# Renew
sudo certbot renew

# Or delete and start fresh
sudo certbot delete --cert-name sponsrai.se
```

---

## Certificate Auto-Renewal

Certbot automatically sets up renewal. Your certificate will renew every 90 days.

### Test Auto-Renewal

```bash
sudo certbot renew --dry-run
```

### Manual Renewal

```bash
sudo certbot renew
```

---

## After Installation

Once SSL is installed:

1. ✓ Visit `https://www.sponsrai.se` - should show green lock
2. ✓ Test all pages and features
3. ✓ Check SSL grade: https://www.ssllabs.com/ssltest/
4. ✓ Update any hardcoded HTTP links to HTTPS

---

## Important Notes

- **Free:** Let's Encrypt certificates are completely free
- **Valid:** 90 days (auto-renews every 60 days)
- **Trusted:** Recognized by all major browsers
- **Automatic:** Renewal happens automatically

---

## Need Help?

If you encounter issues:

1. Check logs:
   ```bash
   sudo tail -50 /var/log/letsencrypt/letsencrypt.log
   ```

2. Check Nginx logs:
   ```bash
   sudo tail -50 /var/log/nginx/error.log
   ```

3. Verify DNS:
   ```bash
   dig www.sponsrai.se
   nslookup www.sponsrai.se
   ```

4. Check firewall:
   ```bash
   sudo ufw status
   ```

---

## Quick Reference

```bash
# Install SSL
sudo certbot --nginx -d sponsrai.se -d www.sponsrai.se

# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run

# Delete certificate
sudo certbot delete --cert-name sponsrai.se
```

---

**Your SSL certificate will be installed in under 5 minutes!**
