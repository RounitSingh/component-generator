// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { User, Mail, Lock, Eye, EyeOff, Check } from 'lucide-react';
// import api, { getProfile, createSession } from '../utils/api';
// import useAuthStore from '../store/authStore';

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     email: '',
//     password: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const { setUser, setTokens } = useAuthStore();

//   const handleChange = e => {
//     const { name, value } = e.target;
//     console.log('Field changed:', name, 'Value:', value);
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: '',
//       }));
//     }
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.firstName.trim()) {
//       newErrors.firstName = 'First name is required';
//     }
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (!validateForm()) {
//       return;
//     }
//     setIsLoading(true);
//     setError('');
//     try {
//       const res = await api.post('/api/auth/signup', {
//         name: formData.firstName,
//         email: formData.email,
//         password: formData.password,
//       });
//       console.log('Signup successful');
//       const { accessToken, refreshToken } = res.data.data;
//       setTokens(accessToken, refreshToken);
//       localStorage.setItem('accessToken', accessToken);
//       if (refreshToken) {
//         localStorage.setItem('refreshToken', refreshToken);
//       }
//       // Hydrate user state
//       const user = await getProfile();
//       setUser(user);
//       // Create a default session for the new user
//       try {
//         await createSession({
//           title: 'My First Session',
//           description: 'Welcome! This is your first session.'
//         });
//       } catch (err) {
//         console.error('Session creation failed:', err, err?.response?.data);
//         setError('Session creation failed. Please try again.');
//         setIsLoading(false);
//         return;
//       }
//       setIsLoading(false);
//       navigate('/login');
//     } catch (err) {
//       setIsLoading(false);
//       setError(
//         err.response?.data?.message || 'Signup failed. Please try again.'
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Create your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Or{' '}
//             <Link
//               to="/login"
//               className="font-medium text-blue-600 hover:text-blue-500"
//             >
//               sign in to your existing account
//             </Link>
//           </p>
//         </div>
//         <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <label
//                   htmlFor="firstName"
//                   className="block text-sm font-medium text-gray-700"
//                 >
//                   First name
//                 </label>
//                 <div className="mt-1 relative">
//                   <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                     <User className="h-5 w-5 text-gray-400" />
//                   </div>
//                   <input
//                     id="firstName"
//                     name="firstName"
//                     type="text"
//                     autoComplete="given-name"
//                     required
//                     value={formData.firstName}
//                     onChange={handleChange}
//                     className={`appearance-none relative block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
//                       errors.firstName ? 'border-red-300' : 'border-gray-300'
//                     }`}
//                     placeholder="First name"
//                   />
//                 </div>
//                 {errors.firstName && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.firstName}
//                   </p>
//                 )}
//               </div>
//             </div>
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
//                   className={`appearance-none relative block w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
//                     errors.email ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter your email"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600">{errors.email}</p>
//               )}
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
//                   autoComplete="new-password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`appearance-none relative block w-full pl-10 pr-10 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm ${
//                     errors.password ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                   placeholder="Create a password"
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
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600">{errors.password}</p>
//               )}
//             </div>
//           </div>
//           {error && (
//             <div className="text-red-600 text-sm text-center">{error}</div>
//           )}
//           <div className="flex items-center">
//             <input
//               id="agree-terms"
//               name="agree-terms"
//               type="checkbox"
//               required
//               className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//             />
//             <label
//               htmlFor="agree-terms"
//               className="ml-2 block text-sm text-gray-900"
//             >
//               I agree to the{' '}
//               <a href="#" className="text-blue-600 hover:text-blue-500">
//                 Terms of Service
//               </a>{' '}
//               and{' '}
//               <a href="#" className="text-blue-600 hover:text-blue-500">
//                 Privacy Policy
//               </a>
//             </label>
//           </div>
//           <div>
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               {isLoading ? 'Creating account...' : 'Create account'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Signup;
// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
// import api, { getProfile, createSession } from '../utils/api';
// import useAuthStore from '../store/authStore';

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     firstName: '',
//     email: '',
//     password: '',
//   });
//   const [showPassword, setShowPassword] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [error, setError] = useState('');
//   const navigate = useNavigate();
//   const { setUser, setTokens } = useAuthStore();

//   const handleChange = e => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//     if (errors[name]) {
//       setErrors(prev => ({
//         ...prev,
//         [name]: '',
//       }));
//     }
//     if (error) {setError('')};
//   };

//   const validateForm = () => {
//     const newErrors = {};
//     if (!formData.firstName.trim()) {
//       newErrors.firstName = 'First name is required';
//     }
//     if (!formData.email.trim()) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Email is invalid';
//     }
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     if (!validateForm()) {
//       return;
//     }
//     setIsLoading(true);
//     setError('');
    
//     try {
//       const res = await api.post('/api/auth/signup', {
//         name: formData.firstName,
//         email: formData.email,
//         password: formData.password,
//       });
      
//       const { accessToken, refreshToken } = res.data.data;
      
//       // Store tokens in state and localStorage
//       setTokens(accessToken, refreshToken);
//       localStorage.setItem('accessToken', accessToken);
//       if (refreshToken) {
//         localStorage.setItem('refreshToken', refreshToken);
//       }
      
//       // Get user profile and update state
//       const user = await getProfile();
//       setUser(user);
      
//       // Create a default session for the new user
//       try {
//         await createSession({
//           title: 'My First Session',
//           description: 'Welcome! This is your first session.'
//         });
//       } catch (err) {
//         console.error('Session creation failed:', err);
//         // Continue even if session creation fails
//       }
      
//       setIsLoading(false);
//       navigate('/login', { replace: true });
//     } catch (err) {
//       setIsLoading(false);
//       setError(
//         err.response?.data?.message || 'Signup failed. Please try again.'
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
//       <div className="sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="flex justify-center">
//           <div className="rounded-full bg-blue-100 p-3">
//             <div className="rounded-full bg-blue-200 p-3">
//               <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
//               </svg>
//             </div>
//           </div>
//         </div>
//         <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//           Create your account
//         </h2>
//         <p className="mt-2 text-center text-sm text-gray-600">
//           Or{' '}
//           <Link
//             to="/login"
//             className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
//           >
//             sign in to your existing account
//           </Link>
//         </p>
//       </div>

//       <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <form className="space-y-6" onSubmit={handleSubmit}>
//             <div>
//               <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
//                 First name
//               </label>
//               <div className="mt-1 relative">
//                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                   <User className="h-5 w-5 text-gray-400" />
//                 </div>
//                 <input
//                   id="firstName"
//                   name="firstName"
//                   type="text"
//                   autoComplete="given-name"
//                   required
//                   value={formData.firstName}
//                   onChange={handleChange}
//                   className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                     errors.firstName ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                   placeholder="First name"
//                 />
//               </div>
//               {errors.firstName && (
//                 <p className="mt-2 text-sm text-red-600">{errors.firstName}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
//                   className={`appearance-none block w-full pl-10 pr-3 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                     errors.email ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                   placeholder="Enter your email"
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-2 text-sm text-red-600">{errors.email}</p>
//               )}
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
//                   autoComplete="new-password"
//                   required
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`appearance-none block w-full pl-10 pr-10 py-2 border rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
//                     errors.password ? 'border-red-300' : 'border-gray-300'
//                   }`}
//                   placeholder="Create a password"
//                 />
//                 <button
//                   type="button"
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                   onClick={() => setShowPassword(!showPassword)}
//                 >
//                   {showPassword ? (
//                     <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-500" />
//                   ) : (
//                     <Eye className="h-5 w-5 text-gray-400 hover:text-gray-500" />
//                   )}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-2 text-sm text-red-600">{errors.password}</p>
//               )}
//             </div>

//             {error && (
//               <div className="rounded-md bg-red-50 p-4">
//                 <div className="flex">
//                   <div className="flex-shrink-0">
//                     <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                     </svg>
//                   </div>
//                   <div className="ml-3">
//                     <h3 className="text-sm font-medium text-red-800">{error}</h3>
//                   </div>
//                 </div>
//               </div>
//             )}

//             <div className="flex items-start">
//               <div className="flex items-center h-5">
//                 <input
//                   id="terms"
//                   name="terms"
//                   type="checkbox"
//                   required
//                   className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
//                 />
//               </div>
//               <div className="ml-3 text-sm">
//                 <label htmlFor="terms" className="font-medium text-gray-700">
//                   I agree to the{' '}
//                   <Link to="/terms" className="text-blue-600 hover:text-blue-500 transition-colors duration-200">
//                     Terms of Service
//                   </Link>{' '}
//                   and{' '}
//                   <Link to="/privacy" className="text-blue-600 hover:text-blue-500 transition-colors duration-200">
//                     Privacy Policy
//                   </Link>
//                 </label>
//               </div>
//             </div>

//             <div>
//               <button
//                 type="submit"
//                 disabled={isLoading}
//                 className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
//               >
//                 {isLoading ? (
//                   <span className="flex items-center">
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Creating account...
//                   </span>
//                 ) : (
//                   'Create account'
//                 )}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Signup;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, Check } from 'lucide-react';
import api, { getProfile, createSession } from '../utils/api';
import useAuthStore from '../store/authStore';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    email: '',
    password: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, setTokens } = useAuthStore();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
    if (error) {setError('')};
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsLoading(true);
    setError('');
    
    try {
      const res = await api.post('/api/auth/signup', {
        name: formData.firstName,
        email: formData.email,
        password: formData.password,
      });
      
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
      
      // Create a default session for the new user
      try {
        await createSession({
          title: 'My First Session',
          description: 'Welcome! This is your first session.'
        });
      } catch (err) {
        console.error('Session creation failed:', err);
        // Continue even if session creation fails
      }
      
      setIsLoading(false);
      navigate('/login', { replace: true });
    } catch (err) {
      setIsLoading(false);
      setError(
        err.response?.data?.message || 'Signup failed. Please try again.'
      );
    }
  };

  const passwordStrength = {
    length: formData.password.length >= 8,
    uppercase: /[A-Z]/.test(formData.password),
    lowercase: /[a-z]/.test(formData.password),
    number: /\d/.test(formData.password),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;

  return (
    <div className="min-h-screen flex w-full">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-900 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex items-center justify-center p-12">
          <div className="text-center text-white space-y-6 max-w-lg">
            <div className="inline-flex p-4 rounded-full bg-white/10 backdrop-blur-sm mb-6 animate-bounce">
              <User className="h-12 w-12" />
            </div>
            <h2 className="text-4xl font-bold">Start Your Journey</h2>
            <p className="text-xl text-white/90">
              Create stunning UI components in seconds with AI-powered generation
            </p>
            <div className="space-y-4 pt-8">
              <div className="flex items-center gap-3 text-left">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
                <span>Generate components with natural language</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
                <span>Export production-ready code instantly</span>
              </div>
              <div className="flex items-center gap-3 text-left">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Check className="h-4 w-4" />
                </div>
                <span>Join a community of innovative developers</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
        <div className="w-full max-w-md space-y-8">
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
            
            <h1 className="text-4xl font-bold mb-3">Create account</h1>
            <p className="text-gray-500 text-lg">
              Join thousands of developers building with AI
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    autoComplete="given-name"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter your first name"
                    className={`w-full pl-10 h-12 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:shadow-md ${
                      errors.firstName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-sm text-red-600">{errors.firstName}</p>
                )}
              </div>

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
                    className={`w-full pl-10 h-12 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:shadow-md ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
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
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className={`w-full pl-10 pr-10 h-12 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 focus:shadow-md ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
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
                
                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="space-y-2">
                    <div className="flex gap-1">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                            level <= strengthScore
                              ? strengthScore <= 2
                                ? 'bg-red-500'
                                : strengthScore <= 3
                                ? 'bg-yellow-500'
                                : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`flex items-center gap-1 ${passwordStrength.length ? 'text-green-600' : 'text-gray-500'}`}>
                        <Check className="h-3 w-3" />
                        8+ characters
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                        <Check className="h-3 w-3" />
                        Uppercase
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                        <Check className="h-3 w-3" />
                        Lowercase
                      </div>
                      <div className={`flex items-center gap-1 ${passwordStrength.number ? 'text-green-600' : 'text-gray-500'}`}>
                        <Check className="h-3 w-3" />
                        Number
                      </div>
                    </div>
                  </div>
                )}
                
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <input
                  id="agreeTerms"
                  name="agreeTerms"
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-0.5 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="agreeTerms" className="text-sm text-gray-500 leading-relaxed">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-800 transition-all duration-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-800 transition-all duration-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeTerms && (
                <p className="text-sm text-red-600">{errors.agreeTerms}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 gap-2 flex items-center justify-center rounded-md"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Creating account...
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-gray-500">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium transition-all duration-300"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;