const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Enhanced Stripe Service for ContentFlow
 * Based on official Stripe subscription integration documentation
 */
class StripeService {
  constructor() {
    this.stripe = stripe;
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  }

  /**
   * Create products and prices for ContentFlow subscription plans
   */
  async createProducts() {
    try {
      // Create Starter Product
      const starterProduct = await this.stripe.products.create({
        name: 'ContentFlow Starter',
        description: 'Perfect for content creators and small teams',
        metadata: {
          plan: 'starter',
          content_pieces: '10',
          platforms: '5'
        }
      });

      // Create Starter Price
      const starterPrice = await this.stripe.prices.create({
        product: starterProduct.id,
        unit_amount: 2900, // $29.00
        currency: 'usd',
        recurring: {
          interval: 'month'
        },
        lookup_key: 'starter_monthly',
        metadata: {
          plan: 'starter'
        }
      });

      // Create Pro Product
      const proProduct = await this.stripe.products.create({
        name: 'ContentFlow Pro',
        description: 'Advanced features for growing businesses',
        metadata: {
          plan: 'pro',
          content_pieces: '30',
          platforms: '15'
        }
      });

      // Create Pro Price
      const proPrice = await this.stripe.prices.create({
        product: proProduct.id,
        unit_amount: 5900, // $59.00
        currency: 'usd',
        recurring: {
          interval: 'month'
        },
        lookup_key: 'pro_monthly',
        metadata: {
          plan: 'pro'
        }
      });

      return {
        starter: {
          product: starterProduct,
          price: starterPrice
        },
        pro: {
          product: proProduct,
          price: proPrice
        }
      };
    } catch (error) {
      console.error('Error creating products:', error);
      throw error;
    }
  }

  /**
   * Create Checkout Session with enhanced features
   */
  async createCheckoutSession({ priceId, customerId, successUrl, cancelUrl, metadata = {} }) {
    try {
      const sessionParams = {
        success_url: successUrl + '?session_id={CHECKOUT_SESSION_ID}',
        cancel_url: cancelUrl,
        mode: 'subscription',
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        subscription_data: {
          billing_mode: { type: 'flexible' },
          metadata: {
            ...metadata,
            platform: 'contentflow',
            created_at: new Date().toISOString()
          }
        },
        // Enhanced features
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        customer_update: {
          address: 'auto',
          name: 'auto'
        },
        tax_id_collection: {
          enabled: true
        },
        // Custom text for subscription terms
        custom_text: {
          submit: {
            message: 'By subscribing, you agree to our Terms of Service and Privacy Policy. You can cancel anytime through your account settings.'
          },
          terms_of_service_acceptance: {
            message: 'I agree to the ContentFlow Terms of Service and Privacy Policy'
          }
        }
      };

      // Add customer if provided
      if (customerId) {
        sessionParams.customer = customerId;
      } else {
        sessionParams.customer_creation = 'always';
      }

      const session = await this.stripe.checkout.sessions.create(sessionParams);
      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  /**
   * Create Customer Portal Session
   */
  async createPortalSession({ customerId, returnUrl }) {
    try {
      const session = await this.stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      return session;
    } catch (error) {
      console.error('Error creating portal session:', error);
      throw error;
    }
  }

  /**
   * Get subscription details with enhanced information
   */
  async getSubscription(subscriptionId) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId, {
        expand: ['default_payment_method', 'customer', 'items.data.price.product']
      });
      return subscription;
    } catch (error) {
      console.error('Error retrieving subscription:', error);
      throw error;
    }
  }

  /**
   * Get customer with subscriptions
   */
  async getCustomer(customerId) {
    try {
      const customer = await this.stripe.customers.retrieve(customerId, {
        expand: ['subscriptions']
      });
      return customer;
    } catch (error) {
      console.error('Error retrieving customer:', error);
      throw error;
    }
  }

  /**
   * Update subscription (upgrade/downgrade)
   */
  async updateSubscription({ subscriptionId, newPriceId, prorationBehavior = 'create_prorations' }) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);
      
      const updatedSubscription = await this.stripe.subscriptions.update(subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: prorationBehavior,
        billing_cycle_anchor: 'unchanged'
      });

      return updatedSubscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId, cancelAtPeriodEnd = true) {
    try {
      const subscription = await this.stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: cancelAtPeriodEnd
      });
      return subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  /**
   * Create usage record for usage-based billing (future feature)
   */
  async createUsageRecord({ subscriptionItemId, quantity, timestamp }) {
    try {
      const usageRecord = await this.stripe.subscriptionItems.createUsageRecord(
        subscriptionItemId,
        {
          quantity,
          timestamp: timestamp || Math.floor(Date.now() / 1000),
          action: 'increment'
        }
      );
      return usageRecord;
    } catch (error) {
      console.error('Error creating usage record:', error);
      throw error;
    }
  }

  /**
   * Handle webhook events
   */
  async handleWebhook(payload, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        this.webhookSecret
      );

      console.log(`Received webhook: ${event.type}`);

      switch (event.type) {
        case 'customer.subscription.created':
          await this.handleSubscriptionCreated(event.data.object);
          break;
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdated(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
          break;
        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;
        case 'checkout.session.completed':
          await this.handleCheckoutCompleted(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };
    } catch (error) {
      console.error('Webhook error:', error);
      throw error;
    }
  }

  /**
   * Webhook handlers
   */
  async handleSubscriptionCreated(subscription) {
    console.log('Subscription created:', subscription.id);
    // Update user subscription status in database
    // Grant access to features
  }

  async handleSubscriptionUpdated(subscription) {
    console.log('Subscription updated:', subscription.id);
    // Update user subscription status in database
    // Adjust feature access
  }

  async handleSubscriptionDeleted(subscription) {
    console.log('Subscription deleted:', subscription.id);
    // Revoke access to features
    // Update user status
  }

  async handlePaymentSucceeded(invoice) {
    console.log('Payment succeeded:', invoice.id);
    // Confirm subscription is active
    // Send confirmation email
  }

  async handlePaymentFailed(invoice) {
    console.log('Payment failed:', invoice.id);
    // Handle failed payment
    // Send notification to customer
  }

  async handleCheckoutCompleted(session) {
    console.log('Checkout completed:', session.id);
    // Provision access to service
    // Send welcome email
  }

  /**
   * Get all prices for display
   */
  async getPrices() {
    try {
      const prices = await this.stripe.prices.list({
        active: true,
        expand: ['data.product']
      });
      return prices.data;
    } catch (error) {
      console.error('Error retrieving prices:', error);
      throw error;
    }
  }

  /**
   * Create coupon for promotions
   */
  async createCoupon({ code, percentOff, duration = 'once', durationInMonths }) {
    try {
      const couponParams = {
        id: code,
        percent_off: percentOff,
        duration: duration
      };

      if (duration === 'repeating' && durationInMonths) {
        couponParams.duration_in_months = durationInMonths;
      }

      const coupon = await this.stripe.coupons.create(couponParams);
      return coupon;
    } catch (error) {
      console.error('Error creating coupon:', error);
      throw error;
    }
  }

  /**
   * Get subscription analytics
   */
  async getSubscriptionAnalytics() {
    try {
      const subscriptions = await this.stripe.subscriptions.list({
        status: 'active',
        limit: 100
      });

      const analytics = {
        totalActiveSubscriptions: subscriptions.data.length,
        monthlyRecurringRevenue: 0,
        planDistribution: {},
        recentSubscriptions: subscriptions.data.slice(0, 10)
      };

      subscriptions.data.forEach(sub => {
        const amount = sub.items.data[0].price.unit_amount / 100;
        analytics.monthlyRecurringRevenue += amount;
        
        const planName = sub.items.data[0].price.lookup_key || 'unknown';
        analytics.planDistribution[planName] = (analytics.planDistribution[planName] || 0) + 1;
      });

      return analytics;
    } catch (error) {
      console.error('Error getting analytics:', error);
      throw error;
    }
  }
}

module.exports = new StripeService();
