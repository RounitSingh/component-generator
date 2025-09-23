import { create } from 'zustand';
import { getConversationDetails, createMessage } from '@/utils/api';

const useChatSessionStore = create((set, get) => ({
  currentConversationId: null,
  messagesByConversationId: {},
  componentsByConversationId: {},
  loadingByConversationId: {},
  errorByConversationId: {},

  // Clear all in-memory session state (used on logout or user switch)
  reset: () => set({
    currentConversationId: null,
    messagesByConversationId: {},
    componentsByConversationId: {},
    loadingByConversationId: {},
    errorByConversationId: {},
  }),

  selectConversation: async (conversationId) => {
    set({ currentConversationId: conversationId });
    const loaded = get().messagesByConversationId[conversationId];
    if (!loaded) {
      await get().fetchConversationDetail(conversationId);
    }
  },

  fetchConversationDetail: async (conversationId, { messagesLimit = 200 } = {}) => {
    set((state) => ({ loadingByConversationId: { ...state.loadingByConversationId, [conversationId]: true }, errorByConversationId: { ...state.errorByConversationId, [conversationId]: null } }));
    try {
      const res = await getConversationDetails(conversationId, { messagesLimit });
      const details = res?.conversation ? res : res?.data || {};
      set((state) => ({
        messagesByConversationId: { ...state.messagesByConversationId, [conversationId]: (details.messages || []).slice().reverse() },
        componentsByConversationId: { ...state.componentsByConversationId, [conversationId]: details.components || [] },
        loadingByConversationId: { ...state.loadingByConversationId, [conversationId]: false },
      }));
    } catch (error) {
      set((state) => ({
        loadingByConversationId: { ...state.loadingByConversationId, [conversationId]: false },
        errorByConversationId: { ...state.errorByConversationId, [conversationId]: error.message || 'Failed to load conversation' },
      }));
    }
  },

  addMessage: async (conversationId, payload) => {
    // optimistic
    const tempId = `temp_${Date.now()}`;
    const optimistic = { id: tempId, ...payload, createdAt: new Date().toISOString() };
    set((state) => ({
      messagesByConversationId: {
        ...state.messagesByConversationId,
        [conversationId]: [...(state.messagesByConversationId[conversationId] || []), optimistic],
      },
    }));
    try {
      const saved = await createMessage({ ...payload, conversationId });
      set((state) => ({
        messagesByConversationId: {
          ...state.messagesByConversationId,
          [conversationId]: (state.messagesByConversationId[conversationId] || []).map((m) => (m.id === tempId ? saved : m)),
        },
      }));
    } catch (error) {
      set((state) => ({
        messagesByConversationId: {
          ...state.messagesByConversationId,
          [conversationId]: (state.messagesByConversationId[conversationId] || []).filter((m) => m.id !== tempId),
        },
      }));
      throw error;
    }
  },
}));

export default useChatSessionStore;


