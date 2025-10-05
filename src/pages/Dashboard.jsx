import React from 'react';

const Dashboard = () => {
  return (
    <div className="min-h-screen text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Stats Cards */}
          <div className="bg-[#2a2a2a] border border-[#333333] rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-white">Total Chats</h3>
            <p className="text-3xl font-bold text-blue-400">24</p>
            <p className="text-gray-300 text-sm mt-1">+12% from last month</p>
          </div>
          
          <div className="bg-[#2a2a2a] border border-[#333333] rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-white">Active Users</h3>
            <p className="text-3xl font-bold text-green-400">1,234</p>
            <p className="text-gray-300 text-sm mt-1">+8% from last month</p>
          </div>
          
          <div className="bg-[#2a2a2a] border border-[#333333] rounded-lg p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2 text-white">Messages Sent</h3>
            <p className="text-3xl font-bold text-purple-400">5,678</p>
            <p className="text-gray-300 text-sm mt-1">+15% from last month</p>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#2a2a2a] border border-[#333333] rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-white">Recent Activity</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-[#333333]">
              <div>
                <p className="text-white font-medium">New chat created</p>
                <p className="text-gray-300 text-sm">2 minutes ago</p>
              </div>
              <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded text-xs">Chat</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#333333]">
              <div>
                <p className="text-white font-medium">User logged in</p>
                <p className="text-gray-300 text-sm">5 minutes ago</p>
              </div>
              <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs">Login</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[#333333]">
              <div>
                <p className="text-white font-medium">Chat archived</p>
                <p className="text-gray-300 text-sm">10 minutes ago</p>
              </div>
              <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs">Archive</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-white font-medium">New user registered</p>
                <p className="text-gray-300 text-sm">15 minutes ago</p>
              </div>
              <span className="bg-purple-500/20 text-purple-400 px-2 py-1 rounded text-xs">User</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
