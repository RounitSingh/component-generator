// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
// import api, { getProfile } from '../utils/api';
// import useAuthStore from '../store/authStore';

// const Login = () => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const { setUser, setTokens } = useAuthStore();

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//     // console.log('Form Change:', { name, value, formData: { ...formData, [name]: value } });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');
//     console.log('Submitting form with:', formData);
//     try {
//       const res = await api.post('/api/auth/login', formData);
//       console.log('login successful ');
//       const { accessToken, refreshToken } = res.data.data;
//       setTokens(accessToken, refreshToken);
//       localStorage.setItem('accessToken', accessToken);
//       if (refreshToken) {
//         localStorage.setItem('refreshToken', refreshToken);
//       }
//       // Hydrate user state
//       const user = await getProfile();
//       setUser(user);
//       setIsLoading(false);
//       navigate('/chatbot', { replace: true });
//     } catch (err) {
//       setIsLoading(false);
//       console.log('Login Error:', err);
//       setError(
//         err.response?.data?.message || 'Login failed. Please try again.'
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Or{' '}
//             <Link
//               to="/signup"
//               className="font-medium text-blue-600 hover:text-blue-500"
//             >
//               create a new account
//             </Link>
//           </p>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Email address
//               </label>
//               <div className="mt-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Mail className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="email"
//                   name="email"
//                   type="email"
//                   autoComplete="email"
//                   required
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                   placeholder="Enter your email"
//                 />
//               </div>
//             </div>
//             <div>
//               <label
//                 htmlFor="password"
//                 className="block text-sm font-medium text-gray-700"
//               >
//                 Password
//               </label>
//               <div className="mt-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <Lock className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="password"
//                   name="password"
//                   type={showPassword ? 'text' : 'password'}
//                   autoComplete="current-password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className="appearance-none relative block w-full pl-10 pr-10 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                   placeholder="Enter your password"
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400" />
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>
//           {error && (
//             <div className="text-red-600 text-sm text-center">{error}</div>
//           )}
//           <div className="flex items-center justify-between">
//             <div className="flex items-center">
//               <input
//                 id="remember-me"
//                 name="remember-me"
//                 type="checkbox"
//                 className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//               />
//               <label
//                 htmlFor="remember-me"
//                 className="ml-2 block text-sm text-gray-900"
//               >
//                 Remember me
//               </label>
//             </div>
//             <div className="text-sm">
//               <a
//                 href="#"
//                 className="font-medium text-blue-600 hover:text-blue-500"
//               >
//                 Forgot your password?
//               </a>
//             </div>
//           </div>
//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? 'Signing in...' : 'Sign in'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Login;
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import api, { getProfile } from '../utils/api';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (error) {setError('')};
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const res = await api.post('/api/auth/login', formData);
      const { accessToken, refreshToken } = res.data.data;
      
      // Store tokens in state and localStorage
      setTokens(accessToken, refreshToken);
      localStorage.setItem('accessToken', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      // Get user profile and update state
      const user = await getProfile();
      setUser(user);
      
      setIsLoading(false);
      navigate('/chatbot', { replace: true });
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message || 'Login failed. Please try again.'
      );
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8 animate-fade-in-up">
          {/* Header */}
          <div className="text-center">
            <Link to="/" className="inline-flex items-center gap-3 mb-8 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl shadow-md">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <span className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">GenUI</span>
                <span className="text-gray-500"> Studio</span>
              </span>
            </Link>
            
          
            <p className="text-gray-500 text-lg">
              Sign in to continue creating amazing UI components
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 h-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:shadow-md"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 h-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:shadow-md"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-all duration-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  id="rememberMe"
                  name="rememberMe"
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="rememberMe" className="text-sm text-gray-500">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm text-blue-600 hover:text-blue-800 transition-all duration-300"
              >
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 gap-2 flex items-center justify-center rounded-md"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-500">
                Don't have an account?{' '}
                <Link
                  to="/signup"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-all duration-300"
                >
                  Create one now
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center p-12">
          <div className="text-center text-white space-y-6 max-w-lg">
            <div className="inline-flex p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6 animate-bounce">
              <Sparkles className="h-12 w-12" />
            </div>
            <h2 className="text-4xl font-bold">Welcome to the Future</h2>
            <p className="text-xl text-white/90">
              Join thousands of developers creating stunning UI components with the power of AI
            </p>
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">10k+</div>
                <div className="text-white/80">Components Created</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">500+</div>
                <div className="text-white/80">Happy Developers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;