
# Security Guide for SponsrAI Production

## Pre-Deployment Security Checklist

### 1. Environment Variables
- [ ] All sensitive data in `.env` file (not in code)
- [ ] `.env` added to `.gitignore`
- [ ] Production Supabase keys configured
- [ ] API keys rotated for production
- [ ] No hardcoded credentials in codebase

### 2. SSL/TLS Configuration
- [ ] SSL certificate installed (Let's Encrypt)
- [ ] HTTPS enforced (HTTP redirects to HTTPS)
- [ ] HSTS header enabled
- [ ] TLS 1.2+ only
- [ ] Strong cipher suites configured

### 3. Server Hardening
- [ ] SSH key authentication enabled
- [ ] Password authentication disabled
- [ ] Root login disabled
- [ ] Firewall configured (UFW)
- [ ] Fail2ban installed
- [ ] Automatic security updates enabled

### 4. Application Security
- [ ] Content Security Policy headers
- [ ] X-Frame-Options set
- [ ] X-Content-Type-Options set
- [ ] XSS Protection enabled
- [ ] CORS properly configured
- [ ] Input validation on all forms
- [ ] SQL injection prevention (using Supabase)

### 5. Database Security
- [ ] Supabase Row Level Security (RLS) enabled
- [ ] Database backups configured
- [ ] Least privilege access
- [ ] Connection strings secured
- [ ] API keys restricted by domain

---

## Server Hardening Steps

### 1. SSH Security

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config
```

Set these values:
```
PermitRootLogin no
PasswordAuthentication no
PubkeyAuthentication yes
Port 2222  # Change from default 22
```

Restart SSH:
```bash
sudo systemctl restart sshd
```

### 2. Firewall Setup

```bash
# Install UFW
sudo apt install ufw

# Default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (use your custom port if changed)
sudo ufw allow 2222/tcp

# Allow HTTP and HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

### 3. Fail2ban Installation

```bash
# Install
sudo apt install fail2ban

# Create local config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local
sudo nano /etc/fail2ban/jail.local
```

Add/modify:
```ini
[sshd]
enabled = true
port = 2222
maxretry = 3
bantime = 3600

[nginx-http-auth]
enabled = true
```

Start service:
```bash
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

### 4. Automatic Security Updates

```bash
# Install unattended-upgrades
sudo apt install unattended-upgrades

# Configure
sudo dpkg-reconfigure -plow unattended-upgrades
```

---

## Supabase Security Configuration

### 1. Row Level Security (RLS)

Enable RLS on all tables:

```sql
-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read their own profile
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = user_id);

-- Repeat for all tables: brands, organizers, matches, etc.
```

### 2. API Key Restrictions

In Supabase Dashboard:
1. Go to Settings → API
2. Add domain restrictions:
   - `https://www.sponsrai.se`
   - `https://sponsrai.se`
3. Enable JWT verification
4. Set appropriate rate limits

### 3. Database Backups

In Supabase Dashboard:
1. Go to Database → Backups
2. Enable automatic daily backups
3. Configure retention period (7-30 days)
4. Test restore process

---

## Application Security Best Practices

### 1. Content Security Policy

Already configured in `nginx.conf`, but verify it matches your needs:

```nginx
add_header Content-Security-Policy "
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
    font-src 'self' https://fonts.gstatic.com;
    img-src 'self' data: https:;
    connect-src 'self' https://*.supabase.co wss://*.supabase.co;
" always;
```

### 2. Rate Limiting

Add to Nginx config:

```nginx
# Define rate limit zone
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=login_limit:10m rate=5r/m;

# Apply to API routes
location /api/ {
    limit_req zone=api_limit burst=20 nodelay;
    # ... rest of config
}

# Apply to login
location /login {
    limit_req zone=login_limit burst=5 nodelay;
    # ... rest of config
}
```

### 3. Security Headers Verification

Test your security headers:
```bash
curl -I https://www.sponsrai.se
```

Should include:
- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `X-XSS-Protection`
- `Content-Security-Policy`

---

## Monitoring and Alerts

### 1. Log Monitoring

```bash
# Install logwatch
sudo apt install logwatch

# Configure daily reports
sudo nano /etc/cron.daily/00logwatch
```

Add:
```bash
#!/bin/bash
/usr/sbin/logwatch --output mail --mailto your@email.com --detail high
```

### 2. Intrusion Detection

```bash
# Install AIDE
sudo apt install aide

# Initialize database
sudo aideinit

# Check for changes
sudo aide --check
```

### 3. Uptime Monitoring

Set up external monitoring:
- **UptimeRobot** (free): https://uptimerobot.com
- **Pingdom** (paid): https://www.pingdom.com
- **StatusCake** (free tier): https://www.statuscake.com

Configure alerts for:
- Site down
- SSL certificate expiry
- Response time > 3s

---

## Incident Response Plan

### 1. Security Breach Response

If you suspect a breach:

```bash
# 1. Immediately change all credentials
# 2. Review access logs
sudo tail -n 1000 /var/log/nginx/access.log | grep -i "POST\|DELETE\|PUT"

# 3. Check for unauthorized users
sudo lastlog
sudo last

# 4. Review Supabase auth logs
# Check Supabase Dashboard → Authentication → Logs

# 5. Scan for malware
sudo apt install clamav
sudo freshclam
sudo clamscan -r /var/www/sponsrai
```

### 2. DDoS Mitigation

If under attack:

```bash
# 1. Enable Cloudflare (free DDoS protection)
# 2. Implement stricter rate limits
# 3. Block attacking IPs

# Block IP temporarily
sudo ufw deny from 123.456.789.0

# View current connections
sudo netstat -ntu | awk '{print $5}' | cut -d: -f1 | sort | uniq -c | sort -n
```

---

## Regular Security Maintenance

### Daily
- [ ] Review access logs for anomalies
- [ ] Check fail2ban status
- [ ] Monitor uptime alerts

### Weekly
- [ ] Review Supabase logs
- [ ] Check SSL certificate expiry
- [ ] Review user activity

### Monthly
- [ ] Update all packages: `sudo apt update && sudo apt upgrade`
- [ ] Review and rotate API keys
- [ ] Test backup restoration
- [ ] Security audit with tools like:
  - `nmap` for port scanning
  - `nikto` for web vulnerabilities
  - `lynis` for system auditing

### Quarterly
- [ ] Full security audit
- [ ] Penetration testing
- [ ] Review and update security policies
- [ ] Update incident response plan

---

## Security Tools

### Recommended Tools

```bash
# Install security tools
sudo apt install -y \
    nmap \
    nikto \
    lynis \
    rkhunter \
    chkrootkit
```

### Run Security Audit

```bash
# System audit
sudo lynis audit system

# Rootkit check
sudo rkhunter --check

# Web vulnerability scan
nikto -h https://www.sponsrai.se
```

---

## Compliance Considerations

### GDPR Compliance
- [ ] Privacy policy published
- [ ] Cookie consent implemented
- [ ] Data processing documented
- [ ] User data export capability
- [ ] Right to deletion implemented
- [ ] Data breach notification process

### Data Protection
- [ ] User passwords hashed (handled by Supabase)
- [ ] Sensitive data encrypted at rest
- [ ] Secure data transmission (HTTPS)
- [ ] Regular data backups
- [ ] Data retention policy

---

## Emergency Contacts

**Server Provider:** [Your hosting provider]
**Domain Registrar:** [Your domain registrar]
**SSL Certificate:** Let's Encrypt
**Database:** Supabase Support

**Emergency Procedures:**
1. Contact server provider for infrastructure issues
2. Check Supabase status page for database issues
3. Review logs for application errors
4. Implement incident response plan

---

## Security Resources

- **OWASP Top 10:** https://owasp.org/www-project-top-ten/
- **Mozilla Observatory:** https://observatory.mozilla.org/
- **SSL Labs Test:** https://www.ssllabs.com/ssltest/
- **Security Headers:** https://securityheaders.com/
- **Supabase Security:** https://supabase.com/docs/guides/platform/security

---

## Post-Deployment Security Verification

After deployment, run these checks:

```bash
# 1. SSL Test
curl -I https://www.sponsrai.se | grep -i "strict-transport"

# 2. Security Headers
curl -I https://www.sponsrai.se | grep -i "x-frame\|x-content\|x-xss"

# 3. Port Scan
nmap -p 80,443,2222 149.248.202.188

# 4. SSL Grade
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=www.sponsrai.se

# 5. Security Headers Grade
# Visit: https://securityheaders.com/?q=www.sponsrai.se
```

Target scores:
- SSL Labs: A or A+
- Security Headers: A or A+
- Mozilla Observatory: B or higher

---

**Last Updated:** [Date]
**Reviewed By:** [Name]
**Next Review:** [Date + 3 months]
