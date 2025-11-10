import { StravaActivity } from '@/types/strava';
import { Activity, TrendingUp, Mountain } from 'lucide-react';

interface StatsPanelProps {
  activities: StravaActivity[];
}

export default function StatsPanel({ activities }: StatsPanelProps) {
  // Calculate statistics
  const totalDistance = activities.reduce((sum, a) => sum + a.distance, 0) / 1000; // Convert to km
  const totalElevation = activities.reduce((sum, a) => sum + a.total_elevation_gain, 0);
  const avgSpeed = activities.length > 0
    ? activities.reduce((sum, a) => sum + a.average_speed, 0) / activities.length * 3.6 // Convert m/s to km/h
    : 0;

  const stats = [
    {
      label: 'Total Distance',
      value: `${totalDistance.toFixed(1)} km`,
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      label: 'Total Elevation',
      value: `${totalElevation.toFixed(0)} m`,
      icon: Mountain,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      label: 'Avg Speed',
      value: `${avgSpeed.toFixed(1)} km/h`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      label: 'Activities',
      value: activities.length.toString(),
      icon: Activity,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow p-4 border border-gray-200"
          >
            <div className="flex items-center gap-3">
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}