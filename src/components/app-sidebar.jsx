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
    { title: "Chats", url: "/chatbot", isActive: false },
    { title: "Archived", url: "/chatbot/archived", isActive: false },
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
  return (
    <Sidebar
      collapsible="icon"
     
      className="bg-[#1B1B1B] text-neutral-200 border-r border-neutral-800 [&_[data-slot=sidebar-inner]]:bg-[#1B1B1B]"
      {...props}>
      <SidebarHeader>
        <SidebarTrigger className=""  />
      </SidebarHeader>
      <SidebarContent className="gap-3">
        <NavPrimary items={data.primary} onNewChat={() => { /* hook up to action */ }} />
        <div className="thin-dark-scrollbar overflow-y-auto pr-1 group-data-[collapsible=icon]:hidden">
          <NavRecents items={data.recents} />
        </div>
      </SidebarContent>
      <SidebarFooter className="border-t border-neutral-800">
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
