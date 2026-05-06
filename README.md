# 🎨 Mehndi & Nail Art Booking Platform

A full-stack web application for booking Mehndi (henna) and nail art services with real-time notifications, admin dashboard, and cloud-based file storage.

![Status](https://img.shields.io/badge/status-production--ready-green)
![Node](https://img.shields.io/badge/node-18+-blue)
![React](https://img.shields.io/badge/react-19-blue)
![License](https://img.shields.io/badge/license-ISC-blue)

## ✨ Features

### 👥 User Features
- Browse designs by category (bridal, traditional, modern, etc.)
- Book appointments with time slot selection
- Real-time appointment status updates
- Email notifications
- User dashboard and profile management
- Design detail views with high-quality images

### 👨‍💼 Admin Features
- Comprehensive admin dashboard with statistics
- Design management (Create, Read, Update, Delete)
- Appointment management and approval system
- Content Management System (CMS)
- User management
- Real-time notifications via Socket.io

### 🔐 Security Features
- JWT authentication with refresh tokens
- Role-based access control
- Rate limiting (general + auth-specific)
- Input validation and sanitization
- NoSQL injection prevention
- XSS protection
- Secure password hashing (bcrypt)
- CORS configuration
- Security headers (helmet.js)

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js 18+
- **Framework:** Express.js
- **Database:** MongoDB (Atlas recommended)
- **Authentication:** JWT (jsonwebtoken)
- **File Storage:** Cloudinary
- **Real-time:** Socket.io
- **Email:** Nodemailer
- **Security:** Helmet, express-rate-limit, mongo-sanitize, hpp

### Frontend
- **Framework:** React 19
- **State Management:** Redux Toolkit
- **Routing:** React Router DOM v7
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite 8
- **Real-time:** Socket.io Client
- **Notifications:** React Hot Toast
- **HTTP Client:** Axios

### DevOps
- **Containerization:** Docker & Docker Compose
- **Web Server:** Nginx (for frontend)
- **Process Management:** PM2 (optional)
- **CI/CD Ready:** GitHub Actions compatible

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- Docker and Docker Compose (for containerized deployment)
- MongoDB Atlas account
- Cloudinary account
- Email service (SendGrid/AWS SES)

### 1. Generate Production Secrets
```bash
npm run generate-secrets
```

### 2. Configure Environment Variables
Update the following files with your credentials:
- `Backend/.env.production`
- `Mehndi Web/.env.production`

See `ENV_SETUP_CHECKLIST.md` for detailed instructions.

### 3. Install Dependencies
```bash
npm run install:all
```

### 4. Validate Configuration
```bash
npm run validate
```

### 5. Deploy
```bash
# Using npm scripts
npm run deploy

# Or using deployment scripts
# Windows
deploy.bat

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

### 6. Seed Database
```bash
npm run seed:prod
```

## 📚 Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - 30-minute deployment guide
- **[PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)** - Comprehensive deployment guide
- **[ENV_SETUP_CHECKLIST.md](ENV_SETUP_CHECKLIST.md)** - Environment variables setup
- **[PRODUCTION_READY_SUMMARY.md](PRODUCTION_READY_SUMMARY.md)** - What's been implemented
- **[PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md)** - Original production checklist

## 🛠️ Development

### Run Backend (Development)
```bash
npm run dev:backend
# or
cd Backend
npm run dev
```

### Run Frontend (Development)
```bash
npm run dev:frontend
# or
cd "Mehndi Web"
npm run dev
```

### Build Frontend
```bash
npm run build:frontend
```

## 🐳 Docker Commands

```bash
# Deploy production stack
npm run deploy

# View logs
npm run logs

# Check status
npm run status

# Stop services
npm run deploy:down

# Rebuild and restart
docker-compose -f docker-compose.prod.yml up -d --build
```

## 📊 Project Structure

```
Bhumi/
├── Backend/                 # Express.js API
│   ├── config/             # Configuration files
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── utils/              # Helper functions
│   ├── Dockerfile          # Backend container
│   └── server.js           # Entry point
├── Mehndi Web/             # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # Redux store
│   │   ├── services/       # API services
│   │   └── App.jsx         # Main app
│   ├── Dockerfile          # Frontend container
│   └── nginx.conf          # Nginx config
├── docker-compose.prod.yml # Production stack
├── generate-secrets.js     # Secret generator
├── validate-deployment.js  # Pre-deployment validator
├── deploy.sh              # Linux/Mac deployment
└── deploy.bat             # Windows deployment
```

## 🔒 Security

This application implements multiple layers of security:

1. **Authentication:** JWT with refresh tokens
2. **Authorization:** Role-based access control
3. **Rate Limiting:** Prevents brute force attacks
4. **Input Validation:** Prevents injection attacks
5. **Security Headers:** Helmet.js configuration
6. **HTTPS Ready:** SSL/TLS support
7. **Secure Secrets:** Strong password generation

## 🌐 Deployment Options

### Option 1: Docker (Recommended)
Complete Docker setup provided for easy deployment on any VPS.

### Option 2: Cloud Platforms
- **Vercel** (Frontend) + **Railway** (Backend)
- **AWS** (S3 + CloudFront + EC2/ECS)
- **DigitalOcean App Platform**
- **Heroku** (Backend) + **Netlify** (Frontend)

### Option 3: Traditional VPS
Deploy on Ubuntu/CentOS with Nginx and PM2.

See `PRODUCTION_DEPLOYMENT.md` for detailed instructions.

## 📈 Performance

- **Frontend:** Code splitting, lazy loading, optimized builds
- **Backend:** Connection pooling, compression, efficient queries
- **Images:** Cloudinary CDN with automatic optimization
- **Caching:** Static asset caching, browser caching headers

## 🧪 Testing

```bash
# Backend tests (if implemented)
cd Backend
npm test

# Frontend tests (if implemented)
cd "Mehndi Web"
npm test

# Validate production configuration
npm run validate
```

## 📞 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Designs
- `GET /api/designs` - Get all designs
- `GET /api/designs/:id` - Get single design
- `POST /api/designs` - Create design (Admin)
- `PUT /api/designs/:id` - Update design (Admin)
- `DELETE /api/designs/:id` - Delete design (Admin)

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments/my` - Get user appointments
- `GET /api/appointments` - Get all appointments (Admin)
- `PUT /api/appointments/:id` - Update appointment (Admin)
- `DELETE /api/appointments/:id` - Cancel appointment

### Content
- `GET /api/content` - Get all content
- `GET /api/content/:section` - Get content by section
- `PUT /api/content/:section` - Update content (Admin)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

ISC License

## 👥 Default Credentials

**⚠️ IMPORTANT:** Change these immediately after first deployment!

- **Email:** admin@yourdomain.com
- **Password:** Use generated password from `production-secrets.txt`

## 🆘 Support

For issues and questions:
1. Check the documentation files
2. Review `QUICKSTART.md` troubleshooting section
3. Check Docker logs: `npm run logs`
4. Validate configuration: `npm run validate`

## 🎯 Roadmap

- [ ] Payment integration (Stripe/PayPal)
- [ ] SMS notifications
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Automated testing suite
- [ ] Performance monitoring

## 📊 Status

- ✅ Core features implemented
- ✅ Security hardened
- ✅ Production-ready configuration
- ✅ Docker containerization
- ✅ Comprehensive documentation
- ⏳ Awaiting deployment

---

**Made with ❤️ for the Mehndi & Nail Art community**