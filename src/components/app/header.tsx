import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface AppHeaderProps {
  title: string;
  showSearch?: boolean;
}

export default function AppHeader({ title, showSearch = true }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
       <SidebarTrigger className="lg:hidden" />
      <h1 className="text-xl font-semibold md:text-2xl">{title}</h1>
      <div className="ml-auto flex items-center gap-4">
        {showSearch && (
          <form className="relative hidden lg:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search shipments..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px]"
            />
          </form>
        )}
        <Button variant="outline" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Toggle notifications</span>
        </Button>
      </div>
    </header>
  );
}
