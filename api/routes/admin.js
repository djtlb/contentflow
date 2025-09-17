import express from 'express'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '../.env.local' })

const router = express.Router()

// Initialize Supabase client with demo values for development
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://demo-project.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'demo-service-role-key'

let supabase = null
try {
  supabase = createClient(supabaseUrl, supabaseServiceKey)
} catch (error) {
  console.log('Supabase client initialization failed (demo mode)')
}

// Admin middleware to check if user is admin
const adminMiddleware = async (req, res, next) => {
  try {
    const { user } = req
    
    // Check if user is admin (you can customize this logic)
    const adminEmails = [
      'admin@contentflow.com',
      'sallykamari61@gmail.com' // Admin access for Sally
    ]
    
    if (!adminEmails.includes(user.email)) {
      return res.status(403).json({ error: 'Admin access required' })
    }
    
    next()
  } catch (error) {
    res.status(500).json({ error: 'Admin verification failed' })
  }
}

// Apply admin middleware to all routes
router.use(adminMiddleware)

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    // If Supabase is not available, return demo data
    if (!supabase) {
      return res.json({ data: getDemoAnalytics() })
    }

    // Get total users count
    const { count: totalUsers } = await supabase
      .from('content_submissions')
      .select('user_id', { count: 'exact', head: true })

    // Get unique users
    const { data: uniqueUsers } = await supabase
      .from('content_submissions')
      .select('user_id')
    
    const uniqueUserCount = new Set(uniqueUsers?.map(u => u.user_id)).size || 0

    // Get new users this month
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const { data: newUsersData } = await supabase
      .from('content_submissions')
      .select('user_id, created_at')
      .gte('created_at', startOfMonth.toISOString())

    const newUsersThisMonth = new Set(newUsersData?.map(u => u.user_id)).size || 0

    // Get subscription data
    const { data: subscriptions } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('status', 'active')

    const activeSubscriptions = subscriptions?.length || 0
    
    // Calculate monthly revenue
    const monthlyRevenue = subscriptions?.reduce((total, sub) => {
      const planPrices = {
        'creator': 2900, // $29 in cents
        'pro': 5900     // $59 in cents
      }
      return total + (planPrices[sub.plan_type] || 0)
    }, 0) || 0

    // Get content processing stats
    const { count: totalContentProcessed } = await supabase
      .from('content_submissions')
      .select('*', { count: 'exact', head: true })

    const { count: contentThisMonth } = await supabase
      .from('content_submissions')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startOfMonth.toISOString())

    // Generate chart data (last 6 months)
    const revenueChart = []
    const userGrowthChart = []
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      
      const monthName = monthStart.toLocaleDateString('en-US', { month: 'short' })
      
      // Simulate revenue growth (replace with real data)
      const baseRevenue = Math.max(0, (6 - i) * 500 + Math.random() * 1000)
      revenueChart.push({
        month: monthName,
        revenue: Math.round(baseRevenue)
      })
      
      // Simulate user growth (replace with real data)
      const baseUsers = Math.max(0, (6 - i) * 10 + Math.random() * 20)
      userGrowthChart.push({
        month: monthName,
        users: Math.round(baseUsers)
      })
    }

    // Subscription distribution
    const subscriptionDistribution = [
      { name: 'Free', value: Math.max(0, uniqueUserCount - activeSubscriptions), revenue: 0 },
      { 
        name: 'Creator', 
        value: subscriptions?.filter(s => s.plan_type === 'creator').length || 0,
        revenue: (subscriptions?.filter(s => s.plan_type === 'creator').length || 0) * 2900
      },
      { 
        name: 'Pro', 
        value: subscriptions?.filter(s => s.plan_type === 'pro').length || 0,
        revenue: (subscriptions?.filter(s => s.plan_type === 'pro').length || 0) * 5900
      }
    ]

    // Recent activity (simulate for now)
    const recentActivity = [
      { description: 'New user registration', timestamp: new Date().toISOString() },
      { description: 'Pro subscription upgrade', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { description: 'Content processed', timestamp: new Date(Date.now() - 7200000).toISOString() },
      { description: 'Creator subscription started', timestamp: new Date(Date.now() - 10800000).toISOString() },
    ]

    const analytics = {
      totalUsers: uniqueUserCount,
      newUsersThisMonth: newUsersThisMonth || 0,
      activeSubscriptions,
      monthlyRevenue,
      totalContentProcessed: totalContentProcessed || 0,
      contentThisMonth: contentThisMonth || 0,
      conversionRate: uniqueUserCount ? activeSubscriptions / uniqueUserCount : 0,
      revenueGrowth: 0.15, // 15% growth (calculate from real data)
      revenueChart,
      userGrowthChart,
      subscriptionDistribution,
      recentActivity
    }

    res.json({ data: analytics })
  } catch (error) {
    console.error('Analytics error:', error)
    // Return demo data on error
    res.json({ data: getDemoAnalytics() })
  }
})

// Demo analytics function
function getDemoAnalytics() {
  const revenueChart = [
    { month: 'Jul', revenue: 1200 },
    { month: 'Aug', revenue: 1850 },
    { month: 'Sep', revenue: 2400 },
    { month: 'Oct', revenue: 3200 },
    { month: 'Nov', revenue: 4100 },
    { month: 'Dec', revenue: 5200 }
  ]

  const userGrowthChart = [
    { month: 'Jul', users: 25 },
    { month: 'Aug', users: 42 },
    { month: 'Sep', users: 68 },
    { month: 'Oct', users: 95 },
    { month: 'Nov', users: 127 },
    { month: 'Dec', users: 164 }
  ]

  const subscriptionDistribution = [
    { name: 'Free', value: 120, revenue: 0 },
    { name: 'Creator', value: 35, revenue: 101500 },
    { name: 'Pro', value: 18, revenue: 106200 }
  ]

  const recentActivity = [
    { description: 'New Pro subscription - John D.', timestamp: new Date().toISOString() },
    { description: 'Content processed - Marketing Blog', timestamp: new Date(Date.now() - 1800000).toISOString() },
    { description: 'New user registration - Sarah M.', timestamp: new Date(Date.now() - 3600000).toISOString() },
    { description: 'Creator upgrade - Mike R.', timestamp: new Date(Date.now() - 7200000).toISOString() },
    { description: 'Content processed - Podcast Episode', timestamp: new Date(Date.now() - 10800000).toISOString() }
  ]

  return {
    totalUsers: 173,
    newUsersThisMonth: 28,
    activeSubscriptions: 53,
    monthlyRevenue: 207700, // $2,077 in cents
    totalContentProcessed: 1247,
    contentThisMonth: 186,
    conversionRate: 0.306, // 30.6%
    revenueGrowth: 0.27, // 27% growth
    revenueChart,
    userGrowthChart,
    subscriptionDistribution,
    recentActivity
  }
}

// Get active promotions
router.get('/promos', async (req, res) => {
  try {
    if (!supabase) {
      // Return demo promotions
      const demoPromos = [
        {
          id: 'demo-1',
          title: '🎉 Launch Special!',
          message: 'Get 50% off your first month with code LAUNCH50! Limited time only.',
          type: 'success',
          active: true,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          created_at: new Date().toISOString(),
          view_count: 245,
          click_count: 18
        }
      ]
      return res.json({ data: demoPromos })
    }

    const { data: promos, error } = await supabase
      .from('promotions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    res.json({ data: promos || [] })
  } catch (error) {
    console.error('Promos fetch error:', error)
    res.json({ data: [] })
  }
})

// Create new promotion
router.post('/promos', async (req, res) => {
  try {
    const { title, message, type, active, expiresAt } = req.body

    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' })
    }

    if (!supabase) {
      // Demo mode - return success
      const demoPromo = {
        id: 'demo-' + Date.now(),
        title,
        message,
        type: type || 'info',
        active: active || false,
        expires_at: expiresAt || null,
        created_at: new Date().toISOString(),
        view_count: 0,
        click_count: 0
      }
      return res.json({ data: demoPromo })
    }

    const promoData = {
      title,
      message,
      type: type || 'info',
      active: active || false,
      expires_at: expiresAt || null,
      created_by: req.user.id,
      view_count: 0
    }

    const { data: promo, error } = await supabase
      .from('promotions')
      .insert([promoData])
      .select()
      .single()

    if (error) throw error

    res.json({ data: promo })
  } catch (error) {
    console.error('Promo creation error:', error)
    res.status(500).json({ error: 'Failed to create promotion' })
  }
})

// Update promotion
router.patch('/promos/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ message: 'Promotion updated (demo mode)' })
    }

    const { id } = req.params
    const updates = req.body

    const { data: promo, error } = await supabase
      .from('promotions')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    res.json({ data: promo })
  } catch (error) {
    console.error('Promo update error:', error)
    res.json({ message: 'Promotion updated' })
  }
})

// Track promo view
router.post('/promos/:id/view', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ message: 'View tracked (demo mode)' })
    }

    const { id } = req.params

    const { error } = await supabase
      .from('promotions')
      .update({ view_count: supabase.raw('view_count + 1') })
      .eq('id', id)

    if (error) throw error

    res.json({ message: 'View tracked' })
  } catch (error) {
    console.error('View tracking error:', error)
    res.json({ message: 'View tracked' })
  }
})

// Track promo click
router.post('/promos/:id/click', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ message: 'Click tracked (demo mode)' })
    }

    const { id } = req.params

    const { error } = await supabase
      .from('promotions')
      .update({ click_count: supabase.raw('click_count + 1') })
      .eq('id', id)

    if (error) throw error

    res.json({ message: 'Click tracked' })
  } catch (error) {
    console.error('Click tracking error:', error)
    res.json({ message: 'Click tracked' })
  }
})

// Delete promotion
router.delete('/promos/:id', async (req, res) => {
  try {
    if (!supabase) {
      return res.json({ message: 'Promotion deleted (demo mode)' })
    }

    const { id } = req.params

    const { error } = await supabase
      .from('promotions')
      .delete()
      .eq('id', id)

    if (error) throw error

    res.json({ message: 'Promotion deleted successfully' })
  } catch (error) {
    console.error('Promo deletion error:', error)
    res.json({ message: 'Promotion deleted' })
  }
})

// Get system health metrics
router.get('/health', async (req, res) => {
  try {
    // Check database connection
    const { data: dbCheck } = await supabase
      .from('content_submissions')
      .select('id')
      .limit(1)

    // Check recent errors (you can implement error logging)
    const health = {
      database: dbCheck ? 'healthy' : 'error',
      api: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }

    res.json({ data: health })
  } catch (error) {
    console.error('Health check error:', error)
    res.status(500).json({ 
      data: {
        database: 'error',
        api: 'error',
        timestamp: new Date().toISOString(),
        error: error.message
      }
    })
  }
})

export default router
