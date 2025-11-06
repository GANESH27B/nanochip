
'use client';

import AppHeader from '@/components/app/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { shipments as initialShipments } from '@/lib/data';
import { useMemo, useState, useEffect } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import type { Shipment } from '@/lib/types';

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
  
  const statusColor = statusColors[shipment.status] || 'text-gray-500';

  return (
    <div className="flex min-h-screen w-full flex-col">
      <AppHeader title={`Tracking: ${shipment.batchId}`} />
      <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 flex">
        <Card>
          <CardHeader>
            <CardTitle>Live Shipment Tracking</CardTitle>
            <CardDescription>
              Visualizing the route from {shipment.startingPoint} to {shipment.endingPoint}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative h-[60vh] w-full overflow-hidden rounded-lg">
              {mapImage ? (
                <Image
                  src={mapImage.imageUrl}
                  alt="Shipment map"
                  fill
                  style={{objectFit: 'cover'}}
                  data-ai-hint={mapImage.imageHint}
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <p>Map could not be loaded.</p>
                </div>
              )}
               <div className="absolute top-4 left-4 bg-background/80 p-4 rounded-md shadow-lg">
                    <h3 className="font-bold text-lg">{shipment.batchId}</h3>
                    <p className="text-sm">Status: <span className={`font-semibold ${statusColor}`}>{shipment.status.replace('-', ' ')}</span></p>
                    <p className="text-sm text-muted-foreground">{shipment.currentHolder}</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
