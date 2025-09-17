import { create } from 'zustand';
import { listConversationsPage, createConversation as apiCreateConversation, updateConversation as apiUpdateConversation } from '@/utils/api';

const mergeUnique = (existing, incoming) => {
  const map = new Map(existing.map((c) => [c.id, c]));
  for (const c of incoming) map.set(c.id, { ...map.get(c.id), ...c });
  return Array.from(map.values()).sort((a, b) => new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0));
};

const useChatListStore = create((set, get) => ({
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
      const res = await listConversationsPage({ limit: opts.limit ?? 10, cursor: nextCursor, activeOnly: opts.activeOnly ?? true });
      const items = res?.items || res?.data?.items || [];
      const cursor = res?.meta?.nextCursor || res?.nextCursor || null;
      set((state) => ({
        conversations: mergeUnique(state.conversations, items),
        nextCursor: cursor,
        hasMore: Boolean(cursor),
        loading: false,
      }));
    } catch (error) {
      set({ error: error.message || 'Failed to load conversations', loading: false });
    }
  },

  createConversation: async (payload = {}) => {
    const row = await apiCreateConversation(payload);
    set((state) => ({ conversations: mergeUnique([{ ...row }], state.conversations) }));
    return row;
  },

  // Insert or update a conversation row without calling the API
  upsertConversation: (row) => {
    if (!row || !row.id) return;
    set((state) => ({ conversations: mergeUnique([{ ...row }], state.conversations) }));
  },

  renameConversation: async (conversationId, title) => {
    const updated = await apiUpdateConversation(conversationId, { title });
    set((state) => ({
      conversations: mergeUnique(
        state.conversations.map((c) => (c.id === conversationId ? { ...c, title: updated.title || title, updatedAt: updated.updatedAt || c.updatedAt } : c)),
        []
      ),
    }));
    return updated;
  },
}));

export default useChatListStore;


