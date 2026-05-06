# 🚀 Quick Start - Production Deployment

## Prerequisites
- Node.js 18+ installed
- Docker and Docker Compose installed
- MongoDB Atlas account
- Cloudinary account
- Email service (SendGrid/AWS SES)
- Domain name with SSL certificate

## 5-Step Production Deployment

### Step 1: Generate Secrets (5 minutes)
```bash
node generate-secrets.js
```
This creates `production-secrets.txt` with secure credentials.

### Step 2: Configure Environment (10 minutes)

**Backend (`Backend/.env.production`):**
```env
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/mehndi-booking-prod
JWT_SECRET=<from production-secrets.txt>
JWT_REFRESH_SECRET=<from production-secrets.txt>
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=<from production-secrets.txt>
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_key
CLIENT_URL=https://yourdomain.com
```

**Frontend (`Mehndi Web/.env.production`):**
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_SOCKET_URL=https://api.yourdomain.com
```

### Step 3: Install Dependencies (5 minutes)
```bash
# Backend
cd Backend
npm install hpp

# Frontend
cd "../Mehndi Web"
npm install
```

### Step 4: Deploy with Docker (10 minutes)
```bash
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

### Step 5: Seed Database (2 minutes)
```bash
cd Backend
npm run seed:prod
```

## ✅ Verify Deployment

1. **Backend Health Check:**
   ```bash
   curl http://localhost:5000/api/health
   ```

2. **Frontend Access:**
   Open browser: `http://localhost:80`

3. **Admin Login:**
   - Email: admin@yourdomain.com
   - Password: <from production-secrets.txt>

## 🌐 DNS Configuration

Point your domain to your server:
```
A Record: yourdomain.com → Your Server IP
A Record: api.yourdomain.com → Your Server IP
```

## 🔒 SSL Setup (Let's Encrypt)

```bash
sudo apt-get install certbot
sudo certbot --nginx -d yourdomain.com -d api.yourdomain.com
```

## 📊 Monitor Services

```bash
# View logs
docker-compose -f docker-compose.prod.yml logs -f

# Check status
docker-compose -f docker-compose.prod.yml ps

# Restart services
docker-compose -f docker-compose.prod.yml restart
```

## 🆘 Troubleshooting

**Issue: CORS errors**
- Check `CLIENT_URL` in Backend/.env.production matches your domain

**Issue: Database connection failed**
- Verify MongoDB Atlas connection string
- Check IP whitelist (add 0.0.0.0/0 for cloud deployments)

**Issue: Images not uploading**
- Verify Cloudinary credentials
- Check API key permissions

**Issue: Emails not sending**
- Verify email service credentials
- Check sender domain verification

## 📞 Support

For detailed documentation, see `PRODUCTION_DEPLOYMENT.md`

---

**Total Setup Time: ~30 minutes**