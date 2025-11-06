
'use client';

import { Bell, Search, User, MapPin, ChevronDown, ShoppingCart, Percent, LogOut } from 'lucide-react';
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
import { useAppNavigation } from './navigation';
import Link from 'next/link';
import { Logo } from '../logo';
import { ThemeSwitcher } from '../theme-switcher';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function AppHeader() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const { handleLogout, userName, user, visibleNavItems } = useAppNavigation();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');


  const showSearch = ['/shipments', '/alerts', '/batches', '/raw-materials', '/needed-drugs'].includes(pathname);

  return (
    <header className="sticky top-0 z-30 flex flex-col border-b bg-background shadow-sm">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {isMobile && <SidebarTrigger />}
          <Link href="/dashboard" className="hidden items-center gap-2 md:flex">
            <Logo />
          </Link>
        </div>
        
        <div className='flex items-center gap-4'>
           <h1 className="text-xl font-semibold md:text-2xl">Dashboard</h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {showSearch && !isMobile && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          )}
          <ThemeSwitcher />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
                 <Avatar className="h-8 w-8">
                    <AvatarImage src={userAvatar?.imageUrl} />
                    <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <p>Signed in as</p>
                <p className="font-semibold">{userName}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              {isMobile && (
                <>
                <DropdownMenuSeparator />
                  {visibleNavItems.map(item => (
                    <DropdownMenuItem key={item.href} asChild>
                       <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                 <LogOut className="mr-2 h-4 w-4" />
                 <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
