import React from 'react';
import { useNavigate } from 'react-router-dom';

const DemoPage = () => {
  const navigate = useNavigate();

  const setupDemoUser = (role, name) => {
    localStorage.setItem('token', 'demo-token');
    localStorage.setItem('role', role);
    localStorage.setItem('username', `demo_${role.toLowerCase()}`);
    localStorage.setItem('fullName', name);
    navigate(`/${role.toLowerCase()}/dashboard`);
  };

  const roles = [
    {
      title: 'Admin Dashboard',
      icon: '🧠',
      description: 'View full system control, KPIs, analytics',
      color: 'from-purple-600 to-purple-800',
      role: 'ADMIN',
      name: 'Demo Admin',
    },
    {
      title: 'Manager Dashboard',
      icon: '🧩',
      description: 'View fleet operations & maintenance',
      color: 'from-blue-600 to-blue-800',
      role: 'MANAGER',
      name: 'Demo Manager',
    },
    {
      title: 'Driver Dashboard',
      icon: '🚗',
      description: 'View trips and route management',
      color: 'from-teal-600 to-teal-800',
      role: 'DRIVER',
      name: 'Demo Driver',
    },
    {
      title: 'Customer Dashboard',
      icon: '👤',
      description: 'View vehicle booking interface',
      color: 'from-green-600 to-green-800',
      role: 'CUSTOMER',
      name: 'Demo Customer',
    },
  ];

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="max-w-7xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4">
            NeuroFleetX Demo Mode
          </h1>
          <p className="text-xl text-white opacity-90 mb-4">
            Explore All Dashboard Features
          </p>
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg inline-block">
            ⚠️ Demo Mode: Backend is not connected. Showing UI with sample data.
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {roles.map((role, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg p-6 card-hover cursor-pointer transform transition duration-300 ease-in-out"
              onClick={() => setupDemoUser(role.role, role.name)}
            >
              <div className={`text-6xl mb-4 text-center bg-gradient-to-br ${role.color} rounded-full w-20 h-20 flex items-center justify-center mx-auto`}>
                <span>{role.icon}</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">
                {role.title}
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {role.description}
              </p>
              <button
                className={`w-full bg-gradient-to-r ${role.color} text-white py-2 px-4 rounded-lg font-semibold transition duration-300 ease-in-out hover:shadow-lg`}
              >
                View Dashboard
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/')}
            className="text-white text-lg font-semibold underline hover:text-gray-200 transition duration-300"
          >
            ← Back to Welcome Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
