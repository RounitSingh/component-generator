import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  sessionId: null,
  setUser: (user) => set({ user }),
  setTokens: (accessToken, refreshToken, sessionId) => set({ 
    accessToken, 
    refreshToken, 
    sessionId: sessionId || null 
  }),
  logout: () => set({ 
    user: null, 
    accessToken: null, 
    refreshToken: null, 
    sessionId: null 
  }),
}));

export default useAuthStore; 