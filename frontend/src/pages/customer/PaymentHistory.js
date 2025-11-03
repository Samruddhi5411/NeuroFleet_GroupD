import React from 'react';
import { RevenueIcon } from '../../components/Icons';

const PaymentHistory = () => {
  const payments = [
    { id: 1, date: '2025-10-20', amount: 150.00, method: 'Credit Card', status: 'Completed', bookingId: 'BK-001' },
    { id: 2, date: '2025-10-15', amount: 200.00, method: 'PayPal', status: 'Completed', bookingId: 'BK-002' },
    { id: 3, date: '2025-10-10', amount: 100.00, method: 'Credit Card', status: 'Completed', bookingId: 'BK-003' },
    { id: 4, date: '2025-10-05', amount: 250.00, method: 'Debit Card', status: 'Completed', bookingId: 'BK-004' },
  ];

  const totalSpent = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <RevenueIcon size="lg" className="text-accent-green" />
          Payment History
        </h2>
        <p className="text-white/50">View your transaction history and invoices</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Total Spent</p>
          <p className="text-4xl font-bold text-accent-green">${totalSpent.toFixed(2)}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Total Transactions</p>
          <p className="text-4xl font-bold text-accent-cyan">{payments.length}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Avg Per Booking</p>
          <p className="text-4xl font-bold text-accent-purple">${(totalSpent / payments.length).toFixed(2)}</p>
        </div>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-6">Transaction History</h3>
        <div className="space-y-3">
          {payments.map((payment) => (
            <div key={payment.id} className="glass-card-hover p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-green to-accent-cyan flex items-center justify-center">
                    <RevenueIcon size="md" className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">Payment #{payment.id}</h4>
                    <div className="flex items-center gap-3 text-sm text-white/50">
                      <span>📅 {new Date(payment.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>💳 {payment.method}</span>
                      <span>•</span>
                      <span>Booking: {payment.bookingId}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-accent-green">${payment.amount.toFixed(2)}</p>
                    <span className="status-badge status-available text-xs">
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                      {payment.status}
                    </span>
                  </div>
                  <button className="btn-secondary text-sm px-4 py-2">
                    Download Invoice
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
