import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-green-950 to-emerald-900 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 2px 2px, rgba(16, 185, 129, 0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>

      {/* Navigation Bar */}
      <nav className="relative z-10 bg-transparent backdrop-blur-none border-b border-transparent">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center gap-3">
              <Logo size="sm" animate={false} showText={false} />
              <span className="text-emerald-100 text-2xl font-bold tracking-wide">NeuroFleetX</span>
            </div>
            
            {/* Get Started Button */}
            <button
              onClick={() => navigate('/portal-selection')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-2.5 rounded-lg transition-all duration-300 shadow-lg hover:shadow-emerald-400/50 transform hover:-translate-y-0.5"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex items-center min-h-[80vh] px-6 py-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Logo */}
            <div className="flex justify-center md:justify-start">
              <div className="transform hover:scale-105 transition-transform duration-500">
                <Logo size="xl" animate={true} showText={true} />
              </div>
            </div>

            {/* Right side - Content */}
            <div className="space-y-8 text-center md:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="text-emerald-300">Welcome to</span>
                <br />
                <span className="text-emerald-100">NeuroFleetX</span>
              </h1>

              <p className="text-lg md:text-xl text-emerald-100/90 max-w-2xl leading-relaxed">
                <span className="text-emerald-300 font-semibold">Step into the future of urban mobility.</span> NeuroFleetX empowers cities, fleet managers, and businesses to move smarter — combining artificial intelligence, geospatial intelligence, and real-time analytics to drive seamless, efficient, and sustainable transportation.
              </p>

              <p className="text-base md:text-lg text-emerald-200/70 max-w-2xl leading-relaxed italic">
                Experience a new era of connected intelligence where every route is optimized, every fleet is predictive, and every journey redefines innovation.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start pt-4">
                <button
                  onClick={() => navigate('/portal-selection')}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-10 py-4 rounded-lg text-lg transition-all duration-300 shadow-xl hover:shadow-emerald-400/50 transform hover:-translate-y-1"
                >
                  Access Portal
                </button>
                <button
                  onClick={() => navigate('/portal-selection')}
                  className="border-2 border-emerald-400 text-emerald-300 hover:bg-emerald-600/20 font-bold px-10 py-4 rounded-lg text-lg transition-all duration-300"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative bg-gradient-to-b from-transparent to-emerald-950/80 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-emerald-300">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: 'Real-Time Analytics',
                description: 'Monitor fleet performance with live data and insights'
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
                title: 'Smart Routing',
                description: 'AI-powered route optimization for fuel efficiency'
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: 'Predictive Maintenance',
                description: 'Prevent breakdowns with ML-based predictions'
              },
              {
                icon: (
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Cost Optimization',
                description: 'Reduce operational costs with intelligent automation'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-emerald-900/60 to-green-900/60 backdrop-blur-sm border border-emerald-500/40 rounded-2xl p-8 hover:border-emerald-400/60 hover:shadow-xl hover:shadow-emerald-400/30 transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="text-emerald-300 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-emerald-100 mb-3">{feature.title}</h3>
                <p className="text-emerald-200/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default WelcomePage;
