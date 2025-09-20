const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

/**
 * Enhanced Stripe Service with Automatic Tax Integration
 * Based on official Stripe Tax API and subscription documentation
 */
class EnhancedStripeService {
  constructor() {
    this.stripe = stripe;
    this.webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  }

  /**
   * Create Checkout Session with automatic tax calculation
   */
  async createCheckoutSessionWithTax({ priceId, customerId, successUrl, cancelUrl, customerAddress, metadata = {} }) {
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
        // Enhanced features with automatic tax
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        customer_update: {
          address: 'auto',
          name: 'auto'
        },
        tax_id_collection: {
          enabled: true
        },
        // AUTOMATIC TAX CALCULATION
        automatic_tax: {
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

      // Add customer address for tax calculation if provided
      if (customerAddress) {
        sessionParams.customer_details = {
          address: customerAddress,
          address_source: 'billing'
        };
      }

      const session = await this.stripe.checkout.sessions.create(sessionParams);
      return session;
    } catch (error) {
      console.error('Error creating checkout session with tax:', error);
      throw error;
    }
  }

  /**
   * Calculate tax for preview/estimation
   */
  async calculateTax({ amount, currency = 'usd', customerAddress, taxCode = null }) {
    try {
      const calculationParams = {
        currency: currency.toLowerCase(),
        line_items: [{
          amount: Math.round(amount * 100), // Convert to cents
          reference: 'preview',
          tax_code: taxCode || undefined
        }],
        customer_details: {
          address: customerAddress,
          address_source: 'billing'
        }
      };

      const calculation = await this.stripe.tax.calculations.create(calculationParams);
      
      return {
        tax_amount: calculation.tax_amount_exclusive,
        total_amount: calculation.amount_total,
        tax_breakdown: calculation.tax_breakdown,
        calculation_id: calculation.id
      };
    } catch (error) {
      console.error('Error calculating tax:', error);
      throw error;
    }
  }

  /**
   * Create subscription with automatic tax
   */
  async createSubscriptionWithTax({ customerId, priceId, customerAddress, paymentMethodId }) {
    try {
      const subscriptionParams = {
        customer: customerId,
        items: [{
          price: priceId,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: { 
          save_default_payment_method: 'on_subscription' 
        },
        billing_mode: { type: 'flexible' },
        // AUTOMATIC TAX
        automatic_tax: {
          enabled: true
        },
        expand: ['latest_invoice.payment_intent']
      };

      // Add default payment method if provided
      if (paymentMethodId) {
        subscriptionParams.default_payment_method = paymentMethodId;
      }

      const subscription = await this.stripe.subscriptions.create(subscriptionParams);
      return subscription;
    } catch (error) {
      console.error('Error creating subscription with tax:', error);
      throw error;
    }
  }

  /**
   * Update customer address for tax calculation
   */
  async updateCustomerAddress(customerId, address) {
    try {
      const customer = await this.stripe.customers.update(customerId, {
        address: address,
        shipping: {
          address: address,
          name: 'Default'
        }
      });
      return customer;
    } catch (error) {
      console.error('Error updating customer address:', error);
      throw error;
    }
  }

  /**
   * Get tax rates for a location (for display purposes)
   */
  async getTaxRatesForLocation(address) {
    try {
      // Create a small calculation to get tax rates
      const calculation = await this.calculateTax({
        amount: 1, // $1 for rate calculation
        customerAddress: address
      });

      const taxRates = calculation.tax_breakdown.map(breakdown => ({
        jurisdiction: breakdown.jurisdiction,
        rate: breakdown.tax_rate_details?.percentage_decimal || 0,
        type: breakdown.tax_rate_details?.tax_type || 'unknown'
      }));

      return taxRates;
    } catch (error) {
      console.error('Error getting tax rates:', error);
      return [];
    }
  }

  /**
   * Create invoice with automatic tax
   */
  async createInvoiceWithTax({ customerId, items, customerAddress }) {
    try {
      // Create invoice
      const invoice = await this.stripe.invoices.create({
        customer: customerId,
        automatic_tax: {
          enabled: true
        },
        collection_method: 'send_invoice',
        days_until_due: 30
      });

      // Add line items
      for (const item of items) {
        await this.stripe.invoiceItems.create({
          customer: customerId,
          invoice: invoice.id,
          amount: Math.round(item.amount * 100),
          currency: item.currency || 'usd',
          description: item.description,
          tax_code: item.tax_code || undefined
        });
      }

      // Finalize invoice to calculate tax
      const finalizedInvoice = await this.stripe.invoices.finalizeInvoice(invoice.id);
      return finalizedInvoice;
    } catch (error) {
      console.error('Error creating invoice with tax:', error);
      throw error;
    }
  }

  /**
   * Record tax transaction for reporting
   */
  async recordTaxTransaction({ calculationId, reference, reversal = false }) {
    try {
      const transaction = await this.stripe.tax.transactions.createFromCalculation({
        calculation: calculationId,
        reference: reference,
        reversal: reversal
      });
      return transaction;
    } catch (error) {
      console.error('Error recording tax transaction:', error);
      throw error;
    }
  }

  /**
   * Get tax settings and registrations
   */
  async getTaxSettings() {
    try {
      const settings = await this.stripe.tax.settings.retrieve();
      return {
        status: settings.status,
        registrations: settings.defaults?.tax_behavior || 'exclusive'
      };
    } catch (error) {
      console.error('Error getting tax settings:', error);
      return { status: 'inactive', registrations: 'exclusive' };
    }
  }

  /**
   * Validate address for tax calculation
   */
  validateAddressForTax(address) {
    const required = {
      US: ['line1', 'city', 'state', 'postal_code', 'country'],
      CA: ['postal_code', 'country'], // or province
      default: ['country']
    };

    const countryRequirements = required[address.country] || required.default;
    const missing = countryRequirements.filter(field => !address[field]);

    return {
      valid: missing.length === 0,
      missing: missing,
      message: missing.length > 0 ? `Missing required fields: ${missing.join(', ')}` : 'Valid'
    };
  }

  /**
   * Get comprehensive subscription with tax details
   */
  async getSubscriptionWithTax(subscriptionId) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId, {
        expand: [
          'default_payment_method', 
          'customer', 
          'items.data.price.product',
          'latest_invoice',
          'latest_invoice.tax_amounts'
        ]
      });

      // Get tax breakdown from latest invoice
      const taxDetails = subscription.latest_invoice?.tax_amounts || [];
      const totalTax = taxDetails.reduce((sum, tax) => sum + tax.amount, 0);

      return {
        ...subscription,
        tax_details: {
          total_tax: totalTax,
          tax_breakdown: taxDetails,
          tax_inclusive: subscription.latest_invoice?.tax_amounts?.length > 0
        }
      };
    } catch (error) {
      console.error('Error retrieving subscription with tax:', error);
      throw error;
    }
  }

  /**
   * Enhanced webhook handling with tax events
   */
  async handleWebhookWithTax(payload, signature) {
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
        // Tax-specific events
        case 'tax.settings.updated':
          await this.handleTaxSettingsUpdated(event.data.object);
          break;
        case 'invoice.finalized':
          await this.handleInvoiceFinalized(event.data.object);
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
   * Tax-specific webhook handlers
   */
  async handleTaxSettingsUpdated(settings) {
    console.log('Tax settings updated:', settings.status);
    // Update application tax configuration
  }

  async handleInvoiceFinalized(invoice) {
    console.log('Invoice finalized with tax:', invoice.id);
    // Record tax transaction for reporting
    if (invoice.tax_amounts && invoice.tax_amounts.length > 0) {
      // Process tax amounts for reporting
    }
  }

  /**
   * Get tax analytics for admin dashboard
   */
  async getTaxAnalytics() {
    try {
      // Get recent invoices with tax
      const invoices = await this.stripe.invoices.list({
        limit: 100,
        expand: ['data.tax_amounts']
      });

      let totalTaxCollected = 0;
      const taxByJurisdiction = {};
      const taxByMonth = {};

      invoices.data.forEach(invoice => {
        if (invoice.tax_amounts) {
          invoice.tax_amounts.forEach(tax => {
            totalTaxCollected += tax.amount;
            
            // Group by jurisdiction
            const jurisdiction = tax.tax_rate?.jurisdiction || 'Unknown';
            taxByJurisdiction[jurisdiction] = (taxByJurisdiction[jurisdiction] || 0) + tax.amount;
            
            // Group by month
            const month = new Date(invoice.created * 1000).toISOString().substring(0, 7);
            taxByMonth[month] = (taxByMonth[month] || 0) + tax.amount;
          });
        }
      });

      return {
        total_tax_collected: totalTaxCollected / 100, // Convert from cents
        tax_by_jurisdiction: Object.entries(taxByJurisdiction).map(([jurisdiction, amount]) => ({
          jurisdiction,
          amount: amount / 100
        })),
        tax_by_month: Object.entries(taxByMonth).map(([month, amount]) => ({
          month,
          amount: amount / 100
        })),
        invoice_count: invoices.data.length
      };
    } catch (error) {
      console.error('Error getting tax analytics:', error);
      return {
        total_tax_collected: 0,
        tax_by_jurisdiction: [],
        tax_by_month: [],
        invoice_count: 0
      };
    }
  }

  // Inherit all other methods from the base StripeService
  async createProducts() {
    // Same as base implementation but with tax codes
    try {
      const starterProduct = await this.stripe.products.create({
        name: 'ContentFlow Starter',
        description: 'Perfect for content creators and small teams',
        tax_code: 'txcd_10103001', // Software as a Service
        metadata: {
          plan: 'starter',
          content_pieces: '10',
          platforms: '5'
        }
      });

      const starterPrice = await this.stripe.prices.create({
        product: starterProduct.id,
        unit_amount: 2900,
        currency: 'usd',
        recurring: { interval: 'month' },
        lookup_key: 'starter_monthly',
        tax_behavior: 'exclusive', // Tax will be added on top
        metadata: { plan: 'starter' }
      });

      const proProduct = await this.stripe.products.create({
        name: 'ContentFlow Pro',
        description: 'Advanced features for growing businesses',
        tax_code: 'txcd_10103001', // Software as a Service
        metadata: {
          plan: 'pro',
          content_pieces: '30',
          platforms: '15'
        }
      });

      const proPrice = await this.stripe.prices.create({
        product: proProduct.id,
        unit_amount: 5900,
        currency: 'usd',
        recurring: { interval: 'month' },
        lookup_key: 'pro_monthly',
        tax_behavior: 'exclusive', // Tax will be added on top
        metadata: { plan: 'pro' }
      });

      return {
        starter: { product: starterProduct, price: starterPrice },
        pro: { product: proProduct, price: proPrice }
      };
    } catch (error) {
      console.error('Error creating products with tax codes:', error);
      throw error;
    }
  }
}

module.exports = new EnhancedStripeService();
