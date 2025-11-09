export interface StravaActivity {
  id: number;
  name: string;
  type: 'Run' | 'Ride' | 'Walk' | 'Hike' | 'Swim' | string;
  distance: number; // in meters
  moving_time: number; // in seconds
  elapsed_time: number;
  total_elevation_gain: number; // in meters
  start_date: string;
  start_date_local: string;
  average_speed: number; // in m/s
  max_speed: number;
  map: {
    summary_polyline: string;
    polyline?: string;
  };
}

export interface ActivityStats {
  totalDistance: number; // in km
  totalElevation: number; // in meters
  averageSpeed: number; // in km/h
  activityCount: number;
}

export interface StravaTokens {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

export interface DecodedCoordinate {
  lat: number;
  lng: number;
}