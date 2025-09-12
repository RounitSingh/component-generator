import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export const useAuth = () => {
  const navigate = useNavigate();
  
  const {
    user,
    isLoading,
    isInitialized,
    error,
    isAuthenticated,
    login,
    logout,
    clearError,
    initializeAuth
  } = useAuthStore();

  // Simple login with navigation
  const loginWithNavigation = useCallback(async (userData, accessToken, refreshToken) => {
    await login(userData, accessToken, refreshToken);
    
    // Navigate to chatbot after login
    navigate('/chatbot', { replace: true });
  }, [login, navigate]);

  // Simple logout with navigation
  const logoutWithNavigation = useCallback(() => {
    logout();
    navigate('/login', );
  }, [logout, navigate]);

  return {
    // State
    user,
    isLoading,
    isInitialized,
    error,
    isAuthenticated: isAuthenticated(),
    
    // Actions
    login: loginWithNavigation,
    logout: logoutWithNavigation,
    clearError,
    initializeAuth,
  };
};
