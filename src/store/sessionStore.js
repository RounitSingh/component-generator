import { create } from 'zustand';

const useSessionStore = create((set) => ({
  sessions: [],
  currentSession: null,
  setSessions: (sessions) => set({ sessions }),
  setCurrentSession: (session) => set({ currentSession: session }),
  addSession: (session) => set((state) => ({ sessions: [...state.sessions, session] })),
  updateSession: (updatedSession) => set((state) => ({
    sessions: state.sessions.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
    currentSession: state.currentSession && state.currentSession.id === updatedSession.id ? updatedSession : state.currentSession,
  })),
  removeSession: (sessionId) => set((state) => ({
    sessions: state.sessions.filter((s) => s.id !== sessionId),
    currentSession: state.currentSession && state.currentSession.id === sessionId ? null : state.currentSession,
  })),
}));

export default useSessionStore; 