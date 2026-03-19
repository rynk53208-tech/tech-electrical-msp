/**
 * MSP Toolset - Main Server
 * Tech & Electrical Services LLC
 *
 * API: http://localhost:3001/api
 * Dashboard: http://localhost:3001
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================
// MIDDLEWARE
// ============================================================

// Security headers (relaxed CSP for inline scripts in dashboard)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:'],
    }
  }
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET','POST','PUT','DELETE','PATCH'],
  allowedHeaders: ['Content-Type','Authorization']
}));

app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: { error: 'Too many auth attempts, please try again later' }
});

// General API rate limit
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 300
});

app.use('/api/auth', authLimiter);
app.use('/api', apiLimiter);

// ============================================================
// ROUTES
// ============================================================

app.use('/api/auth',       require('./routes/auth'));
app.use('/api/clients',    require('./routes/clients'));
app.use('/api/tickets',    require('./routes/tickets'));
app.use('/api/devices',    require('./routes/devices'));
app.use('/api/monitoring', require('./routes/monitoring'));
app.use('/api/invoices',   require('./routes/invoices'));
app.use('/api/users',      require('./routes/users'));
app.use('/api/dashboard',  require('./routes/dashboard'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'MSP Toolset',
    version: '1.0.0',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// ============================================================
// FRONTEND - Serve static files
// ============================================================
const publicDir = path.join(__dirname, 'public');
app.use(express.static(publicDir));

// SPA fallback - all non-API routes serve index.html
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(publicDir, 'index.html'));
  }
});

// ============================================================
// ERROR HANDLING
// ============================================================
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error'
  });
});

// ============================================================
// START
// ============================================================
app.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('  ╔═══════════════════════════════════════╗');
  console.log('  ║   MSP Toolset v1.0 - Tech & Elec LLC  ║');
  console.log('  ╚═══════════════════════════════════════╝');
  console.log('');
  console.log(`  🌐 Dashboard: http://localhost:${PORT}`);
  console.log(`  🔌 API:       http://localhost:${PORT}/api`);
  console.log(`  ❤️  Health:    http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('  Default credentials: irvin / admin2026');
  console.log('');

  // Start monitoring engine
  const monitoring = require('./routes/monitoring');
  monitoring.startMonitoring(60000); // check every 60 seconds
});

module.exports = app;
