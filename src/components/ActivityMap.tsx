import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Polyline, useMap } from 'react-leaflet';
import { StravaActivity } from '@/types/strava';
import { polylineUtils } from '@/lib/polyline';
import 'leaflet/dist/leaflet.css';

interface ActivityMapProps {
  activities: StravaActivity[];
  viewMode: 'route' | 'heatmap';
}

// Component to fit map bounds to all routes
function FitBounds({ activities }: { activities: StravaActivity[] }) {
  const map = useMap();

  useEffect(() => {
    if (activities.length === 0) return;

    const allCoords = activities.flatMap(activity => 
      polylineUtils.decode(activity.map.summary_polyline)
    );

    const bounds = polylineUtils.getBounds(allCoords);
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [activities, map]);

  return null;
}

export default function ActivityMap({ activities, viewMode }: ActivityMapProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Don't render map on server
  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  // Default center (will be overridden by FitBounds)
  const defaultCenter: [number, number] = [40.7589, -73.9851]; // NYC
  const defaultZoom = 12;

  // Color mapping for activity types
  const getActivityColor = (type: string): string => {
    switch (type) {
      case 'Run':
        return '#FC4C02'; // Strava orange
      case 'Ride':
        return '#3B82F6'; // Blue
      case 'Walk':
        return '#10B981'; // Green
      default:
        return '#6B7280'; // Gray
    }
  };

  // Decode polylines and prepare routes
  const routes = activities.map(activity => ({
    id: activity.id,
    name: activity.name,
    type: activity.type,
    color: getActivityColor(activity.type),
    coordinates: polylineUtils.decode(activity.map.summary_polyline),
  })).filter(route => route.coordinates.length > 0);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
      >
        {/* Base Map Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit bounds to all activities */}
        <FitBounds activities={activities} />

        {/* Render routes */}
        {routes.map(route => (
          <Polyline
            key={route.id}
            positions={route.coordinates.map(c => [c.lat, c.lng])}
            pathOptions={{
              color: route.color,
              weight: viewMode === 'heatmap' ? 3 : 4,
              opacity: viewMode === 'heatmap' ? 0.6 : 0.8,
            }}
          >
            {/* You can add popups here later */}
          </Polyline>
        ))}
      </MapContainer>
    </div>
  );
}