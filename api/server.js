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

const app = express()
const PORT = process.env.PORT || 3001

// Initialize Supabase client
export const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
)

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
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
