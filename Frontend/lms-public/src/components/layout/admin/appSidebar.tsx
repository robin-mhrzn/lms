import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { INavGroup } from "./types";
import { TeamSwitcher } from "./teamSwitcher";
import NavGroup from "./navGroup";
import NavUser from "./navUser";
import { NavigationRoute } from "@/util/navigation";

const navGroups: INavGroup[] = [
  {
    title: "General",
    items: [
      {
        title: "Dashboard",
        url: NavigationRoute.DASHBOARD,
        //icon
      },
      {
        title: "My Purchases",
        url: NavigationRoute.MY_PURCHASES,
      },
      { title: "Profile", url: NavigationRoute.PROFILE },
    ],
  },
];

const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        {navGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
export default AppSidebar;
