import React from 'react';

const ChatHistory = () => {
  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-white">Chat History</h1>
        <div className="bg-[#2a2a2a] border border-[#333333] rounded-lg p-6 shadow-lg">
          <p className="text-gray-300">Your chat history will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;
