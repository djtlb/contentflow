import React, { useState, useEffect } from 'react'
import { supabase } from '../App'
import Layout from './Layout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { 
  Search,
  Calendar,
  ExternalLink,
  Twitter,
  Linkedin,
  Mail,
  Video,
  Copy,
  CheckCircle,
  Loader2,
  Filter,
  MoreVertical
} from 'lucide-react'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const ContentHistory = ({ user }) => {
  const [contentHistory, setContentHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)
  const [copiedStates, setCopiedStates] = useState({})

  useEffect(() => {
    fetchContentHistory()
  }, [])

  const fetchContentHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('http://localhost:3001/api/content/history?limit=50', {
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
    } finally {
      setLoading(false)
    }
  }

  const fetchContentDetails = async (contentId) => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch(`http://localhost:3001/api/content/${contentId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        setSelectedItem(result.data)
      }
    } catch (error) {
      console.error('Error fetching content details:', error)
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

  const filteredHistory = contentHistory.filter(item =>
    item.original_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.original_url?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge variant="default" className="bg-green-100 text-green-800">Completed</Badge>
      case 'processing':
        return <Badge variant="secondary">Processing</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const ContentCard = ({ title, content, icon: Icon, type }) => (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted p-4 rounded-lg mb-3 max-h-40 overflow-y-auto">
          <p className="text-sm whitespace-pre-wrap">{content}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => copyToClipboard(content, `${selectedItem.id}-${type}`)}
          className="w-full"
        >
          {copiedStates[`${selectedItem.id}-${type}`] ? (
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

  if (loading) {
    return (
      <Layout user={user}>
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout user={user}>
      <div className="space-y-6">
        {/* Header and Search */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Content History</h2>
            <p className="text-muted-foreground">View and manage your processed content</p>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Content List */}
          <div className="space-y-4">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((item) => (
                <Card 
                  key={item.id} 
                  className={`cursor-pointer transition-colors hover:bg-muted/50 ${
                    selectedItem?.id === item.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => fetchContentDetails(item.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm truncate">
                          {item.original_title || 'Untitled Content'}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {item.original_url}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {getStatusBadge(item.status)}
                          <span className="text-xs text-muted-foreground">
                            {item.word_count} words
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => window.open(item.original_url, '_blank')}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Original
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">No content found</h3>
                  <p className="text-sm text-muted-foreground">
                    {searchTerm ? 'Try adjusting your search terms' : 'Start by processing your first piece of content'}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Content Details */}
          <div className="space-y-4">
            {selectedItem ? (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>Content Details</span>
                      {getStatusBadge(selectedItem.status)}
                    </CardTitle>
                    <CardDescription>
                      Generated on {new Date(selectedItem.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Original Title</label>
                      <p className="text-sm font-semibold">{selectedItem.originalTitle}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Source URL</label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm truncate flex-1">{selectedItem.originalUrl}</p>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => window.open(selectedItem.originalUrl, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Word Count</label>
                      <p className="text-sm font-semibold">{selectedItem.wordCount} words</p>
                    </div>
                  </CardContent>
                </Card>

                {selectedItem.generatedContent && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Generated Content</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      {selectedItem.generatedContent.twitter && (
                        <ContentCard
                          title="Twitter Thread"
                          content={selectedItem.generatedContent.twitter}
                          icon={Twitter}
                          type="twitter"
                        />
                      )}
                      
                      {selectedItem.generatedContent.linkedin && (
                        <ContentCard
                          title="LinkedIn Post"
                          content={selectedItem.generatedContent.linkedin}
                          icon={Linkedin}
                          type="linkedin"
                        />
                      )}
                      
                      {selectedItem.generatedContent.newsletter && (
                        <ContentCard
                          title="Email Newsletter"
                          content={selectedItem.generatedContent.newsletter}
                          icon={Mail}
                          type="newsletter"
                        />
                      )}
                      
                      {selectedItem.generatedContent.video && (
                        <ContentCard
                          title="Video Script"
                          content={selectedItem.generatedContent.video}
                          icon={Video}
                          type="video"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-semibold mb-2">Select content to view details</h3>
                  <p className="text-sm text-muted-foreground">
                    Click on any content item from the list to see the generated content
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ContentHistory
