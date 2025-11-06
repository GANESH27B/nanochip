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
import { useAppNavigation } from './navigation';
import Link from 'next/link';
import { Logo } from '../logo';
import { ThemeSwitcher } from '../theme-switcher';
import { cn } from '@/lib/utils';

export default function AppHeader({ title }: { title?: string }) {
  const { searchTerm, setSearchTerm } = useSearch();
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const { handleLogout, userName, visibleNavItems, userRole, user } = useAppNavigation();

  const showSearch = ['/shipments', '/alerts', '/batches', '/raw-materials', '/needed-drugs'].includes(pathname);
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 sm:px-6">
      <div className="flex items-center gap-2">
         {isMobile && <SidebarTrigger />}
         <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
                <Logo />
            </Link>
          </div>
          <div className='hidden md:block'>
            <h1 className="text-xl font-semibold">{title}</h1>
          </div>
      </div>
      
      <nav className="hidden items-center gap-4 text-sm font-medium md:flex ml-6">
         {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === item.href ? "text-foreground" : "text-foreground/60"
              )}
            >
              {item.label}
            </Link>
          ))}
      </nav>

      <div className="ml-auto flex items-center gap-2">
        {showSearch && !isMobile && (
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
            <Button variant="ghost" className='gap-2 p-2 h-10'>
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src={userAvatar?.imageUrl} alt="User avatar" />
                <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className='hidden md:flex flex-col items-start'>
                  <span className='font-semibold text-sm'>{userName}</span>
                  <span className='text-xs text-muted-foreground'>{userRole}</span>
              </div>
            </Button>
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
