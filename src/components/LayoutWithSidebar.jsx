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

export default function LayoutWithSidebar({ children }) {
    const isMobile = useIsMobile()
  return (
    <SidebarProvider defaultOpen={false}>
      <AppSidebar />
    <SidebarInset className="flex w-full h-screen flex-col overflow-auto ">
        {isMobile && (
          <SidebarHeader className="bg-[#2A2A2A] border-b border-b-neutral-700">
            <div className="flex items-center justify-between text-white/60">
              <SidebarTrigger className="lg:hidden" />
            </div>
          </SidebarHeader>
        )}

      
        <div className="flex-1 min-h-0 overflow-x-hidden">
          {children}
        </div>
      </SidebarInset>

    </SidebarProvider>
  )
}


