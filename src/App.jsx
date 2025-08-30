import React from 'react';
import { Routes, Route, Navigate, useParams,useLocation  } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ChatbotAIEditor from './pages/ChatbotAIEditor';
import Navbar from './components/Navbar';
import TailwindTest from './components/TailwindTest';
import AIEditor from './pages/AIEditor';
import ReactLiveCheck from './pages/ReactLiveCheck';
import ProtectedRoute from './components/ProtectedRoute';
import SessionList from './pages/SessionList';
import useAuthStore from './store/authStore';
import { getProfile } from './utils/api';
import { useEffect } from 'react';


const AIEditorWithSession = () => {
  const { sessionId } = useParams();
  
  
  return <AIEditor sessionId={sessionId} />;
};

const App = () => {
  const { setUser, logout } = useAuthStore();
  const location = useLocation();
  useEffect(() => {
    const hydrateUser = async () => {
      if (localStorage.getItem('accessToken')) {
        try {
          const user = await getProfile();
          setUser(user);
        } catch {
          logout();
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
    };
    hydrateUser();
  }, [setUser, logout]);

  const hideNavbar = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-gray-50">
      {!hideNavbar && <Navbar />}
      <div className=" ">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/chatbot" element={<ChatbotAIEditor />} />
            <Route path="/tailwind-test" element={<TailwindTest />} />
            <Route path="/react-live-check" element={<ReactLiveCheck />} />
            <Route path="/sessions" element={<SessionList />} />
            <Route path="/sessions/:sessionId" element={<AIEditorWithSession />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
