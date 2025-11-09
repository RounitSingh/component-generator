import React, { useEffect, useState } from "react";
import useChatListStore from "@/store/chatListStore";
import useArchivedChatStore from "@/store/archivedChatStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Search, Trash2, Archive, X, Plus, MoreVertical, Edit } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import InfiniteScroll from "react-infinite-scroll-component";

const ChatHistory = () => {
  const { conversations, fetchNextPage, loading, hasMore, bulkDeleteConversations, createConversation, renameConversation, archiveConversation, deleteConversation } = useChatListStore();
  const [selectedChats, setSelectedChats] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [creating, setCreating] = useState(false);
  const [renameModal, setRenameModal] = useState({ isOpen: false, chat: null });
  const [title, setTitle] = useState("");

  // Memoize the load more callback
  const handleLoadMore = React.useCallback(() => {
    if (!loading && hasMore) {
      fetchNextPage({ limit: 20 });
    }
  }, [fetchNextPage, loading, hasMore]);

  // Fetch first page of conversations on mount
  useEffect(() => {
    // Only fetch if we don't have any conversations loaded
    if (conversations.length === 0 && !loading) {
      fetchNextPage({ limit: 20 });
    }
  }, [fetchNextPage, conversations.length, loading]);

  // Toggle selection of a single chat
  const toggleSelect = (id) => {
    setSelectedChats((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  // Filter chats based on search query
  const filteredConversations = conversations.filter((chat) =>
    (chat.title || "Untitled Chat").toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Toggle selection of all filtered chats
  const toggleSelectAll = () => {
    if (selectedChats.size === filteredConversations.length && filteredConversations.length > 0) {
      setSelectedChats(new Set());
    } else {
      setSelectedChats(new Set(filteredConversations.map((c) => c.id)));
    }
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    if (!date) return "unknown";
    const now = new Date();
    const chatDate = new Date(date);
    const diffMs = now - chatDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "in 1 minute";
    if (diffMins === 1) return "in 1 minute";
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours === 1) return "1 hour ago";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "1 day ago";
    return `${diffDays} days ago`;
  };

  const allSelected = selectedChats.size === filteredConversations.length && filteredConversations.length > 0;

  const handleBulkDelete = async () => {
    if (selectedChats.size === 0 || deleting) return;
    setDeleting(true);
    try {
      const idsToDelete = Array.from(selectedChats);
      const result = await bulkDeleteConversations(idsToDelete);
      
      // Clear selection after successful deletion
      setSelectedChats(new Set());
      
      // Optional: Show success message if needed
      if (result?.deletedCount !== undefined) {
        console.log(`Successfully deleted ${result.deletedCount} conversation(s)`);
      }
    } catch (error) {
      // Error is already handled in the store, but we can show user feedback here if needed
      console.error('Failed to delete conversations:', error);
      // Don't clear selection on error so user can retry
    } finally {
      setDeleting(false);
    }
  };

  const handleBulkArchive = async () => {
    if (selectedChats.size === 0 || archiving) return;
    setArchiving(true);
    try {
      const ids = Array.from(selectedChats);
      const archivedStore = useArchivedChatStore.getState();
      await Promise.all(
        ids.map(async (id) => {
          const item = conversations.find((c) => c.id === id);
          try {
            await archiveConversation(id);
            if (item) {
              archivedStore.upsertConversation({ ...item, isActive: false });
            }
          } catch {
            // ignore individual failures
          }
        })
      );
      setSelectedChats(new Set());
    } finally {
      setArchiving(false);
    }
  };

  const handleNewChat = async () => {
    if (creating) return;
    setCreating(true);
    try {
      await createConversation({});
    } finally {
      setCreating(false);
    }
  };

  const handleRename = (chat) => {
    setRenameModal({ isOpen: true, chat });
    setTitle(chat.title || "Untitled");
  };

  const handleRenameSubmit = async () => {
    if (!renameModal.chat || !title.trim()) return;
    try {
      await renameConversation(renameModal.chat.id, title.trim());
      setRenameModal({ isOpen: false, chat: null });
      setTitle("");
    } catch {
      // 
    }
  };

  const handleArchive = async (chat) => {
    try {
      await archiveConversation(chat.id);
      setSelectedChats((prev) => {
        const ns = new Set(prev);
        ns.delete(chat.id);
        return ns;
      });
    } catch {
      // 
    }
  };

  const handleDelete = async (chat) => {
    try {
      await deleteConversation(chat.id);
      setSelectedChats((prev) => {
        const ns = new Set(prev);
        ns.delete(chat.id);
        return ns;
      });
    } catch {
      // 
    }
  };

  return (
    <div className="h-screen  flex flex-col max-w-5xl mx-auto bg-[#222222]">
      {/* Header */}
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-sans text-slate-200">Your chat history</h1>
          <button onClick={handleNewChat} className="flex items-center gap-2 px-4 py-2 bg-white text-[#1a1a1a] rounded-md hover:bg-gray-100 transition-all duration-150 text-sm font-medium disabled:opacity-70" disabled={creating}>
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
            {creating ? 'Creating...' : 'New chat'}
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search your chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#2d2d2d] border border-[#3d3d3d] rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 text-[14px] text-[#d4d4d4] placeholder-gray-500 transition-all duration-150"
          />
        </div>
      </div>

      {/* Action Bar */}
      {selectedChats.size > 0 && (
        <div className="flex-shrink-0 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Checkbox state reflects 'allSelected' */}
            <button 
              onClick={toggleSelectAll}
              className={`flex items-center justify-center w-5 h-5 rounded-sm border ${
                allSelected ? "border-blue-500 bg-blue-500" : "border-gray-500 bg-transparent"
              } hover:bg-blue-600 transition-all duration-150`}
            >
              {allSelected && (
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
            <span className="text-[14px] text-[#d4d4d4]">
              {selectedChats.size} selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleBulkArchive} className="p-2 hover:bg-[#353535] rounded transition-all duration-150 disabled:opacity-60" disabled={archiving || deleting}>
              {archiving ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-300" />
              ) : (
                <Archive className="w-4 h-4 text-gray-400 hover:text-gray-300" />
              )}
            </button>
            <button onClick={handleBulkDelete} className="p-2 hover:bg-[#353535] rounded transition-all duration-150 disabled:opacity-60" disabled={deleting}>
              {deleting ? (
                <Loader2 className="w-4 h-4 animate-spin text-gray-300" />
              ) : (
                <Trash2 className="w-4 h-4 text-gray-400 hover:text-gray-300" />
              )}
            </button>
            <button 
              onClick={() => setSelectedChats(new Set())}
              className="p-2 hover:bg-[#353535] rounded transition-all duration-150"
            >
              <X className="w-4 h-4 text-gray-400 hover:text-gray-300" />
            </button>
          </div>
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 flex flex-col px-6 py-2 min-h-0">
        {conversations.length === 0 && !loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 text-base mb-2">No conversations yet</p>
              <p className="text-gray-500 text-sm">Start a new chat to see it here</p>
            </div>
          </div>
        ) : (
          <div 
            id="scrollableChatHistory"
            className="flex-1 overflow-y-auto pr-1"
          >
            <InfiniteScroll
              dataLength={filteredConversations.length}
              next={handleLoadMore}
              hasMore={hasMore && !loading}
              loader={
                loading ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <Loader2 className="animate-spin mb-2 w-5 h-5 text-blue-400" />
                    <span className="text-[14px]">Loading more chats...</span>
                  </div>
                ) : null
              }
              endMessage={
                <div className="py-4 text-center text-gray-500 text-sm">
                  {filteredConversations.length === 0 
                    ? "No conversations match your search" 
                    : "You've reached the end of your chat history"}
                </div>
              }
              scrollableTarget="scrollableChatHistory"
              scrollThreshold={0.8}
            >
              <div className="space-y-3">
                {filteredConversations.map((chat) => (
                  <div
                    key={chat.id}
                    className={`group flex items-center justify-between gap-3 px-4 py-3.5 rounded-lg border transition-all duration-100 cursor-pointer ${
                      selectedChats.has(chat.id)
                        ? "bg-[#2a3a4d] border-blue-500"
                        : "bg-transparent border-[#3a3a3a] hover:bg-[#2a2a2a]"
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0" onClick={() => toggleSelect(chat.id)}>
                      <div className="pt-0.5">
                        <Checkbox
                          checked={selectedChats.has(chat.id)}
                          onCheckedChange={() => toggleSelect(chat.id)}
                          className="data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 border-[#4a4a4a] bg-transparent hover:border-[#5a5a5a] rounded-sm w-4 h-4"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-normal text-white mb-1 leading-tight">
                          {chat.title || "Untitled"}
                        </p>
                        <p className="text-[13px] text-gray-500">
                          Last message {formatTimeAgo(chat.updatedAt)}
                        </p>
                      </div>
                    </div>
                    {/* 3 dots dropdown menu */}
                    <DropdownMenu >
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 hover:bg-[#2e2e2e] rounded transition-all duration-150" onClick={(e) => e.stopPropagation()}>
                          <MoreVertical className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-[#1c1c1c] border-neutral-700 text-white min-w-[160px]" align="end" onClick={(e) => e.stopPropagation()}>
                        <DropdownMenuItem className="text-white hover:bg-neutral-700 cursor-pointer" onClick={() => handleRename(chat)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Rename
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-white hover:bg-neutral-700 cursor-pointer" onClick={() => handleArchive(chat)}>
                          <Archive className="mr-2 h-4 w-4" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:bg-red-900/20 cursor-pointer" onClick={() => handleDelete(chat)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          </div>
        )}
      </div>
      {/* Rename Dialog (same UX as sidebar) */}
      <Dialog
        open={renameModal.isOpen}
        onOpenChange={(open) =>
          setRenameModal({ isOpen: open, chat: open ? renameModal.chat : null })
        }
      >
        <DialogContent className="bg-neutral-900 text-white border p-8 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white">Rename Chat</DialogTitle>
          </DialogHeader>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter chat name"
            className="bg-neutral-800 p-2 text-white rounded-lg border-neutral-600 "
          />
          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="ghost"
              className="text-neutral-300 hover:text-white hover:bg-neutral-800"
              onClick={() => setRenameModal({ isOpen: false, chat: null })}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRenameSubmit}
              disabled={!title.trim()}
              className="bg-blue-500 hover:bg-blue-500 text-white/90"
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChatHistory;
