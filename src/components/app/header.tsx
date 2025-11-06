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

export default function AppHeader({ title }: { title?: string }) {
  const { searchTerm, setSearchTerm } = useSearch();
  const { isMobile } = useSidebar();
  const pathname = usePathname();
  const { handleLogout, userName, user } = useAppNavigation();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');


  const showSearch = ['/shipments', '/alerts', '/batches', '/raw-materials', '/needed-drugs'].includes(pathname);

  return (
    <header className="sticky top-0 z-30 flex flex-col border-b bg-background shadow-sm">
      <div className="flex h-16 items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {isMobile && <SidebarTrigger />}
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo />
          </Link>
        </div>

        {!isMobile && (
           <div className="flex items-center gap-2 text-sm text-muted-foreground ml-4 border-l pl-4">
              <MapPin className="h-4 w-4" />
              <span>Express delivery to</span>
              <Button variant="ghost" className="p-1 h-auto text-primary font-semibold">
                400001 Mumbai <ChevronDown className="h-4 w-4" />
              </Button>
           </div>
        )}
        
        <div className="flex-1 flex justify-center px-4">
          <div className="relative w-full max-w-lg">
            <Input
              type="search"
              placeholder="Search for Medicine"
              className="w-full rounded-full bg-muted pl-10 pr-24"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Button variant="default" className="absolute right-1 top-1/2 h-8 -translate-y-1/2 rounded-full px-6">
              Search
            </Button>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitcher />
          
          {!isMobile && (
              <>
                 <Button variant="ghost" className="gap-2">
                    <User className="h-5 w-5" /> Hello, {userName.split(' ')[0]}
                </Button>
              </>
          )}

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
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                 <LogOut className="mr-2 h-4 w-4" />
                 <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {!isMobile && (
         <nav className="flex items-center gap-6 text-sm font-medium px-6 h-12 border-t justify-center">
            {useAppNavigation().visibleNavItems.map((item) => (
                <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "transition-colors hover:text-primary pb-1",
                    pathname === item.href ? "text-primary border-b-2 border-primary" : "text-foreground/60"
                )}
                >
                {item.label}
                </Link>
            ))}
        </nav>
      )}
    </header>
  );
}
