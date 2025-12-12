"use client";
import { Home, Package, ShoppingCart, BarChart3, Users, LogOut } from "lucide-react";
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
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { logout } from "@/store/auth/authSlice";
import { useAppDispatch } from "@/store/hooks";

const items = [
  { title: "Inicio", icon: Home, url: "/" },
  { title: "Ventas", icon: ShoppingCart, url: "/sales" },
  { title: "Productos", icon: Package, url: "/products" },
  { title: "Categorías", icon: Package, url: "/categories" },
  { title: "Clientes", icon: Users, url: "/customers" },
  { title: "Analíticas", icon: BarChart3, url: "/analytics" },
];

export function AppSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { state } = useSidebar();

  const router = useRouter();
  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="dark:bg-background border-b h-16 flex items-center justify-center px-4">
        {state === "expanded" ? (
          <>
            <span className="font-bold hidden md:text-lg truncate">Tennis Star</span>
            <Image
              src={"/logo.svg"}
              width={90}
              height={90}
              alt="logo"
              className="object-contain" // Buena práctica para evitar deformaciones
            />
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
                    <Link href={item.url} className="cursor-pointer  dark:hover:bg-accent">
                      <item.icon />
                      <span>{item.title}</span>
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
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </button>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
