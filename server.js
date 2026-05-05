/**
 * ZameenDar Backend — Main Server
 * ================================
 * Pakistan's Farm-to-Table Platform API
 *
 * Run:  node src/server.js
 * Dev:  npx nodemon src/server.js
 */

require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const rateLimit = require('express-rate-limit');
const path     = require('path');
const fs       = require('fs');

// ─── APP ─────────────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

// ─── SECURITY & MIDDLEWARE ───────────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  message: { success: false, message: 'Too many requests. Please slow down.' }
});
app.use('/api/', limiter);

// Serve uploaded images
const uploadDir = process.env.UPLOAD_DIR || './uploads';
fs.mkdirSync(uploadDir, { recursive: true });
app.use('/uploads', express.static(path.resolve(uploadDir)));

// Serve client-side static assets
app.use('/client', express.static(path.resolve('public')));

// ─── ROUTES ──────────────────────────────────────────────────────────────────
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/crops',     require('./routes/crops'));
app.use('/api/orders',    require('./routes/orders'));
app.use('/api/prices',    require('./routes/prices'));
app.use('/api/disease',   require('./routes/disease'));
app.use('/api/centers',   require('./routes/centers'));
app.use('/api/reviews',   require('./routes/reviews'));
app.use('/api/training',  require('./routes/training'));
app.use('/api/dashboard', require('./routes/dashboard'));

// ─── ROOT ─────────────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    name: 'ZameenDar API 🌾',
    version: '1.0.0',
    description: "Pakistan's Farm-to-Table Platform — connecting farmers directly with buyers",
    status: 'running',
    environment: process.env.NODE_ENV || 'development',
    endpoints: {
      auth:      '/api/auth',
      crops:     '/api/crops',
      orders:    '/api/orders',
      prices:    '/api/prices',
      disease:   '/api/disease',
      centers:   '/api/centers',
      reviews:   '/api/reviews',
      training:  '/api/training',
      dashboard: '/api/dashboard'
    },
    docs: 'See README.md for full API documentation'
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime(), timestamp: new Date().toISOString() });
});

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.url}` });
});

// ─── ERROR HANDLER ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large. Max 10MB.' });
  }
  res.status(500).json({ success: false, message: err.message || 'Internal server error.' });
});

// ─── START ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🌾 ZameenDar API is running!`);
  console.log(`   http://localhost:${PORT}`);
  console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n📋 Available routes:`);
  console.log(`   GET  /               → API info`);
  console.log(`   GET  /health         → Health check`);
  console.log(`   POST /api/auth/login → Login`);
  console.log(`   GET  /api/crops      → Browse marketplace`);
  console.log(`   GET  /api/prices     → Live price ticker`);
  console.log(`   POST /api/disease/scan/demo  → AI disease scanner`);
  console.log(`\n📞 Demo accounts (phone → any password):`);
  console.log(`   +923001234567 (Farmer — Ali Raza)`);
  console.log(`   +923331234567 (Retailer — Sana Khan)\n`);
});

module.exports = app;
