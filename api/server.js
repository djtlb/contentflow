const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { createClient } = require('@supabase/supabase-js');
const contentRoutes = require('./routes/content');
const paymentRoutes = require('./routes/payments');
const enhancedPaymentRoutes = require('./routes/enhancedPayments');
const adminRoutes = require('./routes/admin');
const authMiddleware = require('./middleware/auth');

// Load environment variables
dotenv.config({ path: '../.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// Export supabase for use in other modules
module.exports.supabase = supabase;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:5174'],
  credentials: true
}));

// Raw body parser for webhooks (must be before express.json())
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use('/api/enhanced-payments/webhook', express.raw({ type: 'application/json' }));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/content', authMiddleware, contentRoutes);

// Payment routes (webhook routes don't need auth)
app.use('/api/payments/webhook', paymentRoutes);
app.use('/api/payments', authMiddleware, paymentRoutes);

// Enhanced payment routes with Stripe documentation features
app.use('/api/enhanced-payments/webhook', enhancedPaymentRoutes);
app.use('/api/enhanced-payments', authMiddleware, enhancedPaymentRoutes);

// Admin routes (requires auth + admin check)
app.use('/api/admin', authMiddleware, adminRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    features: ['enhanced-stripe-integration', 'admin-analytics', 'promotional-campaigns']
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 ContentFlow API server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`💳 Enhanced Stripe integration: ENABLED`);
  console.log(`🔧 Admin analytics: ENABLED`);
  console.log(`📢 Promotional campaigns: ENABLED`);
});
