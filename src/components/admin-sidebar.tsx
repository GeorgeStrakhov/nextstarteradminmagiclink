"use client";

import * as React from "react";
import Image from "next/image";
import { Users } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { AdminNavUser } from "@/components/admin-nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { appConfig } from "@/lib/config.client";

// Admin navigation data
const adminData = {
  navMain: [
    {
      title: "User Management",
      url: "/admin/users",
      icon: Users,
      isActive: true,
      items: [
        {
          title: "All Users",
          url: "/admin/users",
        },
        {
          title: "Email Whitelist",
          url: "/admin/users/whitelist",
        },
      ],
    },
  ],
};

interface AdminSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function AdminSidebar({ user, ...props }: AdminSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
            <Image
              src="/android-chrome-512x512.png"
              alt={appConfig.name}
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{appConfig.name}</span>
            <span className="text-muted-foreground truncate text-xs">
              Admin Panel
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminData.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <AdminNavUser
          user={user || { name: "Admin", email: "admin@example.com" }}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
