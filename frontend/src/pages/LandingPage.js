import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Analytics',
      description: 'Smart fleet management with predictive insights',
    },
    {
      icon: '📍',
      title: 'Real-Time Tracking',
      description: 'Monitor your fleet location and status instantly',
    },
    {
      icon: '🔧',
      title: 'Predictive Maintenance',
      description: 'Prevent breakdowns before they happen',
    },
    {
      icon: '📊',
      title: 'Advanced Analytics',
      description: 'Data-driven decisions for optimal performance',
    },
  ];

  return (
    <div className="min-h-screen" style={{backgroundColor: '#0A0F0D'}}>
      {/* Navigation */}
      <nav className="fixed top-0 w-full backdrop-blur-lg z-50" style={{backgroundColor: 'rgba(6, 78, 59, 0.9)', borderBottom: '1px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 4px 6px rgba(0, 255, 156, 0.1)'}}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo size="medium" />
          <button
            onClick={() => navigate('/portals')}
            className="px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition duration-300 transform hover:scale-105"
            style={{background: 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)', color: '#FFFFFF', boxShadow: '0 0 20px rgba(0, 255, 156, 0.3)'}}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 animate-fade-in">
            <Logo size="large" className="justify-center mb-8" />
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight" style={{color: '#FFFFFF'}}>
            <span style={{background: 'linear-gradient(135deg, #00FF9C 0%, #10B981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              AI-Powered Urban Fleet
            </span>
            <br />
            <span style={{color: '#FFFFFF'}}>Management System</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto" style={{color: '#E0E0E0'}}>
            Transform your fleet operations with intelligent automation, real-time tracking, 
            and predictive analytics for maximum efficiency.
          </p>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate('/portals')}
              className="px-8 py-4 rounded-lg font-semibold text-lg transition duration-300 transform hover:scale-105"
              style={{background: 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)', color: '#FFFFFF', boxShadow: '0 0 30px rgba(0, 255, 156, 0.4)'}}
            >
              Access Portal
            </button>
            <button
              className="px-8 py-4 rounded-lg font-semibold text-lg transition duration-300"
              style={{backgroundColor: 'rgba(18, 33, 27, 0.6)', border: '2px solid #10B981', color: '#FFFFFF'}}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6" style={{backgroundColor: '#12211B'}}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16" style={{color: '#FFFFFF'}}>
            <span style={{background: 'linear-gradient(135deg, #00FF9C 0%, #10B981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
              Powerful Features
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 backdrop-blur-lg rounded-xl transition duration-300 transform hover:-translate-y-2"
                style={{backgroundColor: 'rgba(18, 33, 27, 0.8)', border: '2px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 4px 6px rgba(0, 255, 156, 0.1)'}}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#00FF9C';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(0, 255, 156, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                  e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 255, 156, 0.1)';
                }}
              >
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2" style={{color: '#FFFFFF'}}>{feature.title}</h3>
                <p style={{color: '#E0E0E0'}}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '99.9%', label: 'Uptime' },
              { value: '500+', label: 'Active Fleets' },
              { value: '50K+', label: 'Vehicles Tracked' },
              { value: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <div key={index} className="p-6">
                <div className="text-5xl font-bold mb-2" style={{background: 'linear-gradient(135deg, #00FF9C 0%, #10B981 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}}>
                  {stat.value}
                </div>
                <div className="text-lg" style={{color: '#E0E0E0'}}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6" style={{backgroundColor: '#12211B'}}>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6" style={{color: '#FFFFFF'}}>Ready to Transform Your Fleet?</h2>
          <p className="text-xl mb-8" style={{color: '#E0E0E0'}}>
            Join hundreds of companies optimizing their fleet operations with NeuroFleetX
          </p>
          <button
            onClick={() => navigate('/portals')}
            className="px-12 py-4 rounded-lg font-semibold text-lg transition duration-300 transform hover:scale-105"
            style={{background: 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)', color: '#FFFFFF', boxShadow: '0 0 30px rgba(0, 255, 156, 0.4)'}}
          >
            Get Started Today
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6" style={{backgroundColor: '#064E3B', borderTop: '1px solid rgba(16, 185, 129, 0.3)'}}>
        <div className="max-w-7xl mx-auto text-center" style={{color: '#E0E0E0'}}>
          <p>&copy; 2025 NeuroFleetX. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
