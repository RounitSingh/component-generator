import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatbotAIEditor from './pages/ChatbotAIEditor';
import Navbar from './components/Navbar';
import TailwindTest from './components/TailwindTest';
import ReactLiveCheck from './pages/ReactLiveCheck';
import ProtectedRoute from './components/ProtectedRoute';
import useAuthStore from './store/authStore';
import { getProfile } from './utils/api';
import { useEffect } from 'react';

const App = () => {
  const { setUser, logout } = useAuthStore();
  const location = useLocation();
  
  useEffect(() => {
    const hydrateUser = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (accessToken) {
        try {
          console.log('🔄 [App] Hydrating user from stored session...');
          const user = await getProfile();
          setUser(user);
          console.log('✅ [App] User hydrated successfully:', user.name);
        } catch (error) {
          console.error('❌ [App] User hydration failed:', error);
          logout();
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('sessionId');
        }
      } else {
        console.log('🚫 [App] No stored session found');
      }
    };
    hydrateUser();
  }, [setUser, logout]);

  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && <Navbar />}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/chatbot" element={<ChatbotAIEditor />} />
            <Route path="/tailwind-test" element={<TailwindTest />} />
            <Route path="/react-live-check" element={<ReactLiveCheck />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
