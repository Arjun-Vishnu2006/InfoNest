const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');

// Existing routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const goalRoutes = require('./routes/goalRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');

// New routes
const riskRoutes = require('./routes/riskRoutes');
const contentRoutes = require('./routes/contentRoutes');
const commentRoutes = require('./routes/commentRoutes');
const interactionRoutes = require('./routes/interactionRoutes');
const chatRoutes = require('./routes/chatRoutes');
const aiRoutes = require('./routes/aiRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Error handling middleware
const {
  notFound,
  errorHandler,
} = require('./middleware/errorHandler');

const app = express();

// =====================================================
// SECURITY
// =====================================================

app.use(helmet());

const configuredOrigins = (process.env.CLIENT_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...configuredOrigins,
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.startsWith('http://localhost:') ||
        origin.startsWith('http://127.0.0.1:')
      ) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

// =====================================================
// REQUEST PARSING
// =====================================================

app.use(
  express.json({
    limit: '10kb',
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(cookieParser());

// =====================================================
// LOGGING
// =====================================================

if (process.env.NODE_ENV !== 'test') {
  app.use(
    morgan(
      process.env.NODE_ENV === 'production'
        ? 'combined'
        : 'dev'
    )
  );
}

// =====================================================
// GENERAL API RATE LIMITER
// =====================================================

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', apiLimiter);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'InfoNest API is running',
    timestamp: new Date().toISOString(),
  });
});

// =====================================================
// EXISTING ROUTES
// =====================================================

// Authentication
app.use(
  '/api/v1/auth',
  authRoutes
);

// Users
app.use(
  '/api/v1/users',
  userRoutes
);

// Goals
app.use(
  '/api/v1/goals',
  goalRoutes
);

// Roadmaps
app.use(
  '/api/v1/roadmaps',
  roadmapRoutes
);

// =====================================================
// NEW INFO NEST MODULE ROUTES
// =====================================================

// Risk Management
app.use(
  '/api/v1/risks',
  riskRoutes
);

// Content Management
app.use(
  '/api/v1/content',
  contentRoutes
);

// Comments
app.use(
  '/api/v1/comments',
  commentRoutes
);

// Likes / Other Interactions
app.use(
  '/api/v1/interactions',
  interactionRoutes
);

// Chat / Guidance
app.use(
  '/api/v1/chats',
  chatRoutes
);

// Grok-powered learning assistant
app.use(
  '/api/v1/ai',
  aiRoutes
);

// Reviews and Ratings
app.use(
  '/api/v1/reviews',
  reviewRoutes
);

// Notifications
app.use(
  '/api/v1/notifications',
  notificationRoutes
);

// Administration
app.use(
  '/api/v1/admin',
  adminRoutes
);

// =====================================================
// ERROR HANDLERS
// MUST BE LAST
// =====================================================

app.use(notFound);

app.use(errorHandler);

// =====================================================
// EXPORT APP
// =====================================================

module.exports = app;
