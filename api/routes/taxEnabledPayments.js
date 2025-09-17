const express = require('express');
const router = express.Router();
const enhancedStripeService = require('../services/enhancedStripeService');
const { supabase } = require('../utils/supabase');
const authMiddleware = require('../middleware/auth');

/**
 * Tax-Enabled Payment Routes for ContentFlow
 * Implements automatic tax calculation and collection
 */

// Create checkout session with automatic tax
router.post('/create-checkout-session-with-tax', authMiddleware, async (req, res) => {
  try {
    const { priceId, planType, customerAddress } = req.body;
    const userId = req.user.id;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Validate address for tax calculation if provided
    if (customerAddress) {
      const validation = enhancedStripeService.validateAddressForTax(customerAddress);
      if (!validation.valid) {
        return res.status(400).json({ 
          error: 'Invalid address for tax calculation',
          details: validation.message,
          missing_fields: validation.missing
        });
      }
    }

    // Get or create Stripe customer
    let { data: userSub } = await supabase
      .from('user_subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    let customerId = userSub?.stripe_customer_id;

    if (!customerId) {
      const { data: user } = await supabase
        .from('auth.users')
        .select('email')
        .eq('id', userId)
        .single();

      const customer = await enhancedStripeService.stripe.customers.create({
        email: user.email,
        address: customerAddress,
        metadata: {
          user_id: userId,
          platform: 'contentflow'
        }
      });

      customerId = customer.id;

      await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          stripe_customer_id: customerId,
          plan: 'free',
          status: 'incomplete'
        });
    } else if (customerAddress) {
      // Update existing customer address
      await enhancedStripeService.updateCustomerAddress(customerId, customerAddress);
    }

    // Create checkout session with automatic tax
    const session = await enhancedStripeService.createCheckoutSessionWithTax({
      priceId,
      customerId,
      successUrl: `${process.env.FRONTEND_URL}/success`,
      cancelUrl: `${process.env.FRONTEND_URL}/pricing`,
      customerAddress,
      metadata: {
        user_id: userId,
        plan_type: planType,
        source: 'contentflow_app',
        tax_enabled: 'true'
      }
    });

    res.json({ 
      sessionId: session.id,
      url: session.url,
      tax_enabled: true
    });
  } catch (error) {
    console.error('Error creating checkout session with tax:', error);
    res.status(500).json({ error: 'Failed to create checkout session with tax' });
  }
});

// Calculate tax preview for pricing display
router.post('/calculate-tax-preview', async (req, res) => {
  try {
    const { amount, currency = 'usd', customerAddress, planType } = req.body;

    if (!amount || !customerAddress) {
      return res.status(400).json({ 
        error: 'Amount and customer address are required for tax calculation' 
      });
    }

    // Validate address
    const validation = enhancedStripeService.validateAddressForTax(customerAddress);
    if (!validation.valid) {
      return res.status(400).json({ 
        error: 'Invalid address for tax calculation',
        details: validation.message 
      });
    }

    // Get tax code for SaaS
    const taxCode = 'txcd_10103001'; // Software as a Service

    const taxCalculation = await enhancedStripeService.calculateTax({
      amount: parseFloat(amount),
      currency,
      customerAddress,
      taxCode
    });

    // Get tax rates for display
    const taxRates = await enhancedStripeService.getTaxRatesForLocation(customerAddress);

    res.json({
      subtotal: amount,
      tax_amount: taxCalculation.tax_amount / 100, // Convert from cents
      total_amount: taxCalculation.total_amount / 100,
      currency: currency.toUpperCase(),
      tax_breakdown: taxCalculation.tax_breakdown,
      tax_rates: taxRates,
      calculation_id: taxCalculation.calculation_id
    });
  } catch (error) {
    console.error('Error calculating tax preview:', error);
    res.status(500).json({ error: 'Failed to calculate tax preview' });
  }
});

// Get subscription with tax details
router.get('/subscription-with-tax', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: userSub } = await supabase
      .from('user_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!userSub || !userSub.stripe_subscription_id) {
      return res.json({ 
        plan: 'free',
        status: 'active',
        usage: { content_pieces_used: 0, monthly_limit: 3 },
        tax_details: { total_tax: 0, tax_breakdown: [] }
      });
    }

    // Get detailed subscription with tax information
    const subscription = await enhancedStripeService.getSubscriptionWithTax(userSub.stripe_subscription_id);

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
      stripe_subscription: subscription,
      usage: {
        content_pieces_used: contentPiecesUsed,
        monthly_limit: monthlyLimit,
        percentage_used: Math.round((contentPiecesUsed / monthlyLimit) * 100)
      },
      billing_cycle_anchor: subscription.current_period_end,
      cancel_at_period_end: subscription.cancel_at_period_end,
      tax_details: subscription.tax_details
    });
  } catch (error) {
    console.error('Error fetching subscription with tax:', error);
    res.status(500).json({ error: 'Failed to fetch subscription details' });
  }
});

// Get tax settings and registrations
router.get('/tax-settings', authMiddleware, async (req, res) => {
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

    const taxSettings = await enhancedStripeService.getTaxSettings();
    res.json(taxSettings);
  } catch (error) {
    console.error('Error fetching tax settings:', error);
    res.status(500).json({ error: 'Failed to fetch tax settings' });
  }
});

// Get tax analytics (admin only)
router.get('/tax-analytics', authMiddleware, async (req, res) => {
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

    const taxAnalytics = await enhancedStripeService.getTaxAnalytics();
    res.json(taxAnalytics);
  } catch (error) {
    console.error('Error fetching tax analytics:', error);
    res.status(500).json({ error: 'Failed to fetch tax analytics' });
  }
});

// Create invoice with tax (admin only)
router.post('/create-invoice-with-tax', authMiddleware, async (req, res) => {
  try {
    const { customerId, items, customerAddress } = req.body;
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

    const invoice = await enhancedStripeService.createInvoiceWithTax({
      customerId,
      items,
      customerAddress
    });

    res.json({ 
      success: true,
      invoice 
    });
  } catch (error) {
    console.error('Error creating invoice with tax:', error);
    res.status(500).json({ error: 'Failed to create invoice with tax' });
  }
});

// Record tax transaction for reporting
router.post('/record-tax-transaction', authMiddleware, async (req, res) => {
  try {
    const { calculationId, reference, reversal = false } = req.body;
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

    const transaction = await enhancedStripeService.recordTaxTransaction({
      calculationId,
      reference,
      reversal
    });

    res.json({ 
      success: true,
      transaction 
    });
  } catch (error) {
    console.error('Error recording tax transaction:', error);
    res.status(500).json({ error: 'Failed to record tax transaction' });
  }
});

// Validate address for tax calculation
router.post('/validate-address', async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const validation = enhancedStripeService.validateAddressForTax(address);
    res.json(validation);
  } catch (error) {
    console.error('Error validating address:', error);
    res.status(500).json({ error: 'Failed to validate address' });
  }
});

// Get tax rates for location
router.post('/tax-rates', async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Address is required' });
    }

    const taxRates = await enhancedStripeService.getTaxRatesForLocation(address);
    res.json({ tax_rates: taxRates });
  } catch (error) {
    console.error('Error getting tax rates:', error);
    res.status(500).json({ error: 'Failed to get tax rates' });
  }
});

// Enhanced webhook endpoint with tax events
router.post('/webhook-with-tax', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['stripe-signature'];
    const payload = req.body;

    const result = await enhancedStripeService.handleWebhookWithTax(payload, signature);
    res.json(result);
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// Setup products with tax codes (admin only)
router.post('/setup-products-with-tax', authMiddleware, async (req, res) => {
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

    const products = await enhancedStripeService.createProducts();
    res.json({ 
      success: true,
      products,
      tax_enabled: true
    });
  } catch (error) {
    console.error('Error setting up products with tax:', error);
    res.status(500).json({ error: 'Failed to setup products with tax' });
  }
});

module.exports = router;
