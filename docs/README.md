
# SponsrAI - Connect Brands with Event Organizers

![SponsrAI](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-production-brightgreen.svg)

SponsrAI is an intelligent platform that connects brands with event organizers, facilitating sponsorship opportunities and product sampling at events.

**Live Site:** [www.sponsrai.se](https://www.sponsrai.se)

---

## 🚀 Quick Start

### For Deployment

1. **Read the Quick Start Guide:** [`QUICK_START.md`](QUICK_START.md)
2. **Configure DNS:** Point your domain to the server
3. **Follow deployment steps:** Complete setup in ~1.5 hours
4. **Launch!** Your site will be live at www.sponsrai.se

### For Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Start development server
npm start

# Build for production
npm run build
```

---

## 📚 Documentation

### Deployment & Operations
- **[Quick Start Guide](QUICK_START.md)** - Fast track deployment (1.5 hours)
- **[Full Deployment Guide](DEPLOYMENT.md)** - Detailed step-by-step instructions
- **[Launch Checklist](LAUNCH_CHECKLIST.md)** - Pre-launch verification
- **[Security Guide](SECURITY.md)** - Security hardening and best practices

### Configuration Files
- **[nginx.conf](nginx.conf)** - Production Nginx configuration
- **[.env.production](.env.production)** - Production environment template
- **[package.json](package.json)** - Dependencies and scripts

---

## 🏗️ Architecture

### Frontend
- **Framework:** React 18 with TypeScript
- **Routing:** React Router v6
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Build Tool:** Create React App

### Backend
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Storage:** Supabase Storage
- **Real-time:** Supabase Realtime

### Infrastructure
- **Web Server:** Nginx
- **SSL:** Let's Encrypt (Certbot)
- **Domain:** www.sponsrai.se
- **Server:** 149.248.202.188

---

## 🎯 Features

### For Brands
- Create brand profiles with product information
- AI-powered matching with relevant events
- Direct messaging with event organizers
- Dashboard to manage sponsorships
- Track sampling opportunities

### For Event Organizers
- Create event profiles with audience details
- Get matched with relevant brands
- Showcase sponsorship opportunities
- Manage brand partnerships
- Coordinate product sampling

### For Community Members
- Join as a test panel participant
- Provide product feedback
- Participate in sampling events
- Connect with brands and organizers

### Platform Features
- AI-powered matching algorithm
- Real-time messaging system
- Advanced search and filtering
- Responsive design (mobile-first)
- Secure authentication
- Email notifications
- Analytics and tracking

---

## 🛠️ Tech Stack

### Core Technologies
```json
{
  "react": "^18.2.0",
  "react-router-dom": "^6.20.0",
  "typescript": "^5.3.0",
  "tailwindcss": "^3.3.0",
  "@supabase/supabase-js": "^2.38.0",
  "lucide-react": "^0.294.0"
}
```

### Development Tools
- **TypeScript** - Type safety
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control

### Production Tools
- **Nginx** - Web server
- **Certbot** - SSL certificates
- **UFW** - Firewall
- **Fail2ban** - Security

---

## 📁 Project Structure

```
sponsrai/
├── components/           # React components
│   ├── ai-assistant/    # AI onboarding components
│   ├── community/       # Community features
│   ├── directory/       # Directory listings
│   ├── sponsorship/     # Sponsorship management
│   └── ...              # Shared components
├── context/             # React context providers
├── pages/               # Page components
│   ├── admin/          # Admin dashboard
│   ├── dashboard/      # User dashboards
│   └── ...             # Public pages
├── services/            # Business logic & API calls
├── styles/              # CSS and styling
├── types/               # TypeScript type definitions
├── public/              # Static assets
└── ...                  # Config files
```

---

## 🔒 Security

### Implemented Security Measures
- ✅ HTTPS with SSL/TLS 1.2+
- ✅ Security headers (HSTS, CSP, X-Frame-Options)
- ✅ Firewall (UFW) configured
- ✅ Fail2ban for brute-force protection
- ✅ Row Level Security (RLS) in Supabase
- ✅ Environment variables for secrets
- ✅ Input validation and sanitization
- ✅ Rate limiting on API endpoints

### Security Best Practices
- Regular security updates
- Automated backups
- Log monitoring
- Intrusion detection
- SSL certificate auto-renewal

**See [SECURITY.md](SECURITY.md) for detailed security documentation.**

---

## 🚀 Deployment

### Production Deployment

```bash
# 1. Clone repository
git clone your_repository_url
cd sponsrai

# 2. Install dependencies
npm install --production

# 3. Configure environment
cp .env.production .env
nano .env  # Add your credentials

# 4. Build for production
npm run build

# 5. Deploy to server
scp -r build/* user@149.248.202.188:/var/www/sponsrai/
```

**For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)**

### Continuous Deployment

```bash
# Update application
cd /var/www/sponsrai
git pull origin main
npm install
npm run build
sudo systemctl reload nginx
```

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Manual Testing Checklist
- [ ] Registration flow (brand, organizer, community)
- [ ] Login/logout functionality
- [ ] Dashboard access and features
- [ ] Matching algorithm
- [ ] Messaging system
- [ ] Search and filtering
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

---

## 📊 Monitoring

### Uptime Monitoring
- **Service:** UptimeRobot
- **URL:** www.sponsrai.se
- **Check Interval:** 5 minutes
- **Alerts:** Email notifications

### Error Tracking
- **Service:** Sentry (optional)
- **Integration:** React Error Boundary
- **Alerts:** Real-time error notifications

### Analytics
- **Service:** Google Analytics
- **Tracking:** Page views, user behavior, conversions
- **Dashboard:** Real-time monitoring

### Server Monitoring
```bash
# Check server status
sudo systemctl status nginx

# Monitor logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Check resources
htop
df -h
free -h
```

---

## 🔧 Maintenance

### Regular Tasks

**Daily:**
- Monitor error logs
- Check uptime status
- Review user activity

**Weekly:**
- Review analytics
- Check SSL certificate status
- Update documentation

**Monthly:**
- Update dependencies: `npm update`
- Security updates: `sudo apt update && sudo apt upgrade`
- Backup verification
- Performance optimization

**Quarterly:**
- Full security audit
- Performance review
- Feature planning
- User feedback analysis

---

## 🐛 Troubleshooting

### Common Issues

**Site Not Loading**
```bash
# Check Nginx status
sudo systemctl status nginx

# Check error logs
sudo tail -100 /var/log/nginx/error.log

# Verify DNS
dig www.sponsrai.se
```

**SSL Certificate Issues**
```bash
# Check certificate
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Test renewal
sudo certbot renew --dry-run
```

**Application Errors**
```bash
# Check build directory
ls -la /var/www/sponsrai/build

# Verify environment variables
cat /var/www/sponsrai/.env

# Check Supabase connection
# Review Supabase dashboard for errors
```

---

## 📝 Environment Variables

### Required Variables

```bash
# Supabase
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
```

### Optional Variables

```bash
# Analytics
REACT_APP_GA_TRACKING_ID=your_ga_id
REACT_APP_MIXPANEL_TOKEN=your_mixpanel_token

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_ERROR_TRACKING=true
REACT_APP_ENABLE_CHAT_SUPPORT=true
```

---

## 🤝 Contributing

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Add your feature"`
6. Push: `git push origin feature/your-feature`
7. Create a Pull Request

### Code Style

- Follow TypeScript best practices
- Use functional components with hooks
- Write meaningful commit messages
- Add comments for complex logic
- Keep components small and focused

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Team

- **Project Lead:** [Your Name]
- **Technical Lead:** [Name]
- **Design Lead:** [Name]
- **Product Manager:** [Name]

---

## 📞 Support

### Technical Support
- **Email:** support@sponsrai.se
- **Documentation:** This repository
- **Status Page:** [status.sponsrai.se]

### Emergency Contact
- **Server Issues:** [Server provider support]
- **Database Issues:** support@supabase.io
- **Domain Issues:** [Domain registrar support]

---

## 🗺️ Roadmap

### Q1 2024
- [x] Platform launch
- [ ] Mobile app (iOS/Android)
- [ ] Advanced analytics dashboard
- [ ] API for third-party integrations

### Q2 2024
- [ ] AI-powered recommendation engine
- [ ] Video conferencing integration
- [ ] Contract management system
- [ ] Payment processing

### Q3 2024
- [ ] Multi-language support
- [ ] Advanced reporting tools
- [ ] White-label solution
- [ ] Enterprise features

---

## 📈 Metrics

### Performance Targets
- **Uptime:** > 99.9%
- **Page Load Time:** < 3 seconds
- **Error Rate:** < 0.1%
- **SSL Grade:** A+
- **Security Headers:** A+

### Business Metrics
- User registrations
- Active users (DAU/MAU)
- Matches created
- Messages sent
- Conversion rate

---

## 🎉 Acknowledgments

- **Supabase** - Backend infrastructure
- **Tailwind CSS** - Styling framework
- **Lucide** - Icon library
- **Let's Encrypt** - Free SSL certificates
- **React Community** - Amazing ecosystem

---

## 📚 Additional Resources

- **Supabase Docs:** https://supabase.com/docs
- **React Docs:** https://react.dev
- **Tailwind Docs:** https://tailwindcss.com/docs
- **Nginx Docs:** https://nginx.org/en/docs/

---

**Built with ❤️ by the SponsrAI Team**

**Website:** [www.sponsrai.se](https://www.sponsrai.se)  
**Version:** 1.0.0  
**Last Updated:** 2024
