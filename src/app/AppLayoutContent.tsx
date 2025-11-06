'use client';

import AppSidebar from '@/components/app/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SearchProvider } from '@/hooks/use-search';
import AppHeader from '@/components/app/header';
import { usePathname } from 'next/navigation';

export default function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Only show the main app layout for authenticated pages
  if (pathname === '/' || pathname === '/signup') {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <SearchProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
          <AppSidebar />
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <AppHeader />
            <main className="flex-1 bg-background p-4 sm:p-6">{children}</main>
          </div>
        </div>
      </SearchProvider>
    </SidebarProvider>
  );
}
