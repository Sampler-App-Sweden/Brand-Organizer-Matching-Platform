
#!/bin/bash

# SponsrAI SSL Certificate Installation Script
# This script installs SSL certificate for www.sponsrai.se

echo "=========================================="
echo "SponsrAI SSL Certificate Installation"
echo "=========================================="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo "Please run as root (use: sudo bash install-ssl.sh)"
    exit 1
fi

echo "Step 1: Checking DNS propagation..."
echo "Checking if www.sponsrai.se points to this server..."

# Get server's public IP
SERVER_IP=$(curl -s ifconfig.me)
echo "This server's IP: $SERVER_IP"

# Check DNS resolution
DNS_IP=$(dig +short www.sponsrai.se | tail -n1)
echo "DNS resolves to: $DNS_IP"

if [ "$SERVER_IP" != "$DNS_IP" ]; then
    echo ""
    echo "⚠️  WARNING: DNS not pointing to this server yet!"
    echo "Expected: $SERVER_IP"
    echo "Got: $DNS_IP"
    echo ""
    echo "Please wait 24-48 hours for DNS propagation, then run this script again."
    exit 1
fi

echo "✓ DNS is correctly configured!"
echo ""

echo "Step 2: Installing Certbot..."
apt update
apt install -y certbot python3-certbot-nginx

echo ""
echo "Step 3: Checking Nginx configuration..."
if ! systemctl is-active --quiet nginx; then
    echo "⚠️  Nginx is not running. Starting Nginx..."
    systemctl start nginx
fi

echo "✓ Nginx is running"
echo ""

echo "Step 4: Getting SSL certificate from Let's Encrypt..."
echo "This will:"
echo "  - Get a free SSL certificate for sponsrai.se and www.sponsrai.se"
echo "  - Automatically configure Nginx"
echo "  - Set up auto-renewal"
echo ""

# Run Certbot
certbot --nginx -d sponsrai.se -d www.sponsrai.se --non-interactive --agree-tos --redirect --email admin@sponsrai.se

if [ $? -eq 0 ]; then
    echo ""
    echo "=========================================="
    echo "✓ SSL Certificate Successfully Installed!"
    echo "=========================================="
    echo ""
    echo "Your website is now secure with HTTPS!"
    echo ""
    echo "Visit: https://www.sponsrai.se"
    echo ""
    echo "Certificate details:"
    certbot certificates
    echo ""
    echo "Auto-renewal is configured. Certificate will renew automatically."
    echo ""
else
    echo ""
    echo "=========================================="
    echo "⚠️  SSL Installation Failed"
    echo "=========================================="
    echo ""
    echo "Common issues:"
    echo "1. DNS not fully propagated - wait 24-48 hours"
    echo "2. Port 80 not open - check firewall"
    echo "3. Nginx not configured correctly"
    echo ""
    echo "Check logs:"
    echo "  sudo tail -50 /var/log/letsencrypt/letsencrypt.log"
    echo ""
    exit 1
fi
