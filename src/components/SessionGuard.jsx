import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../utils/api';
import useAuthStore from '../store/authStore';

function SessionGuard({ children }) {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  
  useEffect(() => {
    const checkSession = async () => {
      const accessToken = localStorage.getItem('accessToken');
      
      if (accessToken) {
        try {
          // console.log('🔍 [SessionGuard] Validating session...');
          await getProfile();
          // console.log('✅ [SessionGuard] Session is valid');
        } catch  {
          // console.error('❌ [SessionGuard] Session validation failed:', error);
          // Clear all auth data
          logout();
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('sessionId');
          navigate('/login');
        }
      } else {
        console.log('🚫 [SessionGuard] No access token found');
      }
    };
    
    checkSession();
  }, [navigate, logout]);
  
  return children;
}

export default SessionGuard; 