import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState('monthly');

  const plans = [
    {
      name: 'Free',
      price: { monthly: 0, annual: 0 },
      description: 'Perfect for getting started',
      features: [
        '10 optimizations per month',
        'Basic AI suggestions',
        'Performance tracking',
        'Email support',
        'Limited history access'
      ],
      highlighted: false
    },
    {
      name: 'Pro',
      price: { monthly: 29, annual: 290 },
      description: 'For serious content creators',
      features: [
        '100 optimizations per month',
        'Advanced AI suggestions',
        'Full performance analytics',
        'Priority support',
        'Unlimited history access',
        'Custom tags suggestions',
        'A/B testing tools'
      ],
      highlighted: true
    },
    {
      name: 'Enterprise',
      price: { monthly: 99, annual: 990 },
      description: 'For teams and agencies',
      features: [
        'Unlimited optimizations',
        'Premium AI suggestions',
        'Advanced analytics & reporting',
        '24/7 dedicated support',
        'Team collaboration tools',
        'API access',
        'White-label options',
        'Custom integrations'
      ],
      highlighted: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-600 mb-8">Select the perfect plan for your needs</p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-lg p-1 shadow-md">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === 'monthly'
                  ? 'bg-[#4F46E5] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-md transition-colors ${
                billingCycle === 'annual'
                  ? 'bg-[#4F46E5] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`rounded-lg shadow-lg overflow-hidden ${
                plan.highlighted
                  ? 'ring-4 ring-[#4F46E5] transform scale-105'
                  : 'bg-white'
              }`}
            >
              {plan.highlighted && (
                <div className="bg-[#4F46E5] text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    ${billingCycle === 'monthly' ? plan.price.monthly : Math.floor(plan.price.annual / 12)}
                  </span>
                  <span className="text-gray-600 ml-2">/month</span>
                  {billingCycle === 'annual' && plan.price.annual > 0 && (
                    <p className="text-sm text-gray-600 mt-2">
                      ${plan.price.annual} billed annually
                    </p>
                  )}
                </div>
                <Link
                  to={plan.name === 'Free' ? '/register' : '/register'}
                  className={`block w-full text-center py-3 border rounded-lg font-medium transition-colors ${
                    plan.highlighted
                      ? 'bg-[#4F46E5] text-white hover:bg-[#4338CA]'
                      : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.name === 'Free' ? 'Get Started' : 'Start Free Trial'}
                </Link>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <i className="fas fa-check text-green-500 mt-1 mr-3"></i>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I change plans later?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time from your settings.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Do you offer refunds?</h3>
              <p className="text-gray-600">We offer a 30-day money-back guarantee for all paid plans.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">Yes, all paid plans include a 14-day free trial with no credit card required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
