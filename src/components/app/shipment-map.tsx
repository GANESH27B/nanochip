'use client';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

// Fix for default icon path issue with webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});


const customIcon = new L.Icon({
    iconUrl: 'data:image/svg+xml;base64,' + btoa('<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" fill="hsl(var(--primary))" stroke="hsl(var(--primary-foreground))" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="hsl(var(--primary-foreground))"/></svg>'),
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
});


type MapPoint = {
  lat: number;
  lng: number;
  label: string;
};

interface ShipmentMapProps {
  start: MapPoint;
  end: MapPoint;
}

export default function ShipmentMap({ start, end }: ShipmentMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const { theme } = useTheme();
  
  const positions: [number, number][] = [
    [start.lat, start.lng],
    [end.lat, end.lng],
  ];

  const bounds = L.latLngBounds(positions);

  return (
    <MapContainer
      bounds={bounds}
      style={{ height: '100%', width: '100%', borderRadius: 'var(--radius)' }}
      className="z-0"
      whenCreated={(map) => {
        // Only set the map instance if it hasn't been set, to avoid re-initialization errors
        if (!mapRef.current) {
          mapRef.current = map;
        }
      }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        className={theme === 'dark' ? 'dark-map-tiles' : ''}
      />
      <Marker position={[start.lat, start.lng]} icon={customIcon}>
        <Tooltip permanent direction="top" offset={[0, -12]}>
          Origin: {start.label}
        </Tooltip>
      </Marker>
      <Marker position={[end.lat, end.lng]} icon={customIcon}>
        <Tooltip permanent direction="top" offset={[0, -12]}>
          Destination: {end.label}
        </Tooltip>
      </Marker>
      <Polyline positions={positions} color="hsl(var(--primary))" weight={3} dashArray="5, 10" />
    </MapContainer>
  );
}
