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
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-gray-400 mb-8">Select the perfect plan for your needs</p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/5 rounded-xl p-1 border border-white/10 backdrop-blur-md">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${billingCycle === 'monthly'
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-6 py-2 rounded-lg transition-all duration-300 ${billingCycle === 'annual'
                  ? 'bg-primary text-white shadow-lg shadow-primary/25'
                  : 'text-gray-400 hover:text-white'
                }`}
            >
              Annual
              <span className="ml-2 text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30">
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
              className={`rounded-2xl overflow-hidden transition-all duration-300 relative group ${plan.highlighted
                  ? 'glass-card border-primary shadow-[0_0_30px_rgba(59,130,246,0.2)] scale-105 z-10'
                  : 'glass-card hover:border-white/20 hover:bg-white/10'
                }`}
            >
              {plan.highlighted && (
                <div className="bg-primary text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 mb-6">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-5xl font-bold text-white">
                    ${billingCycle === 'monthly' ? plan.price.monthly : Math.floor(plan.price.annual / 12)}
                  </span>
                  <span className="text-gray-400 ml-2">/month</span>
                  {billingCycle === 'annual' && plan.price.annual > 0 && (
                    <p className="text-sm text-primary mt-2 font-medium">
                      ${plan.price.annual} billed annually
                    </p>
                  )}
                </div>
                <Link
                  to={plan.name === 'Free' ? '/register' : '/register'}
                  className={`block w-full text-center py-3 border rounded-xl font-medium transition-all duration-300 ${plan.highlighted
                      ? 'bg-primary text-white border-primary hover:bg-blue-600 shadow-lg shadow-primary/25'
                      : 'bg-white/5 text-white border-white/10 hover:bg-white/10 hover:border-white/20'
                    }`}
                >
                  {plan.name === 'Free' ? 'Get Started' : 'Start Free Trial'}
                </Link>
                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className={`mt-1 mr-3 p-1 rounded-full ${plan.highlighted ? 'bg-primary/20' : 'bg-white/10'}`}>
                        <i className={`fas fa-check text-xs ${plan.highlighted ? 'text-primary' : 'text-gray-400'}`}></i>
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-center text-white mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-2 text-lg">Can I change plans later?</h3>
              <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time from your settings.</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-2 text-lg">Do you offer refunds?</h3>
              <p className="text-gray-400">We offer a 30-day money-back guarantee for all paid plans.</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-2 text-lg">What payment methods do you accept?</h3>
              <p className="text-gray-400">We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.</p>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-semibold text-white mb-2 text-lg">Is there a free trial?</h3>
              <p className="text-gray-400">Yes, all paid plans include a 14-day free trial with no credit card required.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
