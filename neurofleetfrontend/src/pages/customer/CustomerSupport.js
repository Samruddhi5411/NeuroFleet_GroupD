import React, { useState, useEffect } from 'react';
import { AlertIcon, BookingIcon } from '../../components/Icons';
import { supportService, bookingService } from '../../services/api';

const CustomerSupport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateTicket, setShowCreateTicket] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [relatedBookings, setRelatedBookings] = useState([]);

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    description: '',
    category: 'GENERAL',
    priority: 'MEDIUM',
    relatedBookingId: null,
  });

  const username = localStorage.getItem('username');

  useEffect(() => {
    loadTickets();
    loadBookings();
  }, []);

  const loadTickets = async () => {
    try {
      const response = await supportService.getCustomerTickets(username);
      setTickets(response.data);
    } catch (error) {
      console.error('Error loading tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const response = await bookingService.getCustomerBookings(username);
      setRelatedBookings(response.data);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      const ticketData = {
        ...ticketForm,
        status: 'OPEN',
        createdAt: new Date().toISOString(),
      };
      await supportService.createTicket(username, ticketData);
      await loadTickets();
      setShowCreateTicket(false);
      setTicketForm({
        subject: '',
        description: '',
        category: 'GENERAL',
        priority: 'MEDIUM',
        relatedBookingId: null,
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      alert('Failed to create support ticket. Please try again.');
    }
  };

  const getPriorityStyle = (priority) => {
    const priorityMap = {
      'LOW': 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/30',
      'MEDIUM': 'text-accent-purple bg-accent-purple/10 border-accent-purple/30',
      'HIGH': 'text-accent-pink bg-accent-pink/10 border-accent-pink/30',
      'URGENT': 'text-red-400 bg-red-500/10 border-red-500/30',
    };
    return priorityMap[priority] || priorityMap['MEDIUM'];
  };

  const getStatusStyle = (status) => {
    const statusMap = {
      'OPEN': 'status-in-use',
      'IN_PROGRESS': 'status-maintenance',
      'RESOLVED': 'status-available',
      'CLOSED': 'status-critical',
    };
    return statusMap[status] || 'status-maintenance';
  };

  const getStatusIcon = (status) => {
    const iconMap = {
      'OPEN': '🔓',
      'IN_PROGRESS': '⚙️',
      'RESOLVED': '✅',
      'CLOSED': '🔒',
    };
    return iconMap[status] || '📋';
  };

  const faqItems = [
    {
      question: 'How do I book a vehicle?',
      answer: 'Browse available vehicles in the Smart Booking section, select your preferred vehicle, choose pickup and dropoff times, and confirm your booking.'
    },
    {
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel pending bookings from the Active Bookings page. Cancellation policies may apply based on timing.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept credit cards, debit cards, PayPal, and various digital wallets for secure payments.'
    },
    {
      question: 'How do I track my vehicle?',
      answer: 'Once your journey starts, you can track your vehicle location in real-time from the Active Bookings page.'
    },
    {
      question: 'What if I have an issue during my trip?',
      answer: 'Create a support ticket immediately with HIGH priority, and our team will assist you promptly.'
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <AlertIcon size="lg" className="text-accent-purple" />
            Customer Support
          </h2>
          <p className="text-white/50">Get help and support for your bookings</p>
        </div>
        <button
          onClick={() => setShowCreateTicket(true)}
          className="btn-primary flex items-center gap-2"
        >
          <AlertIcon size="sm" />
          Create Support Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Total Tickets</p>
          <p className="text-4xl font-bold text-accent-cyan">{tickets.length}</p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Open</p>
          <p className="text-4xl font-bold text-accent-green">
            {tickets.filter(t => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length}
          </p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Resolved</p>
          <p className="text-4xl font-bold text-accent-purple">
            {tickets.filter(t => t.status === 'RESOLVED').length}
          </p>
        </div>
        <div className="glass-card p-6">
          <p className="text-white/60 text-sm font-semibold mb-2">Avg Response</p>
          <p className="text-4xl font-bold text-accent-pink">{'<'}2h</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
              Your Support Tickets
              <span className="text-sm font-normal text-white/50">
                {tickets.length} total
              </span>
            </h3>
            {tickets.length > 0 ? (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="glass-card-hover p-4 cursor-pointer"
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-white">Ticket #{ticket.id}</h4>
                          <span className={`status-badge ${getStatusStyle(ticket.status)}`}>
                            {getStatusIcon(ticket.status)} {ticket.status}
                          </span>
                        </div>
                        <p className="text-white font-semibold text-sm mb-1">
                          {ticket.subject}
                        </p>
                        <p className="text-white/60 text-xs mb-2 line-clamp-2">
                          {ticket.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold border ${getPriorityStyle(ticket.priority)}`}>
                          {ticket.priority}
                        </span>
                        <span className="text-xs text-white/50">
                          {ticket.category}
                        </span>
                      </div>
                      <span className="text-xs text-white/40">
                        {new Date(ticket.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <AlertIcon size="xl" className="text-white/20 mx-auto mb-4" />
                <p className="text-white/50">No support tickets yet</p>
                <p className="text-white/30 text-sm mt-2">
                  Create a ticket if you need assistance
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              📞 Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-dark-700/40 rounded-xl border border-white/5">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="text-white/60 text-sm">Email Support</p>
                  <p className="text-white font-semibold">support@neurofleetx.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-dark-700/40 rounded-xl border border-white/5">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="text-white/60 text-sm">Phone Support</p>
                  <p className="text-white font-semibold">1-800-NEURO-FLEET</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-dark-700/40 rounded-xl border border-white/5">
                <span className="text-2xl">⏰</span>
                <div>
                  <p className="text-white/60 text-sm">Support Hours</p>
                  <p className="text-white font-semibold">24/7 Available</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-accent-green/10 to-accent-cyan/10 rounded-xl border border-accent-cyan/30">
                <span className="text-2xl">⚡</span>
                <div className="flex-1">
                  <p className="text-white/80 text-sm flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
                    Emergency Support Active
                  </p>
                  <p className="text-accent-cyan font-semibold">Avg response: 5-10 mins</p>
                </div>
              </div>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">❓ Frequently Asked Questions</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {faqItems.map((item, index) => (
                <details
                  key={index}
                  className="p-4 bg-dark-700/40 rounded-xl border border-white/5 hover:border-white/10 transition-all"
                >
                  <summary className="text-white font-semibold cursor-pointer flex items-center gap-2">
                    <span className="text-accent-cyan">Q:</span>
                    {item.question}
                  </summary>
                  <p className="text-white/70 text-sm mt-3 pl-6 border-l-2 border-accent-cyan/30">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-dark-800 rounded-2xl border border-white/10 shadow-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                <AlertIcon size="md" className="text-accent-purple" />
                Create Support Ticket
              </h3>
              <button
                onClick={() => setShowCreateTicket(false)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCreateTicket} className="p-6 space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  required
                  value={ticketForm.subject}
                  onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                  className="input-field w-full"
                  placeholder="Brief description of your issue"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="GENERAL">General Inquiry</option>
                    <option value="BOOKING">Booking Issue</option>
                    <option value="PAYMENT">Payment Problem</option>
                    <option value="TECHNICAL">Technical Issue</option>
                    <option value="FEEDBACK">Feedback</option>
                    <option value="COMPLAINT">Complaint</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-semibold mb-2">
                    Priority *
                  </label>
                  <select
                    required
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({ ...ticketForm, priority: e.target.value })}
                    className="input-field w-full"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Related Booking (Optional)
                </label>
                <select
                  value={ticketForm.relatedBookingId || ''}
                  onChange={(e) => setTicketForm({ ...ticketForm, relatedBookingId: e.target.value || null })}
                  className="input-field w-full"
                >
                  <option value="">No related booking</option>
                  {relatedBookings.map((booking) => (
                    <option key={booking.id} value={booking.id}>
                      Booking #{booking.id} - {booking.vehicle?.model} ({new Date(booking.startTime).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  required
                  value={ticketForm.description}
                  onChange={(e) => setTicketForm({ ...ticketForm, description: e.target.value })}
                  className="input-field w-full min-h-[120px]"
                  placeholder="Please provide detailed information about your issue..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Submit Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateTicket(false)}
                  className="btn-secondary px-6"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-dark-800 rounded-2xl border border-white/10 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-white/10 sticky top-0 bg-dark-800/95 backdrop-blur-sm">
              <div>
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <AlertIcon size="md" className="text-accent-purple" />
                  Ticket #{selectedTicket.id}
                </h3>
                <p className="text-white/50 text-sm mt-1">{selectedTicket.subject}</p>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="glass-card p-4">
                  <p className="text-white/60 text-sm mb-1">Status</p>
                  <span className={`status-badge ${getStatusStyle(selectedTicket.status)}`}>
                    {getStatusIcon(selectedTicket.status)} {selectedTicket.status}
                  </span>
                </div>
                <div className="glass-card p-4">
                  <p className="text-white/60 text-sm mb-1">Priority</p>
                  <span className={`px-3 py-1 rounded-lg text-sm font-semibold border ${getPriorityStyle(selectedTicket.priority)}`}>
                    {selectedTicket.priority}
                  </span>
                </div>
                <div className="glass-card p-4">
                  <p className="text-white/60 text-sm mb-1">Category</p>
                  <p className="text-white font-semibold">{selectedTicket.category}</p>
                </div>
              </div>

              <div className="glass-card p-6">
                <h4 className="text-white font-bold mb-3">Description</h4>
                <p className="text-white/70 whitespace-pre-wrap">{selectedTicket.description}</p>
              </div>

              <div className="glass-card p-6">
                <h4 className="text-white font-bold mb-3">Ticket Information</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Created:</span>
                    <span className="text-white font-semibold">
                      {new Date(selectedTicket.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {selectedTicket.assignedTo && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Assigned To:</span>
                      <span className="text-white font-semibold">{selectedTicket.assignedTo}</span>
                    </div>
                  )}
                  {selectedTicket.resolvedAt && (
                    <div className="flex justify-between">
                      <span className="text-white/60">Resolved:</span>
                      <span className="text-white font-semibold">
                        {new Date(selectedTicket.resolvedAt).toLocaleString()}
                      </span>
                    </div>
                  )}
                  {selectedTicket.resolution && (
                    <div className="pt-3 border-t border-white/10">
                      <span className="text-white/60">Resolution:</span>
                      <p className="text-white mt-2">{selectedTicket.resolution}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="btn-secondary px-6"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSupport;