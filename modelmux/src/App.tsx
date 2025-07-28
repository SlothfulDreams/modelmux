import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface/chat-interface";
import  Workspace from "@/components/Workspace/workspace";
import { ThemeProvider } from "@/components/theme-provider";
import { ManageModel } from "@/components/manage-model";
import Layout from "@/components/sidebar/layout";

export type View = "chat" | "models" | "workspaces";

function App() {
  const [currentView, setCurrentView] = useState<View>("chat");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout setCurrentView={setCurrentView}>
        {currentView === "chat" && <ChatInterface />}
        {currentView === "models" && <ManageModel />}
        {currentView === "workspaces" && <Workspace />}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
