import AppSidebar from "@/components/layout/admin/appSidebar";
import Header from "@/components/layout/admin/header";
import MainContainer from "@/components/layout/admin/mainContainer";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <SidebarProvider defaultOpen={true}>
        <AppSidebar />
        <div
          id="content"
          className={cn(
            "ml-auto w-full max-w-full",
            "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
            "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
            "sm:transition-[width] sm:duration-200 sm:ease-linear",
            "flex h-svh flex-col",
            "group-data-[scroll-locked=1]/body:h-full",
            "has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh"
          )}
        >
          <Header></Header>
          {children}
        </div>
      </SidebarProvider>
    </>
  );
}
