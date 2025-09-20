import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Check, Star, Shield, Zap, Users, BarChart3, Globe } from 'lucide-react';

/**
 * Enhanced Checkout Component
 * Based on official Stripe subscription integration documentation
 */
const EnhancedCheckout = ({ user, onSuccess }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlans();
    fetchCurrentSubscription();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/enhanced-payments/plans');
      const data = await response.json();
      setPlans(data.plans || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
      setError('Failed to load pricing plans');
    }
  };

  const fetchCurrentSubscription = async () => {
    try {
      const response = await fetch('/api/enhanced-payments/subscription', {
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });
      const data = await response.json();
      setCurrentSubscription(data);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleCheckout = async (priceId, planType) => {
    setLoading(true);
    setError('');
    setSelectedPlan(planType);

    try {
      const response = await fetch('/api/enhanced-payments/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          priceId,
          planType
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      setError(error.message || 'Failed to start checkout process');
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/enhanced-payments/create-portal-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.access_token}`
        }
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error opening billing portal:', error);
      setError('Failed to open billing portal');
      setLoading(false);
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  const getPlanFeatures = (planType) => {
    const features = {
      starter: [
        { icon: <Zap className=\"w-4 h-4\" />, text: '10 AI-powered content pieces per month' },
        { icon: <Globe className=\"w-4 h-4\" />, text: '5 platform formats' },
        { icon: <Shield className=\"w-4 h-4\" />, text: 'Basic brand voice training' },
        { icon: <Users className=\"w-4 h-4\" />, text: 'Standard support' },
        { icon: <BarChart3 className=\"w-4 h-4\" />, text: 'API access' }
      ],
      pro: [
        { icon: <Zap className=\"w-4 h-4\" />, text: '30 AI-powered content pieces per month' },
        { icon: <Globe className=\"w-4 h-4\" />, text: '15+ platform formats' },
        { icon: <Shield className=\"w-4 h-4\" />, text: 'Advanced brand voice AI' },
        { icon: <Users className=\"w-4 h-4\" />, text: 'Priority support' },
        { icon: <Users className=\"w-4 h-4\" />, text: 'Team collaboration' },
        { icon: <BarChart3 className=\"w-4 h-4\" />, text: 'Custom integrations' },
        { icon: <BarChart3 className=\"w-4 h-4\" />, text: 'Analytics dashboard' }
      ]
    };
    return features[planType] || [];
  };

  const isCurrentPlan = (planType) => {
    return currentSubscription?.plan === planType;
  };

  const canUpgrade = (planType) => {
    if (!currentSubscription || currentSubscription.plan === 'free') return true;
    if (currentSubscription.plan === 'starter' && planType === 'pro') return true;
    return false;
  };

  if (error) {
    return (
      <Alert className=\"mb-6\">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className=\"max-w-6xl mx-auto p-6\">
      {/* Header */}
      <div className=\"text-center mb-12\">
        <h1 className=\"text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent\">
          Choose Your ContentFlow Plan
        </h1>
        <p className=\"text-xl text-gray-400 max-w-3xl mx-auto\">
          Transform your content strategy with AI-powered orchestration. 
          All plans include enterprise-grade security, 99.9% uptime, and our revolutionary AI technology.
        </p>
      </div>

      {/* Current Subscription Status */}
      {currentSubscription && currentSubscription.plan !== 'free' && (
        <div className=\"mb-8 p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg\">
          <div className=\"flex items-center justify-between\">
            <div>
              <h3 className=\"text-lg font-semibold text-blue-400\">Current Plan: {currentSubscription.plan.toUpperCase()}</h3>
              <p className=\"text-gray-400\">
                Usage: {currentSubscription.usage?.content_pieces_used || 0} / {currentSubscription.usage?.monthly_limit || 0} content pieces this month
              </p>
            </div>
            <Button 
              onClick={handleManageBilling}
              variant=\"outline\"
              disabled={loading}
            >
              {loading ? <Loader2 className=\"w-4 h-4 animate-spin mr-2\" /> : null}
              Manage Billing
            </Button>
          </div>
        </div>
      )}

      {/* Pricing Plans */}
      <div className=\"grid md:grid-cols-2 gap-8 mb-12\">
        {/* Starter Plan */}
        <Card className=\"relative border-gray-700 bg-gray-900/50 backdrop-blur-sm\">
          <CardHeader>
            <div className=\"flex items-center justify-between\">
              <CardTitle className=\"text-2xl font-bold text-white\">Starter</CardTitle>
              {isCurrentPlan('starter') && (
                <Badge className=\"bg-blue-500 text-white\">Current Plan</Badge>
              )}
            </div>
            <CardDescription className=\"text-gray-400\">
              Perfect for content creators and small teams
            </CardDescription>
            <div className=\"mt-4\">
              <span className=\"text-4xl font-bold text-blue-400\">$29</span>
              <span className=\"text-gray-400\">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-3 mb-6\">
              {getPlanFeatures('starter').map((feature, index) => (
                <div key={index} className=\"flex items-center space-x-3\">
                  <div className=\"text-blue-400\">{feature.icon}</div>
                  <span className=\"text-gray-300\">{feature.text}</span>
                </div>
              ))}
            </div>
            <Button 
              className=\"w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700\"
              onClick={() => handleCheckout('price_starter_monthly', 'starter')}
              disabled={loading || isCurrentPlan('starter') || !canUpgrade('starter')}
            >
              {loading && selectedPlan === 'starter' ? (
                <Loader2 className=\"w-4 h-4 animate-spin mr-2\" />
              ) : null}
              {isCurrentPlan('starter') ? 'Current Plan' : 'Start Free Trial'}
            </Button>
          </CardContent>
        </Card>

        {/* Pro Plan */}
        <Card className=\"relative border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-blue-900/20 backdrop-blur-sm\">
          <div className=\"absolute -top-3 left-1/2 transform -translate-x-1/2\">
            <Badge className=\"bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1\">
              <Star className=\"w-3 h-3 mr-1\" />
              MOST POPULAR
            </Badge>
          </div>
          <CardHeader className=\"pt-8\">
            <div className=\"flex items-center justify-between\">
              <CardTitle className=\"text-2xl font-bold text-white\">Pro</CardTitle>
              {isCurrentPlan('pro') && (
                <Badge className=\"bg-purple-500 text-white\">Current Plan</Badge>
              )}
            </div>
            <CardDescription className=\"text-gray-400\">
              Advanced features for growing businesses
            </CardDescription>
            <div className=\"mt-4\">
              <span className=\"text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent\">
                $59
              </span>
              <span className=\"text-gray-400\">/month</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className=\"space-y-3 mb-6\">
              {getPlanFeatures('pro').map((feature, index) => (
                <div key={index} className=\"flex items-center space-x-3\">
                  <div className=\"text-purple-400\">{feature.icon}</div>
                  <span className=\"text-gray-300\">{feature.text}</span>
                </div>
              ))}
            </div>
            <Button 
              className=\"w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600\"
              onClick={() => handleCheckout('price_pro_monthly', 'pro')}
              disabled={loading || isCurrentPlan('pro')}
            >
              {loading && selectedPlan === 'pro' ? (
                <Loader2 className=\"w-4 h-4 animate-spin mr-2\" />
              ) : null}
              {isCurrentPlan('pro') ? 'Current Plan' : canUpgrade('pro') ? 'Upgrade to Pro' : 'Start Free Trial'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Trust Indicators */}
      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6 mb-12\">
        <div className=\"text-center p-6 bg-gray-900/30 rounded-lg border border-gray-700\">
          <Shield className=\"w-8 h-8 text-green-400 mx-auto mb-3\" />
          <h3 className=\"font-semibold text-white mb-2\">SOC 2 Certified</h3>
          <p className=\"text-gray-400 text-sm\">Enterprise-grade security standards</p>
        </div>
        <div className=\"text-center p-6 bg-gray-900/30 rounded-lg border border-gray-700\">
          <BarChart3 className=\"w-8 h-8 text-blue-400 mx-auto mb-3\" />
          <h3 className=\"font-semibold text-white mb-2\">99.9% Uptime</h3>
          <p className=\"text-gray-400 text-sm\">Guaranteed service availability</p>
        </div>
        <div className=\"text-center p-6 bg-gray-900/30 rounded-lg border border-gray-700\">
          <Users className=\"w-8 h-8 text-purple-400 mx-auto mb-3\" />
          <h3 className=\"font-semibent text-white mb-2\">24/7 Support</h3>
          <p className=\"text-gray-400 text-sm\">Expert help when you need it</p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className=\"text-center\">
        <h2 className=\"text-2xl font-bold text-white mb-4\">Frequently Asked Questions</h2>
        <div className=\"grid md:grid-cols-2 gap-6 text-left\">
          <div className=\"p-4 bg-gray-900/30 rounded-lg border border-gray-700\">
            <h3 className=\"font-semibold text-white mb-2\">Can I cancel anytime?</h3>
            <p className=\"text-gray-400 text-sm\">
              Yes, you can cancel your subscription at any time through your account settings or billing portal. 
              Your access continues until the end of your billing period.
            </p>
          </div>
          <div className=\"p-4 bg-gray-900/30 rounded-lg border border-gray-700\">
            <h3 className=\"font-semibold text-white mb-2\">What happens to my data?</h3>
            <p className=\"text-gray-400 text-sm\">
              Your content and generated materials remain accessible even after cancellation. 
              We provide data export options for all your content.
            </p>
          </div>
          <div className=\"p-4 bg-gray-900/30 rounded-lg border border-gray-700\">
            <h3 className=\"font-semibold text-white mb-2\">Do you offer refunds?</h3>
            <p className=\"text-gray-400 text-sm\">
              We offer a 30-day money-back guarantee for new subscriptions. 
              Contact support if you're not satisfied with your experience.
            </p>
          </div>
          <div className=\"p-4 bg-gray-900/30 rounded-lg border border-gray-700\">
            <h3 className=\"font-semibold text-white mb-2\">Can I upgrade or downgrade?</h3>
            <p className=\"text-gray-400 text-sm\">
              Yes, you can change your plan at any time. Upgrades take effect immediately, 
              and downgrades take effect at your next billing cycle.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCheckout;
