import { create } from 'zustand';

const useChatStore = create((set) => ({
  messages: [],
  interactions: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setInteractions: (interactions) => set({ interactions }),
  addInteraction: (interaction) => set((state) => ({ interactions: [...state.interactions, interaction] })),
}));

export default useChatStore; 