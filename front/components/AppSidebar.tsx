"use client";
import { Home, Package, ShoppingCart, BarChart3, Users, LogOut, Menu, Power } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { logout, performLogout } from "@/store/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";

const items = [
  { title: "Inicio", icon: Home, url: "/" },
  { title: "Ventas", icon: ShoppingCart, url: "/sales" },
  { title: "Productos", icon: Package, url: "/products" },
  { title: "Categorías", icon: Menu, url: "/categories" },
  { title: "Clientes", icon: Users, url: "/customers" },
  { title: "Analíticas", icon: BarChart3, url: "/analytics" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { state } = useSidebar();

  const handleLogout = async () => {
    await dispatch(performLogout()).unwrap();

    window.location.href = "/login";
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="dark:bg-background border-b h-16 flex items-center justify-center px-4">
        {state === "expanded" ? (
          <>
            <span className="font-bold hidden md:text-lg truncate">Tennis Star</span>
            <Image src={"/logo.svg"} width={90} height={90} alt="logo" className="object-contain" />
          </>
        ) : (
          <Image src={"/logoSmall.svg"} width={40} height={40} alt="logo small" className="object-contain" />
        )}
      </SidebarHeader>

      <SidebarContent className="dark:bg-background">
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild tooltip={item.title} isActive={pathname === item.url}>
                    <Link href={item.url} className="cursor-pointer dark:hover:bg-accent">
                      <item.icon />
                      
                      {state === "expanded" && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <button
          onClick={() => handleLogout()}
          className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground"
        >
          {state === "expanded" ? (
            <>
              <Power size={16} />
              <span>Cerrar Sesión</span>
            </>
          ) : (
            <Power size={16} />
          )}
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
