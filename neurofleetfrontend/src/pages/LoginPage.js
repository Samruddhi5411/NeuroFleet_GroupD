// import React, { useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { authService } from '../services/api';
// import Logo from '../components/Logo';
// import { DashboardIcon, VehicleIcon, RouteIcon, UserIcon } from '../components/Icons';

// const LoginPage = () => {
//   const navigate = useNavigate();
//   const { role } = useParams();
//   const [formData, setFormData] = useState({ username: '', password: '' });
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);

//   const roleConfig = {
//     admin: {
//       title: 'Admin Portal',
//       icon: DashboardIcon,
//       gradient: 'from-accent-purple via-accent-pink to-accent-purple',
//       glow: 'shadow-neon-purple'
//     },
//     manager: {
//       title: 'Manager Portal',
//       icon: VehicleIcon,
//       gradient: 'from-accent-cyan via-accent-blue to-accent-cyan',
//       glow: 'shadow-neon-cyan'
//     },
//     driver: {
//       title: 'Driver Portal',
//       icon: RouteIcon,
//       gradient: 'from-accent-blue via-accent-purple to-accent-blue',
//       glow: 'shadow-neon-blue'
//     },
//     customer: {
//       title: 'Customer Portal',
//       icon: UserIcon,
//       gradient: 'from-accent-green via-accent-cyan to-accent-green',
//       glow: 'shadow-neon-cyan'
//     },
//   };

//   const config = roleConfig[role] || roleConfig.customer;
//   const IconComponent = config.icon;

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const response = await authService.login(formData.username, formData.password);
//       const { token, role: userRole, username, fullName } = response.data;

//       localStorage.setItem('token', token);
//       localStorage.setItem('role', userRole);
//       localStorage.setItem('username', username);
//       localStorage.setItem('fullName', fullName);

//       navigate(`/${userRole.toLowerCase()}/dashboard`);
//     } catch (err) {
//       setError('Invalid username or password. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0A0F0D' }}>

//       <div className="relative min-h-screen flex items-center justify-center p-6">
//         <div className="max-w-md w-full animate-fade-in-up">
//           <div className="glass-card p-8">
//             <div className="flex justify-center mb-8">
//               <Logo size="md" animate={false} showText={true} />
//             </div>

//             <div className="text-center mb-8">
//               <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(18, 33, 27, 0.6)', border: '2px solid rgba(16, 185, 129, 0.4)' }}>
//                 <IconComponent size="lg" style={{ color: '#00FF9C' }} />
//               </div>
//               <h2 className="text-2xl font-bold mb-2" style={{ color: '#FFFFFF' }}>{config.title}</h2>
//               <p className="text-sm" style={{ color: '#E0E0E0' }}>Sign in to your account</p>
//             </div>

//             {error && (
//               <div className="px-4 py-3 rounded-xl mb-6 animate-fade-in" style={{ backgroundColor: 'rgba(255, 82, 82, 0.15)', border: '1px solid #FF5252', color: '#FF5252' }}>
//                 {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit} className="space-y-6">
//               <div>
//                 <label className="block text-sm font-semibold mb-2" style={{ color: '#E0E0E0' }}>
//                   Username
//                 </label>
//                 <input
//                   type="text"
//                   className="input-field"
//                   placeholder="Enter your username"
//                   value={formData.username}
//                   onChange={(e) => setFormData({ ...formData, username: e.target.value })}
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold mb-2" style={{ color: '#E0E0E0' }}>
//                   Password
//                 </label>
//                 <input
//                   type="password"
//                   className="input-field"
//                   placeholder="Enter your password"
//                   value={formData.password}
//                   onChange={(e) => setFormData({ ...formData, password: e.target.value })}
//                   required
//                 />
//               </div>

//               <button
//                 type="submit"
//                 disabled={loading}
//                 className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
//                 style={{ background: 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)', color: '#FFFFFF', boxShadow: '0 0 30px rgba(0, 255, 156, 0.4)' }}
//               >
//                 {loading ? 'Signing in...' : 'Sign In'}
//               </button>
//             </form>

//             <div className="mt-8 space-y-4">
//               <div className="divider"></div>
//               <div className="flex items-center justify-between text-sm">
//                 <button
//                   onClick={() => navigate('/portals')}
//                   className="transition-colors duration-300"
//                   style={{ color: '#E0E0E0' }}
//                   onMouseEnter={(e) => e.currentTarget.style.color = '#00FF9C'}
//                   onMouseLeave={(e) => e.currentTarget.style.color = '#E0E0E0'}
//                 >
//                   ← Back to Portals
//                 </button>
//                 <button
//                   onClick={() => navigate('/signup')}
//                   className="font-semibold transition-colors duration-300"
//                   style={{ color: '#00FF9C' }}
//                   onMouseEnter={(e) => e.currentTarget.style.color = '#10B981'}
//                   onMouseLeave={(e) => e.currentTarget.style.color = '#00FF9C'}
//                 >
//                   Sign up
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginPage;
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/api';
import Logo from '../components/Logo';
import { DashboardIcon, VehicleIcon, RouteIcon, UserIcon } from '../components/Icons';

const LoginPage = () => {
  const navigate = useNavigate();
  const { role } = useParams();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roleConfig = {
    admin: {
      title: 'Admin Portal',
      icon: DashboardIcon,
      gradient: 'from-accent-purple via-accent-pink to-accent-purple',
      glow: 'shadow-neon-purple'
    },
    manager: {
      title: 'Manager Portal',
      icon: VehicleIcon,
      gradient: 'from-accent-cyan via-accent-blue to-accent-cyan',
      glow: 'shadow-neon-cyan'
    },
    driver: {
      title: 'Driver Portal',
      icon: RouteIcon,
      gradient: 'from-accent-blue via-accent-purple to-accent-blue',
      glow: 'shadow-neon-blue'
    },
    customer: {
      title: 'Customer Portal',
      icon: UserIcon,
      gradient: 'from-accent-green via-accent-cyan to-accent-green',
      glow: 'shadow-neon-cyan'
    },
  };

  const config = roleConfig[role] || roleConfig.customer;
  const IconComponent = config.icon;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('🔄 Attempting login for:', formData.username);

      const response = await authService.login(formData.username, formData.password);

      // ✅ CRITICAL: Check the response structure
      console.log('📦 Full Response:', response);
      console.log('📦 Response Data:', response.data);

      // ✅ Handle both possible response formats
      let token, userRole, username, fullName, userId;

      // Check if response has nested user object
      if (response.data.user) {
        // Format: { token: "...", user: { id, username, role, fullName } }
        token = response.data.token;
        userRole = response.data.user.role;
        username = response.data.user.username;
        fullName = response.data.user.fullName || response.data.user.username;
        userId = response.data.user.id;

        console.log('📋 Response Format: Nested user object');
      } else {
        // Format: { token: "...", role: "...", username: "...", fullName: "..." }
        token = response.data.token;
        userRole = response.data.role;
        username = response.data.username;
        fullName = response.data.fullName || response.data.username;
        userId = response.data.id;

        console.log('📋 Response Format: Flat structure');
      }

      // ✅ Debug logs
      console.log('🎉 Login Success!');
      console.log('🔑 Token:', token);
      console.log('👤 Username:', username);
      console.log('🎭 Role:', userRole);
      console.log('📝 Full Name:', fullName);
      console.log('🆔 User ID:', userId);

      // ✅ Save everything to localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('username', username);
      localStorage.setItem('fullName', fullName);
      if (userId) {
        localStorage.setItem('userId', userId);
      }

      // ✅ Save complete user object for easy access
      const userObject = {
        id: userId,
        username: username,
        role: userRole,
        fullName: fullName
      };
      localStorage.setItem('user', JSON.stringify(userObject));

      // ✅ Verify everything is saved
      console.log('💾 Verification - Token saved:', localStorage.getItem('token') ? '✅ Yes' : '❌ No');
      console.log('💾 Verification - Role saved:', localStorage.getItem('role'));
      console.log('💾 Verification - Username saved:', localStorage.getItem('username'));
      console.log('💾 Verification - User object saved:', localStorage.getItem('user'));

      // ✅ Navigate to the correct dashboard
      const dashboardPath = `/${userRole.toLowerCase()}/dashboard`;
      console.log('🚀 Redirecting to:', dashboardPath);

      navigate(dashboardPath);

    } catch (err) {
      console.error('❌ Login failed:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error data:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);

      // More specific error messages
      if (err.response?.status === 401) {
        setError('Invalid username or password. Please try again.');
      } else if (err.response?.status === 403) {
        setError('Access forbidden. Please check your credentials.');
      } else if (err.response?.status === 404) {
        setError('Login service not found. Please contact support.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Login failed. Please try again or contact support.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ backgroundColor: '#0A0F0D' }}>

      <div className="relative min-h-screen flex items-center justify-center p-6">
        <div className="max-w-md w-full animate-fade-in-up">
          <div className="glass-card p-8">
            <div className="flex justify-center mb-8">
              <Logo size="md" animate={false} showText={true} />
            </div>

            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center" style={{ backgroundColor: 'rgba(18, 33, 27, 0.6)', border: '2px solid rgba(16, 185, 129, 0.4)' }}>
                <IconComponent size="lg" style={{ color: '#00FF9C' }} />
              </div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: '#FFFFFF' }}>{config.title}</h2>
              <p className="text-sm" style={{ color: '#E0E0E0' }}>Sign in to your account</p>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl mb-6 animate-fade-in" style={{ backgroundColor: 'rgba(255, 82, 82, 0.15)', border: '1px solid #FF5252', color: '#FF5252' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#E0E0E0' }}>
                  Username
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2" style={{ color: '#E0E0E0' }}>
                  Password
                </label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                style={{ background: 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)', color: '#FFFFFF', boxShadow: '0 0 30px rgba(0, 255, 156, 0.4)' }}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 space-y-4">
              <div className="divider"></div>
              <div className="flex items-center justify-between text-sm">
                <button
                  onClick={() => navigate('/portals')}
                  className="transition-colors duration-300"
                  style={{ color: '#E0E0E0' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#00FF9C'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#E0E0E0'}
                >
                  ← Back to Portals
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="font-semibold transition-colors duration-300"
                  style={{ color: '#00FF9C' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#10B981'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#00FF9C'}
                >
                  Sign up
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;