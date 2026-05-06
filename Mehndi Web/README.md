# Mehndi & Nail Art Booking Platform - Frontend

## Features Implemented

### User Features
- ✅ User Authentication (Signup/Login with JWT)
- ✅ Browse Designs by Category
- ✅ View Design Details
- ✅ Book Appointments with Time Slot Selection
- ✅ Track Appointment Status
- ✅ Real-time Notifications (Socket.io)
- ✅ Email Notifications
- ✅ Cancel Appointments

### Admin Features
- ✅ Admin Dashboard with Statistics
- ✅ Manage Designs (Create/Edit/Delete)
- ✅ Upload Images to Cloudinary
- ✅ Manage Appointments
- ✅ Approve/Cancel Appointments
- ✅ Add Remarks to Appointments
- ✅ Real-time Updates

### Technical Features
- ✅ Redux Toolkit for State Management
- ✅ Socket.io for Real-time Updates
- ✅ React Hot Toast for Notifications
- ✅ Protected Routes
- ✅ Role-based Access Control
- ✅ Responsive Design
- ✅ JWT Token Refresh
- ✅ API Error Handling

## Installation

1. **Install dependencies:**
```bash
cd "Mehndi Web"
npm install
```

2. **Configure environment:**
   - Update `.env` file with your backend API URL
   - Update Stripe public key if using payment integration

3. **Start development server:**
```bash
npm run dev
```

The app will run on `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin-specific components
│   ├── user/           # User-specific components
│   └── common/         # Shared components
├── pages/
│   ├── admin/          # Admin pages
│   └── user/           # User pages
├── redux/              # Redux store and slices
├── services/           # API services
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── App.jsx             # Main app component
```

## Available Routes

### Public Routes
- `/` - Home page
- `/login` - User login
- `/signup` - User registration
- `/designs` - Browse designs
- `/designs/:id` - Design details

### Protected User Routes
- `/appointments` - My appointments

### Protected Admin Routes
- `/admin/dashboard` - Admin dashboard
- `/admin/designs` - Manage designs
- `/admin/designs/new` - Add new design
- `/admin/designs/edit/:id` - Edit design
- `/admin/appointments` - Manage appointments

## Environment Variables

```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
```

## Technologies Used

- React 19
- Redux Toolkit
- React Router DOM
- Socket.io Client
- Axios
- React Hot Toast
- React Icons
- Date-fns
- Stripe (for payments)

## Default Admin Credentials

- Email: admin@mehndi.com
- Password: Admin@123

**⚠️ Change these in production!**
