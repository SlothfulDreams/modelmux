import { useState } from "react";
import { ChatInterface } from "@/components/ChatInterface/chat-interface";
import { ThemeProvider } from "@/components/theme-provider";
import { ModelManagerInterface } from "@/components/ModelManager/model-manager-interface";
import Layout from "@/components/sidebar/layout";
import WorkspaceInterface from "@/components/Workspace/workspace-interface";

export type View = "chat" | "models" | "workspaces";

function App() {
  const [currentView, setCurrentView] = useState<View>("chat");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Layout setCurrentView={setCurrentView}>
        {currentView === "chat" && <ChatInterface />}
        {currentView === "models" && <ModelManagerInterface />}
        {currentView === "workspaces" && <WorkspaceInterface />}
      </Layout>
    </ThemeProvider>
  );
}

export default App;
