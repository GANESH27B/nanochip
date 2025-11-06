'use client';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useTheme } from 'next-themes';
import { useEffect, useRef } from 'react';

// Fix for default icon path issue with webpack
if (L.Icon.Default.prototype) {
  delete (L.Icon.Default.prototype as any)._getIconUrl;
}
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
  const { theme } = useTheme();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  
  const positions: [number, number][] = [
    [start.lat, start.lng],
    [end.lat, end.lng],
  ];

  useEffect(() => {
    if (mapContainerRef.current && !mapRef.current) {
        const map = L.map(mapContainerRef.current, {
            scrollWheelZoom: false,
        });
        mapRef.current = map;

        L.tileLayer(
            'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
            {
              attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              className: theme === 'dark' ? 'dark-map-tiles' : ''
            }
        ).addTo(map);
        
        L.marker([start.lat, start.lng], { icon: customIcon })
          .addTo(map)
          .bindTooltip(`Origin: ${start.label}`, { permanent: true, direction: 'top', offset: [0, -12] });

        L.marker([end.lat, end.lng], { icon: customIcon })
            .addTo(map)
            .bindTooltip(`Destination: ${end.label}`, { permanent: true, direction: 'top', offset: [0, -12] });
        
        L.polyline(positions, { color: "hsl(var(--primary))", weight: 3, dashArray: "5, 10" }).addTo(map);

        map.fitBounds(L.latLngBounds(positions), { padding: [50, 50] });
    }

    return () => {
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
        }
    };
  }, [start, end, theme, positions]);


  return (
    <div
      ref={mapContainerRef}
      style={{ height: '100%', width: '100%', borderRadius: 'var(--radius)' }}
      className="z-0"
    />
  );
}
