import React, { useState } from 'react';
import { AlertIcon } from '../../components/Icons';

const CustomerSupport = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'support', text: 'Hello! How can we assist you today?', time: '10:00 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'customer',
        text: newMessage,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
      setNewMessage('');
    }
  };

  const faqItems = [
    { question: 'How do I book a vehicle?', answer: 'Browse available vehicles, select one, fill in pickup/dropoff details, and confirm your booking.' },
    { question: 'Can I cancel my booking?', answer: 'Yes, you can cancel up to 24 hours before your scheduled time for a full refund.' },
    { question: 'What payment methods are accepted?', answer: 'We accept credit cards, debit cards, PayPal, and digital wallets.' },
    { question: 'How do I contact my driver?', answer: 'Driver contact information will be shared once your booking is confirmed.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <AlertIcon size="lg" className="text-accent-purple" />
          Customer Support
        </h2>
        <p className="text-white/50">Get help and support for your bookings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center justify-between">
            Live Chat
            <span className="flex items-center gap-2 text-accent-green text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse"></span>
              Online
            </span>
          </h3>
          <div className="bg-dark-700/40 rounded-xl border border-white/5 p-4 h-96 overflow-y-auto mb-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'customer' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${
                    message.sender === 'customer'
                      ? 'bg-gradient-to-r from-accent-cyan to-accent-blue'
                      : 'bg-dark-700/60 border border-white/10'
                  } rounded-2xl p-4`}>
                    <p className="text-white text-sm mb-1">{message.text}</p>
                    <p className="text-white/40 text-xs text-right">{message.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className="input-field flex-1"
            />
            <button
              onClick={handleSendMessage}
              className="btn-primary px-6"
            >
              Send
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-dark-700/40 rounded-xl border border-white/5">
                <span className="text-2xl">📧</span>
                <div>
                  <p className="text-white/60 text-sm">Email</p>
                  <p className="text-white font-semibold">support@neurofleetx.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-dark-700/40 rounded-xl border border-white/5">
                <span className="text-2xl">📞</span>
                <div>
                  <p className="text-white/60 text-sm">Phone</p>
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
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-xl font-bold text-white mb-4">FAQ</h3>
            <div className="space-y-3">
              {faqItems.map((item, index) => (
                <details key={index} className="p-4 bg-dark-700/40 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                  <summary className="text-white font-semibold cursor-pointer">
                    {item.question}
                  </summary>
                  <p className="text-white/70 text-sm mt-2">
                    {item.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSupport;
