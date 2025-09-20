# ContentFlow - Enhanced Stripe Integration

## Overview

ContentFlow now includes a comprehensive Stripe subscription integration based on official Stripe documentation. This implementation provides enterprise-grade billing, subscription management, and promotional capabilities.

## Features Implemented

### 🔧 Core Stripe Features
- **Subscription Management** - Create, update, cancel subscriptions
- **Customer Portal** - Self-service billing management
- **Webhook Handling** - Real-time subscription events
- **Promotional Codes** - Discount and coupon system
- **Usage Tracking** - Monitor content generation limits
- **Analytics Dashboard** - Revenue and subscription metrics

### 💳 Enhanced Checkout Experience
- **Flexible Billing Mode** - Enhanced subscription behavior
- **Custom Terms** - Subscription and cancellation terms
- **Tax Collection** - Automatic tax ID collection
- **Address Collection** - Required billing address
- **Promotion Codes** - Built-in discount support

### 📊 Admin Features
- **Revenue Analytics** - Monthly recurring revenue tracking
- **Subscription Distribution** - Plan usage statistics
- **Customer Management** - User subscription overview
- **Promotional Campaigns** - Create and manage discounts

## API Endpoints

### Public Endpoints
```
GET  /api/enhanced-payments/plans           # Get available pricing plans
POST /api/enhanced-payments/webhook         # Stripe webhook handler
```

### Authenticated Endpoints
```
POST /api/enhanced-payments/create-checkout-session    # Start subscription
POST /api/enhanced-payments/create-portal-session     # Billing portal
GET  /api/enhanced-payments/subscription               # Current subscription
POST /api/enhanced-payments/update-subscription       # Upgrade/downgrade
POST /api/enhanced-payments/cancel-subscription       # Cancel subscription
```

### Admin Endpoints
```
GET  /api/enhanced-payments/analytics       # Subscription analytics
POST /api/enhanced-payments/create-coupon   # Create promotional codes
POST /api/enhanced-payments/setup-products  # Initialize Stripe products
```

## Setup Instructions

### 1. Stripe Account Configuration

#### Create Products and Prices
```bash
# Using Stripe CLI (recommended)
stripe products create --name="ContentFlow Starter" --description="Perfect for content creators"
stripe prices create --product=prod_xxx --unit-amount=2900 --currency=usd --recurring-interval=month --lookup-key=starter_monthly

stripe products create --name="ContentFlow Pro" --description="Advanced features for businesses"
stripe prices create --product=prod_xxx --unit-amount=5900 --currency=usd --recurring-interval=month --lookup-key=pro_monthly
```

#### Or use the API endpoint (admin only)
```bash
POST /api/enhanced-payments/setup-products
Authorization: Bearer <admin_token>
```

### 2. Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Frontend URL for redirects
FRONTEND_URL=https://your-domain.vercel.app
```

### 3. Webhook Configuration

#### Set up webhooks in Stripe Dashboard:
1. Go to Stripe Dashboard → Webhooks
2. Add endpoint: `https://your-api-domain.vercel.app/api/enhanced-payments/webhook`
3. Select events:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `checkout.session.completed`

#### For local development:
```bash
stripe listen --forward-to localhost:3001/api/enhanced-payments/webhook
```

### 4. Database Schema

The integration uses existing Supabase tables:
- `user_subscriptions` - User subscription data
- `content_submissions` - Usage tracking
- `promotions` - Admin promotional campaigns

## Usage Examples

### Frontend Integration

```jsx
import EnhancedCheckout from './components/EnhancedCheckout';

function PricingPage() {
  return (
    <EnhancedCheckout 
      user={currentUser}
      onSuccess={() => {
        // Handle successful subscription
        window.location.href = '/dashboard';
      }}
    />
  );
}
```

### Creating Promotional Campaigns

```javascript
// Admin only - create 50% off coupon
const response = await fetch('/api/enhanced-payments/create-coupon', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    code: 'LAUNCH50',
    percentOff: 50,
    duration: 'once'
  })
});
```

### Subscription Management

```javascript
// Get current subscription
const subscription = await fetch('/api/enhanced-payments/subscription', {
  headers: { 'Authorization': `Bearer ${userToken}` }
});

// Cancel subscription
await fetch('/api/enhanced-payments/cancel-subscription', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${userToken}` },
  body: JSON.stringify({ cancelAtPeriodEnd: true })
});
```

## Revenue Analytics

### Admin Dashboard Metrics
- **Monthly Recurring Revenue (MRR)**
- **Active Subscriptions Count**
- **Plan Distribution (Starter vs Pro)**
- **Recent Subscription Activity**
- **Customer Lifetime Value**

### Usage Tracking
- **Content Pieces Generated**
- **Monthly Usage Limits**
- **Usage Percentage by Plan**
- **Overage Notifications**

## Security Features

### Data Protection
- **Row Level Security** - Database access control
- **Webhook Signature Verification** - Secure event handling
- **Customer Data Isolation** - User-specific data access
- **PCI Compliance** - Stripe handles payment data

### Admin Access Control
- **Email-based Admin Authentication**
- **Admin-only Endpoints** - Analytics and coupon creation
- **Audit Logging** - Track administrative actions

## Testing

### Test Cards (Stripe Test Mode)
```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0000 0000 3220
```

### Webhook Testing
```bash
# Test webhook locally
stripe trigger customer.subscription.created
```

### Integration Testing
1. **Subscription Flow** - Complete checkout process
2. **Portal Access** - Billing management
3. **Plan Changes** - Upgrade/downgrade
4. **Cancellation** - Subscription termination
5. **Usage Limits** - Content generation tracking

## Deployment Checklist

### Production Setup
- [ ] Switch to live Stripe keys
- [ ] Configure production webhooks
- [ ] Set up monitoring and alerts
- [ ] Test payment flows end-to-end
- [ ] Configure tax settings
- [ ] Set up customer support workflows

### Monitoring
- [ ] Stripe Dashboard alerts
- [ ] Failed payment notifications
- [ ] Subscription churn tracking
- [ ] Revenue goal monitoring

## Troubleshooting

### Common Issues

#### Webhook Failures
- Verify webhook secret in environment variables
- Check endpoint URL accessibility
- Review Stripe Dashboard webhook logs

#### Payment Failures
- Check customer payment method
- Verify billing address requirements
- Review Stripe Dashboard payment logs

#### Subscription Issues
- Confirm product and price IDs
- Check subscription status in Stripe
- Verify database synchronization

### Support Resources
- **Stripe Documentation**: https://docs.stripe.com/billing/subscriptions
- **Stripe Support**: Available in Dashboard
- **ContentFlow Admin**: Access analytics at `/admin`

## Future Enhancements

### Planned Features
- **Usage-based Billing** - Pay per content piece
- **Annual Subscriptions** - Discounted yearly plans
- **Team Management** - Multi-user subscriptions
- **Custom Pricing** - Enterprise negotiations
- **Dunning Management** - Failed payment recovery

### Integration Opportunities
- **Zapier Integration** - Workflow automation
- **Slack Notifications** - Team alerts
- **Email Marketing** - Customer lifecycle
- **Analytics Platforms** - Advanced reporting

---

**ContentFlow's enhanced Stripe integration provides enterprise-grade subscription management with comprehensive analytics, promotional capabilities, and seamless user experience. Ready for production deployment and scaling to $10B+ platform status!**
