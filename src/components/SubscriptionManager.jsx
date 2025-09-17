import React, { useState, useEffect } from 'react'
import { supabase } from '../App'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Crown, 
  Zap, 
  Check, 
  ExternalLink,
  CreditCard,
  Settings,
  Loader2
} from 'lucide-react'

const SubscriptionManager = ({ user }) => {
  const [subscription, setSubscription] = useState(null)
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSubscriptionData()
    fetchPlans()
  }, [])

  const fetchSubscriptionData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('http://localhost:3001/api/payments/subscription', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        setSubscription(result.subscription)
      }
    } catch (error) {
      console.error('Error fetching subscription:', error)
      setError('Failed to load subscription details')
    } finally {
      setLoading(false)
    }
  }

  const fetchPlans = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const response = await fetch('http://localhost:3001/api/payments/plans', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      if (response.ok) {
        const result = await response.json()
        setPlans(result.plans)
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
    }
  }

  const handleUpgrade = async (planType) => {
    setUpgrading(true)
    setError('')

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      const response = await fetch('http://localhost:3001/api/payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planType })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create checkout session')
      }

      // Redirect to Stripe Checkout
      window.location.href = result.url

    } catch (error) {
      setError(error.message)
    } finally {
      setUpgrading(false)
    }
  }

  const handleManageSubscription = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('No active session')

      const response = await fetch('http://localhost:3001/api/payments/create-portal-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create portal session')
      }

      // Redirect to Stripe Customer Portal
      window.location.href = result.url

    } catch (error) {
      setError(error.message)
    }
  }

  const formatPrice = (price) => {
    return `$${(price / 100).toFixed(0)}`
  }

  const getPlanBadgeVariant = (planType) => {
    switch (planType) {
      case 'free': return 'secondary'
      case 'creator': return 'default'
      case 'pro': return 'destructive'
      default: return 'secondary'
    }
  }

  const getPlanIcon = (planType) => {
    switch (planType) {
      case 'pro': return Crown
      case 'creator': return Zap
      default: return Check
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          {subscription && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant={getPlanBadgeVariant(subscription.plan_type)}>
                    {subscription.plan_type === 'free' ? 'Free Plan' : 
                     subscription.plan_type === 'creator' ? 'Creator Plan' : 'Pro Plan'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Status: {subscription.status}
                  </span>
                </div>
                {subscription.plan_type !== 'free' && (
                  <Button variant="outline" onClick={handleManageSubscription}>
                    <Settings className="h-4 w-4 mr-2" />
                    Manage
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Monthly Limit</p>
                  <p className="font-semibold">{subscription.features.monthlyLimit} pieces</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Platforms</p>
                  <p className="font-semibold">{subscription.features.platforms.length} platforms</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Support</p>
                  <p className="font-semibold capitalize">{subscription.features.support}</p>
                </div>
                {subscription.features.customTone && (
                  <div>
                    <p className="text-muted-foreground">Custom Tone</p>
                    <p className="font-semibold">✓ Included</p>
                  </div>
                )}
              </div>

              {subscription.current_period_end && (
                <p className="text-xs text-muted-foreground">
                  {subscription.status === 'active' ? 'Renews' : 'Expires'} on{' '}
                  {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      {subscription?.plan_type === 'free' && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Upgrade Your Plan</h3>
          
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => {
              const Icon = getPlanIcon(plan.id)
              const isCurrentPlan = subscription?.plan_type === plan.id
              
              return (
                <Card key={plan.id} className={plan.id === 'pro' ? 'border-primary' : ''}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      {plan.name}
                      {plan.id === 'pro' && (
                        <Badge variant="destructive">Most Popular</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      <span className="text-3xl font-bold text-foreground">
                        {formatPrice(plan.price)}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        {plan.features.monthlyLimit} content pieces per month
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        {plan.features.platforms.join(', ')} platforms
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        {plan.features.support} support
                      </li>
                      {plan.features.customTone && (
                        <li className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-green-500" />
                          Custom tone adjustment
                        </li>
                      )}
                    </ul>

                    <Button 
                      className="w-full" 
                      onClick={() => handleUpgrade(plan.id)}
                      disabled={upgrading || isCurrentPlan}
                      variant={plan.id === 'pro' ? 'default' : 'outline'}
                    >
                      {upgrading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : isCurrentPlan ? (
                        'Current Plan'
                      ) : (
                        <>
                          Upgrade to {plan.name}
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default SubscriptionManager
