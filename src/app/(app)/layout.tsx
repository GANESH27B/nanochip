'use client';

import AppSidebar from '@/components/app/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SearchProvider } from '@/hooks/use-search';
import AppHeader from '@/components/app/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SearchProvider>
        <div className="flex min-h-screen w-full flex-col">
          <AppSidebar />
          <div className="flex flex-col">
            <AppHeader />
            <main className="flex-1 bg-muted/40 p-4 md:p-8 lg:p-10">{children}</main>
          </div>
        </div>
      </SearchProvider>
    </SidebarProvider>
  );
}
