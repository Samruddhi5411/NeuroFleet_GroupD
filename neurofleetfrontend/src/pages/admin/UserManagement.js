import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [activeTab, setActiveTab] = useState('drivers');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8083/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading users:', error);
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u => {
    if (activeTab === 'drivers') return u.role === 'DRIVER';
    if (activeTab === 'customers') return u.role === 'CUSTOMER';
    if (activeTab === 'managers') return u.role === 'MANAGER';
    return true;
  });

  if (loading) {
    return <div className="text-white text-center p-12">Loading users...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">User Management</h2>
        <p className="text-white/50">Manage drivers, customers, and managers</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'drivers'
                ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            Drivers ({users.filter(u => u.role === 'DRIVER').length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'customers'
                ? 'bg-gradient-to-r from-accent-purple to-accent-pink text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            Customers ({users.filter(u => u.role === 'CUSTOMER').length})
          </button>
          <button
            onClick={() => setActiveTab('managers')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${activeTab === 'managers'
                ? 'bg-gradient-to-r from-accent-green to-accent-cyan text-white'
                : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            Managers ({users.filter(u => u.role === 'MANAGER').length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredUsers.map((user) => (
            <div key={user.id} className="glass-card-hover p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white font-bold text-lg">
                  {user.fullName?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white">{user.fullName}</h4>
                  <p className="text-sm text-white/50">{user.email}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Phone:</span>
                  <span className="text-white font-semibold">{user.phone}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.isAvailable ? 'bg-accent-green/20 text-accent-green' : 'bg-red-500/20 text-red-400'
                    }`}>
                    {user.isAvailable ? 'Available' : 'Busy'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;