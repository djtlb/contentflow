import React, { useState, useEffect } from 'react'
import { supabase } from '../App'
import Layout from './Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Crown,
  Megaphone,
  Calendar,
  Eye,
  MousePointer,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target
} from 'lucide-react'

const AdminDashboard = ({ user }) => {
  const [analytics, setAnalytics] = useState(null)
  const [promoData, setPromoData] = useState({
    title: '',
    message: '',
    type: 'info',
    active: false,
    expiresAt: ''
  })
  const [activePromos, setActivePromos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchAnalytics()
    fetchActivePromos()
  }, [])

  const fetchAnalytics = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('http://localhost:3001/api/admin/analytics', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        setAnalytics(result.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  const fetchActivePromos = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('http://localhost:3001/api/admin/promos', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        setActivePromos(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching promos:', error)
    }
  }

  const createPromo = async () => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      const response = await fetch('http://localhost:3001/api/admin/promos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(promoData)
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create promotion')
      }

      setSuccess('Promotion created successfully!')
      setPromoData({
        title: '',
        message: '',
        type: 'info',
        active: false,
        expiresAt: ''
      })
      fetchActivePromos()

    } catch (error) {
      setError(error.message)
    } finally {
      setSaving(false)
    }
  }

  const togglePromo = async (promoId, active) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`http://localhost:3001/api/admin/promos/${promoId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ active })
      })

      if (response.ok) {
        fetchActivePromos()
        setSuccess(`Promotion ${active ? 'activated' : 'deactivated'} successfully!`)
      }
    } catch (error) {
      setError('Failed to update promotion')
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getPromoTypeColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

  if (loading) {
    return (
      <Layout user={user}>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Crown className="h-8 w-8 text-yellow-500" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">Monitor your SaaS performance and manage promotions</p>
          </div>
          <Badge variant="destructive" className="text-sm">
            Admin Access
          </Badge>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="promotions">Promotions</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="space-y-6">
            {analytics && (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                          <p className="text-2xl font-bold">{analytics.totalUsers || 0}</p>
                          <p className="text-xs text-green-600">
                            +{analytics.newUsersThisMonth || 0} this month
                          </p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Monthly Revenue</p>
                          <p className="text-2xl font-bold">
                            {formatCurrency(analytics.monthlyRevenue || 0)}
                          </p>
                          <p className="text-xs text-green-600">
                            +{((analytics.revenueGrowth || 0) * 100).toFixed(1)}% growth
                          </p>
                        </div>
                        <DollarSign className="h-8 w-8 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Active Subscriptions</p>
                          <p className="text-2xl font-bold">{analytics.activeSubscriptions || 0}</p>
                          <p className="text-xs text-blue-600">
                            {((analytics.conversionRate || 0) * 100).toFixed(1)}% conversion rate
                          </p>
                        </div>
                        <CreditCard className="h-8 w-8 text-purple-500" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">Content Processed</p>
                          <p className="text-2xl font-bold">{analytics.totalContentProcessed || 0}</p>
                          <p className="text-xs text-orange-600">
                            {analytics.contentThisMonth || 0} this month
                          </p>
                        </div>
                        <Activity className="h-8 w-8 text-orange-500" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Revenue Trend</CardTitle>
                      <CardDescription>Monthly recurring revenue over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.revenueChart || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(value)} />
                          <Line type="monotone" dataKey="revenue" stroke="#8884d8" strokeWidth={2} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>User Growth</CardTitle>
                      <CardDescription>New user registrations by month</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.userGrowthChart || []}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="users" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>

                {/* Subscription Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Plans Distribution</CardTitle>
                    <CardDescription>Breakdown of users by subscription tier</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analytics.subscriptionDistribution || []}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            {(analytics.subscriptionDistribution || []).map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      
                      <div className="space-y-4">
                        {(analytics.subscriptionDistribution || []).map((item, index) => (
                          <div key={item.name} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              ></div>
                              <span className="font-medium">{item.name}</span>
                            </div>
                            <div className="text-right">
                              <p className="font-bold">{item.value} users</p>
                              <p className="text-sm text-muted-foreground">
                                {formatCurrency(item.revenue || 0)}/month
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="promotions" className="space-y-6">
            {/* Create New Promotion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5" />
                  Create New Promotion
                </CardTitle>
                <CardDescription>
                  Create promotional banners and announcements for your users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Promotion Title</Label>
                    <Input
                      id="title"
                      placeholder="🎉 Limited Time Offer!"
                      value={promoData.title}
                      onChange={(e) => setPromoData(prev => ({ ...prev, title: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Promotion Type</Label>
                    <select
                      id="type"
                      className="w-full p-2 border rounded-md"
                      value={promoData.type}
                      onChange={(e) => setPromoData(prev => ({ ...prev, type: e.target.value }))}
                    >
                      <option value="info">Info (Blue)</option>
                      <option value="success">Success (Green)</option>
                      <option value="warning">Warning (Yellow)</option>
                      <option value="error">Error (Red)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Promotion Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Get 50% off your first month with code LAUNCH50! Limited time only."
                    value={promoData.message}
                    onChange={(e) => setPromoData(prev => ({ ...prev, message: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expires">Expires At (Optional)</Label>
                    <Input
                      id="expires"
                      type="datetime-local"
                      value={promoData.expiresAt}
                      onChange={(e) => setPromoData(prev => ({ ...prev, expiresAt: e.target.value }))}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Status</Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="active"
                        checked={promoData.active}
                        onChange={(e) => setPromoData(prev => ({ ...prev, active: e.target.checked }))}
                      />
                      <Label htmlFor="active">Activate immediately</Label>
                    </div>
                  </div>
                </div>

                <Button onClick={createPromo} disabled={saving || !promoData.title || !promoData.message}>
                  {saving ? 'Creating...' : 'Create Promotion'}
                </Button>
              </CardContent>
            </Card>

            {/* Active Promotions */}
            <Card>
              <CardHeader>
                <CardTitle>Active Promotions</CardTitle>
                <CardDescription>Manage your current promotional campaigns</CardDescription>
              </CardHeader>
              <CardContent>
                {activePromos.length > 0 ? (
                  <div className="space-y-4">
                    {activePromos.map((promo) => (
                      <div key={promo.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold">{promo.title}</h3>
                              <Badge className={getPromoTypeColor(promo.type)}>
                                {promo.type}
                              </Badge>
                              <Badge variant={promo.active ? "default" : "secondary"}>
                                {promo.active ? "Active" : "Inactive"}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{promo.message}</p>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              <span>Created: {formatDate(promo.created_at)}</span>
                              {promo.expires_at && (
                                <span>Expires: {formatDate(promo.expires_at)}</span>
                              )}
                              <span>Views: {promo.view_count || 0}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant={promo.active ? "destructive" : "default"}
                              size="sm"
                              onClick={() => togglePromo(promo.id, !promo.active)}
                            >
                              {promo.active ? "Deactivate" : "Activate"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Megaphone className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="font-semibold mb-2">No promotions yet</h3>
                    <p className="text-sm text-muted-foreground">
                      Create your first promotion to engage with your users
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Overview of your user base and subscription status</CardDescription>
              </CardHeader>
              <CardContent>
                {analytics && (
                  <div className="space-y-6">
                    {/* User Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{analytics.totalUsers || 0}</p>
                        <p className="text-sm text-muted-foreground">Total Users</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-green-600">{analytics.activeSubscriptions || 0}</p>
                        <p className="text-sm text-muted-foreground">Paying Customers</p>
                      </div>
                      <div className="text-center p-4 border rounded-lg">
                        <p className="text-2xl font-bold text-orange-600">
                          {analytics.totalUsers ? ((analytics.activeSubscriptions / analytics.totalUsers) * 100).toFixed(1) : 0}%
                        </p>
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      </div>
                    </div>

                    {/* Recent Activity */}
                    <div>
                      <h3 className="font-semibold mb-4">Recent User Activity</h3>
                      <div className="space-y-2">
                        {(analytics.recentActivity || []).map((activity, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm">{activity.description}</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{formatDate(activity.timestamp)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default AdminDashboard
