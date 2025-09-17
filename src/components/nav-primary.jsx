import { Plus, MessageSquare, Archive } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavPrimary({ onNewChat, items }) {
  return (
    <SidebarGroup>

      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={onNewChat} variant="outline"  className="  hover:bg-blue-400/10">
          <div className="-ml-1 rounded-full p-1 bg-blue-500 cursor-pointer text-white">
            <Plus size={16} data-icon />
            </div>
            <span className="group-data-[collapsible=icon]/sidebar-wrapper:hidden text-blue-400 font-medium">New chat</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {items?.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild isActive={item.isActive}  className="text-neutral-300 hover:bg-black hover:text-white data-[active=true]:bg-black data-[active=true]:text-white transition-colors">
              <a href={item.url}>
                {item.title === "Chats" && <MessageSquare className="size-4" />}
                {item.title === "Archived" && <Archive className="size-4" />}
                <span className="group-data-[collapsible=icon]/sidebar-wrapper:hidden">{item.title}</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
