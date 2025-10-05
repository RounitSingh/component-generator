import { create } from 'zustand';
import { 
  listConversationsPage, 
  unarchiveConversation as apiUnarchiveConversation,
  deleteConversation as apiDeleteConversation
} from '@/utils/api';

const mergeUnique = (existing, incoming) => {
  const map = new Map(existing.map((c) => [c.id, c]));
  for (const c of incoming) map.set(c.id, { ...map.get(c.id), ...c });
  return Array.from(map.values()).sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
};

const useArchivedChatStore = create((set, get) => ({
  conversations: [],
  nextCursor: null,
  hasMore: true,
  loading: false,
  error: null,

  reset: () => set({ conversations: [], nextCursor: null, hasMore: true, loading: false, error: null }),

  fetchNextPage: async (opts = {}) => {
    const { loading, nextCursor, hasMore } = get();
    if (loading || !hasMore) return;
    set({ loading: true, error: null });
    try {
      const res = await listConversationsPage({ 
        limit: opts.limit ?? 10, 
        cursor: nextCursor, 
        activeOnly: false // Fetch archived conversations
      });
      const items = res?.items || res?.data?.items || [];
      const cursor = res?.meta?.nextCursor || res?.nextCursor || null;
      set((state) => ({
        conversations: mergeUnique(state.conversations, items.filter(item => !item.isActive)),
        nextCursor: cursor,
        hasMore: Boolean(cursor),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message || 'Failed to load archived conversations', loading: false });
    }
  },

  // Insert or update a conversation row without calling the API
  upsertConversation: (row) => {
    if (!row || !row.id) return;
    set((state) => ({ conversations: mergeUnique([{ ...row }], state.conversations) }));
  },

  // Remove a conversation from the archived list without calling the API
  removeConversation: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== conversationId),
    }));
  },

  unarchiveConversation: async (conversationId) => {
    const updated = await apiUnarchiveConversation(conversationId);
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== conversationId),
    }));
    return updated;
  },

  deleteConversation: async (conversationId) => {
    await apiDeleteConversation(conversationId);
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== conversationId),
    }));
  },
}));

export default useArchivedChatStore;


