import { create } from 'zustand';

const useChatStoreTesting = create((set) => ({
  messages: [],
  interactions: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  setInteractions: (interactions) => set({ interactions }),
  addInteraction: (interaction) => set((state) => ({ interactions: [...state.interactions, interaction] })),
  clearInteractions: () => set({ interactions: [] }),
}));

export default useChatStoreTesting;
