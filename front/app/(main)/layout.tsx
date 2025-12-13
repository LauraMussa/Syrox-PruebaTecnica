"use client";

import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { AppSidebar } from "@/components/AppSidebar";
import ThemeToggle from "@/components/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { HistoryDropdown } from "@/components/HistoryDropdown";
import { useAppSelector } from "@/store/hooks";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);

  const getInitials = (name: string | undefined | null) => {
    if (!name) return "U";

    return name
      .trim()
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-background/95 backdrop-blur px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <DynamicBreadcrumb />
          </div>

          <div className="flex items-center gap-4">
            <HistoryDropdown />
            <ThemeToggle />
            <Avatar className="h-8 w-8 cursor-pointer hover:border hover:border-foreground/50 ">
              <AvatarImage src="" />
              <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
