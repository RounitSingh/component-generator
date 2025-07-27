import React from 'react';

const TailwindTest = () => {
  return (
    <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Tailwind CSS Test
        </h2>
        <p className="text-gray-600 mb-4">
          If you can see this styled component, Tailwind CSS is working
          correctly!
        </p>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-700">
              Green dot - Tailwind is working
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-700">
              Red dot - Something is wrong
            </span>
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors">
            Primary Button
          </button>
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition-colors">
            Secondary Button
          </button>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;
