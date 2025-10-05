import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatbotAIEditor from './pages/ChatbotAIEditor';
import ChatHistory from './pages/ChatHistory';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import LayoutWithSidebar from './components/LayoutWithSidebar';
import TailwindTest from './components/TailwindTest';
import ReactLiveCheck from './pages/ReactLiveCheck';
import SharedViewer from './pages/SharedViewer';
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
          // console.log('🔄 [App] Hydrating user from stored session...');
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

  const isHomePage = location.pathname === "/";
  const showNavbar = isHomePage;

  return (
    <div className={`min-h-screen ${isHomePage ? 'bg-gradient-to-br from-gray-900 via-slate-900 to-black' : 'bg-[#222222]'}`}>
      {showNavbar && <Navbar />}
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<LayoutWithSidebar><Dashboard /></LayoutWithSidebar>} />
            <Route path="/chat" element={<LayoutWithSidebar><ChatbotAIEditor /></LayoutWithSidebar>} />
            <Route path="/chat/:id" element={<LayoutWithSidebar><ChatbotAIEditor /></LayoutWithSidebar>} />
            <Route path="/chat-history" element={<LayoutWithSidebar><ChatHistory /></LayoutWithSidebar>} />
           </Route>
          <Route path="/share/:slug" element={<SharedViewer />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
