import React from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chatbot from './pages/Chatbot';
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
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/chatbot" element={<AIEditor />} />
            <Route path="/tailwind-test" element={<TailwindTest />} />
            <Route path="/react-live-check" element={<ReactLiveCheck />} />
            <Route path="/sessions" element={<SessionList />} />
            <Route path="/sessions/:sessionId" element={<AIEditorWithSession />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
