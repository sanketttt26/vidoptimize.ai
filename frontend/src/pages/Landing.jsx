import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Glow Effects */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl -z-10"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-block mb-4 px-4 py-1.5 rounded-full glass-panel border-primary/30 text-primary text-sm font-medium animate-fadeIn">
              ✨ AI-Powered YouTube Optimization
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-slideUp">
              Boost Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">YouTube Growth</span> with AI
            </h1>
            <p className="text-xl text-gray-400 mb-10 animate-slideUp" style={{ animationDelay: '0.1s' }}>
              Generate viral titles, optimized descriptions, and high-ranking tags in seconds.
              Let AI handle the SEO while you focus on creating.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-slideUp" style={{ animationDelay: '0.2s' }}>
              <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn btn-primary text-lg px-8 py-4 shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all duration-300">
                Start Optimizing Free <i className="fas fa-arrow-right ml-2"></i>
              </Link>
              <Link to="/pricing" className="glass-button text-lg px-8 py-4">
                View Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Go Viral</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Our AI analyzes millions of successful videos to give you the best recommendations for your content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: "fa-magic",
                title: "Smart Title Generator",
                desc: "Get click-worthy titles that drive views and increase CTR.",
                color: "text-primary"
              },
              {
                icon: "fa-align-left",
                title: "SEO Descriptions",
                desc: "Generate keyword-rich descriptions that help you rank higher.",
                color: "text-accent"
              },
              {
                icon: "fa-tags",
                title: "Intelligent Tagging",
                desc: "Find the perfect tags to target the right audience.",
                color: "text-teal-400"
              }
            ].map((feature, index) => (
              <div key={index} className="glass-card p-8 group">
                <div className={`w-14 h-14 rounded-2xl glass-panel flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border-${feature.color.split('-')[1]}/30`}>
                  <i className={`fas ${feature.icon} ${feature.color} text-2xl`}></i>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary/5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="glass-panel rounded-3xl p-12 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
              <div className="p-4">
                <div className="text-4xl font-bold text-white mb-2">1M+</div>
                <div className="text-primary font-medium">Videos Optimized</div>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold text-white mb-2">50k+</div>
                <div className="text-primary font-medium">Happy Creators</div>
              </div>
              <div className="p-4">
                <div className="text-4xl font-bold text-white mb-2">300%</div>
                <div className="text-primary font-medium">Avg. View Increase</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-panel rounded-3xl p-12 relative overflow-hidden group hover:border-primary/30 transition-colors duration-500">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 relative z-10">Ready to Grow Your Channel?</h2>
            <p className="text-xl text-gray-400 mb-8 relative z-10">
              Join thousands of creators who are already using VidOptimize AI to dominate their niche.
            </p>
            <Link to={isAuthenticated ? '/dashboard' : '/register'} className="btn btn-primary text-lg px-10 py-4 shadow-xl shadow-primary/25 hover:shadow-primary/50 relative z-10 inline-block transform hover:-translate-y-1 transition-all duration-300">
              Get Started Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;
