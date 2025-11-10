import { StravaActivity } from '@/types/strava';

export const mockActivities: StravaActivity[] = [
  {
    id: 1,
    name: "Morning Run in Central Park",
    type: "Run",
    distance: 5420.3,
    moving_time: 1823,
    elapsed_time: 1920,
    total_elevation_gain: 45.2,
    start_date: "2024-11-09T07:30:00Z",
    start_date_local: "2024-11-09T02:30:00",
    average_speed: 2.97,
    max_speed: 4.5,
    map: {
      summary_polyline: "a~l~Fjk~uOwHJy@P" // Simple polyline for demo
    }
  },
  {
    id: 2,
    name: "Evening Bike Ride",
    type: "Ride",
    distance: 15230.5,
    moving_time: 2847,
    elapsed_time: 3000,
    total_elevation_gain: 125.8,
    start_date: "2024-11-08T18:00:00Z",
    start_date_local: "2024-11-08T13:00:00",
    average_speed: 5.35,
    max_speed: 8.2,
    map: {
      summary_polyline: "w`l~Fjk~uO@bH@pI"
    }
  },
  {
    id: 3,
    name: "Weekend Long Run",
    type: "Run",
    distance: 10842.7,
    moving_time: 3625,
    elapsed_time: 3780,
    total_elevation_gain: 89.3,
    start_date: "2024-11-07T08:15:00Z",
    start_date_local: "2024-11-07T03:15:00",
    average_speed: 2.99,
    max_speed: 4.8,
    map: {
      summary_polyline: "y~l~Fjk~uOsHvD"
    }
  }
];