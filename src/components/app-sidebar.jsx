"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
  StarsIcon,
} from "lucide-react"
import { LayoutDashboard, MessageSquare, Archive } from "lucide-react"
import { NavPrimary } from "@/components/nav-primary"
import { NavRecents } from "@/components/nav-recents"
import { NavArchived } from "@/components/nav-archived"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import useAuthStore from "@/store/authStore"
import useChatListStore from "@/store/chatListStore"
import useArchivedChatStore from "@/store/archivedChatStore"
import useChatSessionStore from "@/store/chatSessionStore"
import { useNavigate } from "react-router-dom"
import { useIsMobile } from "@/hooks/use-mobile"

// This is sample data.
const data = {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  teams: [
    {
      name: "GenUI Studio",
      logo: StarsIcon,
      plan: "Free",
    },
    
  ],
  primary: [
  //  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, isActive: false },
    { title: "Chats", url: "/chat-history", icon: MessageSquare, isActive: false },
    { title: "Archived", icon: Archive, isActive: false },
  ],
  recents: [
    { id: "1", title: "Modern Dark UI Design Styling", url: "#" },
    { id: "2", title: "UI Design Color Adjustment", url: "#" },
    { id: "3", title: "React MessageItem Component", url: "#" },
    { id: "4", title: "3D Interactive Animations", url: "#" },
    { id: "5", title: "Modern Dashboard Layout", url: "#" },
  ],
}

export function AppSidebar({
  ...props
}) {
   const { user } = useAuthStore();
   const navigate = useNavigate();
   const [showArchived, setShowArchived] = React.useState(false);
   const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
   const [conversationToDelete, setConversationToDelete] = React.useState(null);
   const [isArchivedConversation, setIsArchivedConversation] = React.useState(false);
   const conversations = useChatListStore((s) => s.conversations);
   const hasMore = useChatListStore((s) => s.hasMore);
   const loading = useChatListStore((s) => s.loading);
  const fetchNextPage = useChatListStore((s) => s.fetchNextPage);
  const createConversation = useChatListStore((s) => s.createConversation);
  const upsertConversation = useChatListStore((s) => s.upsertConversation);
  const renameConversation = useChatListStore((s) => s.renameConversation);
  const archiveConversation = useChatListStore((s) => s.archiveConversation);
  const unarchiveConversation = useChatListStore((s) => s.unarchiveConversation);
  const deleteConversation = useChatListStore((s) => s.deleteConversation);
  const resetChatList = useChatListStore((s) => s.reset);
  
  // Archived chats
  const archivedConversations = useArchivedChatStore((s) => s.conversations);
  const archivedHasMore = useArchivedChatStore((s) => s.hasMore);
  const archivedLoading = useArchivedChatStore((s) => s.loading);
  const fetchArchivedNextPage = useArchivedChatStore((s) => s.fetchNextPage);
  const deleteArchivedConversation = useArchivedChatStore((s) => s.deleteConversation);
  const resetArchivedChatList = useArchivedChatStore((s) => s.reset);
  
   const selectConversation = useChatSessionStore((s) => s.selectConversation);
  const resetChatSession = useChatSessionStore((s) => s.reset);

  // On user change: clear in-memory chat data and fetch fresh from backend
  React.useEffect(() => {
    if (!user?.id) return;
    
    // Reset sidebar conversations and any per-conversation session state
    resetChatSession();
    resetChatList();
    resetArchivedChatList();
    
    // Fetch initial page for the current user
    fetchNextPage({ limit: 10 });
    fetchArchivedNextPage({ limit: 10 });
  }, [user?.id, resetChatList, resetChatSession, resetArchivedChatList, fetchNextPage, fetchArchivedNextPage]);

  const handleSelectRecent = React.useCallback((item) => {
    selectConversation(item.id);
    navigate(`/chat/${item.id}`);
  }, [selectConversation, navigate]);

  const handleSelectArchived = React.useCallback((item) => {
    selectConversation(item.id);
    navigate(`/chat/${item.id}`);
  }, [selectConversation, navigate]);

  const handleArchive = React.useCallback(async (conversationId) => {
    try {
      // Get the item before archiving it
      const itemToArchive = conversations.find(c => c.id === conversationId);
      await archiveConversation(conversationId);
      // The store automatically removes the item from active conversations
      // Now add it to the archived conversations list
      if (itemToArchive) {
        const archivedStore = useArchivedChatStore.getState();
        archivedStore.upsertConversation({ ...itemToArchive, isActive: false });
      }
    } catch (e) {
      console.error('Failed to archive conversation', e);
    }
  }, [archiveConversation, conversations]);

  const handleUnarchive = React.useCallback(async (conversationId) => {
    try {
      await unarchiveConversation(conversationId);
      // The chatListStore automatically adds the item back to active conversations
      // Now remove it from the archived conversations list
      const archivedStore = useArchivedChatStore.getState();
      archivedStore.removeConversation(conversationId);
    } catch (e) {
      console.error('Failed to unarchive conversation', e);
    }
  }, [unarchiveConversation]);

  const handleDelete = React.useCallback((conversationId) => {
    setConversationToDelete(conversationId);
    setIsArchivedConversation(false);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteArchived = React.useCallback((conversationId) => {
    setConversationToDelete(conversationId);
    setIsArchivedConversation(true);
    setDeleteModalOpen(true);
  }, []);

  const confirmDelete = React.useCallback(async () => {
    if (!conversationToDelete) return;
    
    try {
      if (isArchivedConversation) {
        await deleteArchivedConversation(conversationToDelete);
      } else {
        await deleteConversation(conversationToDelete);
      }
      // No need to refresh as the store already removes the item
    } catch (e) {
      console.error('Failed to delete conversation', e);
    } finally {
      setDeleteModalOpen(false);
      setConversationToDelete(null);
      setIsArchivedConversation(false);
    }
  }, [conversationToDelete, isArchivedConversation, deleteConversation, deleteArchivedConversation]);

  const cancelDelete = React.useCallback(() => {
    setDeleteModalOpen(false);
    setConversationToDelete(null);
    setIsArchivedConversation(false);
  }, []);

  const handleToggleArchived = React.useCallback(() => {
    setShowArchived(prev => !prev);
  }, []);
   const isMobile = useIsMobile();
  return (
    <Sidebar
      collapsible="icon"
     
      className="bg-[#1B1B1B] text-neutral-200 border-r border-neutral-800 [&_[data-slot=sidebar-inner]]:bg-[#1B1B1B]"
      {...props}>
      <SidebarHeader>
        <SidebarTrigger className={isMobile ? "text-white/60" : ""} />

      </SidebarHeader>
      <SidebarContent className="gap-3">
        <NavPrimary 
          items={data.primary} 
          onNewChat={async () => {
            const row = await createConversation({ title: 'New Chat' });
            upsertConversation({ ...row });
            await selectConversation(row.id);
            navigate(`/chat/${row.id}`);
          }}
          onToggleArchived={handleToggleArchived}
          showArchived={showArchived}
        />
        <div className="thin-dark-scrollbar overflow-y-auto pr-1 group-data-[collapsible=icon]:overflow-hidden group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:pointer-events-none">
          {showArchived && (
            <NavArchived
              items={archivedConversations}
              onSelect={handleSelectArchived}
              onLoadMore={() => fetchArchivedNextPage({ limit: 10 })}
              hasMore={archivedHasMore}
              loading={archivedLoading}
              onUnarchive={handleUnarchive}
              onDelete={handleDeleteArchived}
            />
          )}
          <NavRecents
            items={conversations}
            onSelect={handleSelectRecent}
            onLoadMore={() => fetchNextPage({ limit: 10 })}
            hasMore={hasMore}
            loading={loading}
            onRename={async (item, title) => {
              try {
                await renameConversation(item.id, title);
              } catch (e) {
                console.error('Failed to rename conversation', e);
              }
            }}
            onArchive={handleArchive}
            onDelete={handleDelete}
          />
        </div>
      </SidebarContent>
      <SidebarFooter 
     
         className="border-t border-neutral-800 p-0"
      >
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
      
      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <DialogContent className="bg-[#1B1B1B] text-white border p-8 border-neutral-700">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Conversation</DialogTitle>
          </DialogHeader>
          <p className="text-neutral-300 text-sm mt-2">
            Are you sure you want to delete this conversation? This action cannot be undone.
          </p>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="ghost"
              className="text-neutral-300 hover:text-white hover:bg-neutral-800"
              onClick={cancelDelete}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
