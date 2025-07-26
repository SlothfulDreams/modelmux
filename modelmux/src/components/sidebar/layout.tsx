import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/ChatInterface/app-sidebar";
import { View } from "@/App";

type LayoutProps = {
  children: React.ReactNode;
  setCurrentView: (view: View) => void;
};

export default function Layout({ children, setCurrentView }: LayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar setCurrentView={setCurrentView} />
      <SidebarInset>
        <main>{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
