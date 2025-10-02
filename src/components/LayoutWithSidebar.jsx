import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useIsMobile } from "@/hooks/use-mobile"
import { MessageSquare,  Monitor } from 'lucide-react'
import useMobileViewStore from '../store/mobileViewStore'

export default function LayoutWithSidebar({ children }) {
    const isMobile = useIsMobile()
    const { currentView, toggleView } = useMobileViewStore()
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
    <SidebarInset className={`flex w-full flex-col overflow-hidden ${isMobile ? 'h-[100dvh]' : 'h-screen'}`}>
        {isMobile && (
          <SidebarHeader className="bg-[#2A2A2A] border-b border-b-neutral-700 flex-shrink-0">
            <div className="flex items-center justify-between text-white/60">
              <SidebarTrigger className="lg:hidden" title=" Sidebar" />
              {/* Mobile View Toggle Button */}
              <button
  onClick={toggleView}
  className="flex items-center gap-2 text-xs bg-[#0f0f0f] cursor-pointer text-gray-300 hover:text-gray-200 px-2 py-1.5 rounded-md transition-colors "
  title={currentView === 'chat' ? 'Switch to Preview' : 'Switch to Chat'}
>
  {currentView === 'chat' ? (
    <>
      <Monitor className="w-4 h-4" /> Preview
    </>
  ) : (
    <>
      <MessageSquare className="w-4 h-4" /> Chat
    </>
  )}
</button>

            </div>
          </SidebarHeader>
        )}

      
        <div className={`flex-1 min-h-0 ${isMobile ? 'overflow-hidden' : 'overflow-x-hidden'}`}>
          {children}
        </div>
      </SidebarInset>

    </SidebarProvider>
  )
}


