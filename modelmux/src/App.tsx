import { AppSidebar } from "./components/app-sidebar";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { ChatInterface } from "@/components/chat-interface";

function App() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ChatInterface />
      </SidebarInset>
    </SidebarProvider>
  );
}

export default App;
