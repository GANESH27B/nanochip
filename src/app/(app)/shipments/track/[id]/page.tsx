
'use client';

import AppHeader from '@/components/app/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { shipments as initialShipments } from '@/lib/data';
import { useMemo, useState, useEffect } from 'react';
import type { Shipment } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Map } from 'lucide-react';

const statusColors: { [key: string]: string } = {
  'In-Transit': 'text-blue-500',
  Delivered: 'text-green-500',
  'Requires-Approval': 'text-yellow-500',
  Pending: 'text-gray-500',
};


export default function TrackShipmentPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const [shipments, setShipments] = useState(initialShipments);
  const [shipment, setShipment] = useState<Shipment | undefined>(initialShipments.find(s => s.batchId === id));

  useEffect(() => {
    // This effect simulates real-time updates for the shipment status
    const interval = setInterval(() => {
      // In a real app, you would fetch this from a server
      const updatedShipment = shipments.find(s => s.batchId === id);
      if (updatedShipment && updatedShipment.status !== shipment?.status) {
        setShipment(updatedShipment);
      }
    }, 2000); // Check for updates every 2 seconds

    return () => clearInterval(interval);
  }, [id, shipments, shipment]);

  const handleOpenMap = () => {
    if (shipment?.startingPoint && shipment?.endingPoint) {
      const url = `https://www.google.com/maps/dir/${encodeURIComponent(shipment.startingPoint)}/${encodeURIComponent(shipment.endingPoint)}`;
      window.open(url, '_blank');
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
  
  const statusColor = statusColors[shipment.status] || 'text-gray-500';

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title={`Tracking: ${shipment.batchId}`} />
      <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 flex">
        <Card className="flex-1">
           <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div>
              <CardTitle>Live Shipment Tracking</CardTitle>
              <CardDescription>
                Track the journey from {shipment.startingPoint} to {shipment.endingPoint}.
              </CardDescription>
            </div>
            <Button onClick={handleOpenMap} variant="outline">
              <Map className="mr-2 h-4 w-4" />
              Open in Google Maps
            </Button>
          </CardHeader>
          <CardContent className="h-[calc(100%-100px)]">
            <div className="relative h-full w-full overflow-hidden rounded-lg bg-muted flex flex-col items-center justify-center text-center p-8">
               <div className="absolute top-4 left-4 bg-background/80 p-4 rounded-md shadow-lg text-left">
                    <h3 className="font-bold text-lg">{shipment.batchId}</h3>
                    <p className="text-sm">Status: <span className={`font-semibold ${statusColor}`}>{shipment.status.replace('-', ' ')}</span></p>
                    <p className="text-sm text-muted-foreground">{shipment.currentHolder}</p>
                </div>

                <Map className="h-24 w-24 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold">Ready to Track</h3>
                <p className="text-muted-foreground max-w-sm">
                    Click the button above to open the live route in Google Maps for detailed directions and real-time traffic information.
                </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
