'use client';

import AppHeader from '@/components/app/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Siren } from 'lucide-react';
import { shipments as initialShipments, alerts as allAlerts } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import type { Shipment, Role } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

export default function ShipmentDetailPage({ params }: { params: { id: string } }) {
  const [shipment, setShipment] = useState<Shipment | undefined>(
    initialShipments.find(s => s.batchId === params.id)
  );
  const [userRole, setUserRole] = useState<Role | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const role = localStorage.getItem('userRole') as Role;
    if (role) {
      setUserRole(role);
    }
  }, []);

  const shipmentAlerts = allAlerts.filter(a => a.batchId === params.id);
  const mapImage = PlaceHolderImages.find(img => img.id === 'shipment-map');

  const handleUpdateStatus = (newStatus: 'Delivered' | 'In-Transit') => {
    if (shipment) {
      setShipment({ ...shipment, status: newStatus });
      toast({
        title: `Shipment ${newStatus === 'Delivered' ? 'Approved' : 'Rejected'}`,
        description: `Batch ${shipment.batchId} has been updated.`,
      });
    }
  };

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
              Status: <span className="font-semibold">{shipment.status.replace('-', ' ')}</span>
            </p>
            {shipment.status === 'Requires-Approval' && userRole === 'FDA' && (
              <div className="flex gap-2">
                <Button onClick={() => handleUpdateStatus('Delivered')}>Approve Batch</Button>
                <Button variant="destructive" onClick={() => handleUpdateStatus('In-Transit')}>Reject Batch</Button>
              </div>
            )}
             {shipment.status !== 'Requires-Approval' && (
                <p className="text-sm text-muted-foreground">This shipment has already been reviewed.</p>
            )}
            {userRole !== 'FDA' && shipment.status === 'Requires-Approval' && (
                 <p className="text-sm text-muted-foreground">Awaiting review from an FDA agent.</p>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
