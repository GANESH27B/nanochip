import AppHeader from '@/components/app/header';
import { alerts } from '@/lib/data';
import AlertsList from '@/components/app/alerts-list';

export default function AlertsPage() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title="Alerts" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <AlertsList initialAlerts={alerts} />
      </main>
    </div>
  );
}
