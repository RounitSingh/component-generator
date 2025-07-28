import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../utils/api';

function SessionGuard({ children }) {
  const navigate = useNavigate();
  useEffect(() => {
    const checkSession = async () => {
      if (localStorage.getItem('accessToken')) {
        try {
          await getProfile();
        } catch {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          navigate('/login');
        }
      }
    };
    checkSession();
  }, [navigate]);
  return children;
}

export default SessionGuard; 