import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Zap, Target, Clock, TrendingUp } from 'lucide-react'

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Zap className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">ContentFlow</h1>
        </div>
        <Link to="/auth">
          <Button variant="outline">Sign In</Button>
        </Link>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-5xl font-bold text-foreground mb-6">
          Turn One Piece of Content Into
          <span className="text-primary"> Multiple Formats</span>
        </h2>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Save hours of work with AI-powered content repurposing. Transform your blog posts, 
          videos, and podcasts into Twitter threads, LinkedIn posts, and more.
        </p>
        <Link to="/auth">
          <Button size="lg" className="text-lg px-8 py-4">
            Start Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center text-foreground mb-12">
          Why Content Creators Choose ContentFlow
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader>
              <Clock className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Save Time</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Transform hours of manual work into minutes with AI automation.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Multi-Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Generate content optimized for Twitter, LinkedIn, newsletters, and more.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Zap className="h-8 w-8 text-primary mb-2" />
              <CardTitle>AI-Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Advanced AI understands your content and creates engaging variations.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <TrendingUp className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Grow Faster</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Consistent content across platforms means faster audience growth.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h3 className="text-3xl font-bold text-center text-foreground mb-12">
          Simple, Transparent Pricing
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Creator Plan</CardTitle>
              <CardDescription>Perfect for individual creators</CardDescription>
              <div className="text-3xl font-bold text-primary">$29<span className="text-sm text-muted-foreground">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center">✓ 10 content pieces per month</li>
                <li className="flex items-center">✓ Twitter & LinkedIn generation</li>
                <li className="flex items-center">✓ Email support</li>
              </ul>
              <Button className="w-full" variant="outline">
                Start Free Trial
              </Button>
            </CardContent>
          </Card>
          
          <Card className="border-primary">
            <CardHeader>
              <CardTitle className="text-2xl">Pro Plan</CardTitle>
              <CardDescription>For serious content creators</CardDescription>
              <div className="text-3xl font-bold text-primary">$59<span className="text-sm text-muted-foreground">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center">✓ 30 content pieces per month</li>
                <li className="flex items-center">✓ All platforms supported</li>
                <li className="flex items-center">✓ Priority support</li>
                <li className="flex items-center">✓ Custom tone adjustment</li>
              </ul>
              <Button className="w-full">
                Start Free Trial
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 ContentFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
