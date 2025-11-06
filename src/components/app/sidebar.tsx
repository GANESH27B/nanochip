'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarSeparator,
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

import { ThemeSwitcher } from '../theme-switcher';
import Link from 'next/link';
import { useAppNavigation } from './navigation';

export default function AppSidebar() {
  const { userRole, userName, handleLogout, visibleNavItems } = useAppNavigation();

  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <Sidebar
      variant="sidebar"
      collapsible="offcanvas"
      className="border-r bg-background text-foreground md:hidden"
    >
      <SidebarHeader className="border-b">
        <div className="flex w-full items-center justify-between p-4">
          <Logo />
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 p-4">
        <SidebarMenu>
          {visibleNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                // @ts-ignore
                isActive={typeof window !== 'undefined' && window.location.pathname === item.href}
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
      <SidebarSeparator />
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar?.imageUrl} alt="User avatar" />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">{userRole}</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
