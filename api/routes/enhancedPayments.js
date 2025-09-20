const express = require('express');
const router = express.Router();
const stripeService = require('../services/stripeService');
const { supabase } = require('../utils/supabase');
const authMiddleware = require('../middleware/auth');

/**
 * Enhanced Payment Routes for ContentFlow
 * Based on official Stripe subscription integration documentation
 */

// Get all available pricing plans
router.get('/plans', async (req, res) => {
  try {
    const prices = await stripeService.getPrices();
    
    // Format prices for frontend
    const plans = prices.map(price => ({
      id: price.id,
      product: price.product,
      amount: price.unit_amount,
      currency: price.currency,
      interval: price.recurring?.interval,
      lookup_key: price.lookup_key,
      metadata: price.metadata
    }));

    res.json({ plans });
  } catch (error) {
    console.error('Error fetching plans:', error);
    res.status(500).json({ error: 'Failed to fetch plans' });
  }
});

// Create checkout session with enhanced features
router.post('/create-checkout-session', authMiddleware, async (req, res) => {
  try {
    const { priceId, planType } = req.body;
    const userId = req.user.id;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Get or create Stripe customer
    let { data: userSub } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    let customerId = userSub?.stripe_customer_id;

    if (!customerId) {
      // Create new Stripe customer
      const { data: user } = await supabase
        .from('auth.users')
        .select('email')
        .eq('id', userId)
        .single();

      const customer = await stripeService.stripe.customers.create({
        email: user.email,
        metadata: {
          user_id: userId,
          platform: 'contentflow'
        }
      });

      customerId = customer.id;

      // Update user subscription record
      await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          stripe_customer_id: customerId,
          plan: 'free',
          status: 'incomplete'
        });
    }

    // Create checkout session with enhanced features
    const session = await stripeService.createCheckoutSession({
      priceId,
      customerId,
      successUrl: `${process.env.FRONTEND_URL}/success`,
      cancelUrl: `${process.env.FRONTEND_URL}/pricing`,
      metadata: {
        user_id: userId,
        plan_type: planType,
        source: 'contentflow_app'
      }
    });

    res.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Create customer portal session
router.post('/create-portal-session', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get customer ID from database
    const { data: userSub } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (!userSub?.stripe_customer_id) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const session = await stripeService.createPortalSession({
      customerId: userSub.stripe_customer_id,
      returnUrl: `${process.env.FRONTEND_URL}/settings`
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

// Get current subscription details
router.get('/subscription', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: userSub } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!userSub) {
      return res.json({ 
        plan: 'free',
        status: 'active',
        usage: { content_pieces_used: 0, monthly_limit: 3 }
      });
    }

    // Get detailed subscription from Stripe if available
    let stripeSubscription = null;
    if (userSub.stripe_subscription_id) {
      try {
        stripeSubscription = await stripeService.getSubscription(userSub.stripe_subscription_id);
      } catch (error) {
        console.error('Error fetching Stripe subscription:', error);
      }
    }

    // Get usage statistics
    const { data: usage } = await supabase
      .from('content_submissions')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString());

    const contentPiecesUsed = usage?.length || 0;
    const monthlyLimit = userSub.plan === 'starter' ? 10 : userSub.plan === 'pro' ? 30 : 3;

    res.json({
      plan: userSub.plan,
      status: userSub.status,
      stripe_subscription: stripeSubscription,
      usage: {
        content_pieces_used: contentPiecesUsed,
        monthly_limit: monthlyLimit,
        percentage_used: Math.round((contentPiecesUsed / monthlyLimit) * 100)
      },
      billing_cycle_anchor: stripeSubscription?.current_period_end,
      cancel_at_period_end: stripeSubscription?.cancel_at_period_end
    });
  } catch (error) {
    console.error('Error fetching subscription:', error);
    res.status(500).json({ error: 'Failed to fetch subscription details' });
  }
});

// Update subscription (upgrade/downgrade)
router.post('/update-subscription', authMiddleware, async (req, res) => {
  try {
    const { newPriceId, planType } = req.body;
    const userId = req.user.id;

    const { data: userSub } = await supabase
      .from('user_subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .single();

    if (!userSub?.stripe_subscription_id) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    const updatedSubscription = await stripeService.updateSubscription({
      subscriptionId: userSub.stripe_subscription_id,
      newPriceId,
      prorationBehavior: 'create_prorations'
    });

    // Update database
    await supabase
      .from('user_subscriptions')
      .update({
        plan: planType,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    res.json({ 
      success: true,
      subscription: updatedSubscription 
    });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Cancel subscription
router.post('/cancel-subscription', authMiddleware, async (req, res) => {
  try {
    const { cancelAtPeriodEnd = true } = req.body;
    const userId = req.user.id;

    const { data: userSub } = await supabase
      .from('user_subscriptions')
      .select('stripe_subscription_id')
      .eq('user_id', userId)
      .single();

    if (!userSub?.stripe_subscription_id) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    const canceledSubscription = await stripeService.cancelSubscription(
      userSub.stripe_subscription_id,
      cancelAtPeriodEnd
    );

    // Update database if immediate cancellation
    if (!cancelAtPeriodEnd) {
      await supabase
        .from('user_subscriptions')
        .update({
          status: 'canceled',
          plan: 'free',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);
    }

    res.json({ 
      success: true,
      subscription: canceledSubscription 
    });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
});

// Create promotional coupon (admin only)
router.post('/create-coupon', authMiddleware, async (req, res) => {
  try {
    const { code, percentOff, duration, durationInMonths } = req.body;
    const userId = req.user.id;

    // Check if user is admin
    const { data: user } = await supabase
      .from('auth.users')
      .select('email')
      .eq('id', userId)
      .single();

    if (user.email !== 'sallykamari61@gmail.com') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const coupon = await stripeService.createCoupon({
      code,
      percentOff,
      duration,
      durationInMonths
    });

    res.json({ 
      success: true,
      coupon 
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ error: 'Failed to create coupon' });
  }
});

// Get subscription analytics (admin only)
router.get('/analytics', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user is admin
    const { data: user } = await supabase
      .from('auth.users')
      .select('email')
      .eq('id', userId)
      .single();

    if (user.email !== 'sallykamari61@gmail.com') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const analytics = await stripeService.getSubscriptionAnalytics();
    
    // Get additional analytics from database
    const { data: dbStats } = await supabase
      .from('user_subscriptions')
      .select('plan, status, created_at')
      .neq('plan', 'free');

    const planCounts = dbStats?.reduce((acc, sub) => {
      acc[sub.plan] = (acc[sub.plan] || 0) + 1;
      return acc;
    }, {}) || {};

    res.json({
      ...analytics,
      database_stats: {
        total_paid_users: dbStats?.length || 0,
        plan_distribution: planCounts
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Stripe webhook endpoint
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const payload = req.body;

    const result = await stripeService.handleWebhook(payload, signature);
    res.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// Initialize products and prices (admin setup)
router.post('/setup-products', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    // Check if user is admin
    const { data: user } = await supabase
      .from('auth.users')
      .select('email')
      .eq('id', userId)
      .single();

    if (user.email !== 'sallykamari61@gmail.com') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const products = await stripeService.createProducts();
    res.json({ 
      success: true,
      products 
    });
  } catch (error) {
    console.error('Error setting up products:', error);
    res.status(500).json({ error: 'Failed to setup products' });
  }
});

module.exports = router;
