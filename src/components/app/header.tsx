'use client';

import {
  Bell,
  ChevronDown,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  Percent,
  Search,
  ShoppingCart,
  Sparkles,
  User,
} from 'lucide-react';
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
import { ThemeSwitcher } from '../theme-switcher';
import { Logo } from '../logo';
import Link from 'next/link';
import { useAppNavigation } from './navigation';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const navLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Shipments', href: '/shipments' },
  { label: 'Alerts', href: '/alerts' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Approvals', href: '/approvals' },
];

export default function AppHeader() {
  const { userName, userRole, handleLogout, visibleNavItems } = useAppNavigation();
  const userAvatar = PlaceHolderImages.find((img) => img.id === 'user-avatar');

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 shadow-sm backdrop-blur-sm">
      <div className="container mx-auto">
        <div className="flex h-20 items-center gap-6">
          <div className="hidden items-center gap-2 md:flex">
            <Logo />
          </div>

          {/* Mobile Menu & Logo */}
          <div className="flex items-center md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <div className="flex flex-col gap-6 p-4">
                  <Logo />
                  <nav className="flex flex-col gap-4">
                    {visibleNavItems.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="flex items-center justify-between font-medium text-foreground/80 hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
             <div className="ml-4">
               <Logo />
             </div>
          </div>
          
          <div className="flex-1" />


          <div className="hidden items-center gap-6 text-sm md:flex">
              {userRole ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2">
                       <Avatar className="h-8 w-8">
                          <AvatarImage src={userAvatar?.imageUrl} />
                          <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
                        </Avatar>
                      <span className="font-medium">Hello, {userName.split(' ')[0]}</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
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
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/" className="flex items-center gap-1.5 font-medium">
                  <User className="h-5 w-5" />
                  Hello, Log in
                </Link>
              )}
             <ThemeSwitcher />
          </div>
        </div>

        <div className="hidden border-t md:block">
            <div className="container mx-auto">
                <nav className="flex h-12 items-center justify-center">
                    <div className="flex gap-8">
                         {visibleNavItems.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                                )}
                            >
                                <link.icon className="h-4 w-4" />
                                {link.label === 'Dashboard' && userRole ? `${userRole} ${link.label}` : link.label}
                            </Link>
                        ))}
                    </div>
                </nav>
            </div>
        </div>
      </div>
    </header>
  );
}
