import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Chatbot from './pages/Chatbot';
import Navbar from './components/Navbar';
import TailwindTest from './components/TailwindTest';
import AIEditor from './pages/AIEditor';
import ReactLiveCheck from './pages/ReactLiveCheck';


const App = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chatbot" element={< AIEditor/>} />
          <Route path="/tailwind-test" element={<TailwindTest />} />
          <Route path="/react-live-check" element={<ReactLiveCheck />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
