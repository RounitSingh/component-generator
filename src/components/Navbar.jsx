import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { StarsIcon } from 'lucide-react';

// Utility to generate a color from a string (user name)
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const rgb = [];
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    rgb.push(value.toString(16).padStart(2, '0'));
  }
  return `#${rgb.join('')}`;
}

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    logout();
    navigate('/login');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow mb-4">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className=" flex flex-row gap-2 ">
            <span className="rounded-xl bg-blue-500 p-2">
                    <StarsIcon className='h-5 w-5 text-blue-50'/>
                    </span><span className="text-3xl font-bold text-blue-600">GenUI</span> 
          </Link>

        
          <div className="hidden md:flex">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/chatbot" className="text-blue-600 hover:text-blue-800 transition-colors">
                  AI Chatbot
                </Link>
                {/* <Link to="/sessions" className="text-blue-600 hover:text-blue-800 transition-colors">
                  Sessions
                </Link> */}
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: stringToColor(user.name || 'U') }}
                    title={user.name}
                  >
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-blue-600 hover:underline transition-colors">
                  Login
                </Link>
                <Link to="/signup" className="text-blue-600 hover:underline transition-colors">
                  Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
              aria-label="Toggle mobile menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            {user ? (
              <div className="flex flex-col space-y-4 pt-4">
                <Link 
                  to="/chatbot" 
                  className="text-blue-600 hover:text-blue-800 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  AI Chatbot
                </Link>
                <Link 
                  to="/sessions" 
                  className="text-blue-600 hover:text-blue-800 transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sessions
                </Link>
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{ backgroundColor: stringToColor(user.name || 'U') }}
                    title={user.name}
                  >
                    {user.name ? user.name[0].toUpperCase() : 'U'}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors w-full text-left"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-4">
                <Link 
                  to="/login" 
                  className="text-blue-600 hover:underline transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/signup" 
                  className="text-blue-600 hover:underline transition-colors py-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
