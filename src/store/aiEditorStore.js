import { create } from 'zustand';

const useAIEditorStore = create((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  code: { jsx: '', css: '' },
  setCode: (code) => set({ code }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  error: '',
  setError: (error) => set({ error }),
  activeTab: 'preview',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));

export default useAIEditorStore; 