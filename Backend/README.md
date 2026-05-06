# Mehndi & Nail Art Booking Platform - Backend

## Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update the following variables:
     - `MONGO_URI`: Your MongoDB connection string
     - `JWT_SECRET`: Strong secret key for JWT
     - `JWT_REFRESH_SECRET`: Strong secret key for refresh tokens
     - `CLOUDINARY_CLOUD_NAME`: Your Cloudinary cloud name
     - `CLOUDINARY_API_KEY`: Your Cloudinary API key
     - `CLOUDINARY_API_SECRET`: Your Cloudinary API secret

3. **Seed database (create admin user):**
```bash
node seed.js
```

4. **Start server:**
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Designs
- `GET /api/designs` - Get all designs (Query: ?category=mehndi)
- `GET /api/designs/:id` - Get single design
- `POST /api/designs` - Create design (Admin only, multipart/form-data)
- `PUT /api/designs/:id` - Update design (Admin only, multipart/form-data)
- `DELETE /api/designs/:id` - Delete design (Admin only)

### Appointments
- `POST /api/appointments` - Create appointment (Protected)
- `GET /api/appointments/my` - Get user appointments (Protected)
- `GET /api/appointments` - Get all appointments (Admin only, Query: ?status=pending)
- `PUT /api/appointments/:id` - Update appointment status (Admin only)
- `DELETE /api/appointments/:id` - Cancel appointment (Protected)

### Content (CMS)
- `GET /api/content` - Get all content
- `GET /api/content/:section` - Get content by section (hero, header, footer, about)
- `PUT /api/content/:section` - Update content (Admin only, multipart/form-data)

## Request Examples

### Signup
```json
POST /api/auth/signup
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```json
POST /api/auth/login
{
  "email": "admin@mehndi.com",
  "password": "Admin@123"
}
```

### Create Design (Admin)
```
POST /api/designs
Content-Type: multipart/form-data
Authorization: Bearer <token>

title: Beautiful Bridal Mehndi
description: Traditional bridal mehndi design
category: bridal
image: [file]
```

### Create Appointment
```json
POST /api/appointments
Authorization: Bearer <token>
{
  "designId": "65abc123...",
  "date": "2024-12-25",
  "time": "10:00 AM",
  "customDesignDescription": "Optional custom design details"
}
```

## Folder Structure
```
Backend/
├── config/          # Database & Cloudinary config
├── controllers/     # Request handlers
├── middleware/      # Auth & error middleware
├── models/          # Mongoose schemas
├── routes/          # API routes
├── utils/           # Helper functions
├── .env             # Environment variables
├── server.js        # Entry point
└── seed.js          # Database seeding
```

## Default Admin Credentials
- Email: admin@mehndi.com
- Password: Admin@123

**⚠️ Change these in production!**
