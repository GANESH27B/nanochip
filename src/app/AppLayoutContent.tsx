'use client';

import AppHeader from '@/components/app/header';
import AppFooter from '@/components/app/footer';

export default function AppLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </div>
  );
}
