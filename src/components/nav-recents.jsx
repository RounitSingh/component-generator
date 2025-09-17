// import React from "react"
// import { Edit, EllipsisVertical } from "lucide-react"

// import {
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuAction,
//   SidebarMenuButton,
//   SidebarMenuItem,
// } from "@/components/ui/sidebar"

// export function NavRecents({ items = [], onSelect, onLoadMore, hasMore, loading, onRename }) {
//   const sentinelRef = React.useRef(null);
//   React.useEffect(() => {
//     if (!hasMore || loading) return;
//     const el = sentinelRef.current;
//     if (!el) return;
//     const io = new IntersectionObserver((entries) => {
//       entries.forEach((entry) => {
//         if (entry.isIntersecting) {
//           onLoadMore?.();
//         }
//       });
//     }, { root: el.parentElement, rootMargin: '100px', threshold: 0 });
//     io.observe(el);
//     return () => io.disconnect();
//   }, [hasMore, loading, onLoadMore]);
//   return (
//     <SidebarGroup>
//       <SidebarGroupLabel className="text-xs text-white/60 font-medium uppercase tracking-wider mb-2">Recents</SidebarGroupLabel>
//       <div className="overflow-y-auto max-h-[50vh] pr-1 thin-dark-scrollbar">
//         <SidebarMenu>
//           {items.map((item) => (
//             <SidebarMenuItem key={item.id} className="group/menu-item">
//               <SidebarMenuButton asChild  className="text-neutral-300 hover:bg-black hover:text-white data-[active=true]:bg-black data-[active=true]:text-white transition-colors text-sm rounded-md">
//                 <button onClick={() => onSelect?.(item)}>
//                   <span className="truncate group-data-[collapsible=icon]/sidebar-wrapper:hidden">{item.title || 'Untitled'}</span>
//                 </button>
//               </SidebarMenuButton>
//               <SidebarMenuAction className="text-neutral-500 hover:text-neutral-300 opacity-0 group-hover/menu-item:opacity-100 transition-opacity">
//                 <button
//                   className="text-xs text-white/80 hover:text-white"
//                   title="Rename"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     const next = prompt('Rename chat', item.title || 'Untitled');
//                     if (next && next.trim()) onRename?.(item, next.trim());
//                   }}
//                 >
//                   <Edit size={12} />
//                 </button>
//               </SidebarMenuAction>
//             </SidebarMenuItem>
//           ))}
//         </SidebarMenu>
//         <div ref={sentinelRef} className="py-2 text-center text-xs text-neutral-500">
//           {hasMore ? (loading ? 'Loading…' : 'Scroll to load more') : 'No more'}
//         </div>
//       </div>
//     </SidebarGroup>
//   );
// }
import React from "react"
import { Edit } from "lucide-react"

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

export function NavRecents({
  items = [],
  onSelect,
  onLoadMore,
  hasMore,
  loading,
  onRename,
}) {
  const sentinelRef = React.useRef(null)
  const [renameModal, setRenameModal] = React.useState({
    isOpen: false,
    item: null,
  })
  const [title, setTitle] = React.useState("")

  React.useEffect(() => {
    if (!hasMore || loading) return
    const el = sentinelRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            onLoadMore?.()
          }
        })
      },
      { root: el.parentElement, rootMargin: "100px", threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hasMore, loading, onLoadMore])

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

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-xs text-white/60 font-medium uppercase tracking-wider mb-2">
        Recents
      </SidebarGroupLabel>
      <div className="overflow-y-auto max-h-[50vh] pr-1 thin-dark-scrollbar">
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
                <button
                  className="text-xs text-white/80 hover:text-white"
                  title="Rename"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRenameClick(item)
                  }}
                >
                  <Edit size={12} />
                </button>
              </SidebarMenuAction>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div
          ref={sentinelRef}
          className="py-2 text-center text-xs text-neutral-500"
        >
          {hasMore ? (loading ? "Loading…" : "Scroll to load more") : "No more"}
        </div>
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
