'use client'
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
    <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.674 6.1.232.226.277.428.254.543a3.73 3.73 0 01-.814 1.686.75.75 0 00.44 1.206 4.057 4.057 0 002.466-.761z" clipRule="evenodd" />
  </svg>
);

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; isUser: boolean }[]>([]);
  const [input, setInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    setMessages((prevMessages) => [...prevMessages, { text: input, isUser: true }]);

    try {
      const response = await axios.post('/api/chat', { message: input });
      const botMessage = response.data.message;
      setMessages((prevMessages) => [...prevMessages, { text: botMessage, isUser: false }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [...prevMessages, { 
        text: 'Sorry, something went wrong. Please try again.', 
        isUser: false 
      }]);
    }

    setInput('');
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Chat Button */}
      <button 
        onClick={toggleChat}
        className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-xl transition-all duration-300 ease-in-out transform hover:scale-110 focus:outline-none"
      >
        <ChatIcon />
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div 
          className="fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col"
          style={{ height: '500px' }}
        >
          {/* Chat Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-xl flex justify-between items-center">
            <h2 className="text-lg font-semibold">Customer Support</h2>
            <button 
              onClick={toggleChat} 
              className="hover:bg-blue-700 p-1 rounded-full focus:outline-none"
            >
              ×
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-grow overflow-y-auto p-4 space-y-3">
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.isUser 
                    ? 'bg-blue-500 text-white self-end ml-auto' 
                    : 'bg-gray-100 text-black self-start'
                }`}
              >
                {message.text}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 flex">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              onClick={handleSendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;