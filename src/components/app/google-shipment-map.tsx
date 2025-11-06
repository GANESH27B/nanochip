'use client';
import { useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, DirectionsService, DirectionsRenderer, MarkerF } from '@react-google-maps/api';
import { useTheme } from 'next-themes';
import { Loader2 } from 'lucide-react';
import type { ShipmentStatus } from '@/lib/types';

interface MapPoint {
  lat: number;
  lng: number;
}

interface GoogleShipmentMapProps {
  origin: MapPoint;
  destination: MapPoint;
  status: ShipmentStatus;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: 'var(--radius)',
};

const lightMapStyle: google.maps.MapTypeStyle[] = [];
const darkMapStyle: google.maps.MapTypeStyle[] = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
];

const truckIcon = {
  path: 'M21 16V8a2 2 0 0 0-2-2h-7.09a4 4 0 0 0-3.16 1.5l-2.84 4.26A2 2 0 0 0 5 13v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2zm-9 2a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z',
  fillColor: 'hsl(var(--primary))',
  fillOpacity: 1,
  strokeWeight: 0,
  scale: 1.2,
  anchor: { x: 12, y: 12 },
};

export default function GoogleShipmentMap({ origin, destination, status }: GoogleShipmentMapProps) {
  const { theme } = useTheme();
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: ['places'],
  });

  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [truckPosition, setTruckPosition] = useState<google.maps.LatLngLiteral>(origin);

  useEffect(() => {
    if (status === 'In-Transit' && directions) {
      const route = directions.routes[0].overview_path;
      let step = 0;
      const interval = setInterval(() => {
        if (step >= route.length) {
          clearInterval(interval);
           setTruckPosition(destination); // Snap to destination at the end
        } else {
            setTruckPosition({ lat: route[step].lat(), lng: route[step].lng() });
            step++;
        }
      }, 200); // Adjust speed of the animation
      return () => clearInterval(interval);
    } else if (status === 'Delivered') {
      setTruckPosition(destination);
    } else {
      setTruckPosition(origin);
    }
  }, [status, directions, origin, destination]);


  if (loadError) {
    return <div>Error loading maps. Please check your API key and configuration.</div>;
  }

  if (!isLoaded) {
    return <div className="h-full w-full bg-muted animate-pulse flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={origin}
      zoom={8}
      options={{
        styles: theme === 'dark' ? darkMapStyle : lightMapStyle,
        disableDefaultUI: true,
        zoomControl: true,
      }}
    >
      <DirectionsService
        options={{
          destination: destination,
          origin: origin,
          travelMode: google.maps.TravelMode.DRIVING,
        }}
        callback={(response) => {
          if (response !== null) {
            if (response.status === 'OK') {
              setDirections(response);
            } else {
              console.error('Directions request failed due to ' + response.status);
            }
          }
        }}
      />
      {directions && (
        <DirectionsRenderer
          options={{
            directions: directions,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: 'hsl(var(--primary))',
              strokeOpacity: 0.8,
              strokeWeight: 4,
            },
          }}
        />
      )}
      <MarkerF position={origin} label="A" />
      <MarkerF position={destination} label="B" />
      {status !== 'Delivered' && <MarkerF position={truckPosition} icon={truckIcon} />}
    </GoogleMap>
  );
}
