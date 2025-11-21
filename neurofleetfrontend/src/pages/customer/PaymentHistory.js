import React, { useState, useEffect } from 'react';
import { RevenueIcon, BookingIcon } from '../../components/Icons';
import { bookingService } from '../../services/api';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBookings, setActiveBookings] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    loadPayments();
  }, []);

  // const loadPayments = async () => {
  //   try {
  //     const response = await bookingService.getCustomerBookings(username);
  //     const allBookings = response.data;

  //     const completedPayments = allBookings.filter(b =>
  //       b.status === 'COMPLETED' || b.status === 'CANCELLED'
  //     );

  //     const currentBookings = allBookings.filter(b =>
  //       b.status === 'CONFIRMED' || b.status === 'IN_PROGRESS'
  //     );

  //     setPayments(completedPayments);
  //     setActiveBookings(currentBookings);
  //   } catch (error) {
  //     console.error('Error loading payment history:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadPayments = async () => {
  try {
    const response = await bookingService.getCustomerBookings(username);
    
    // ✅ FIX: Only show PAID bookings
    const paidBookings = response.data.filter(b =>
      b.paymentStatus === 'PAID' && b.status === 'COMPLETED'
    );
    
    setPayments(paidBookings);
  } catch (error) {
    console.error('Error loading payments:', error);
  }
};

  const totalSpent = payments.reduce((sum, p) => sum + (p.totalPrice || 0), 0);
  const activeAmount = activeBookings.reduce((sum, p) => sum + (p.totalPrice || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <RevenueIcon size="lg" className="text-accent-green" />
          Payment History
        </h2>
        <p className="text-white/50">View your transaction history and current bookings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Total Spent</p>
          <p className="text-4xl font-bold text-accent-green">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Active Bookings Amount</p>
          <p className="text-4xl font-bold text-accent-cyan">${activeAmount.toFixed(2)}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Total Transactions</p>
          <p className="text-4xl font-bold text-accent-purple">{payments.length}</p>
        </div>
      </div>

      {activeBookings.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
            <BookingIcon size="md" className="text-accent-cyan" />
            Current Bookings Payment
          </h3>
          <div className="space-y-3">
            {activeBookings.map((booking) => (
              <div key={booking.id} className="glass-card-hover p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-cyan to-accent-blue flex items-center justify-center">
                      <BookingIcon size="md" className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Booking #{booking.id}</h4>
                      <div className="flex items-center gap-3 text-sm text-white/50">
                        <span>📅 {new Date(booking.startTime).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>🚗 {booking.vehicle?.model || 'N/A'}</span>
                        <span>•</span>
                        <span className={`font-semibold ${booking.status === 'IN_PROGRESS' ? 'text-accent-green' : 'text-accent-cyan'
                          }`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-accent-cyan">
                        ${(booking.totalPrice || 0).toFixed(2)}
                      </p>
                      <span className="status-badge status-in-use text-xs">
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse"></span>
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">Payment History</h3>
        {payments.length > 0 ? (
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment.id} className="glass-card-hover p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${payment.status === 'CANCELLED' ? 'from-red-500 to-red-600' : 'from-accent-green to-accent-cyan'
                      } flex items-center justify-center`}>
                      <RevenueIcon size="md" className="text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white mb-1">Booking #{payment.id}</h4>
                      <div className="flex items-center gap-3 text-sm text-white/50">
                        <span>📅 {new Date(payment.createdAt || payment.startTime).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>🚗 {payment.vehicle?.model || 'N/A'}</span>
                        <span>•</span>
                        <span>{payment.vehicle?.vehicleNumber || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${payment.status === 'CANCELLED' ? 'text-red-400 line-through' : 'text-accent-green'
                        }`}>
                        ${(payment.totalPrice || 0).toFixed(2)}
                      </p>
                      <span className={`status-badge ${payment.status === 'CANCELLED' ? 'status-critical' : 'status-available'
                        } text-xs`}>
                        <span className="w-2 h-2 rounded-full bg-current"></span>
                        {payment.status === 'CANCELLED' ? 'Cancelled' : 'Paid'}
                      </span>
                    </div>
                    <button className="btn-secondary text-sm px-4 py-2">
                      View Receipt
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center mx-auto mb-6">
              <RevenueIcon size="xl" className="text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No Payment History</h3>
            <p className="text-white/50 text-lg">
              Your completed transactions will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;
