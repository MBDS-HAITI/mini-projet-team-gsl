import * as React from "react";
import {
  IconDashboard,
  IconFileAi,
  IconFileDescription,
  IconHelp,
  IconUsers,
} from "@tabler/icons-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

import { Link } from "react-router";
import { SignedIn } from "@clerk/clerk-react";

import logo from "@/assets/mbds.png";

const user = {
  name: "shadcn",
  email: "m@example.com",
  avatar: "/avatars/shadcn.jpg",
};

const items = [
  {
    path: "students",
    name: "Etudiants",
    icon: IconUsers,
  },
  {
    path: "courses",
    name: "Matières",
    icon: IconFileAi,
  },
  {
    path: "notes",
    name: "Notes",
    icon: IconFileDescription,
  },
  {
    path: "about",
    name: "A propos",
    icon: IconHelp,
  },
];

const administration = [
  {
    path: "users",
    name: "Utilisateurs",
    icon: IconUsers,
  },
];

const isCurrentRoute = (path) => {
  return window.location.pathname.includes(path);
};

export function AppSidebar({ ...props }) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="/">
                <img
                  src={logo}
                  alt="Logo MBDS"
                  className="h-full object-contain"
                />
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          <SidebarGroup>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={"Tableau de bord"}>
                <Link to={"/dashboard"}>
                  <IconDashboard />
                  <span>Tableau de bord</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Gestion Académique</SidebarGroupLabel>
            {items.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.name}
                  isActive={isCurrentRoute(item.path)}
                >
                  <Link to={item.path}>
                    {item.icon && <item.icon />}
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Administration</SidebarGroupLabel>
            {administration.map((item) => (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.name}
                  isActive={isCurrentRoute(item.path)}
                >
                  <Link to={item.path}>
                    {item.icon && <item.icon />}
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarGroup>
        </SidebarMenu>
      </SidebarContent>

      <SignedIn>
        <SidebarFooter>
          <NavUser user={user} />
        </SidebarFooter>
      </SignedIn>
    </Sidebar>
  );
}
