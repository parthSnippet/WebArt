# 🚀 PRODUCTION DEPLOYMENT CHECKLIST

## 🔐 SECURITY FIXES (CRITICAL)

### 1. Environment Variables
```bash
# Production .env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/mehndi-booking
JWT_SECRET=super_strong_random_secret_256_bits_minimum
JWT_REFRESH_SECRET=another_super_strong_secret_256_bits
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary (or AWS S3)
CLOUDINARY_CLOUD_NAME=your_production_cloud
CLOUDINARY_API_KEY=your_production_key
CLOUDINARY_API_SECRET=your_production_secret

# Email (Production SMTP)
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key

# Frontend URL
CLIENT_URL=https://yourdomain.com
```

### 2. Security Middleware
```javascript
// Add to server.js
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

app.use(helmet());
app.use(mongoSanitize());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);
```

## 🗄️ DATABASE MIGRATION

### 1. MongoDB Atlas Setup
- Create MongoDB Atlas cluster
- Set up database user with minimal permissions
- Configure IP whitelist
- Enable backup and monitoring

### 2. Connection Configuration
```javascript
// config/db.js - Production ready
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};
```

## 📁 FILE STORAGE MIGRATION

### Option 1: Cloudinary (Recommended)
```javascript
// Fix upload.js for production
export const uploadToCloudinary = async (filePath, folder) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `mehndi-booking/${folder}`,
      resource_type: 'auto',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto:good' }
      ]
    });
    return result;
  } catch (error) {
    throw new Error('File upload failed');
  }
};
```

### Option 2: AWS S3
```javascript
// Alternative: AWS S3 setup
import AWS from 'aws-sdk';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});
```

## 🌐 FRONTEND PRODUCTION CONFIG

### 1. Environment Variables
```javascript
// .env.production
VITE_API_URL=https://api.yourdomain.com
VITE_SOCKET_URL=https://api.yourdomain.com
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_key
```

### 2. API Configuration
```javascript
// services/api.js - Environment aware
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  timeout: 10000
});
```

### 3. Build Optimization
```javascript
// vite.config.js - Production optimized
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          redux: ['@reduxjs/toolkit', 'react-redux']
        }
      }
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
```

## 🐳 DOCKER CONFIGURATION

### Backend Dockerfile
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Frontend Dockerfile
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
    env_file:
      - .env.production
  
  frontend:
    build: ./frontend
    ports:
      - "80:80"
    depends_on:
      - backend
```

## 🚀 DEPLOYMENT OPTIONS

### 1. Vercel (Frontend) + Railway (Backend)
- Frontend: Deploy to Vercel
- Backend: Deploy to Railway/Render
- Database: MongoDB Atlas
- Files: Cloudinary

### 2. AWS (Full Stack)
- Frontend: S3 + CloudFront
- Backend: EC2 or ECS
- Database: DocumentDB or Atlas
- Files: S3

### 3. DigitalOcean (Cost Effective)
- App Platform for both frontend/backend
- MongoDB Atlas
- Cloudinary for files

## ✅ PRE-DEPLOYMENT CHECKLIST

### Security
- [ ] Strong JWT secrets (256-bit minimum)
- [ ] Environment variables secured
- [ ] CORS configured for production domain
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] HTTPS enforced
- [ ] Security headers (helmet.js)

### Database
- [ ] MongoDB Atlas cluster created
- [ ] Connection string updated
- [ ] Database user with minimal permissions
- [ ] Backup strategy configured
- [ ] Indexes optimized

### File Storage
- [ ] Cloudinary/S3 configured
- [ ] File upload limits set
- [ ] Image optimization enabled
- [ ] CDN configured

### Performance
- [ ] Frontend build optimized
- [ ] Code splitting implemented
- [ ] Images compressed
- [ ] Caching headers set
- [ ] Gzip compression enabled

### Monitoring
- [ ] Error logging (Sentry)
- [ ] Performance monitoring
- [ ] Uptime monitoring
- [ ] Database monitoring

## 🚨 IMMEDIATE ACTIONS REQUIRED

1. **STOP** - Do not deploy current version
2. **Secure** - Generate strong secrets and move to secure env vars
3. **Migrate** - Set up MongoDB Atlas
4. **Configure** - Set up Cloudinary for file storage
5. **Test** - Full testing in staging environment
6. **Deploy** - Only after all security issues are fixed

## 📊 ESTIMATED TIMELINE
- Security fixes: 2-3 days
- Database migration: 1 day
- File storage setup: 1 day
- Production configuration: 2 days
- Testing and deployment: 2-3 days

**Total: 8-10 days for production-ready deployment**