'use client';

import AppHeader from '@/components/app/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { shipments as initialShipments, users } from '@/lib/data';
import { useMemo, useState, useEffect, use } from 'react';
import type { Shipment, User } from '@/lib/types';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { MapPin } from 'lucide-react';

const ShipmentMap = dynamic(() => import('@/components/app/shipment-map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-muted animate-pulse" />,
});

const statusColors: { [key: string]: string } = {
  'In-Transit': 'text-blue-500',
  Delivered: 'text-green-500',
  'Requires-Approval': 'text-yellow-500',
  Pending: 'text-gray-500',
};


export default function TrackShipmentPage({ params }: { params: { id: string } }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
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
              <ShipmentMap
                key={shipment.status}
                start={{ lat: startUser.latitude, lng: startUser.longitude, label: startUser.name }}
                end={{ lat: endUser.latitude, lng: endUser.longitude, label: endUser.name }}
                status={shipment.status}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
