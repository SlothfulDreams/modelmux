import { AppSidebar } from "./components/ChatInterface/app-sidebar";
import { SidebarProvider, SidebarInset } from "./components/ui/sidebar";
import { ChatInterface } from "@/components/ChatInterface/chat-interface";
import { ThemeProvider } from "@/components/theme-provider";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <ChatInterface />
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
