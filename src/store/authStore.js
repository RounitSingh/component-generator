import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      sessionId: null,

      setUser: (user) => set({ user }),

      setTokens: (accessToken, refreshToken, sessionId) =>
        set({
          accessToken,
          refreshToken,
          sessionId: sessionId || null,
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          sessionId: null,
        }),
    }),
    {
      name: 'auth-storage', // key in localStorage
      getStorage: () => localStorage, // you can swap with sessionStorage if needed
    }
  )
)

export default useAuthStore
