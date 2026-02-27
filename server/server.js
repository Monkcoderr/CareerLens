const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Connect to MongoDB Atlas
connectDB();

// 1. Security & Middleware
app.use(helmet());

// 2. Optimized CORS for Production (Vercel) and Local (Vite)
const allowedOrigins = [
  'https://career-lens-ashen.vercel.app', // Your Vercel frontend
  'http://localhost:5173'                  // Your local development
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or health checks)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not allowed`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 3. Rate Limiting (Prevents API abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// 4. API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/resume', require('./routes/resumeRoutes'));
app.use('/api/jobs', require('./routes/jobRoutes'));

// 5. Health Check & Root
app.get('/', (req, res) => {
  res.json({ message: '🚀 CareerLens API is live!', status: 'Running' });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'CareerLens API Working Fine', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// 7. Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n✅ Server successfully started!`);
  console.log(`📡 URL: http://localhost:${PORT}`);
  console.log(`🛠️ Mode: ${process.env.NODE_ENV || 'development'}\n`);
});