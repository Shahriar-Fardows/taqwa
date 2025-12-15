"use client";

import type React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Home, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/app/globals.css"; // CSS ফাইল ইমপোর্ট করতে ভুলবেন না

const menuItems = [
  { title: "Dashboard", href: "/admin", icon: Home },
  { title: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body>
        <SidebarProvider>
          <Sidebar>
            <SidebarHeader className="border-b p-4">
              <h2 className="text-xl font-bold text-yellow-400">Admin Panel</h2>
            </SidebarHeader>

            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menuItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={pathname === item.href}
                        >
                          <Link
                            href={item.href}
                            className="flex items-center gap-3"
                          >
                            <item.icon className="h-5 w-5" />
                            {item.title}
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t p-4">
              <button className="flex items-center gap-3 text-sm">
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </SidebarFooter>
          </Sidebar>

          <SidebarInset>
            <header className="flex h-16 items-center gap-4 border-b px-6">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Dashboard Overview</h1>
            </header>

            <main className="p-6">{children}</main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}