// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import useAuthStore from '../store/authStore';
// import { StarsIcon } from 'lucide-react';

// // Utility to generate a color from a string (user name)
// function stringToColor(str) {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     hash = str.charCodeAt(i) + ((hash << 5) - hash);
//   }
//   const rgb = [];
//   for (let i = 0; i < 3; i++) {
//     const value = (hash >> (i * 8)) & 0xff;
//     rgb.push(value.toString(16).padStart(2, '0'));
//   }
//   return `#${rgb.join('')}`;
// }

// const Navbar = () => {
//   const { user, logout } = useAuthStore();
//   const navigate = useNavigate();
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const handleLogout = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     logout();
//     navigate('/login');
//     setIsMobileMenuOpen(false);
//   };

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   return (
//     <nav className="bg-transparent shadow-md">
//       <div className="container mx-auto px-4 py-4">
//         <div className="flex justify-between items-center">
//           {/* Logo */}
//           <Link to="/" className="flex flex-row gap-2">
//             <span className="rounded-xl bg-blue-500 p-2">
//               <StarsIcon className="h-5 w-5 text-blue-50" />
//             </span>
//             <span className="text-3xl font-bold text-blue-600">GenUI</span>
//           </Link>

//           {/* Desktop Navigation */}
//           <div className="hidden md:flex">
//             {user ? (
//               <div className="flex items-center gap-6">
//                 <Link to="/chatbot" className="text-blue-600 hover:text-blue-800 transition-colors">
//                   AI Component Generator
//                 </Link>
//                 <div className="flex items-center gap-3">
//                   <div className="flex items-center gap-2">
//                     <div
//                       className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
//                       style={{ backgroundColor: stringToColor(user.name || user.email) }}
//                     >
//                       {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
//                     </div>
//                     <span className="text-gray-700 font-medium">{user.name || user.email}</span>
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="text-gray-600 hover:text-red-600 transition-colors px-3 py-1 rounded-md hover:bg-gray-100"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center gap-4">
//                 <Link
//                   to="/login"
//                   className="text-blue-600 hover:text-blue-800 transition-colors"
//                 >
//                   Login
//                 </Link>
//                 <Link
//                   to="/signup"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
//                 >
//                   Signup
//                 </Link>
//               </div>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button
//               onClick={toggleMobileMenu}
//               className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900"
//             >
//               <svg
//                 className="h-6 w-6"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 {isMobileMenuOpen ? (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M6 18L18 6M6 6l12 12"
//                   />
//                 ) : (
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M4 6h16M4 12h16M4 18h16"
//                   />
//                 )}
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Mobile Navigation */}
//         {isMobileMenuOpen && (
//           <div className="md:hidden">
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
//               {user ? (
//                 <div className="space-y-2">
//                   <Link
//                     to="/chatbot"
//                     className="text-blue-600 hover:text-blue-800 transition-colors py-2"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     AI Component Generator
//                   </Link>
//                   <div className="flex items-center gap-2 py-2 border-t">
//                     <div
//                       className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
//                       style={{ backgroundColor: stringToColor(user.name || user.email) }}
//                     >
//                       {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
//                     </div>
//                     <span className="text-gray-700 font-medium">{user.name || user.email}</span>
//                   </div>
//                   <button
//                     onClick={handleLogout}
//                     className="text-gray-600 hover:text-red-600 transition-colors py-2"
//                   >
//                     Logout
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-2">
//                   <Link
//                     to="/login"
//                     className="text-blue-600 hover:text-blue-800 transition-colors py-2"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     to="/signup"
//                     className="text-blue-600 hover:text-blue-800 transition-colors py-2"
//                     onClick={() => setIsMobileMenuOpen(false)}
//                   >
//                     Signup
//                   </Link>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
 import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { StarsIcon, Menu, X, Sparkles, LogOut, User } from 'lucide-react';

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
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setShowUserMenu(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const isHomePage = location.pathname === '/';

  return (
    <>
      {/* Navbar */}
      
      <nav   className={`   ${
    isHomePage
      ? `fixed top-0 left-0 right-0 z-50 transition-all duration-100 ${
          isScrolled
            ? 'bg-transparent backdrop-blur-sm border-b border-slate-700/50 shadow-lg'
            : 'bg-transparent '
        }`
      : 'relative bg-transparent z-50 shadow-md'
  }`}>
        {/* Subtle gradient overlay */}
        <div className="  absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
        
        <div className="max-w-auto mx-auto px-4 sm:px-6 lg:px-8 relative ">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group transition-all duration-300 ">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/25 transition-all duration-300">
                  <StarsIcon className="h-7 w-7 text-white" />
                </div>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
              </div>
              <div className="hidden sm:block">
                <span className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  GenUI
                </span>
                <div className="text-xs font-bold text-gray-400 tracking-wider uppercase -mt-1">
                  Studio
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {user ? (
                <>
                  {/* AI Generator Link */}
                  <Link 
                    to="/chat" 
                    className="group flex items-center gap-2 px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-all duration-300 hover:bg-white/5 border border-transparent hover:border-cyan-500/20"
                  >
                    <Sparkles className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                    <span className="font-medium">AI Generator</span>
                  </Link>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-all duration-300 group"
                    >
                      <div className="flex items-center  gap-2">
                        <div
                          className="w-9 h-9 rounded-full flex items-center drop-shadow-md justify-center text-white text-sm font-bold ring-2 ring-transparent group-hover:ring-cyan-500/30 transition-all duration-200"
                          style={{ backgroundColor: stringToColor(user.name || user.email) }}
                        >
                          {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                        </div>
                        <div className="hidden  text-left  lg:block">
                          <div className="text-sm font-medium text-white ">
                            {user.name || 'User'}
                          </div>
                          <div className="text-xs text-gray-400 -mt-0.5">
                            {user.email}
                          </div>
                        </div>
                      </div>
                      <svg className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-300" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* User Dropdown */}
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-xl pointer-events-none"></div>
                        
                        {/* User Info */}
                        <div className="px-4 py-2 border-b border-slate-500/50 relative">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-full flex items-center  justify-center text-white text-sm font-bold"
                              style={{ backgroundColor: stringToColor(user.name || user.email) }}
                            >
                              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1  min-w-0">
                              <div className="text-sm font-medium text-white truncate">
                                {user.name || 'User'}
                              </div>
                              <div className="text-xs text-gray-400 truncate">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <button
                            onClick={() => {/* Add profile functionality */}}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-200 relative group"
                          >
                            <User className="w-4 h-4 text-gray-400 group-hover:text-cyan-400 transition-colors duration-200" />
                            Profile Settings
                          </button>
                          
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-300 hover:text-red-400 hover:bg-red-500/5 transition-all duration-200 relative group"
                          >
                            <LogOut className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors duration-200" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-all duration-300 hover:bg-white/5 rounded-lg"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="group relative bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300 hover:scale-105 overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10">Get Started</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-slate-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 py-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 rounded-xl pointer-events-none"></div>
              
              <div className="relative px-4 space-y-2">
                {user ? (
                  <>
                    {/* User Info */}
                    <div className="flex items-center gap-3 px-3 py-3 rounded-lg bg-white/5 border border-white/10 mb-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
                        style={{ backgroundColor: stringToColor(user.name || user.email) }}
                      >
                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">
                          {user.name || 'User'}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    {/* AI Generator Link */}
                    <Link
                      to="/chat"
                      className="flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Sparkles className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                      <span className="font-medium">AI Generator</span>
                    </Link>

                    {/* Profile Button */}
                    <button
                      onClick={() => {/* Add profile functionality */}}
                      className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-all duration-300 group"
                    >
                      <User className="w-5 h-5 text-gray-400 group-hover:text-cyan-400 transition-colors duration-300" />
                      <span className="font-medium">Profile Settings</span>
                    </button>

                    {/* Logout Button */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-gray-300 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300 group"
                    >
                      <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400 transition-colors duration-300" />
                      <span className="font-medium">Sign Out</span>
                    </button>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      className="flex items-center justify-center px-4 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 font-medium transition-all duration-300"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="flex items-center justify-center px-4 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium transition-all duration-300 hover:scale-105"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
    

      {/* Background overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Background overlay for user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-40 md:z-auto"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </>
  );
};

export default Navbar;