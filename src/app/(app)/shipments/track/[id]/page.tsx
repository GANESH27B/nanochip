
'use client';

import AppHeader from '@/components/app/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { shipments as initialShipments } from '@/lib/data';
import { useMemo } from 'react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function TrackShipmentPage({ params }: { params: { id: string } }) {
  const id = params.id;
  const shipment = useMemo(() => initialShipments.find(s => s.batchId === id), [id]);
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
                  layout="fill"
                  objectFit="cover"
                  data-ai-hint={mapImage.imageHint}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <p>Map could not be loaded.</p>
                </div>
              )}
               <div className="absolute top-4 left-4 bg-background/80 p-4 rounded-md shadow-lg">
                    <h3 className="font-bold text-lg">{shipment.batchId}</h3>
                    <p className="text-sm">Status: <span className="font-semibold text-primary">{shipment.status.replace('-', ' ')}</span></p>
                    <p className="text-sm text-muted-foreground">{shipment.currentHolder}</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
