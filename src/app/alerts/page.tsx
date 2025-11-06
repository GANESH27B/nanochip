
import AlertsList from '@/components/app/alerts-list';
import { alerts } from '@/lib/data';

export default function AlertsPage() {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <AlertsList initialAlerts={alerts} />
    </main>
  );
}
