import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: 'fa-robot',
      title: 'AI-Powered Optimization',
      description: 'Advanced algorithms analyze your content and generate data-driven suggestions'
    },
    {
      icon: 'fa-chart-line',
      title: 'Performance Analytics',
      description: 'Track views, engagement, and growth with comprehensive analytics'
    },
    {
      icon: 'fa-magic',
      title: 'Smart Suggestions',
      description: 'Get intelligent title, description, and tag recommendations'
    },
    {
      icon: 'fa-bolt',
      title: 'Instant Results',
      description: 'Receive optimizations in seconds with our lightning-fast AI engine'
    },
    {
      icon: 'fa-history',
      title: 'Optimization History',
      description: 'Access all your previous optimizations and track improvements'
    },
    {
      icon: 'fa-shield-alt',
      title: 'Secure & Private',
      description: 'Your data is encrypted and protected with enterprise-grade security'
    }
  ];

  const steps = [
    {
      number: 1,
      title: 'Connect Your Channel',
      description: 'Link your YouTube channel securely in seconds'
    },
    {
      number: 2,
      title: 'Input Video URL',
      description: 'Paste the URL of the video you want to optimize'
    },
    {
      number: 3,
      title: 'Get AI Suggestions',
      description: 'Our AI analyzes and generates optimized suggestions'
    },
    {
      number: 4,
      title: 'Apply & Track',
      description: 'Implement changes and monitor performance improvements'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#4F46E5] to-[#7C3AED] text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fadeIn">
              Optimize Your YouTube Content with AI
            </h1>
            <p className="text-xl mb-8 text-gray-100 animate-slideUp">
              Boost visibility, engagement, and growth with intelligent suggestions powered by advanced AI technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slideUp">
              <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn bg-white text-[#4F46E5] hover:bg-gray-100 px-8 py-3 text-lg rounded-xl inline-block">
                <i className="fas fa-rocket mr-2"></i>
                {isAuthenticated ? 'Go to Dashboard' : 'Start Free Trial'}
              </Link>
              <Link to="/pricing" className="btn bg-transparent border-2 border-white text-white hover:bg-white hover:text-[#4F46E5] px-8 py-3 text-lg">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600">Everything you need to optimize your YouTube content</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card group hover:border-[#4F46E5] border border-transparent">
                <div className="w-12 h-12 bg-[#4F46E5] rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i className={`fas ${feature.icon} text-white text-xl`}></i>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Get started in 4 simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative flex flex-col">
                <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow h-full min-h-[180px] flex flex-col">
                  <div className="w-12 h-12 bg-[#4F46E5] rounded-full flex items-center justify-center mb-4 text-white font-bold text-xl shrink-0">
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 flex-1">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#4F46E5] text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-4">Ready to Boost Your YouTube Success?</h2>
          <p className="text-xl mb-8">Join thousands of creators optimizing their content with AI</p>
          <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn bg-white text-[#4F46E5] hover:bg-gray-100 px-8 py-3 text-lg inline-block">
            {isAuthenticated ? 'Go to Dashboard' : 'Start Your Free Trial'}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;
