import React, { useState } from 'react';
import { AlertIcon } from '../../components/Icons';

const SupportChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'support', text: 'Hello! How can we help you today?', time: '10:00 AM' },
    { id: 2, sender: 'driver', text: 'I have a question about my last payout', time: '10:02 AM' },
    { id: 3, sender: 'support', text: 'I would be happy to help! Can you provide your payout ID?', time: '10:03 AM' },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        sender: 'driver',
        text: newMessage,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }]);
      setNewMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <AlertIcon size="lg" className="text-accent-purple" />
          Support Center
        </h2>
        <p className="text-white/50">Get help from our support team</p>
      </div>

      <div className="glass-card p-6">
        <h3 className="text-xl font-bold text-white mb-4">Live Chat</h3>
        <div className="bg-dark-700/40 rounded-xl border border-white/5 p-4 h-96 overflow-y-auto mb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'driver' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[70%] ${message.sender === 'driver'
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
    </div>
  );
};

export default SupportChat;