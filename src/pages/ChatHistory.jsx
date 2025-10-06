import React, { useEffect, useState } from "react";
import useChatListStore from "@/store/chatListStore";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Search, Trash2, Archive, X, Plus, MoreVertical } from "lucide-react"; // Added MoreVertical

const ChatHistory = () => {
  const { conversations, fetchNextPage, loading } = useChatListStore();
  const [selectedChats, setSelectedChats] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch first page of conversations on mount
  useEffect(() => {
    fetchNextPage({ limit: 20 });
  }, [fetchNextPage]);

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

  return (
    <div className="p-6 min-h-screen max-w-5xl mx-auto bg-[#222222]">
      {/* Header */}
      <div className="px-6 py-2">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-sans text-slate-200">Your chat history</h1>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#1a1a1a] rounded-md hover:bg-gray-100 transition-all duration-150 text-sm font-medium">
            <Plus className="w-4 h-4" />
            New chat
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
        <div className="px-6 py-3 flex items-center justify-between">
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
            <button className="p-2 hover:bg-[#353535] rounded transition-all duration-150">
              <Archive className="w-4 h-4 text-gray-400 hover:text-gray-300" />
            </button>
            <button className="p-2 hover:bg-[#353535] rounded transition-all duration-150">
              <Trash2 className="w-4 h-4 text-gray-400 hover:text-gray-300" />
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
      <div className="px-6 py-2">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <Loader2 className="animate-spin mb-3 w-6 h-6 text-blue-400" />
            <span className="text-[14px]">Loading your chats...</span>
          </div>
        ) : conversations.length === 0 ? (
          <div className="py-32 text-center">
            <p className="text-gray-400 text-base mb-2">No conversations yet</p>
            <p className="text-gray-500 text-sm">Start a new chat to see it here</p>
          </div>
        ) : (
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
                {/* 3 dots menu icon */}
                <button className="p-1 hover:bg-[#353535] rounded transition-all duration-150">
                  <MoreVertical className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistory;
