import React from 'react';
import { Link } from 'react-router-dom';
import { Home as HomeIcon, BookOpen, Users, Star } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center py-16">
        <div className="flex justify-center mb-6">
          <HomeIcon className="w-16 h-16 text-blue-600" />
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-blue-600">TesyBook</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your personal library management system. Organize, discover, and share
          your favorite books with ease.
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

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 py-16">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Book Management</h3>
          <p className="text-gray-600">
            Easily add, organize, and track your personal book collection with
            detailed information.
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Users className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Community</h3>
          <p className="text-gray-600">
            Connect with other book lovers, share recommendations, and discover
            new reads.
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <Star className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Reviews & Ratings</h3>
          <p className="text-gray-600">
            Rate and review books, and see what others think about your favorite
            reads.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
