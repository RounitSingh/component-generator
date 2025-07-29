import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, BookOpen, Users, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center py-16">
        <div className="flex justify-center mb-6">
          <HomeIcon className="w-16 h-16 text-blue-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">component generator</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Instantly generate custom UI components with the power of generative AI. Describe what you need, preview the result, and copy or download production-ready code for your projects.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="border border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8 py-16">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">AI-Driven Component Creation</h3>
          <p className="text-gray-600">
            Generate React components instantly by describing your requirements in natural language. Let AI handle the code for you.
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Live Preview & Customization</h3>
          <p className="text-gray-600">
            See your generated components in action, tweak properties, and refine the output before using it in your project.
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy Export & Copy</h3>
          <p className="text-gray-600">
            Effortlessly copy or download the generated code and integrate it directly into your workflow.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
