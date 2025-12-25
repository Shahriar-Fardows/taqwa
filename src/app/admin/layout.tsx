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
import {
  Home,
  User,
  FileText,
  Video,
  Image as ImageIcon,
  Users,
  Briefcase,
  Star,
  FileSignature,
  HelpCircle,
  Sparkles,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/app/globals.css";

// ছবির মেনু আইটেম অনুযায়ী ডাটা
const menuItems = [
  { title: "Home", href: "/admin", icon: Home },
  { title: "About", href: "/admin/about", icon: User },
  { title: "Blog", href: "/admin/blog", icon: FileText },
  { title: "Media", href: "/admin/media", icon: Video },
  { title: "Business", href: "/admin/business", icon: Briefcase },
  { title: "Events", href: "/admin/event", icon: Calendar },
  { title: "Review", href: "/admin/review", icon: Star },
  { title: "Contract", href: "/admin/contract", icon: FileSignature },
  { title: "FAQ", href: "/admin/faq", icon: HelpCircle },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" className="dark">
      <body className="bg-[#0f172a] text-white">
        <SidebarProvider>
          {/* সাইডবার ব্যাকগ্রাউন্ড কালার কাস্টমাইজ করা হয়েছে */}
          <Sidebar className="border-r border-white/10 bg-[#0f172a] text-gray-300 [&>div]:bg-[#0f172a]">
            
            {/* Header Section with Brand Logo */}
            <SidebarHeader className="h-16 flex items-center justify-center px-4 border-b border-white/5">
              <div className="flex items-center gap-3 w-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                  <Sparkles className="h-6 w-6" />
                </div>
                <span className="text-xl font-bold text-white tracking-wide">
                  Portfolio
                </span>
              </div>
            </SidebarHeader>

            <SidebarContent className="px-3 py-4">
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu className="space-y-1">
                    {menuItems.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            asChild
                            // অ্যাক্টিভ হলে সবুজ ব্যাকগ্রাউন্ড, নাহলে হোভার এফেক্ট
                            className={`h-11 rounded-xl transition-all duration-200 ${
                              isActive
                                ? "bg-emerald-500 text-white hover:bg-emerald-600 hover:text-white shadow-md shadow-emerald-500/20"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <Link href={item.href} className="flex items-center gap-3 px-3">
                              <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                              <span className="font-medium text-[15px]">{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            {/* Footer / User Profile Section */}
            <SidebarFooter className="border-t border-white/5 p-4">
              <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 hover:bg-white/10 transition-colors cursor-pointer">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-900/50 text-emerald-500 border border-emerald-500/20">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-sm">
                  <span className="font-semibold text-white">Admin</span>
                  <span className="text-xs text-gray-400 truncate max-w-[140px]">
                    admin@portfolio.com
                  </span>
                </div>
              </div>
            </SidebarFooter>
          </Sidebar>

          {/* Main Content Area */}
          <SidebarInset className="bg-[#0f172a]">
            <header className="flex h-16 items-center gap-4 border-b border-white/5 bg-[#0f172a] px-6">
              <SidebarTrigger className="text-white hover:bg-white/10" />
              <h1 className="text-lg font-semibold text-white">Dashboard Overview</h1>
            </header>
            <main className="p-6 bg-[#0f172a] text-gray-200 min-h-screen">
                {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}