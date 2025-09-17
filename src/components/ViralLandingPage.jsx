import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Brain, Zap, Users, TrendingUp, DollarSign, Activity, Globe, Shield,
  Rocket, Target, Crown, Diamond, Sparkles, Eye, MousePointer, 
  Calendar, Clock, Award, Briefcase, Settings, Database, Code,
  BarChart3, PieChart, LineChart, Cpu, Network, Server, Cloud,
  Lock, Key, UserCheck, AlertTriangle, CheckCircle, XCircle,
  Plus, Edit, Trash2, Download, Upload, Filter, Search, RefreshCw,
  Bell, Star, Heart, Share2, Send, ArrowRight, Play, Pause,
  Volume2, VolumeX, Maximize, Minimize, RotateCcw, RotateCw
} from 'lucide-react'
import '../styles/viral-brand.css'

const ViralLandingPage = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [activeFeature, setActiveFeature] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    createParticleEffect()
    
    // Auto-rotate features
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % features.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [])

  const createParticleEffect = () => {
    const container = document.querySelector('.viral-particles')
    if (!container) return

    for (let i = 0; i < 100; i++) {
      const particle = document.createElement('div')
      particle.className = 'viral-particle'
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: #00D4FF;
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: viralFloat ${3 + Math.random() * 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
        opacity: ${0.3 + Math.random() * 0.7};
      `
      container.appendChild(particle)
    }
  }

  const features = [
    {
      icon: Brain,
      title: "NEURAL AI ORCHESTRATION",
      description: "Multi-model AI coordination with GPT-4, Claude, and Gemini for unparalleled content intelligence",
      color: "text-viral-neon-purple"
    },
    {
      icon: Rocket,
      title: "QUANTUM CONTENT PROCESSING",
      description: "Transform any URL into viral content across 15+ platforms in seconds with enterprise-grade precision",
      color: "text-viral-electric-blue"
    },
    {
      icon: Users,
      title: "ENTERPRISE COLLABORATION",
      description: "Real-time team workflows, approval systems, and white-label solutions for Fortune 500 companies",
      color: "text-viral-cyber-green"
    },
    {
      icon: Shield,
      title: "MILITARY-GRADE SECURITY",
      description: "Zero-trust architecture, end-to-end encryption, and compliance with SOC 2, GDPR, and HIPAA",
      color: "text-viral-plasma-pink"
    }
  ]

  const stats = [
    { value: "$10B+", label: "Platform Valuation", icon: DollarSign },
    { value: "2.3M+", label: "Content Pieces Generated", icon: Brain },
    { value: "99.9%", label: "Uptime Guarantee", icon: Shield },
    { value: "150+", label: "Enterprise Clients", icon: Crown }
  ]

  const pricingPlans = [
    {
      name: "NEURAL STARTER",
      price: "$29",
      period: "/month",
      description: "Perfect for content creators and small teams",
      features: [
        "10 AI-powered content pieces/month",
        "5 platform formats",
        "Basic brand voice training",
        "Standard support",
        "API access"
      ],
      popular: false,
      gradient: "from-viral-electric-blue to-viral-neon-purple"
    },
    {
      name: "QUANTUM PRO",
      price: "$59",
      period: "/month",
      description: "Advanced features for growing businesses",
      features: [
        "30 AI-powered content pieces/month",
        "15+ platform formats",
        "Advanced brand voice AI",
        "Priority support",
        "Team collaboration",
        "Custom integrations",
        "Analytics dashboard"
      ],
      popular: true,
      gradient: "from-viral-cyber-green to-viral-electric-blue"
    },
    {
      name: "ENTERPRISE NEURAL",
      price: "Custom",
      period: "",
      description: "Unlimited power for enterprise organizations",
      features: [
        "Unlimited content generation",
        "All platform formats",
        "Custom AI model training",
        "24/7 dedicated support",
        "White-label solutions",
        "Advanced security",
        "Custom integrations",
        "SLA guarantees"
      ],
      popular: false,
      gradient: "from-viral-plasma-pink to-viral-quantum-orange"
    }
  ]

  return (
    <div className="viral-bg-neural min-h-screen overflow-hidden">
      {/* Particle Effect Background */}
      <div className="viral-particles fixed inset-0 pointer-events-none"></div>
      
      {/* Matrix Rain Effect */}
      <div className="viral-matrix-bg"></div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-6 text-center">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Logo and Branding */}
            <div className="flex items-center justify-center mb-8">
              <div className="viral-card viral-glow p-6">
                <Brain className="h-16 w-16 text-viral-electric-blue viral-pulse mx-auto" />
              </div>
            </div>
            
            <h1 className="viral-font-display text-6xl md:text-8xl viral-text-gradient mb-6 viral-glow">
              CONTENTFLOW
            </h1>
            
            <div className="viral-badge viral-badge-primary viral-pulse mb-8 inline-flex">
              <Crown className="h-4 w-4 mr-2" />
              $10 BILLION AI PLATFORM
            </div>
            
            <h2 className="text-2xl md:text-4xl text-viral-dark-text mb-8 viral-font-primary">
              The World's Most Advanced
              <span className="viral-text-gradient viral-font-display"> AI CONTENT ORCHESTRATION </span>
              Platform
            </h2>
            
            <p className="text-lg text-viral-dark-text-secondary mb-12 max-w-3xl mx-auto viral-font-primary">
              Transform any content into viral masterpieces across 15+ platforms using our neural AI network. 
              Trusted by Fortune 500 companies and used by over 2.3 million content creators worldwide.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link to="/auth">
                <Button className="viral-button viral-button-success viral-glow text-lg px-8 py-4">
                  <Rocket className="h-5 w-5 mr-2" />
                  START NEURAL TRANSFORMATION
                </Button>
              </Link>
              <Button variant="outline" className="viral-button text-lg px-8 py-4">
                <Play className="h-5 w-5 mr-2" />
                WATCH QUANTUM DEMO
              </Button>
            </div>
            
            {/* Stats Grid */}
            <div className="viral-grid viral-grid-4 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <Card key={index} className="viral-card viral-card-glow viral-float">
                  <CardContent className="p-6 text-center">
                    <stat.icon className="h-8 w-8 mx-auto mb-4 text-viral-electric-blue viral-glow" />
                    <div className="viral-font-display text-3xl viral-text-gradient mb-2">
                      {stat.value}
                    </div>
                    <p className="text-sm text-viral-dark-text-secondary viral-font-primary">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="viral-font-display text-4xl viral-text-gradient mb-6">
              NEURAL CAPABILITIES
            </h2>
            <p className="text-xl text-viral-dark-text-secondary max-w-3xl mx-auto">
              Experience the future of content creation with our quantum-powered AI orchestration system
            </p>
          </div>
          
          <div className="viral-grid viral-grid-2 gap-12 items-center">
            <div className="space-y-8">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className={`viral-card viral-card-glow cursor-pointer transition-all duration-500 ${
                    activeFeature === index ? 'viral-border-glow scale-105' : ''
                  }`}
                  onClick={() => setActiveFeature(index)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="viral-card viral-glow p-3">
                        <feature.icon className={`h-6 w-6 ${feature.color} viral-pulse`} />
                      </div>
                      <div>
                        <h3 className="viral-font-display viral-text-gradient text-lg mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-viral-dark-text-secondary viral-font-primary">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="viral-card viral-card-glow p-8">
              <div className="aspect-video bg-gradient-to-br from-viral-electric-blue/20 to-viral-neon-purple/20 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <features[activeFeature].icon className="h-24 w-24 mx-auto mb-4 text-viral-electric-blue viral-pulse" />
                  <h3 className="viral-font-display viral-text-gradient text-2xl mb-4">
                    {features[activeFeature].title}
                  </h3>
                  <p className="text-viral-dark-text-secondary">
                    Interactive demo coming soon...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="viral-font-display text-4xl viral-text-gradient mb-6">
              QUANTUM PRICING MATRIX
            </h2>
            <p className="text-xl text-viral-dark-text-secondary max-w-3xl mx-auto">
              Choose your neural enhancement level. All plans include our revolutionary AI orchestration technology.
            </p>
          </div>
          
          <div className="viral-grid viral-grid-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index}
                className={`viral-card viral-card-glow relative ${
                  plan.popular ? 'viral-border-glow scale-105 viral-pulse' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="viral-badge viral-badge-success viral-glow">
                      <Crown className="h-3 w-3 mr-1" />
                      MOST POPULAR
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="viral-font-display viral-text-gradient text-2xl mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="mb-4">
                    <span className="viral-font-display text-4xl viral-text-gradient">
                      {plan.price}
                    </span>
                    <span className="text-viral-dark-text-secondary">
                      {plan.period}
                    </span>
                  </div>
                  <CardDescription className="text-viral-dark-text-secondary">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-4 w-4 text-viral-cyber-green viral-glow" />
                      <span className="viral-font-primary text-sm">{feature}</span>
                    </div>
                  ))}
                  
                  <div className="pt-6">
                    <Link to="/auth">
                      <Button 
                        className={`viral-button w-full ${
                          plan.popular ? 'viral-button-success viral-glow' : ''
                        }`}
                      >
                        {plan.price === 'Custom' ? 'CONTACT SALES' : 'START NEURAL TRIAL'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-6 text-center">
          <div className="viral-card viral-card-glow max-w-4xl mx-auto p-12">
            <h2 className="viral-font-display text-4xl viral-text-gradient mb-6">
              READY TO DOMINATE THE CONTENT UNIVERSE?
            </h2>
            <p className="text-xl text-viral-dark-text-secondary mb-8">
              Join the neural revolution. Transform your content strategy with the world's most advanced AI platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button className="viral-button viral-button-success viral-glow text-lg px-8 py-4">
                  <Brain className="h-5 w-5 mr-2" />
                  ACTIVATE NEURAL MODE
                </Button>
              </Link>
              <Button variant="outline" className="viral-button text-lg px-8 py-4">
                <Shield className="h-5 w-5 mr-2" />
                ENTERPRISE CONSULTATION
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-viral-dark-elevated">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Brain className="h-8 w-8 text-viral-electric-blue viral-glow" />
              <span className="viral-font-display viral-text-gradient text-xl">
                CONTENTFLOW
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <Badge className="viral-badge viral-badge-primary">
                <Shield className="h-3 w-3 mr-1" />
                SOC 2 CERTIFIED
              </Badge>
              <Badge className="viral-badge viral-badge-success">
                <CheckCircle className="h-3 w-3 mr-1" />
                99.9% UPTIME
              </Badge>
              <Badge className="viral-badge viral-badge-primary">
                <Crown className="h-3 w-3 mr-1" />
                ENTERPRISE READY
              </Badge>
            </div>
          </div>
          <div className="text-center mt-8 text-viral-dark-text-secondary text-sm">
            © 2024 ContentFlow Neural Systems. All rights reserved. Powered by quantum AI technology.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default ViralLandingPage
