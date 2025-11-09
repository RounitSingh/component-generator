
import React from "react"
import { Edit, EllipsisVertical, Archive, Trash2 } from "lucide-react"
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
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function NavRecents({
  items = [],
  onSelect,
  onLoadMore,
  hasMore,
  loading,
  onRename,
  onArchive,
  onDelete,
}) {
  const scrollContainerRef = React.useRef(null)
  const [renameModal, setRenameModal] = React.useState({
    isOpen: false,
    item: null,
  })
  const [title, setTitle] = React.useState("")

  // Memoize the load more callback to prevent unnecessary re-renders
  const handleLoadMore = React.useCallback(() => {
    if (!loading && hasMore) {
      onLoadMore?.()
    }
  }, [onLoadMore, loading, hasMore])

  const handleRenameClick = (item) => {
    setRenameModal({ isOpen: true, item })
    setTitle(item.title || "Untitled")
  }

  const handleRenameSubmit = async () => {
    if (renameModal.item && title.trim()) {
      onRename?.(renameModal.item, title.trim())
      setRenameModal({ isOpen: false, item: null })
      setTitle("")
    }
  }

  const handleArchive = async (item) => {
    try {
      await onArchive?.(item.id)
    } catch (e) {
      console.error('Failed to archive conversation', e)
    }
  }

  const handleDelete = (item) => {
    onDelete?.(item.id)
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs text-white/60 font-medium uppercase tracking-wider mb-2">
        Recents
      </SidebarGroupLabel>
      <div 
        id="scrollableRecents"
        ref={scrollContainerRef} 
        style={{ height: '50vh', overflowY: 'auto' }}
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
            <div className="py-2 text-center text-xs text-neutral-500">
              No more conversations
            </div>
          }
          scrollableTarget="scrollableRecents"
          scrollThreshold={0.8}
        >
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.id} className="group/menu-item">
              <SidebarMenuButton
                asChild
                className="text-neutral-300 hover:bg-black hover:text-white data-[active=true]:bg-black data-[active=true]:text-white transition-colors text-sm rounded-md"
              >
                <button onClick={() => onSelect?.(item)}>
                  <span className="truncate group-data-[collapsible=icon]/sidebar-wrapper:hidden">
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
                        handleRenameClick(item)
                      }}
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-white hover:bg-neutral-700 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleArchive(item)
                      }}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
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
          ))}
        </SidebarMenu>
        </InfiniteScroll>
      </div>

      {/* Rename Dialog */}
      <Dialog
        open={renameModal.isOpen}
        onOpenChange={(open) =>
          setRenameModal({ isOpen: open, item: open ? renameModal.item : null })
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
              onClick={() => setRenameModal({ isOpen: false, item: null })}
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
    </SidebarGroup>
  )
}
