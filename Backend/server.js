import './config/env.js'; // MUST be first - loads dotenv before all other imports

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import fs from 'fs';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/error.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Routes
import authRoutes from './routes/authRoutes.js';
import designRoutes from './routes/designRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import contentRoutes from './routes/contentRoutes.js';

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);

// Trust proxy for production deployment
app.set('trust proxy', 1);

// Security Middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false,
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https:"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https:", "wss:"],
    },
  },
}));

const isDev = process.env.NODE_ENV !== 'production';

// Stricter rate limiting for auth routes only
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isDev ? 1000 : 10,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later.'
  },
  skip: (req) => req.path === '/logout' || req.path === '/refresh',
});

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Socket.io with production configuration
const io = new Server(httpServer, {
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? [process.env.CLIENT_URL]
      : ['http://localhost:5173', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['websocket', 'polling']
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);
  socket.on('disconnect', () => console.log('User disconnected:', socket.id));
});

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = process.env.NODE_ENV === 'production'
      ? [process.env.CLIENT_URL]
      : [
          'http://localhost:5173',
          'http://localhost:3000',
          'http://127.0.0.1:5173',
          process.env.CLIENT_URL_LOCAL, // local network IP
        ].filter(Boolean);

    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS blocked: ${origin}`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Apply rate limiting only on auth routes
app.use('/api/auth', (req, res, next) => {
  if (req.path === '/logout' || req.path === '/refresh') return next();
  return authLimiter(req, res, next);
});

// Serve static files from uploads directory
const uploadsPath = path.join(__dirname, 'uploads');
console.log('💾 Server: Serving static files from:', uploadsPath);
app.use('/uploads', express.static(uploadsPath));

// Log all requests to uploads
app.use('/uploads', (req, res, next) => {
  console.log('🖼️ Static file request:', {
    url: req.url,
    fullPath: path.join(uploadsPath, req.url),
    method: req.method
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/content', contentRoutes);

// Health check with detailed info
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Remove debug endpoint in production
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/debug/uploads', (req, res) => {
    try {
      const uploadsPath = path.join(__dirname, 'uploads');
      const files = fs.readdirSync(uploadsPath).map(file => ({
        name: file,
        url: `${req.protocol}://${req.get('host')}/uploads/${file}`,
        path: path.join(uploadsPath, file)
      }));
      res.json({ 
        success: true, 
        uploadsPath,
        filesCount: files.length,
        files 
      });
    } catch (error) {
      res.json({ 
        success: false, 
        error: error.message,
        uploadsPath: path.join(__dirname, 'uploads')
      });
    }
  });
}

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
