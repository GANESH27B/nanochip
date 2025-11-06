
'use client';

import AppSidebar from '@/components/app/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SearchProvider } from '@/hooks/use-search';
import AppHeader from '@/components/app/header';
import { usePathname } from 'next/navigation';
import AppFooter from '@/components/app/footer';

export default function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Only show the main app layout for authenticated pages
  if (pathname === '/' || pathname === '/signup') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <SearchProvider>
        <div className="flex min-h-screen w-full flex-col">
          <AppHeader />
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
