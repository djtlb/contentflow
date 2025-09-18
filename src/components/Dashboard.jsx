import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../App'
import { apiUrl } from '../lib/config'
import Layout from './Layout'
import PromoBanner from './PromoBanner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { 
  Plus, 
  Link as LinkIcon, 
  Twitter, 
  Linkedin, 
  Mail, 
  Video,
  Copy,
  CheckCircle,
  Loader2,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react'

const Dashboard = ({ user }) => {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [generatedContent, setGeneratedContent] = useState(null)
  const [error, setError] = useState('')
  const [copiedStates, setCopiedStates] = useState({})
  const [contentHistory, setContentHistory] = useState([])
  const [usageStats, setUsageStats] = useState(null)

  useEffect(() => {
    fetchContentHistory()
    fetchUsageStats()
  }, [])

  const fetchContentHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(apiUrl('/api/content/history'), {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        setContentHistory(result.data || [])
      }
    } catch (error) {
      console.error('Error fetching content history:', error)
    }
  }

  const fetchUsageStats = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(apiUrl('/api/content/usage/stats'), {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        setUsageStats(result.data)
      }
    } catch (error) {
      console.error('Error fetching usage stats:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setGeneratedContent(null)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        throw new Error('No active session')
      }

      // Call our backend API to process the content
      const response = await fetch(apiUrl('/api/content/process'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process content')
      }

      setGeneratedContent(data)
      setUrl('') // Clear the input
      
      // Refresh content history and usage stats
      fetchContentHistory()
      fetchUsageStats()
      
    } catch (error) {
      setError(error.message || 'An error occurred while processing your content')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedStates(prev => ({ ...prev, [type]: true }))
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [type]: false }))
      }, 2000)
    } catch (error) {
      console.error('Failed to copy text:', error)
    }
  }

  const ContentCard = ({ title, content, icon: Icon, type }) => (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <div className="bg-muted p-4 rounded-lg mb-3 flex-1 overflow-y-auto max-h-48">
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(content, type)}
          className="w-full"
        >
          {copiedStates[type] ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 mr-2" />
              Copy to Clipboard
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )

  return (
    <Layout user={user}>
      <div className="space-y-8">
        {/* Promotional Banners */}
        <PromoBanner />
        {/* Welcome Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome back!</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transform your content into multiple formats with AI-powered repurposing
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">
                    {usageStats ? usageStats.monthly.used : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    of {usageStats ? usageStats.monthly.limit : 50} pieces
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Processed</p>
                  <p className="text-2xl font-bold">
                    {usageStats ? usageStats.total.processed : 0}
                  </p>
                  <p className="text-xs text-muted-foreground">all time</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Time Saved</p>
                  <p className="text-2xl font-bold">
                    {usageStats ? Math.round(usageStats.total.processed * 2.5) : 0}h
                  </p>
                  <p className="text-xs text-muted-foreground">estimated</p>
                </div>
                <Clock className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Input Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create New Content Package
                </CardTitle>
                <CardDescription>
                  Enter a URL to your blog post, YouTube video, or podcast to generate repurposed content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="url">Content URL</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/your-blog-post"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing Content...
                      </>
                    ) : (
                      <>
                        <LinkIcon className="h-4 w-4 mr-2" />
                        Generate Content Package
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Generated Content */}
            {generatedContent && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">Generated Content Package</h2>
                  <Badge variant="secondary">Ready to use</Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ContentCard
                    title="Twitter Thread"
                    content={generatedContent.twitter}
                    icon={Twitter}
                    type="twitter"
                  />
                  
                  <ContentCard
                    title="LinkedIn Post"
                    content={generatedContent.linkedin}
                    icon={Linkedin}
                    type="linkedin"
                  />
                  
                  <ContentCard
                    title="Email Newsletter"
                    content={generatedContent.newsletter}
                    icon={Mail}
                    type="newsletter"
                  />
                  
                  <ContentCard
                    title="Video Script"
                    content={generatedContent.video}
                    icon={Video}
                    type="video"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Usage Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Content Processed</span>
                    <span className="font-semibold">
                      {usageStats ? `${usageStats.monthly.used} / ${usageStats.monthly.limit}` : '0 / 50'}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${usageStats ? Math.min(usageStats.monthly.percentage, 100) : 0}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {usageStats ? usageStats.monthly.remaining : 50} content pieces remaining this month
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Recent Content */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Content</CardTitle>
              </CardHeader>
              <CardContent>
                {contentHistory.length > 0 ? (
                  <div className="space-y-3">
                    {contentHistory.slice(0, 5).map((item, index) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {item.original_title || item.original_url}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No content processed yet. Create your first content package above!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Dashboard
