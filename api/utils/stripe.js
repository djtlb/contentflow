import Stripe from 'stripe'
import { supabase } from '../server.js'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

// Define subscription plans
export const SUBSCRIPTION_PLANS = {
  creator: {
    name: 'Creator Plan',
    price: 2900, // $29.00 in cents
    priceId: process.env.STRIPE_CREATOR_PRICE_ID || 'price_creator_placeholder',
    features: {
      monthlyLimit: 10,
      platforms: ['twitter', 'linkedin'],
      support: 'email'
    }
  },
  pro: {
    name: 'Pro Plan',
    price: 5900, // $59.00 in cents
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
    features: {
      monthlyLimit: 30,
      platforms: ['twitter', 'linkedin', 'newsletter', 'video'],
      support: 'priority',
      customTone: true
    }
  }
}

/**
 * Create a Stripe customer
 */
export async function createStripeCustomer(email, userId) {
  try {
    const customer = await stripe.customers.create({
      email,
      metadata: {
        supabase_user_id: userId
      }
    })
    
    return customer
  } catch (error) {
    console.error('Error creating Stripe customer:', error)
    throw new Error('Failed to create customer')
  }
}

/**
 * Create a checkout session for subscription
 */
export async function createCheckoutSession(userId, planType, customerEmail) {
  try {
    const plan = SUBSCRIPTION_PLANS[planType]
    if (!plan) {
      throw new Error('Invalid plan type')
    }

    // Get or create Stripe customer
    let customer = await getStripeCustomerByUserId(userId)
    if (!customer) {
      customer = await createStripeCustomer(customerEmail, userId)
      
      // Save customer ID to database
      await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          stripe_customer_id: customer.id,
          plan_type: 'free',
          status: 'active'
        })
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard?canceled=true`,
      metadata: {
        user_id: userId,
        plan_type: planType
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          plan_type: planType
        }
      }
    })

    return session
  } catch (error) {
    console.error('Error creating checkout session:', error)
    throw new Error('Failed to create checkout session')
  }
}

/**
 * Get Stripe customer by Supabase user ID
 */
export async function getStripeCustomerByUserId(userId) {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single()

    if (error || !data?.stripe_customer_id) {
      return null
    }

    const customer = await stripe.customers.retrieve(data.stripe_customer_id)
    return customer
  } catch (error) {
    console.error('Error getting Stripe customer:', error)
    return null
  }
}

/**
 * Handle successful subscription creation
 */
export async function handleSubscriptionCreated(subscription) {
  try {
    const userId = subscription.metadata.user_id
    const planType = subscription.metadata.plan_type

    if (!userId || !planType) {
      throw new Error('Missing metadata in subscription')
    }

    // Update user subscription in database
    const { error } = await supabase
      .from('user_subscriptions')
      .upsert({
        user_id: userId,
        stripe_customer_id: subscription.customer,
        stripe_subscription_id: subscription.id,
        plan_type: planType,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      })

    if (error) {
      console.error('Database update error:', error)
      throw error
    }

    console.log(`Subscription created for user ${userId}: ${planType}`)
    return true
  } catch (error) {
    console.error('Error handling subscription created:', error)
    throw error
  }
}

/**
 * Handle subscription updates (renewals, cancellations, etc.)
 */
export async function handleSubscriptionUpdated(subscription) {
  try {
    const userId = subscription.metadata.user_id

    if (!userId) {
      throw new Error('Missing user_id in subscription metadata')
    }

    // Update subscription status in database
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) {
      console.error('Database update error:', error)
      throw error
    }

    console.log(`Subscription updated for user ${userId}: ${subscription.status}`)
    return true
  } catch (error) {
    console.error('Error handling subscription updated:', error)
    throw error
  }
}

/**
 * Handle subscription deletion/cancellation
 */
export async function handleSubscriptionDeleted(subscription) {
  try {
    const userId = subscription.metadata.user_id

    if (!userId) {
      throw new Error('Missing user_id in subscription metadata')
    }

    // Update subscription to canceled and downgrade to free plan
    const { error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'canceled',
        plan_type: 'free'
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) {
      console.error('Database update error:', error)
      throw error
    }

    console.log(`Subscription canceled for user ${userId}`)
    return true
  } catch (error) {
    console.error('Error handling subscription deleted:', error)
    throw error
  }
}

/**
 * Get user's current subscription details
 */
export async function getUserSubscription(userId) {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user subscription:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error getting user subscription:', error)
    return null
  }
}

/**
 * Create a billing portal session for subscription management
 */
export async function createBillingPortalSession(userId) {
  try {
    const customer = await getStripeCustomerByUserId(userId)
    if (!customer) {
      throw new Error('No Stripe customer found for user')
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard`,
    })

    return session
  } catch (error) {
    console.error('Error creating billing portal session:', error)
    throw new Error('Failed to create billing portal session')
  }
}

export default stripe
