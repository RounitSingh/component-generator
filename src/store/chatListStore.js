import { create } from 'zustand';
import { 
  listConversationsPage, 
  createConversation as apiCreateConversation, 
  updateConversation as apiUpdateConversation,
  archiveConversation as apiArchiveConversation,
  unarchiveConversation as apiUnarchiveConversation,
  deleteConversation as apiDeleteConversation,
  bulkDeleteConversations as apiBulkDeleteConversations
} from '@/utils/api';

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
    if (loading) {
      console.log('⏸️ Already loading, skipping fetch');
      return;
    }
    if (!hasMore && nextCursor === null) {
      console.log('⏸️ No more data to fetch (hasMore=false, nextCursor=null)');
      return;
    }
    
    set({ loading: true, error: null });
    try {
      console.log('📤 Fetching next page with cursor:', nextCursor, 'limit:', opts.limit ?? 10);
      const res = await listConversationsPage({ limit: opts.limit ?? 10, cursor: nextCursor, activeOnly: opts.activeOnly ?? true });
      
      console.log('📥 fetchNextPage response:', res);
      const items = res?.items || res?.data?.items || [];
      const cursor = res?.meta?.nextCursor || res?.nextCursor || null;
      
      console.log('📊 Received items:', items.length, 'nextCursor:', cursor, 'hasMore:', Boolean(cursor));
      
      set((state) => ({
        conversations: mergeUnique(state.conversations, items),
        nextCursor: cursor,
        hasMore: Boolean(cursor),
        loading: false,
      }));
    } catch (error) {
      console.error('❌ Error fetching next page:', error);
      set({ error: error.message || 'Failed to load conversations', loading: false, hasMore: false });
    }
  },

  createConversation: async (payload = {}) => {
    const row = await apiCreateConversation(payload);
    // Ensure new conversation appears at the top by prepending it
    set((state) => {
      const existing = state.conversations.filter(c => c.id !== row.id);
      // Sort all conversations by updatedAt to ensure proper order
      const merged = mergeUnique([{ ...row }], existing);
      return { conversations: merged };
    });
    return row;
  },

  // Insert or update a conversation row without calling the API
  upsertConversation: (row) => {
    if (!row || !row.id) return;
    set((state) => {
      // Ensure updated conversation appears at the top if it's the most recent
      const merged = mergeUnique([{ ...row }], state.conversations);
      return { conversations: merged };
    });
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

  archiveConversation: async (conversationId) => {
    const updated = await apiArchiveConversation(conversationId);
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== conversationId),
    }));
    return updated;
  },

  unarchiveConversation: async (conversationId) => {
    const updated = await apiUnarchiveConversation(conversationId);
    set((state) => ({
      conversations: mergeUnique([{ ...updated }], state.conversations),
    }));
    return updated;
  },

  deleteConversation: async (conversationId) => {
    await apiDeleteConversation(conversationId);
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== conversationId),
    }));
  },

  // Bulk delete multiple conversations
  bulkDeleteConversations: async (conversationIds = []) => {
    const ids = Array.from(new Set(conversationIds)).filter(Boolean);
    if (ids.length === 0) return { deletedCount: 0, deletedIds: [] };
    
    try {
      // Call the bulk delete endpoint
      const result = await apiBulkDeleteConversations(ids);
      const deletedIds = result?.deletedIds || result?.data?.deletedIds || [];
      
      // Only remove successfully deleted conversations from the UI
      if (deletedIds.length > 0) {
        set((state) => ({
          conversations: state.conversations.filter((c) => !deletedIds.includes(c.id)),
        }));
      }
      
      return result;
    } catch (error) {
      // If bulk delete fails, restore the conversations in the UI
      // The error will be handled by the calling component
      set({ error: error.message || 'Failed to delete conversations' });
      throw error;
    }
  },
}));

export default useChatListStore;


