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

import { NavPrimary } from "@/components/nav-primary"
import { NavRecents } from "@/components/nav-recents"
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
import useAuthStore from "@/store/authStore"
import useChatListStore from "@/store/chatListStore"
import useChatSessionStore from "@/store/chatSessionStore"
import { useNavigate } from "react-router-dom"
import { useIsMobile } from "./hooks/use-mobile"

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
    { title: "Chats", url: "/chat", isActive: false },
    { title: "Archived", url: "/chat/archived", isActive: false },
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
   const conversations = useChatListStore((s) => s.conversations);
   const hasMore = useChatListStore((s) => s.hasMore);
   const loading = useChatListStore((s) => s.loading);
  const fetchNextPage = useChatListStore((s) => s.fetchNextPage);
  const createConversation = useChatListStore((s) => s.createConversation);
  const upsertConversation = useChatListStore((s) => s.upsertConversation);
  const renameConversation = useChatListStore((s) => s.renameConversation);
  const resetChatList = useChatListStore((s) => s.reset);
   const selectConversation = useChatSessionStore((s) => s.selectConversation);
  const resetChatSession = useChatSessionStore((s) => s.reset);

  // On user change: clear in-memory chat data and fetch fresh from backend
  React.useEffect(() => {
    // Reset sidebar conversations and any per-conversation session state
    resetChatSession();
    resetChatList();
    // Fetch initial page for the current user
    fetchNextPage({ limit: 10 });
  }, [resetChatList, resetChatSession, fetchNextPage, user?.id]);

  const handleSelectRecent = React.useCallback((item) => {
    selectConversation(item.id);
    navigate(`/chat/${item.id}`);
  }, [selectConversation, navigate]);
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
        <NavPrimary items={data.primary} onNewChat={async () => {
          const row = await createConversation({ title: 'New Chat' });
          upsertConversation({ ...row });
          await selectConversation(row.id);
          navigate(`/chat/${row.id}`);
        }} />
        <div className="thin-dark-scrollbar overflow-y-auto pr-1 group-data-[collapsible=icon]:hidden">
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
          />
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-neutral-800">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
