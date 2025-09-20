import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Loader2, Check, Star, Shield, Calculator, MapPin, DollarSign } from 'lucide-react';

/**
 * Tax-Enabled Checkout Component
 * Implements automatic tax calculation and collection
 */
const TaxEnabledCheckout = ({ user, onSuccess }) => {
  const [plans] = useState([
    {
      id: 'starter',
      name: 'Starter',
      price: 29,
      priceId: 'price_starter_monthly',
      description: 'Perfect for content creators and small teams',
      features: [
        '10 AI-powered content pieces per month',
        '5 platform formats',
        'Basic brand voice training',
        'Standard support',
        'API access'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: 59,
      priceId: 'price_pro_monthly',
      description: 'Advanced features for growing businesses',
      features: [
        '30 AI-powered content pieces per month',
        '15+ platform formats',
        'Advanced brand voice AI',
        'Priority support',
        'Team collaboration',
        'Custom integrations',
        'Analytics dashboard'
      ],
      popular: true
    }
  ]);

  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [error, setError] = useState('');
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [taxCalculation, setTaxCalculation] = useState(null);
  const [calculatingTax, setCalculatingTax] = useState(false);

  // Address form state
  const [address, setAddress] = useState({
    line1: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'US'
  });

  const [addressValid, setAddressValid] = useState(false);

  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  useEffect(() => {
    // Validate address and calculate tax when address changes
    if (address.line1 && address.city && address.postal_code && address.country) {
      validateAndCalculateTax();
    } else {
      setTaxCalculation(null);
      setAddressValid(false);
    }
  }, [address, selectedPlan]);

  const fetchCurrentSubscription = async () => {
    try {
      const response = await fetch('/api/tax-enabled-payments/subscription-with-tax', {
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

  const validateAndCalculateTax = async () => {
    if (!selectedPlan) return;

    setCalculatingTax(true);
    try {
      // Validate address first
      const validationResponse = await fetch('/api/tax-enabled-payments/validate-address', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ address })
      });

      const validation = await validationResponse.json();
      setAddressValid(validation.valid);

      if (!validation.valid) {
        setError(`Address validation failed: ${validation.message}`);
        setTaxCalculation(null);
        return;
      }

      // Calculate tax
      const taxResponse = await fetch('/api/tax-enabled-payments/calculate-tax-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: selectedPlan.price,
          currency: 'usd',
          customerAddress: address,
          planType: selectedPlan.id
        })
      });

      const taxData = await taxResponse.json();
      
      if (taxData.error) {
        setError(taxData.error);
        setTaxCalculation(null);
      } else {
        setTaxCalculation(taxData);
        setError('');
      }
    } catch (error) {
      console.error('Error calculating tax:', error);
      setError('Failed to calculate tax. Please try again.');
      setTaxCalculation(null);
    } finally {
      setCalculatingTax(false);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setShowAddressForm(true);
    setError('');
  };

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCheckout = async () => {
    if (!selectedPlan || !addressValid) {
      setError('Please select a plan and provide a valid address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/tax-enabled-payments/create-checkout-session-with-tax', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.access_token}`
        },
        body: JSON.stringify({
          priceId: selectedPlan.priceId,
          planType: selectedPlan.id,
          customerAddress: address
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
    }
  };

  const formatPrice = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const isCurrentPlan = (planId) => {
    return currentSubscription?.plan === planId;
  };

  if (error && !showAddressForm) {
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
        <p className=\"text-xl text-gray-400 max-w-3xl mx-auto mb-4\">
          Transform your content strategy with AI-powered orchestration. 
          All plans include enterprise-grade security, 99.9% uptime, and our revolutionary AI technology.
        </p>
        <div className=\"flex items-center justify-center space-x-2 text-green-400\">
          <Calculator className=\"w-5 h-5\" />
          <span className=\"text-sm font-medium\">Automatic tax calculation included</span>
        </div>
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
              {currentSubscription.tax_details && currentSubscription.tax_details.total_tax > 0 && (
                <p className=\"text-sm text-gray-500\">
                  Tax collected: {formatPrice(currentSubscription.tax_details.total_tax / 100)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {!showAddressForm ? (
        /* Pricing Plans */
        <div className=\"grid md:grid-cols-2 gap-8 mb-12\">
          {plans.map((plan) => (
            <Card key={plan.id} className={`relative border-gray-700 bg-gray-900/50 backdrop-blur-sm cursor-pointer transition-all hover:border-blue-500/50 ${plan.popular ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-blue-900/20' : ''}`}>
              {plan.popular && (
                <div className=\"absolute -top-3 left-1/2 transform -translate-x-1/2\">
                  <Badge className=\"bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1\">
                    <Star className=\"w-3 h-3 mr-1\" />
                    MOST POPULAR
                  </Badge>
                </div>
              )}
              <CardHeader className={plan.popular ? 'pt-8' : ''}>
                <div className=\"flex items-center justify-between\">
                  <CardTitle className=\"text-2xl font-bold text-white\">{plan.name}</CardTitle>
                  {isCurrentPlan(plan.id) && (
                    <Badge className=\"bg-blue-500 text-white\">Current Plan</Badge>
                  )}
                </div>
                <CardDescription className=\"text-gray-400\">
                  {plan.description}
                </CardDescription>
                <div className=\"mt-4\">
                  <span className={`text-4xl font-bold ${plan.popular ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent' : 'text-blue-400'}`}>
                    {formatPrice(plan.price)}
                  </span>
                  <span className=\"text-gray-400\">/month</span>
                  <p className=\"text-xs text-gray-500 mt-1\">+ applicable taxes</p>
                </div>
              </CardHeader>
              <CardContent>
                <div className=\"space-y-3 mb-6\">
                  {plan.features.map((feature, index) => (
                    <div key={index} className=\"flex items-center space-x-3\">
                      <Check className={`w-4 h-4 ${plan.popular ? 'text-purple-400' : 'text-blue-400'}`} />
                      <span className=\"text-gray-300\">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button 
                  className={`w-full ${plan.popular ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'}`}
                  onClick={() => handlePlanSelect(plan)}
                  disabled={isCurrentPlan(plan.id)}
                >
                  {isCurrentPlan(plan.id) ? 'Current Plan' : 'Select Plan'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        /* Address Form and Tax Calculation */
        <div className=\"max-w-2xl mx-auto\">
          <Card className=\"border-gray-700 bg-gray-900/50 backdrop-blur-sm\">
            <CardHeader>
              <CardTitle className=\"text-2xl font-bold text-white flex items-center\">
                <MapPin className=\"w-6 h-6 mr-2 text-blue-400\" />
                Billing Address
              </CardTitle>
              <CardDescription className=\"text-gray-400\">
                We need your billing address to calculate accurate taxes for your {selectedPlan?.name} plan.
              </CardDescription>
            </CardHeader>
            <CardContent className=\"space-y-4\">
              {error && (
                <Alert className=\"border-red-500/50 bg-red-900/20\">
                  <AlertDescription className=\"text-red-400\">{error}</AlertDescription>
                </Alert>
              )}

              <div className=\"grid grid-cols-1 gap-4\">
                <div>
                  <Label htmlFor=\"line1\" className=\"text-white\">Address Line 1</Label>
                  <Input
                    id=\"line1\"
                    value={address.line1}
                    onChange={(e) => handleAddressChange('line1', e.target.value)}
                    placeholder=\"123 Main Street\"
                    className=\"bg-gray-800 border-gray-600 text-white\"
                  />
                </div>

                <div className=\"grid grid-cols-2 gap-4\">
                  <div>
                    <Label htmlFor=\"city\" className=\"text-white\">City</Label>
                    <Input
                      id=\"city\"
                      value={address.city}
                      onChange={(e) => handleAddressChange('city', e.target.value)}
                      placeholder=\"New York\"
                      className=\"bg-gray-800 border-gray-600 text-white\"
                    />
                  </div>
                  <div>
                    <Label htmlFor=\"postal_code\" className=\"text-white\">Postal Code</Label>
                    <Input
                      id=\"postal_code\"
                      value={address.postal_code}
                      onChange={(e) => handleAddressChange('postal_code', e.target.value)}
                      placeholder=\"10001\"
                      className=\"bg-gray-800 border-gray-600 text-white\"
                    />
                  </div>
                </div>

                <div className=\"grid grid-cols-2 gap-4\">
                  <div>
                    <Label htmlFor=\"state\" className=\"text-white\">State/Province</Label>
                    <Input
                      id=\"state\"
                      value={address.state}
                      onChange={(e) => handleAddressChange('state', e.target.value)}
                      placeholder=\"NY\"
                      className=\"bg-gray-800 border-gray-600 text-white\"
                    />
                  </div>
                  <div>
                    <Label htmlFor=\"country\" className=\"text-white\">Country</Label>
                    <Select value={address.country} onValueChange={(value) => handleAddressChange('country', value)}>
                      <SelectTrigger className=\"bg-gray-800 border-gray-600 text-white\">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=\"US\">United States</SelectItem>
                        <SelectItem value=\"CA\">Canada</SelectItem>
                        <SelectItem value=\"GB\">United Kingdom</SelectItem>
                        <SelectItem value=\"DE\">Germany</SelectItem>
                        <SelectItem value=\"FR\">France</SelectItem>
                        <SelectItem value=\"AU\">Australia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Tax Calculation Display */}
              {calculatingTax && (
                <div className=\"flex items-center justify-center p-4 bg-blue-900/20 rounded-lg\">
                  <Loader2 className=\"w-5 h-5 animate-spin mr-2 text-blue-400\" />
                  <span className=\"text-blue-400\">Calculating taxes...</span>
                </div>
              )}

              {taxCalculation && addressValid && (
                <div className=\"p-4 bg-green-900/20 border border-green-500/30 rounded-lg\">
                  <div className=\"flex items-center mb-3\">
                    <DollarSign className=\"w-5 h-5 mr-2 text-green-400\" />
                    <h3 className=\"text-lg font-semibold text-green-400\">Tax Calculation</h3>
                  </div>
                  <div className=\"space-y-2 text-sm\">
                    <div className=\"flex justify-between\">
                      <span className=\"text-gray-400\">Subtotal:</span>
                      <span className=\"text-white\">{formatPrice(taxCalculation.subtotal)}</span>
                    </div>
                    <div className=\"flex justify-between\">
                      <span className=\"text-gray-400\">Tax:</span>
                      <span className=\"text-white\">{formatPrice(taxCalculation.tax_amount)}</span>
                    </div>
                    <div className=\"border-t border-gray-600 pt-2 flex justify-between font-semibold\">
                      <span className=\"text-white\">Total:</span>
                      <span className=\"text-green-400\">{formatPrice(taxCalculation.total_amount)}</span>
                    </div>
                  </div>
                  {taxCalculation.tax_rates && taxCalculation.tax_rates.length > 0 && (
                    <div className=\"mt-3 pt-3 border-t border-gray-600\">
                      <p className=\"text-xs text-gray-500 mb-2\">Tax breakdown:</p>
                      {taxCalculation.tax_rates.map((rate, index) => (
                        <div key={index} className=\"text-xs text-gray-400 flex justify-between\">
                          <span>{rate.jurisdiction} ({rate.type}):</span>
                          <span>{(rate.rate * 100).toFixed(2)}%</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              <div className=\"flex space-x-3 pt-4\">
                <Button
                  variant=\"outline\"
                  onClick={() => {
                    setShowAddressForm(false);
                    setSelectedPlan(null);
                    setTaxCalculation(null);
                    setError('');
                  }}
                  className=\"flex-1\"
                >
                  Back to Plans
                </Button>
                <Button
                  onClick={handleCheckout}
                  disabled={loading || !addressValid || !taxCalculation}
                  className=\"flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700\"
                >
                  {loading ? (
                    <Loader2 className=\"w-4 h-4 animate-spin mr-2\" />
                  ) : null}
                  {taxCalculation ? `Pay ${formatPrice(taxCalculation.total_amount)}` : 'Continue to Payment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trust Indicators */}
      <div className=\"grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 mt-12\">
        <div className=\"text-center p-6 bg-gray-900/30 rounded-lg border border-gray-700\">
          <Shield className=\"w-8 h-8 text-green-400 mx-auto mb-3\" />
          <h3 className=\"font-semibold text-white mb-2\">Secure Tax Calculation</h3>
          <p className=\"text-gray-400 text-sm\">Automatic tax compliance worldwide</p>
        </div>
        <div className=\"text-center p-6 bg-gray-900/30 rounded-lg border border-gray-700\">
          <Calculator className=\"w-8 h-8 text-blue-400 mx-auto mb-3\" />
          <h3 className=\"font-semibold text-white mb-2\">Real-time Tax Rates</h3>
          <p className=\"text-gray-400 text-sm\">Always up-to-date tax calculations</p>
        </div>
        <div className=\"text-center p-6 bg-gray-900/30 rounded-lg border border-gray-700\">
          <DollarSign className=\"w-8 h-8 text-purple-400 mx-auto mb-3\" />
          <h3 className=\"font-semibent text-white mb-2\">Transparent Pricing</h3>
          <p className=\"text-gray-400 text-sm\">No hidden fees, tax included upfront</p>
        </div>
      </div>
    </div>
  );
};

export default TaxEnabledCheckout;
