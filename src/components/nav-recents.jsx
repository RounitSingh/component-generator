import { EllipsisVertical, MessageSquareText } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavRecents({ items = [] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs text-white/60 font-medium uppercase tracking-wider mb-2">Recents</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <SidebarMenuItem key={item.id} className="group/menu-item">
            <SidebarMenuButton asChild  className="text-neutral-300 hover:bg-black hover:text-white data-[active=true]:bg-black data-[active=true]:text-white transition-colors text-sm rounded-md">
              <a href={item.url}>
                
                <span className="truncate group-data-[collapsible=icon]/sidebar-wrapper:hidden">{item.title}</span>
              </a>
            </SidebarMenuButton>
            <SidebarMenuAction className="text-neutral-500 hover:text-neutral-300 opacity-0 group-hover/menu-item:opacity-100 transition-opacity">
              <EllipsisVertical className="size-4 text-white cursor-pointer" />
            </SidebarMenuAction>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
