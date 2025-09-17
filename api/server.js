import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
import contentRoutes from './routes/content.js'
import paymentRoutes from './routes/payments.js'
import adminRoutes from './routes/admin.js'
import authMiddleware from './middleware/auth.js'

// Load environment variables
dotenv.config({ path: '../.env.local' })

// Environment validation
const requiredEnvVars = {
  'VITE_SUPABASE_URL': process.env.VITE_SUPABASE_URL,
  'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  'OPENAI_API_KEY': process.env.OPENAI_API_KEY
}

const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value || value.includes('your-') || value.includes('${'))
  .map(([key]) => key)

if (missingEnvVars.length > 0 && process.env.NODE_ENV === 'production') {
  console.error('❌ Missing or invalid environment variables:', missingEnvVars.join(', '))
  console.error('Please configure these environment variables in your Vercel dashboard')
}

const app = express()
const PORT = process.env.PORT || 3001

// Initialize Supabase client
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
)

// Middleware
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5174',
  process.env.FRONTEND_URL,
  ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
  ...(process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : [])
].filter(Boolean)

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true)
    
    // Allow any vercel.app domain in production
    if (process.env.NODE_ENV === 'production' && origin.includes('.vercel.app')) {
      return callback(null, true)
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      console.warn(`CORS: Origin ${origin} not allowed`)
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true
}))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

// Routes
app.use('/api/content', authMiddleware, contentRoutes)

// Payment routes (webhook route doesn't need auth)
app.use('/api/payments/webhook', paymentRoutes)
app.use('/api/payments', authMiddleware, paymentRoutes)

// Admin routes (requires auth + admin check)
app.use('/api/admin', authMiddleware, adminRoutes)

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('API Error:', error)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
  console.log(`🚀 API server running on http://localhost:${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
})
