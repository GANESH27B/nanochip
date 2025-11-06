'use client';

import AppSidebar from '@/components/app/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SearchProvider } from '@/hooks/use-search';
import AppHeader from '@/components/app/header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SearchProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex flex-1 flex-col transition-all duration-300 ease-in-out group-data-[state=expanded]/sidebar-wrapper:md:pl-64">
            <AppHeader />
            <main className="flex-1 bg-muted/40 p-4 md:p-8 lg:p-10">{children}</main>
          </div>
        </div>
      </SearchProvider>
    </SidebarProvider>
  );
}
