import express from 'express'
import { 
  createCheckoutSession, 
  createBillingPortalSession,
  getUserSubscription,
  SUBSCRIPTION_PLANS,
  handleSubscriptionCreated,
  handleSubscriptionUpdated,
  handleSubscriptionDeleted
} from '../utils/stripe.js'
import stripe from '../utils/stripe.js'

const router = express.Router()

/**
 * POST /api/payments/create-checkout-session
 * Create a Stripe checkout session for subscription
 */
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { planType } = req.body
    const userId = req.user.id
    const userEmail = req.user.email

    if (!planType || !SUBSCRIPTION_PLANS[planType]) {
      return res.status(400).json({ error: 'Invalid plan type' })
    }

    const session = await createCheckoutSession(userId, planType, userEmail)

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url
    })

  } catch (error) {
    console.error('Checkout session error:', error)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
})

/**
 * POST /api/payments/create-portal-session
 * Create a Stripe billing portal session for subscription management
 */
router.post('/create-portal-session', async (req, res) => {
  try {
    const userId = req.user.id

    const session = await createBillingPortalSession(userId)

    res.json({
      success: true,
      url: session.url
    })

  } catch (error) {
    console.error('Portal session error:', error)
    res.status(500).json({ error: 'Failed to create portal session' })
  }
})

/**
 * GET /api/payments/subscription
 * Get user's current subscription details
 */
router.get('/subscription', async (req, res) => {
  try {
    const userId = req.user.id
    const subscription = await getUserSubscription(userId)

    if (!subscription) {
      return res.json({
        success: true,
        subscription: {
          plan_type: 'free',
          status: 'active',
          features: {
            monthlyLimit: 5, // Free tier limit
            platforms: ['twitter'],
            support: 'community'
          }
        }
      })
    }

    // Get plan features
    const planFeatures = SUBSCRIPTION_PLANS[subscription.plan_type]?.features || {
      monthlyLimit: 5,
      platforms: ['twitter'],
      support: 'community'
    }

    res.json({
      success: true,
      subscription: {
        id: subscription.id,
        plan_type: subscription.plan_type,
        status: subscription.status,
        current_period_start: subscription.current_period_start,
        current_period_end: subscription.current_period_end,
        features: planFeatures
      }
    })

  } catch (error) {
    console.error('Subscription fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch subscription details' })
  }
})

/**
 * GET /api/payments/plans
 * Get available subscription plans
 */
router.get('/plans', (req, res) => {
  try {
    const plans = Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => ({
      id: key,
      name: plan.name,
      price: plan.price,
      features: plan.features
    }))

    res.json({
      success: true,
      plans
    })

  } catch (error) {
    console.error('Plans fetch error:', error)
    res.status(500).json({ error: 'Failed to fetch plans' })
  }
})

/**
 * POST /api/payments/webhook
 * Handle Stripe webhooks (no auth middleware needed)
 */
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      
      case 'invoice.payment_succeeded':
        console.log('Payment succeeded:', event.data.object.id)
        break
      
      case 'invoice.payment_failed':
        console.log('Payment failed:', event.data.object.id)
        break
      
      default:
        console.log(`Unhandled event type ${event.type}`)
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    res.status(500).json({ error: 'Webhook handler failed' })
  }
})

export default router
