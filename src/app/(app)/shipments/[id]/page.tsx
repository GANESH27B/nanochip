import AppHeader from '@/components/app/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Siren } from 'lucide-react';
import { shipments, alerts as allAlerts } from '@/lib/data';
import { Button } from '@/components/ui/button';

export default function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const shipment = shipments.find(s => s.batchId === params.id);
  const shipmentAlerts = allAlerts.filter(a => a.batchId === params.id);
  const mapImage = PlaceHolderImages.find(img => img.id === 'shipment-map');

  if (!shipment) {
    return (
      <div className="flex min-h-screen w-full flex-col">
        <AppHeader title="Shipment Not Found" />
        <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
            <p>The shipment you are looking for does not exist.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title={`Shipment: ${shipment.batchId}`} showSearch={false} />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>Live Telemetry & Route</CardTitle>
            </CardHeader>
            <CardContent>
              {mapImage && 
                <Image
                  src={mapImage.imageUrl}
                  alt="Shipment map"
                  width={800}
                  height={400}
                  className="rounded-lg"
                  data-ai-hint={mapImage.imageHint}
                />
              }
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Alerts</CardTitle>
              <CardDescription>Alerts triggered for this shipment.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                {shipmentAlerts.length > 0 ? (
                    shipmentAlerts.map(alert => (
                        <Alert key={alert.alertId} variant={alert.severity === "High" ? "destructive" : "default"}>
                            <Siren className="h-4 w-4" />
                            <AlertTitle>{alert.type}</AlertTitle>
                            <AlertDescription>{alert.details}</AlertDescription>
                        </Alert>
                    ))
                ) : (
                    <p className="text-sm text-muted-foreground">No alerts for this shipment.</p>
                )}
            </CardContent>
          </Card>
        </div>
         <Card>
          <CardHeader>
            <CardTitle>FDA Approval</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Status: {shipment.status === 'Requires-Approval' ? 'Pending Approval' : 'Approved'}
            </p>
            {shipment.status === 'Requires-Approval' && (
              <div className="flex gap-2">
                <Button>Approve Batch</Button>
                <Button variant="destructive">Reject Batch</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
