import polyline from 'polyline';
import { DecodedCoordinate } from '@/types/strava';

export const polylineUtils = {
  // Decode Strava polyline to lat/lng coordinates
  decode: (encodedPolyline: string): DecodedCoordinate[] => {
    if (!encodedPolyline) return [];
    
    try {
      const decoded = polyline.decode(encodedPolyline) as number[][];
      return decoded.map((coord) => ({ 
        lat: coord[0], 
        lng: coord[1] 
      }));
    } catch (error) {
      console.error('Error decoding polyline:', error);
      return [];
    }
  },

  // Get center point of coordinates
  getCenter: (coordinates: DecodedCoordinate[]): DecodedCoordinate | null => {
    if (coordinates.length === 0) return null;

    const sum = coordinates.reduce(
      (acc, coord) => ({
        lat: acc.lat + coord.lat,
        lng: acc.lng + coord.lng,
      }),
      { lat: 0, lng: 0 }
    );

    return {
      lat: sum.lat / coordinates.length,
      lng: sum.lng / coordinates.length,
    };
  },

  // Get bounds for all coordinates
  getBounds: (coordinates: DecodedCoordinate[]): [[number, number], [number, number]] | null => {
    if (coordinates.length === 0) return null;

    let minLat = coordinates[0].lat;
    let maxLat = coordinates[0].lat;
    let minLng = coordinates[0].lng;
    let maxLng = coordinates[0].lng;

    coordinates.forEach(coord => {
      minLat = Math.min(minLat, coord.lat);
      maxLat = Math.max(maxLat, coord.lat);
      minLng = Math.min(minLng, coord.lng);
      maxLng = Math.max(maxLng, coord.lng);
    });

    return [[minLat, minLng], [maxLat, maxLng]];
  }
};