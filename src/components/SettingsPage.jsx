import React from 'react'
import Layout from './Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import SubscriptionManager from './SubscriptionManager'
import { 
  User,
  CreditCard,
  Settings
} from 'lucide-react'

const SettingsPage = ({ user }) => {
  return (
    <Layout user={user}>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="subscription" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="subscription" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Subscription
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Account
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Subscription & Billing</h2>
              <p className="text-muted-foreground mb-6">
                Manage your subscription plan and billing information.
              </p>
            </div>
            <SubscriptionManager user={user} />
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Account Settings</h2>
              <p className="text-muted-foreground mb-6">
                Manage your account information and security settings.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Your account details and authentication information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                    <p className="text-sm font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                    <p className="text-sm font-semibold">
                      {new Date(user.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User ID</label>
                    <p className="text-sm font-mono text-xs">{user.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Last Sign In</label>
                    <p className="text-sm font-semibold">
                      {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Preferences</h2>
              <p className="text-muted-foreground mb-6">
                Customize your ContentFlow experience.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Content Generation Preferences</CardTitle>
                <CardDescription>
                  Control how your content is processed and generated
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Tone</label>
                  <p className="text-sm text-muted-foreground">
                    Choose the default tone for your generated content. This can be overridden per request.
                  </p>
                  <div className="flex gap-2">
                    <Badge variant="outline">Professional</Badge>
                    <Badge variant="outline">Casual</Badge>
                    <Badge variant="outline">Friendly</Badge>
                    <Badge variant="outline">Authoritative</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Custom tone adjustment is available with Pro plan
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform Priorities</label>
                  <p className="text-sm text-muted-foreground">
                    Select which platforms you use most often for optimized content generation.
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="twitter" defaultChecked />
                      <label htmlFor="twitter" className="text-sm">Twitter/X</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="linkedin" defaultChecked />
                      <label htmlFor="linkedin" className="text-sm">LinkedIn</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="newsletter" />
                      <label htmlFor="newsletter" className="text-sm">Newsletter</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="video" />
                      <label htmlFor="video" className="text-sm">Video Scripts</label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>
                  Manage your email notifications and alerts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Processing Complete</p>
                    <p className="text-xs text-muted-foreground">
                      Get notified when your content processing is complete
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Monthly Usage Summary</p>
                    <p className="text-xs text-muted-foreground">
                      Receive a monthly summary of your usage and generated content
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Product Updates</p>
                    <p className="text-xs text-muted-foreground">
                      Stay informed about new features and improvements
                    </p>
                  </div>
                  <input type="checkbox" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}

export default SettingsPage
