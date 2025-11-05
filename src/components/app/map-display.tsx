'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Shipment } from '@/lib/types';
import { useEffect, useState } from 'react';

// Fix for default icon path issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapDisplayProps {
  shipment: Shipment | null;
}

// A simple mock geocoding function
const geocode = async (address: string): Promise<[number, number] | null> => {
    try {
        // In a real app, you would use a geocoding service API
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`);
        const data = await response.json();
        if (data.length > 0) {
            return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
        }
        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
};


export default function MapDisplay({ shipment }: MapDisplayProps) {
    const [startCoords, setStartCoords] = useState<[number, number] | null>(null);
    const [endCoords, setEndCoords] = useState<[number, number] | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCoords = async () => {
            if (shipment?.startingPoint && shipment?.endingPoint) {
                const start = await geocode(shipment.startingPoint);
                const end = await geocode(shipment.endingPoint);

                if (start && end) {
                    setStartCoords(start);
                    setEndCoords(end);
                    setError(null);
                } else {
                    setError("Could not find coordinates for the given locations.");
                }
            }
        };
        fetchCoords();
    }, [shipment]);

    if (error) {
        return <div className="flex items-center justify-center h-full bg-muted"><p className="text-destructive">{error}</p></div>;
    }

    if (!startCoords || !endCoords) {
        return <div className="flex items-center justify-center h-full bg-muted"><p>Loading map...</p></div>;
    }
    
    const center: [number, number] = [
        (startCoords[0] + endCoords[0]) / 2,
        (startCoords[1] + endCoords[1]) / 2,
    ];

    const bounds = L.latLngBounds(startCoords, endCoords);

    return (
        <MapContainer center={center} bounds={bounds} style={{ height: '100%', width: '100%' }} className='z-0'>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {startCoords && (
              <Marker position={startCoords}>
                  <Popup>Starting Point: {shipment?.startingPoint}</Popup>
              </Marker>
            )}
            {endCoords && (
              <Marker position={endCoords}>
                  <Popup>Ending Point: {shipment?.endingPoint}</Popup>
              </Marker>
            )}
        </MapContainer>
    );
}
