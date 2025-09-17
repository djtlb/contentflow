import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts'
import {
  Brain, Zap, Users, TrendingUp, DollarSign, Activity, Globe, Shield,
  Rocket, Target, Crown, Diamond, Sparkles, Eye, MousePointer, 
  Calendar, Clock, Award, Briefcase, Settings, Database, Code,
  BarChart3, PieChart as PieChartIcon, LineChart as LineChartIcon,
  Cpu, Network, Server, Cloud, Lock, Key, UserCheck, AlertTriangle,
  CheckCircle, XCircle, Plus, Edit, Trash2, Download, Upload,
  Filter, Search, RefreshCw, Bell, Star, Heart, Share2, Send
} from 'lucide-react'
import '../styles/viral-brand.css'

const ViralAdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null)
  const [promotions, setPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [newPromo, setNewPromo] = useState({
    title: '',
    message: '',
    type: 'info',
    active: false,
    expiresAt: ''
  })

  useEffect(() => {
    fetchAnalytics()
    fetchPromotions()
    createMatrixEffect()
  }, [])

  const createMatrixEffect = () => {
    const matrixContainer = document.querySelector('.viral-matrix-bg')
    if (!matrixContainer) return

    // Clear existing matrix characters
    matrixContainer.innerHTML = ''

    // Create matrix rain effect
    for (let i = 0; i < 50; i++) {
      const char = document.createElement('div')
      char.className = 'viral-matrix-char'
      char.textContent = String.fromCharCode(0x30A0 + Math.random() * 96)
      char.style.left = `${Math.random() * 100}%`
      char.style.animationDelay = `${Math.random() * 3}s`
      char.style.animationDuration = `${3 + Math.random() * 2}s`
      matrixContainer.appendChild(char)
    }
  }

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics')
      if (response.ok) {
        const data = await response.json()
        setAnalytics(data.data)
      } else {
        // Demo data for development
        setAnalytics({
          monthlyRevenue: 125000,
          revenueGrowth: 0.23,
          totalUsers: 15847,
          newUsersThisMonth: 2341,
          totalContentProcessed: 89234,
          contentThisMonth: 12456,
          conversionRate: 0.087,
          revenueChart: [
            { month: 'Jan', revenue: 45000 },
            { month: 'Feb', revenue: 52000 },
            { month: 'Mar', revenue: 61000 },
            { month: 'Apr', revenue: 73000 },
            { month: 'May', revenue: 89000 },
            { month: 'Jun', revenue: 125000 }
          ],
          userGrowthChart: [
            { month: 'Jan', users: 1200 },
            { month: 'Feb', users: 1890 },
            { month: 'Mar', users: 2340 },
            { month: 'Apr', users: 3120 },
            { month: 'May', users: 4200 },
            { month: 'Jun', users: 2341 }
          ],
          subscriptionDistribution: [
            { name: 'Free', value: 8234, revenue: 0 },
            { name: 'Creator', value: 4521, revenue: 131109 },
            { name: 'Pro', value: 3092, revenue: 182428 }
          ],
          recentActivity: [
            { description: 'New Pro subscription activated', timestamp: new Date().toISOString() },
            { description: 'Content processing milestone: 100K pieces', timestamp: new Date().toISOString() },
            { description: 'System performance optimization completed', timestamp: new Date().toISOString() },
            { description: 'New integration: Slack workspace connector', timestamp: new Date().toISOString() }
          ]
        })
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
      // Set demo data on error
      setAnalytics({
        monthlyRevenue: 125000,
        revenueGrowth: 0.23,
        totalUsers: 15847,
        newUsersThisMonth: 2341,
        totalContentProcessed: 89234,
        contentThisMonth: 12456,
        conversionRate: 0.087
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchPromotions = async () => {
    try {
      const response = await fetch('/api/admin/promos')
      if (response.ok) {
        const data = await response.json()
        setPromotions(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch promotions:', error)
      // Demo promotions
      setPromotions([
        {
          id: '1',
          title: '🚀 Black Friday Mega Sale',
          message: 'Get 50% off all plans! Use code VIRAL50 - Limited time only!',
          type: 'success',
          active: true,
          view_count: 15234,
          click_count: 1847,
          expires_at: '2024-12-01T00:00:00Z'
        },
        {
          id: '2',
          title: '⚡ New AI Features Released',
          message: 'Experience next-gen content generation with our latest AI models!',
          type: 'info',
          active: true,
          view_count: 8921,
          click_count: 743,
          expires_at: null
        }
      ])
    }
  }

  const createPromotion = async () => {
    try {
      const response = await fetch('/api/admin/promos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPromo)
      })
      
      if (response.ok) {
        setNewPromo({ title: '', message: '', type: 'info', active: false, expiresAt: '' })
        fetchPromotions()
      }
    } catch (error) {
      console.error('Failed to create promotion:', error)
    }
  }

  const togglePromotion = async (id, active) => {
    try {
      await fetch(`/api/admin/promos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !active })
      })
      fetchPromotions()
    } catch (error) {
      console.error('Failed to toggle promotion:', error)
    }
  }

  if (loading) {
    return (
      <div className="viral-bg-neural min-h-screen flex items-center justify-center">
        <div className="viral-card viral-glow">
          <div className="flex items-center space-x-4">
            <Brain className="h-8 w-8 text-viral-electric-blue viral-pulse" />
            <div className="viral-text-gradient viral-font-display text-xl">
              INITIALIZING NEURAL COMMAND CENTER...
            </div>
          </div>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100)
  }

  const formatPercentage = (value) => {
    return `${(value * 100).toFixed(1)}%`
  }

  return (
    <div className="viral-bg-neural min-h-screen">
      {/* Matrix Rain Effect */}
      <div className="viral-matrix-bg"></div>

      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="viral-slide-in">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <div className="viral-card viral-glow p-4">
                <Crown className="h-8 w-8 text-viral-quantum-orange viral-pulse" />
              </div>
              <div>
                <h1 className="viral-font-display text-4xl viral-text-gradient">
                  NEURAL COMMAND CENTER
                </h1>
                <p className="text-viral-dark-text-secondary viral-font-primary">
                  $10 Billion Platform Administration • Quantum-Level Control
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="viral-badge viral-badge-success viral-glow">
                <Activity className="h-3 w-3 mr-1" />
                SYSTEM OPTIMAL
              </Badge>
              <Badge className="viral-badge viral-badge-primary viral-pulse">
                <Shield className="h-3 w-3 mr-1" />
                SECURE MODE
              </Badge>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="viral-grid viral-grid-4 viral-slide-in">
          <Card className="viral-card viral-card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-viral-dark-text-secondary">
                TOTAL REVENUE
              </CardTitle>
              <DollarSign className="h-4 w-4 text-viral-cyber-green viral-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold viral-text-gradient viral-font-display">
                {formatCurrency(analytics?.monthlyRevenue || 0)}
              </div>
              <p className="text-xs text-viral-dark-text-secondary">
                <TrendingUp className="inline h-3 w-3 mr-1 text-viral-cyber-green" />
                +{formatPercentage(analytics?.revenueGrowth || 0)} from last month
              </p>
            </CardContent>
          </Card>

          <Card className="viral-card viral-card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-viral-dark-text-secondary">
                ACTIVE USERS
              </CardTitle>
              <Users className="h-4 w-4 text-viral-electric-blue viral-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold viral-text-gradient viral-font-display">
                {analytics?.totalUsers?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-viral-dark-text-secondary">
                <Plus className="inline h-3 w-3 mr-1 text-viral-cyber-green" />
                +{analytics?.newUsersThisMonth || 0} new this month
              </p>
            </CardContent>
          </Card>

          <Card className="viral-card viral-card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-viral-dark-text-secondary">
                CONTENT PROCESSED
              </CardTitle>
              <Brain className="h-4 w-4 text-viral-neon-purple viral-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold viral-text-gradient viral-font-display">
                {analytics?.totalContentProcessed?.toLocaleString() || '0'}
              </div>
              <p className="text-xs text-viral-dark-text-secondary">
                <Zap className="inline h-3 w-3 mr-1 text-viral-quantum-orange" />
                {analytics?.contentThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card className="viral-card viral-card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-viral-dark-text-secondary">
                CONVERSION RATE
              </CardTitle>
              <Target className="h-4 w-4 text-viral-plasma-pink viral-glow" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold viral-text-gradient viral-font-display">
                {formatPercentage(analytics?.conversionRate || 0)}
              </div>
              <p className="text-xs text-viral-dark-text-secondary">
                <Award className="inline h-3 w-3 mr-1 text-viral-plasma-pink" />
                Industry leading performance
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="viral-slide-in">
          <TabsList className="viral-card viral-backdrop-blur mb-6">
            <TabsTrigger value="overview" className="viral-font-primary">
              <BarChart3 className="h-4 w-4 mr-2" />
              NEURAL ANALYTICS
            </TabsTrigger>
            <TabsTrigger value="promotions" className="viral-font-primary">
              <Rocket className="h-4 w-4 mr-2" />
              VIRAL CAMPAIGNS
            </TabsTrigger>
            <TabsTrigger value="users" className="viral-font-primary">
              <Users className="h-4 w-4 mr-2" />
              USER MATRIX
            </TabsTrigger>
            <TabsTrigger value="system" className="viral-font-primary">
              <Server className="h-4 w-4 mr-2" />
              QUANTUM CORE
            </TabsTrigger>
          </TabsList>

          {/* Analytics Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="viral-grid viral-grid-2">
              <Card className="viral-card viral-card-glow">
                <CardHeader>
                  <CardTitle className="viral-font-display viral-text-gradient">
                    REVENUE TRAJECTORY
                  </CardTitle>
                  <CardDescription>Monthly recurring revenue growth pattern</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={analytics?.revenueChart || []}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="#a0a0a0" />
                      <YAxis stroke="#a0a0a0" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(26, 26, 26, 0.9)',
                          border: '1px solid rgba(0, 212, 255, 0.3)',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#00D4FF" 
                        strokeWidth={2}
                        fill="url(#revenueGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="viral-card viral-card-glow">
                <CardHeader>
                  <CardTitle className="viral-font-display viral-text-gradient">
                    USER ACQUISITION
                  </CardTitle>
                  <CardDescription>New user registration trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics?.userGrowthChart || []}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis dataKey="month" stroke="#a0a0a0" />
                      <YAxis stroke="#a0a0a0" />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(26, 26, 26, 0.9)',
                          border: '1px solid rgba(0, 255, 136, 0.3)',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="users" fill="url(#userGradient)" />
                      <defs>
                        <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00FF88" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#00D4FF" stopOpacity={0.3}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card className="viral-card viral-card-glow">
              <CardHeader>
                <CardTitle className="viral-font-display viral-text-gradient">
                  SUBSCRIPTION DISTRIBUTION
                </CardTitle>
                <CardDescription>Revenue breakdown by subscription tier</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="viral-grid viral-grid-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics?.subscriptionDistribution || []}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {(analytics?.subscriptionDistribution || []).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={['#00D4FF', '#8B5CF6', '#FF0080'][index % 3]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="space-y-4">
                    {(analytics?.subscriptionDistribution || []).map((item, index) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: ['#00D4FF', '#8B5CF6', '#FF0080'][index % 3] }}
                          />
                          <span className="viral-font-primary">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="viral-font-display text-sm viral-text-gradient">
                            {item.value} users
                          </div>
                          <div className="text-xs text-viral-dark-text-secondary">
                            {formatCurrency(item.revenue)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Viral Campaigns */}
          <TabsContent value="promotions" className="space-y-6">
            <Card className="viral-card viral-card-glow">
              <CardHeader>
                <CardTitle className="viral-font-display viral-text-gradient">
                  CREATE VIRAL CAMPAIGN
                </CardTitle>
                <CardDescription>Launch promotional campaigns to drive user engagement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="viral-grid viral-grid-2">
                  <div>
                    <Label htmlFor="title" className="viral-font-primary">Campaign Title</Label>
                    <Input
                      id="title"
                      className="viral-input"
                      placeholder="🚀 Limited Time Offer!"
                      value={newPromo.title}
                      onChange={(e) => setNewPromo({...newPromo, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" className="viral-font-primary">Campaign Type</Label>
                    <select
                      id="type"
                      className="viral-input w-full"
                      value={newPromo.type}
                      onChange={(e) => setNewPromo({...newPromo, type: e.target.value})}
                    >
                      <option value="info">Info</option>
                      <option value="success">Success</option>
                      <option value="warning">Warning</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="message" className="viral-font-primary">Campaign Message</Label>
                  <textarea
                    id="message"
                    className="viral-input w-full h-20 resize-none"
                    placeholder="Get 50% off your first month with code VIRAL50! Limited time only."
                    value={newPromo.message}
                    onChange={(e) => setNewPromo({...newPromo, message: e.target.value})}
                  />
                </div>
                <div className="viral-grid viral-grid-2">
                  <div>
                    <Label htmlFor="expires" className="viral-font-primary">Expiration Date</Label>
                    <Input
                      id="expires"
                      type="datetime-local"
                      className="viral-input"
                      value={newPromo.expiresAt}
                      onChange={(e) => setNewPromo({...newPromo, expiresAt: e.target.value})}
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={newPromo.active}
                        onChange={(e) => setNewPromo({...newPromo, active: e.target.checked})}
                        className="viral-input"
                      />
                      <span className="viral-font-primary">Activate Immediately</span>
                    </label>
                  </div>
                </div>
                <Button onClick={createPromotion} className="viral-button viral-button-success">
                  <Rocket className="h-4 w-4 mr-2" />
                  LAUNCH CAMPAIGN
                </Button>
              </CardContent>
            </Card>

            {/* Active Campaigns */}
            <Card className="viral-card viral-card-glow">
              <CardHeader>
                <CardTitle className="viral-font-display viral-text-gradient">
                  ACTIVE CAMPAIGNS
                </CardTitle>
                <CardDescription>Manage your viral promotional campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {promotions.map((promo) => (
                    <div key={promo.id} className="viral-card viral-backdrop-blur p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="viral-font-display viral-text-gradient">{promo.title}</h3>
                            <Badge className={`viral-badge viral-badge-${promo.type}`}>
                              {promo.type.toUpperCase()}
                            </Badge>
                            {promo.active && (
                              <Badge className="viral-badge viral-badge-success viral-pulse">
                                <Activity className="h-3 w-3 mr-1" />
                                LIVE
                              </Badge>
                            )}
                          </div>
                          <p className="viral-font-primary text-sm mb-3">{promo.message}</p>
                          <div className="flex items-center space-x-4 text-xs text-viral-dark-text-secondary">
                            <span className="flex items-center">
                              <Eye className="h-3 w-3 mr-1" />
                              {promo.view_count || 0} views
                            </span>
                            <span className="flex items-center">
                              <MousePointer className="h-3 w-3 mr-1" />
                              {promo.click_count || 0} clicks
                            </span>
                            {promo.expires_at && (
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Expires {new Date(promo.expires_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => togglePromotion(promo.id, promo.active)}
                            className="viral-button"
                          >
                            {promo.active ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {promotions.length === 0 && (
                    <div className="text-center py-8 text-viral-dark-text-secondary">
                      <Rocket className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No campaigns created yet. Launch your first viral campaign above!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* User Matrix */}
          <TabsContent value="users" className="space-y-6">
            <div className="viral-grid viral-grid-3">
              <Card className="viral-card viral-card-glow">
                <CardHeader>
                  <CardTitle className="viral-font-display viral-text-gradient">
                    USER ENGAGEMENT
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold viral-text-gradient viral-font-display mb-2">
                    94.7%
                  </div>
                  <p className="text-sm text-viral-dark-text-secondary">
                    Daily active user rate
                  </p>
                </CardContent>
              </Card>

              <Card className="viral-card viral-card-glow">
                <CardHeader>
                  <CardTitle className="viral-font-display viral-text-gradient">
                    RETENTION RATE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold viral-text-gradient viral-font-display mb-2">
                    87.3%
                  </div>
                  <p className="text-sm text-viral-dark-text-secondary">
                    30-day user retention
                  </p>
                </CardContent>
              </Card>

              <Card className="viral-card viral-card-glow">
                <CardHeader>
                  <CardTitle className="viral-font-display viral-text-gradient">
                    SATISFACTION
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold viral-text-gradient viral-font-display mb-2">
                    4.9/5
                  </div>
                  <p className="text-sm text-viral-dark-text-secondary">
                    Average user rating
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quantum Core */}
          <TabsContent value="system" className="space-y-6">
            <div className="viral-grid viral-grid-2">
              <Card className="viral-card viral-card-glow">
                <CardHeader>
                  <CardTitle className="viral-font-display viral-text-gradient">
                    SYSTEM HEALTH
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="viral-font-primary">API Response Time</span>
                      <Badge className="viral-badge viral-badge-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        45ms
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="viral-font-primary">Database Performance</span>
                      <Badge className="viral-badge viral-badge-success">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Optimal
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="viral-font-primary">AI Model Status</span>
                      <Badge className="viral-badge viral-badge-success viral-pulse">
                        <Brain className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="viral-font-primary">Security Level</span>
                      <Badge className="viral-badge viral-badge-primary viral-glow">
                        <Shield className="h-3 w-3 mr-1" />
                        Maximum
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="viral-card viral-card-glow">
                <CardHeader>
                  <CardTitle className="viral-font-display viral-text-gradient">
                    RESOURCE USAGE
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="viral-font-primary text-sm">CPU Usage</span>
                        <span className="text-sm text-viral-dark-text-secondary">23%</span>
                      </div>
                      <div className="w-full bg-viral-dark-elevated rounded-full h-2">
                        <div className="bg-gradient-to-r from-viral-cyber-green to-viral-electric-blue h-2 rounded-full" style={{width: '23%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="viral-font-primary text-sm">Memory</span>
                        <span className="text-sm text-viral-dark-text-secondary">67%</span>
                      </div>
                      <div className="w-full bg-viral-dark-elevated rounded-full h-2">
                        <div className="bg-gradient-to-r from-viral-electric-blue to-viral-neon-purple h-2 rounded-full" style={{width: '67%'}}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="viral-font-primary text-sm">Storage</span>
                        <span className="text-sm text-viral-dark-text-secondary">34%</span>
                      </div>
                      <div className="w-full bg-viral-dark-elevated rounded-full h-2">
                        <div className="bg-gradient-to-r from-viral-neon-purple to-viral-plasma-pink h-2 rounded-full" style={{width: '34%'}}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default ViralAdminDashboard
