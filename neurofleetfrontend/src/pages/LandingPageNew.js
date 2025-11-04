import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const LandingPageNew = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: (
        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      title: 'AI-Powered Intelligence',
      description: 'Advanced machine learning algorithms optimize routes and predict maintenance needs in real-time.',
    },
    {
      icon: (
        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Real-Time GPS Tracking',
      description: 'Monitor your entire fleet with precise location tracking and live status updates.',
    },
    {
      icon: (
        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: 'Predictive Maintenance',
      description: 'AI predicts vehicle issues before they occur, reducing downtime and repair costs.',
    },
    {
      icon: (
        <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      title: 'Advanced Analytics',
      description: 'Comprehensive dashboards with actionable insights for data-driven decision making.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-dark-900 bg-opacity-90 backdrop-blur-md border-b border-blue-900/30 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <Logo size="medium" />
          <button
            onClick={() => navigate('/portals')}
            className="px-8 py-3 bg-gradient-primary rounded-xl font-bold text-base hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105 tracking-wide"
          >
            Launch Portal
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-28 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center animate-fade-in">
            <div className="mb-12 flex justify-center">
              <Logo size="large" />
            </div>

            <h1 className="text-7xl md:text-8xl font-extrabold mb-8 leading-tight tracking-tight">
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                Next-Gen Fleet
              </span>
              <span className="block text-white mt-2">Management Platform</span>
            </h1>

            <p className="text-2xl md:text-3xl text-gray-300 mb-14 max-w-4xl mx-auto leading-relaxed font-light">
              Revolutionize your urban fleet operations with <span className="text-blue-400 font-semibold">AI-powered automation</span>,
              real-time intelligence, and predictive analytics.
            </p>

            <div className="flex gap-6 justify-center items-center">
              <button
                onClick={() => navigate('/portals')}
                className="px-12 py-5 bg-gradient-primary rounded-xl font-bold text-xl hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105 shadow-glow"
              >
                Access Portal →
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="px-12 py-5 bg-dark-700 border-2 border-blue-500/30 rounded-xl font-bold text-xl hover:bg-dark-600 hover:border-blue-500 transition-all duration-300"
              >
                Get Started Free
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-28 px-8 bg-gradient-to-b from-dark-800 to-dark-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to manage your fleet efficiently in one intelligent platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-gradient-card backdrop-blur-sm rounded-2xl border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-card-hover"
              >
                <div className="text-blue-400 mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-base">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-28 px-8 bg-dark-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {[
              { value: '99.9%', label: 'System Uptime', color: 'text-blue-400' },
              { value: '500+', label: 'Active Fleets', color: 'text-purple-400' },
              { value: '50K+', label: 'Vehicles Tracked', color: 'text-teal-400' },
              { value: '24/7', label: 'Live Support', color: 'text-green-400' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-8 bg-gradient-card rounded-2xl border border-blue-500/10">
                <div className={`text-6xl font-extrabold ${stat.color} mb-4`}>
                  {stat.value}
                </div>
                <div className="text-gray-400 text-lg font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-8 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border-y border-blue-500/20">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-8 leading-tight">
            Ready to Transform Your Fleet Operations?
          </h2>
          <p className="text-2xl text-gray-300 mb-12 leading-relaxed">
            Join hundreds of companies optimizing their fleet with NeuroFleetX AI
          </p>
          <button
            onClick={() => navigate('/portals')}
            className="px-16 py-6 bg-gradient-primary rounded-xl font-bold text-2xl hover:shadow-glow-lg transition-all duration-300 transform hover:scale-105 shadow-glow"
          >
            Start Now →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-8 bg-dark-900 border-t border-blue-900/20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-500 text-base">© 2025 NeuroFleetX. All rights reserved. Powered by AI.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPageNew;