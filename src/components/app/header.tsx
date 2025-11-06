'use client';

import { Bell, Search, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { useSearch } from '@/hooks/use-search';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { navItems, useAppNavigation } from './navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Logo } from '../logo';
import { ThemeSwitcher } from '../theme-switcher';

export default function AppHeader() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const { userRole, userName, user, handleLogout, visibleNavItems } = useAppNavigation();

  const showSearch = ['/shipments', '/alerts', '/batches', '/raw-materials', '/needed-drugs'].includes(pathname);
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  const getPageTitle = () => {
    for (const role in navItems) {
      const items = navItems[role as keyof typeof navItems];
      const item = items.find(i => i.href === pathname);
      if (item) return item.label;
    }
    // Fallbacks for detail pages
    if (pathname.startsWith('/shipments/')) return 'Shipment Details';
    if (pathname.startsWith('/profile')) return 'My Profile';
    return 'Dashboard';
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {!isMobile && <Logo className="h-6" />}
        {isMobile && <SidebarTrigger />}
        <h1 className="hidden text-lg font-semibold md:block">{getPageTitle()}</h1>
      </div>

      {!isMobile && (
        <nav className="mx-auto flex items-center space-x-2">
          {visibleNavItems.map((item) => (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              size="sm"
              className={cn(
                'text-sm font-medium text-muted-foreground transition-colors hover:text-primary',
                pathname === item.href && 'text-primary'
              )}
            >
              <Link href={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      )}

      <div className="ml-auto flex items-center gap-4">
        {showSearch && (
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full rounded-lg bg-muted pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        <ThemeSwitcher />
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-8 w-8 cursor-pointer">
              <AvatarImage src={userAvatar?.imageUrl} alt="User avatar" />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/alerts">
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
