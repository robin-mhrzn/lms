import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Image from "next/image";

export const TeamSwitcher = () => {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <Image src="/logo.svg" alt="Team Logo" width={100} height={100} />
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};
