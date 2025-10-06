// import {
//   BadgeCheck,
//   Bell,
//   ChevronsUpDown,
//   CreditCard,
//   LogOut,
//   Sparkles,
// } from "lucide-react"

// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuGroup,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar"
// import useAuthStore from "@/store/authStore";
// import { useNavigate } from "react-router-dom";

// export function NavUser({
//   user
// }) {
//    const { logout } = useAuthStore();
//   const { isMobile } = useSidebar();
//    const navigate = useNavigate();
//     const handleLogout = () => {
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('refreshToken');
//     logout();
//     navigate('/');
//   }

//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton
//               size="lg"
//               className=" hover:bg-neutral-800/50 text-neutral-200 data-[state=open]:bg-neutral-800 data-[state=open]:text-white transition-colors">
//               <Avatar className="h-8 w-8 rounded-full ring-2 ring-neutral-700">
//                 <AvatarImage src={user.avatar} alt={user.name} />
//                 <AvatarFallback className="rounded-full bg-neutral-700 text-neutral-200 font-semibold">R</AvatarFallback>
//               </Avatar>
//               <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]/sidebar-wrapper:hidden">
//                 <span className="truncate font-semibold text-white">{user.name}</span>
//                 <span className="truncate text-xs text-neutral-400">Free plan</span>
//               </div>
//               <ChevronsUpDown className="ml-auto size-4 text-neutral-400" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             className="w-[--radix-dropdown-menu-trigger-width]  text-white/70 rounded-lb-sm rounded-t-lg rounded bg-neutral-800 min-w-56 rounded-lg"
//             side={isMobile ? "bottom" : "right"}
//             align="end"
//             sideOffset={4}>
//             <DropdownMenuLabel className="p-0 border-b pb-2 font-normal">
//               <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
//                 <Avatar className="h-8 w-8 rounded-lg">
//                   <AvatarImage src={user.avatar} alt={user.name} />
//                   <AvatarFallback className="rounded-lg">CN</AvatarFallback>
//                 </Avatar>
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-semibold">{user.name}</span>
//                   <span className="truncate text-xs">{user.email}</span>
//                 </div>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <Sparkles />
//                 Upgrade to Pro
//               </DropdownMenuItem>
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuGroup>
//               <DropdownMenuItem>
//                 <BadgeCheck />
//                 Account
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <CreditCard />
//                 Billing
//               </DropdownMenuItem>
//               <DropdownMenuItem>
//                 <Bell />
//                 Notifications
//               </DropdownMenuItem>
//             </DropdownMenuGroup>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onClick={handleLogout} className="text-red-400 hover:bg-red-400/10 ">
//               <LogOut />
//               Log out
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// }


import {   
  BadgeCheck,   
  Bell,   
  ChevronsUpDown,   
  CreditCard,   
  LogOut,   
  Sparkles, 
} from "lucide-react";

import {   
  Avatar,   
  AvatarFallback,   
  AvatarImage, 
} from "@/components/ui/avatar";

import {   
  DropdownMenu,   
  DropdownMenuContent,   
  DropdownMenuGroup,   
  DropdownMenuItem,   
  DropdownMenuLabel,   
  DropdownMenuSeparator,   
  DropdownMenuTrigger, 
} from "@/components/ui/dropdown-menu";

import {   
  SidebarMenu,   
  SidebarMenuButton,   
  SidebarMenuItem,   
} from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar-utils";

import useAuthStore from "@/store/authStore";
import useChatListStore from "@/store/chatListStore";
import useChatSessionStore from "@/store/chatSessionStore";
import { useNavigate } from "react-router-dom";

// Helper to get initials
const getInitials = (name) => {
  if (!name) return "U"; // fallback for undefined
  const words = name.trim().split(" ");
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};

// Bright color palette
const avatarColors = [
  "bg-pink-500",
  "bg-purple-500",
  "bg-indigo-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-orange-500",
  "bg-red-500",
];

// Pick color based on username hash
const getAvatarColor = (name) => {
  if (!name) return "bg-gray-500";
  const index = name
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0) % avatarColors.length;
  return avatarColors[index];
};

export function NavUser({user}) {
  const { logout } = useAuthStore();
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const resetChatList = useChatListStore((s) => s.reset);
  const resetChatSession = useChatSessionStore((s) => s.reset);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Clear in-memory chat state to avoid leaking previous user's data
    resetChatSession();
    resetChatList();
    logout();
    navigate("/");
  };
  
console.log('User in NavUser:', user);
  const initials = getInitials(user?.name);
  const avatarColor = getAvatarColor(user?.name);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="hover:bg-neutral-800/50 text-neutral-200 data-[state=open]:bg-neutral-800 data-[state=open]:text-white transition-colors group-data-[collapsible=icon]/sidebar-wrapper:justify-center"
            >
              <Avatar className="h-8 w-8 rounded-lg ">
                {/* <AvatarImage src={user.avatar || "" } alt={user.name || "User"} /> */}
                <AvatarFallback
                  className={`rounded-full text-white font-semibold ${avatarColor}`}
                >
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]/sidebar-wrapper:hidden">
                <span className="truncate font-semibold text-white">
                  {user.name}
                </span>
                <span className="truncate text-xs f text-neutral-400">
                  Free plan
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-neutral-400" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] text-white/70  border border-gray-700/50 bg-neutral-800 min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 border-b pb-2 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback
                    className={`rounded-lg text-white font-semibold ${avatarColor}`}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup >
              <DropdownMenuItem className="hover:bg-black/40">
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {/* <DropdownMenuItem className="hover:bg-black/40">
                <BadgeCheck />
                Account
              </DropdownMenuItem> */}
              <DropdownMenuItem className="hover:bg-black/40">
                <CreditCard />
                Billing
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-black/40">
                <Bell />
                Notifications
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-400 hover:bg-red-400/10"
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
