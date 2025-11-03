import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/api';
import Logo from '../components/Logo';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'CUSTOMER',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const roles = [
    { value: 'CUSTOMER', label: 'Customer', icon: '👤', color: 'from-green-500 to-green-700' },
    { value: 'DRIVER', label: 'Driver', icon: '🚗', color: 'from-cyan-500 to-cyan-700' },
    { value: 'MANAGER', label: 'Manager', icon: '🧩', color: 'from-blue-500 to-blue-700' },
    { value: 'ADMIN', label: 'Admin', icon: '🧠', color: 'from-purple-500 to-purple-700' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // First signup the user
      await authService.signup(formData);
      setSuccess(true);
      
      // Then automatically login with the same credentials
      try {
        const loginResponse = await authService.login(formData.username, formData.password);
        const { token, role: userRole, username, fullName } = loginResponse.data;
        
        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('role', userRole);
        localStorage.setItem('username', username);
        localStorage.setItem('fullName', fullName);
        
        // Redirect to appropriate dashboard based on role
        setTimeout(() => {
          navigate(`/${userRole.toLowerCase()}/dashboard`);
        }, 1500);
      } catch (loginErr) {
        // If auto-login fails, redirect to login page
        setTimeout(() => {
          navigate(`/login/${formData.role.toLowerCase()}`);
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{backgroundColor: '#0A0F0D'}}>
      <div className="max-w-md w-full">
        <div className="backdrop-blur-xl rounded-2xl p-8" style={{backgroundColor: 'rgba(18, 33, 27, 0.8)', border: '2px solid rgba(16, 185, 129, 0.3)', boxShadow: '0 8px 32px 0 rgba(0, 255, 156, 0.1)'}}>
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Logo size="medium" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2" style={{color: '#FFFFFF'}}>Create Account</h2>
            <p style={{color: '#E0E0E0'}}>Join NeuroFleetX Platform</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="px-4 py-3 rounded-lg mb-6" style={{backgroundColor: 'rgba(255, 82, 82, 0.15)', border: '1px solid #FF5252', color: '#FF5252'}}>
              {error}
            </div>
          )}

          {success && (
            <div className="px-4 py-3 rounded-lg mb-6" style={{backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10B981', color: '#00FF9C'}}>
              Registration successful! Redirecting to your dashboard...
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#E0E0E0'}}>
                Full Name
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#E0E0E0'}}>
                Username
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Choose a username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#E0E0E0'}}>
                Email
              </label>
              <input
                type="email"
                className="input-field"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#E0E0E0'}}>
                Phone (Optional)
              </label>
              <input
                type="tel"
                className="input-field"
                placeholder="Your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#E0E0E0'}}>
                Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2" style={{color: '#E0E0E0'}}>
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, role: role.value })}
                    className={`p-3 rounded-lg border-2 transition duration-300`}
                    style={formData.role === role.value
                      ? {background: 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)', color: '#FFFFFF', borderColor: '#00FF9C', boxShadow: '0 0 20px rgba(0, 255, 156, 0.3)'}
                      : {backgroundColor: 'rgba(18, 33, 27, 0.6)', borderColor: 'rgba(16, 185, 129, 0.3)', color: '#E0E0E0'}
                    }
                  >
                    <div className="text-2xl mb-1">{role.icon}</div>
                    <div className="text-sm font-semibold">{role.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-lg font-semibold text-lg transition duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{background: 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)', color: '#FFFFFF', boxShadow: '0 0 30px rgba(0, 255, 156, 0.4)'}}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <button
              onClick={() => navigate('/portals')}
              className="text-sm transition duration-300"
              style={{color: '#E0E0E0'}}
              onMouseEnter={(e) => e.currentTarget.style.color = '#00FF9C'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#E0E0E0'}
            >
              ← Back to Portals
            </button>
            <div>
              <button
                onClick={() => navigate(`/login/${formData.role.toLowerCase()}`)}
                className="text-sm font-semibold transition duration-300"
                style={{color: '#00FF9C'}}
                onMouseEnter={(e) => e.currentTarget.style.color = '#10B981'}
                onMouseLeave={(e) => e.currentTarget.style.color = '#00FF9C'}
              >
                Already have an account? Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
