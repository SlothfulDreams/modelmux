import { useState } from "react";
import { AppSidebar } from "./components/ChatInterface/app-sidebar";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { ChatInterface } from "@/components/ChatInterface/chat-interface";
import { ThemeProvider } from "@/components/theme-provider";
import { ManageModel } from "@/components/manage-model";

export type View = "chat" | "models";

function App() {
  const [currentView, setCurrentView] = useState<View>("chat");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar setCurrentView={setCurrentView} />
        <SidebarInset>
          {currentView === "chat" && <ChatInterface />}
          {currentView === "models" && <ManageModel />}
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
