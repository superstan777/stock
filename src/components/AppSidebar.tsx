"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const navData = [
  {
    title: "Main",
    items: [
      { title: "Dashboard", url: "/" },
      { title: "Computers", url: "/computers" },
      { title: "Monitors", url: "/monitors" },
      { title: "Users", url: "/users" },
    ],
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const isActive = (url: string) => {
    return pathname === url || pathname.startsWith(url + "/");
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="p-2 font-bold">STOCK</div>
      </SidebarHeader>
      <SidebarContent>
        {navData.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  // Add ?page=1 for both Computers and Monitors
                  const href =
                    item.url === "/computers" || item.url === "/monitors"
                      ? `${item.url}?page=1`
                      : item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive(item.url)}>
                        <Link href={href}>{item.title}</Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
