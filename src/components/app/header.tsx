'use client';

import { Bell, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useSearch } from '@/hooks/use-search';
import { usePathname } from 'next/navigation';

interface AppHeaderProps {
  title: string;
}

export default function AppHeader({ title }: AppHeaderProps) {
  const { searchTerm, setSearchTerm } = useSearch();
  const pathname = usePathname();
  const showSearch = pathname === '/shipments';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      <SidebarTrigger className="flex text-foreground hover:text-foreground/80 md:hidden" />
      <h1 className="text-lg font-semibold md:text-2xl">{title}</h1>
      <div className="ml-auto flex flex-1 items-center justify-end gap-4">
        {showSearch && (
          <div className="relative hidden w-full max-w-sm md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search shipments..."
              className="pl-8 w-full bg-background/90 text-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground hover:bg-accent/80 hover:text-accent-foreground">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
    </header>
  );
}
