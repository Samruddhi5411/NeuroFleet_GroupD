import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const roleConfig = {
    admin: { title: 'Admin Portal', icon: '🧠', color: 'purple' },
    manager: { title: 'Manager Portal', icon: '🧩', color: 'blue' },
    driver: { title: 'Driver Portal', icon: '🚗', color: 'teal' },
    customer: { title: 'Customer Portal', icon: '👤', color: 'green' },
  };

  const config = roleConfig[role] || roleConfig.customer;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(formData.username, formData.password);
      const { token, role: userRole, username, fullName } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('username', username);
      localStorage.setItem('fullName', fullName);

      navigate(`/${userRole.toLowerCase()}/dashboard`);
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-xl p-8">
          <div className="text-center mb-8">
            <div className={`text-6xl mb-4 bg-gradient-to-br from-${config.color}-600 to-${config.color}-800 rounded-full w-20 h-20 flex items-center justify-center mx-auto`}>
              <span>{config.icon}</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">{config.title}</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Username
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <button
              type="submit"
              className={`w-full bg-gradient-to-r from-${config.color}-600 to-${config.color}-800 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transition duration-300 ease-in-out`}
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
            >
              ← Back to Welcome Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
