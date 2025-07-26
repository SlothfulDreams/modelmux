import { useState } from "react";
import {
  MessageSquare,
  Plus,
  History,
  Folder,
  Settings,
  Search,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { SettingsModal } from "@/components/settings-modal";
import { View } from "@/App";

// Chat history items
const chatItems = [
  {
    title: "Previous Chat 1",
    url: "#",
    icon: MessageSquare,
  },
  {
    title: "Previous Chat 2",
    url: "#",
    icon: MessageSquare,
  },
  {
    title: "Previous Chat 3",
    url: "#",
    icon: MessageSquare,
  },
];

type AppSidebarProps = {
  setCurrentView: (view: View) => void;
};

export function AppSidebar({ setCurrentView }: AppSidebarProps) {
  const { state } = useSidebar();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Menu items.
  const menuItems = [
    {
      title: "New Chat",
      action: () => setCurrentView("chat"),
      icon: Plus,
    },
    {
      title: "Search Chats",
      action: () => {
        "N/A";
      },
      icon: Search,
    },
    {
      title: "Chat History",
      action: () => {
        "N/A";
      },
      icon: History,
    },
    {
      title: "Manage Models",
      action: () => setCurrentView("models"),
      icon: Folder,
    },
  ];

  return (
    <>
      <Sidebar collapsible="icon">
        {/* Sidebar header: always render trigger, only show title when expanded */}
        <div
          className={`flex items-center p-4 border-b ${
            state === "collapsed" ? "justify-center" : "gap-2"
          }`}
        >
          <SidebarTrigger />
          {state === "expanded" && (
            <span className="text-lg font-bold">ModelMux</span>
          )}
        </div>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Actions</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className={state === "collapsed" ? "mt-10" : ""}>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton onClick={item.action}>
                      <item.icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {(state === "collapsed"
                  ? chatItems.slice(0, 1)
                  : chatItems
                ).map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => setIsSettingsOpen(true)}>
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SettingsModal
        open={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
