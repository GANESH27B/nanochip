'use client';

import { Bell, Search, User, MapPin, ChevronDown, ShoppingCart, Percent, LogOut, Zap, Menu } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"


export default function AppHeader() {
  const { handleLogout, userName, visibleNavItems, isClient } = useAppNavigation();

  return (
    <header className="sticky top-0 z-30 flex w-full flex-col border-b bg-background shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center gap-6">
          <div className="md:hidden">
             <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-4 p-4">
                  <Logo />
                  <nav className="flex flex-col gap-2">
                    {isClient && visibleNavItems.map((item, index) => (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
                      >
                        <div className="flex items-center gap-2">
                           <item.icon className="h-4 w-4" />
                           {item.label}
                        </div>
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex">
             <Logo />
          </div>
          
          <div className="hidden items-center gap-2 text-sm lg:flex">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="font-bold">Express delivery to</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex cursor-pointer items-center text-muted-foreground">
                    <span>400001 Mumbai</span>
                    <ChevronDown className="h-4 w-4" />
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuLabel>Select Location</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>New York</DropdownMenuItem>
                  <DropdownMenuItem>London</DropdownMenuItem>
                  <DropdownMenuItem>Tokyo</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex-1">
            <div className="relative mx-auto max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input placeholder="Search for Medicine" className="rounded-full bg-muted pl-10 pr-24" />
                <Button className="absolute right-1 top-1/2 -translate-y-1/2 h-8 rounded-full">Search</Button>
            </div>
          </div>

          <div className="hidden items-center gap-6 text-sm md:flex">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Hello, Log in
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
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                   <LogOut className="mr-2 h-4 w-4" />
                   <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
      
      <div className="hidden border-t md:block">
        <div className="container mx-auto px-4">
            <nav className="flex h-12 items-center justify-center gap-8">
                 {isClient && visibleNavItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        className={cn(
                            "flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                        )}
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>
        </div>
      </div>
    </header>
  );
}
