
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { shipments as initialShipments, users } from '@/lib/data';
import { useMemo, useState, useEffect } from 'react';
import type { Shipment } from '@/lib/types';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { MapPin, Loader2 } from 'lucide-react';

const GoogleShipmentMap = dynamic(() => import('@/components/app/google-shipment-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>,
});


const statusColors: { [key: string]: string } = {
  'In-Transit': 'text-blue-500',
  Delivered: 'text-green-500',
  'Requires-Approval': 'text-yellow-500',
  Pending: 'text-gray-500',
};


export default function TrackShipmentPage({ params }: { params: { id: string } }) {
  const [shipment, setShipment] = useState<Shipment | undefined>();
  const [id, setId] = useState<string | null>(null);


  useEffect(() => {
    if (params.id) {
      setId(params.id);
      const currentShipment = initialShipments.find(s => s.batchId === params.id);
      setShipment(currentShipment);

      if (currentShipment) {
          // This effect simulates real-time updates for the shipment status
          const interval = setInterval(() => {
          // In a real app, you would fetch this from a server
          const updatedShipment = initialShipments.find(s => s.batchId === params.id);
          if (updatedShipment && updatedShipment.status !== currentShipment?.status) {
              setShipment(updatedShipment);
          }
          }, 2000); // Check for updates every 2 seconds

          return () => clearInterval(interval);
      }
    }
  }, [params.id]);

  const { startUser, endUser } = useMemo(() => {
    if (!shipment) return { startUser: null, endUser: null };
    const start = Object.values(users).find(u => u.location === shipment.startingPoint);
    const end = Object.values(users).find(u => u.location === shipment.endingPoint);
    return { startUser: start, endUser: end };
  }, [shipment]);

  const handleOpenGoogleMaps = () => {
    if (startUser?.latitude && startUser?.longitude && endUser?.latitude && endUser?.longitude) {
      const url = `https://www.google.com/maps/dir/?api=1&origin=${startUser.latitude},${startUser.longitude}&destination=${endUser.latitude},${endUser.longitude}`;
      window.open(url, '_blank');
    }
  };


  if (!shipment) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 md:gap-8 md:p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </main>
    );
  }
  
  const statusColor = statusColors[shipment.status] || 'text-gray-500';

  return (
    <main className="flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 flex">
      <Card className="flex-1">
         <CardHeader className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Live Shipment Tracking</CardTitle>
            <CardDescription>
              Visualizing the route from {shipment.startingPoint} to {shipment.endingPoint}.
            </CardDescription>
          </div>
           <div className="flex flex-col sm:flex-row items-center gap-4">
               <div className="bg-background/80 p-4 rounded-md shadow-lg text-left w-full sm:w-auto">
                    <h3 className="font-bold text-lg">{shipment.batchId}</h3>
                    <p className="text-sm">Status: <span className={`font-semibold ${statusColor}`}>{shipment.status.replace('-', ' ')}</span></p>
                    <p className="text-sm text-muted-foreground">{shipment.currentHolder}</p>
                </div>
                <Button onClick={handleOpenGoogleMaps} className="w-full sm:w-auto">
                    <MapPin className="mr-2 h-4 w-4" />
                    Open in Google Maps
                </Button>
            </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-120px)]">
          {startUser && endUser && startUser.latitude && startUser.longitude && endUser.latitude && endUser.longitude && (
            <GoogleShipmentMap
              origin={{ lat: startUser.latitude, lng: startUser.longitude }}
              destination={{ lat: endUser.latitude, lng: endUser.longitude }}
              status={shipment.status}
            />
          )}
        </CardContent>
      </Card>
    </main>
  );
}
