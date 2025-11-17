import React, { useState, useEffect } from 'react';
import { LogoutIcon } from '../../components/Icons';

const UserManagement = () => {
  const [activeTab, setActiveTab] = useState('drivers');
  const [users, setUsers] = useState({
    drivers: [],
    customers: [],
    managers: [],
  });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const mockUsers = {
      drivers: [
        { id: 1, fullName: 'John Driver', email: 'driver1@neurofleetx.com', phone: '555-0003', status: 'ACTIVE', trips: 156, rating: 4.8 },
        { id: 2, fullName: 'Jane Driver', email: 'driver2@neurofleetx.com', phone: '555-0004', status: 'ACTIVE', trips: 142, rating: 4.9 },
        { id: 3, fullName: 'Mike Driver', email: 'driver3@neurofleetx.com', phone: '555-0007', status: 'INACTIVE', trips: 89, rating: 4.5 },
      ],
      customers: [
        { id: 1, fullName: 'Alice Customer', email: 'customer1@neurofleetx.com', phone: '555-0005', status: 'ACTIVE', bookings: 45, totalSpent: 1250.50 },
        { id: 2, fullName: 'Bob Customer', email: 'customer2@neurofleetx.com', phone: '555-0006', status: 'ACTIVE', bookings: 32, totalSpent: 980.00 },
        { id: 3, fullName: 'Carol Customer', email: 'customer3@neurofleetx.com', phone: '555-0008', status: 'ACTIVE', bookings: 67, totalSpent: 2150.75 },
      ],
      managers: [
        { id: 1, fullName: 'Fleet Manager', email: 'manager@neurofleetx.com', phone: '555-0002', status: 'ACTIVE', department: 'Operations' },
      ],
    };
    setUsers(mockUsers);
  };

  const currentUsers = users[activeTab] || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <LogoutIcon size="lg" className="text-accent-purple" />
          User Management
        </h2>
        <p className="text-white/50">Manage drivers, customers, and managers</p>
      </div>

      <div className="glass-card p-6">
        <div className="flex gap-2 mb-6 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('drivers')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'drivers'
                ? 'bg-gradient-to-r from-accent-cyan to-accent-blue text-white shadow-lg shadow-accent-cyan/30'
                : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            Drivers ({users.drivers.length})
          </button>
          <button
            onClick={() => setActiveTab('customers')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'customers'
                ? 'bg-gradient-to-r from-accent-purple to-accent-pink text-white shadow-lg shadow-accent-purple/30'
                : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            Customers ({users.customers.length})
          </button>
          <button
            onClick={() => setActiveTab('managers')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'managers'
                ? 'bg-gradient-to-r from-accent-green to-accent-cyan text-white shadow-lg shadow-accent-green/30'
                : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
          >
            Managers ({users.managers.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentUsers.map((user) => (
            <div key={user.id} className="glass-card-hover p-6 group">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center text-white font-bold text-lg">
                    {user.fullName?.split(' ').map(n => n[0]).join('') || 'U'}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">{user.fullName}</h4>
                    <p className="text-sm text-white/50">{user.email}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Phone:</span>
                  <span className="text-white font-semibold">{user.phone}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${user.status === 'ACTIVE' ? 'bg-accent-green/20 text-accent-green' : 'bg-red-500/20 text-red-400'
                    }`}>
                    {user.status}
                  </span>
                </div>
                {activeTab === 'drivers' && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Trips:</span>
                      <span className="text-white font-semibold">{user.trips}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Rating:</span>
                      <span className="text-accent-cyan font-semibold">⭐ {user.rating}</span>
                    </div>
                  </>
                )}
                {activeTab === 'customers' && (
                  <>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Bookings:</span>
                      <span className="text-white font-semibold">{user.bookings}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60">Total Spent:</span>
                      <span className="text-accent-green font-semibold">${user.totalSpent.toFixed(2)}</span>
                    </div>
                  </>
                )}
                {activeTab === 'managers' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-white/60">Department:</span>
                    <span className="text-white font-semibold">{user.department}</span>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <button className="flex-1 btn-secondary text-sm py-2">
                  View Details
                </button>
                <button className="flex-1 btn-secondary text-sm py-2">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
