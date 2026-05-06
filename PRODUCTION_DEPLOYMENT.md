# 🚀 Production Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ Required Services Setup

1. **MongoDB Atlas**
   - Create a MongoDB Atlas cluster
   - Set up database user with read/write permissions
   - Configure IP whitelist (0.0.0.0/0 for cloud deployment)
   - Get connection string

2. **Cloudinary Account**
   - Sign up for Cloudinary production account
   - Get Cloud Name, API Key, and API Secret
   - Configure upload presets

3. **Email Service**
   - Set up SendGrid, AWS SES, or similar service
   - Get SMTP credentials
   - Configure sender domain

4. **Domain & SSL**
   - Purchase domain name
   - Set up DNS records
   - Obtain SSL certificate

## 🔐 Security Configuration

### Step 1: Generate Production Secrets

```bash
# Generate secure secrets
node generate-secrets.js
```

This will create a `production-secrets.txt` file with:
- Strong JWT secrets (256-bit)
- Secure admin password
- MongoDB password
- Session secret

### Step 2: Update Environment Files

Update `Backend/.env.production` with generated secrets and your service credentials.

Update `Mehndi Web/.env.production` with your production domain.

## 🐳 Docker Deployment

### Quick Deploy

```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

### Manual Docker Commands

```bash
# Build and run
docker-compose -f docker-compose.prod.yml up -d --build

# Check logs
docker-compose -f docker-compose.prod.yml logs -f

# Stop services
docker-compose -f docker-compose.prod.yml down
```

## 🔧 Post-Deployment

### 1. Database Seeding
```bash
cd Backend
npm run seed:prod
```

### 2. Health Checks
```bash
curl http://localhost:5000/api/health
curl http://localhost:80/health
```

## 🚨 Security Checklist

- [ ] Strong JWT secrets generated
- [ ] Default admin credentials changed
- [ ] HTTPS enabled
- [ ] CORS configured for production domain
- [ ] Rate limiting enabled
- [ ] Security headers configured

---

**🎉 Your Mehndi Booking Platform is now production-ready!**