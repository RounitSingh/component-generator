import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f] text-white">
      <div className="bg-[#1c1c1c] border border-[#2a2a2a] rounded-2xl shadow-2xl p-10 text-center max-w-md w-full">
        <h1 className="text-4xl font-bold mb-4 text-white">
          Dashboard
        </h1>

        <p className="text-gray-300 text-lg leading-relaxed">
          Your personalized dashboard is on the way!  
          <br />
          We’re crafting insightful analytics and a seamless experience just
          for you. ✨
        </p>

        <p className="text-gray-500 text-sm mt-6 italic">
          Stay tuned — great things are coming soon.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
