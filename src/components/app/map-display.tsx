'use client';

import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Shipment } from '@/lib/types';

// Fix for default icon issues with Leaflet in React
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface MapDisplayProps {
  shipment: Shipment;
}

interface Coords {
  lat: number;
  lng: number;
}

const geocode = async (address: string): Promise<Coords | null> => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
    const data = await response.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export default function MapDisplay({ shipment }: MapDisplayProps) {
  const [startCoords, setStartCoords] = useState<Coords | null>(null);
  const [endCoords, setEndCoords] = useState<Coords | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const fetchCoords = async () => {
      if (shipment.startingPoint) {
        const start = await geocode(shipment.startingPoint);
        setStartCoords(start);
      }
      if (shipment.endingPoint) {
        const end = await geocode(shipment.endingPoint);
        setEndCoords(end);
      }
    };

    fetchCoords();
  }, [shipment, isClient]);

  if (!isClient) {
    return <div style={{ height: '100%', width: '100%', backgroundColor: '#E7E5EA' }} />;
  }

  const positions: [number, number][] = [];
  if (startCoords) positions.push([startCoords.lat, startCoords.lng]);
  if (endCoords) positions.push([endCoords.lat, endCoords.lng]);

  const center: [number, number] = startCoords ? [startCoords.lat, startCoords.lng] : [51.505, -0.09];
  const bounds = positions.length > 1 ? L.latLngBounds(positions) : undefined;

    return (
        <MapContainer center={center} bounds={bounds} style={{ height: '100%', width: '100%' }} className='z-0' attributionControl={false}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {startCoords && (
                <Marker position={[startCoords.lat, startCoords.lng]}>
                    <Popup>Starting Point: {shipment.startingPoint}</Popup>
                </Marker>
            )}
            {endCoords && (
                <Marker position={[endCoords.lat, endCoords.lng]}>
                    <Popup>Ending Point: {shipment.endingPoint}</Popup>
                </Marker>
            )}
            {positions.length > 1 && (
                 <Polyline positions={positions} color="blue" />
            )}
        </MapContainer>
    );
}
