'use client';

import AppSidebar from '@/components/app/sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { SearchProvider } from '@/hooks/use-search';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <SearchProvider>
        <div className="flex min-h-screen">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </SearchProvider>
    </SidebarProvider>
  );
}
