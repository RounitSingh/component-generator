import { Plus, MessageSquare, Archive } from "lucide-react"
import { Link } from "react-router-dom"
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavPrimary({ onNewChat, items, onToggleArchived, showArchived }) {
  return (
    <SidebarGroup>
      <SidebarMenu>
        {/* New Chat Button */}
        <SidebarMenuItem>
          <SidebarMenuButton onClick={onNewChat} variant="outline" className="hover:bg-blue-400/10">
            <div className="-ml-1 mb-1 rounded-full p-1 bg-blue-500 text-white">
              <Plus size={16} />
            </div>
            <span className="group-data-[collapsible=icon]/sidebar-wrapper:hidden text-blue-400 font-medium">
              New chat
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>

        {/* Navigation Items */}
        {items?.map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              asChild={item.title !== "Archived"}
              isActive={item.isActive || (item.title === "Archived" && showArchived)}  
              className="text-neutral-300 hover:bg-black mb-1 hover:text-white data-[active=true]:bg-black data-[active=true]:text-white transition-colors"
              onClick={item.title === "Archived" ? onToggleArchived : undefined}
            >
              {item.title === "Archived" ? (
                <>
                  <Archive className="size-4" />
                  <span className="group-data-[collapsible=icon]/sidebar-wrapper:hidden">{item.title}</span>
                </>
              ) : (
                <Link to={item.url}>
                  <MessageSquare className="size-4" />
                  <span className="group-data-[collapsible=icon]/sidebar-wrapper:hidden">{item.title}</span>
                </Link>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
