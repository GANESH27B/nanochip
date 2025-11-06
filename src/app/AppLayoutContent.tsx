
'use client';

import AppSidebar from '@/components/app/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SearchProvider } from '@/hooks/use-search';
import AppHeader from '@/components/app/header';
import { useAppNavigation } from '@/components/app/navigation';
import { usePathname } from 'next/navigation';
import AppFooter from '@/components/app/footer';

export default function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { visibleNavItems } = useAppNavigation();
  const pathname = usePathname();

  const getTitleForPath = (path: string) => {
    const item = visibleNavItems.find(item => item.href === path);
    if (item) return item.label;

    if (path.startsWith('/shipments/track')) return 'Track Shipment';
    if (path.startsWith('/shipments')) return 'Shipment Details';

    // Extract title from path
    const title = path.substring(path.lastIndexOf('/') + 1);
    return title.charAt(0).toUpperCase() + title.slice(1).replace('-', ' ');
  };
  
  // Only show the main app layout for authenticated pages
  if (pathname === '/' || pathname === '/signup') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <SearchProvider>
        <div className="flex min-h-screen w-full flex-col">
          <AppHeader title={getTitleForPath(pathname)} />
          <div className="flex flex-1">
            <AppSidebar />
            <main className="flex-1 bg-muted/30">{children}</main>
          </div>
          <AppFooter />
        </div>
      </SearchProvider>
    </SidebarProvider>
  );
}
