'use client';

import {
  Bell,
  FlaskConical,
  Home,
  LineChart,
  Package,
  Siren,
  Truck,
  User,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Logo } from '../logo';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useEffect, useState } from 'react';
import type { Role } from '@/lib/types';

const navItems = {
  all: [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/shipments', icon: Truck, label: 'Shipments' },
    { href: '/analytics', icon: LineChart, label: 'Analytics' },
    { href: '/alerts', icon: Siren, label: 'Alerts' },
  ],
  Manufacturer: [{ href: '/batches', icon: FlaskConical, label: 'Batches' }],
  FDA: [{ href: '/approvals', icon: Package, label: 'Approvals' }],
};

export default function AppSidebar() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<Role | null>(null);

  useEffect(() => {
    const role = localStorage.getItem('userRole') as Role;
    if (role) {
      setUserRole(role);
    }
  }, [pathname]);

  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');
  const roleNav = userRole ? navItems[userRole as keyof typeof navItems] || [] : [];
  const combinedNav = [...navItems.all, ...roleNav];

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r bg-sidebar text-sidebar-foreground"
    >
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex w-full items-center justify-between p-2">
          <Logo className="text-sidebar-primary-foreground" />
          <SidebarTrigger className="hidden lg:flex" />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {combinedNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={{ children: item.label, side: 'right' }}
              >
                <a href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
             <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent cursor-pointer w-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userAvatar?.imageUrl} alt="User avatar" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="text-left group-data-[collapsible=icon]:hidden">
                  <p className="text-sm font-medium">PharmaTrust User</p>
                  <p className="text-xs text-muted-foreground">{userRole}</p>
                </div>
              </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="right" align="start">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Bell className="mr-2 h-4 w-4" />
              <span>Notifications</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => (window.location.href = '/')}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
