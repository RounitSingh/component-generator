import React from "react"
import { EllipsisVertical, Archive, Trash2 } from "lucide-react"
import InfiniteScroll from "react-infinite-scroll-component"

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavArchived({
  items = [],
  onSelect,
  onLoadMore,
  hasMore,
  loading,
  onUnarchive,
  onDelete,
}) {
  // Memoize the load more callback
  const handleLoadMore = React.useCallback(() => {
    if (!loading && hasMore) {
      onLoadMore?.()
    }
  }, [onLoadMore, loading, hasMore])

  const handleUnarchive = async (item) => {
    try {
      await onUnarchive?.(item.id)
    } catch (e) {
      console.error('Failed to unarchive conversation', e)
    }
  }

  const handleDelete = (item) => {
    onDelete?.(item.id)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs text-white/60 font-medium uppercase tracking-wider mb-2">
        Archived
      </SidebarGroupLabel>
      <div 
        id="scrollableArchived"
        style={{ height: '20vh', overflowY: 'auto' }}
        className="pr-1 thin-dark-scrollbar group-data-[collapsible=icon]:hidden"
      >
        <InfiniteScroll
          dataLength={items.length}
          next={handleLoadMore}
          hasMore={hasMore && !loading}
          loader={
            loading ? (
              <div className="py-2 text-center text-xs text-neutral-500">
                Loading…
              </div>
            ) : null
          }
          endMessage={
            items.length > 0 ? (
              <div className="py-2 text-center text-xs text-neutral-500">
                No more
              </div>
            ) : null
          }
          scrollableTarget="scrollableArchived"
          scrollThreshold={0.8}
        >
        <SidebarMenu>
          {items.length === 0 ? (
            <div className="px-2 py-4 text-center text-xs text-neutral-500">
              No archived conversations
            </div>
          ) : (
            items.map((item) => (
            <SidebarMenuItem key={item.id} className="group/menu-item">
              <SidebarMenuButton
                asChild
                className="text-neutral-300 hover:bg-black hover:text-white data-[active=true]:bg-black data-[active=true]:text-white transition-colors text-sm rounded-md"
              >
                <button onClick={() => onSelect?.(item)}>
                  <span className="truncate">
                    {item.title || "Untitled"}
                  </span>
                </button>
              </SidebarMenuButton>
              <SidebarMenuAction className="text-neutral-500 hover:text-neutral-300 opacity-0 group-hover/menu-item:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="text-xs text-white/80 hover:text-white"
                      title="More options"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <EllipsisVertical size={12} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="bg-neutral-800 border-neutral-700 text-white min-w-[160px]"
                    align="end"
                  >
                    <DropdownMenuItem
                      className="text-white hover:bg-neutral-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleUnarchive(item)
                      }}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Unarchive
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-400 hover:bg-red-900/20 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(item)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuAction>
            </SidebarMenuItem>
            ))
          )}
        </SidebarMenu>
        </InfiniteScroll>
      </div>
    </SidebarGroup>
  )
}
