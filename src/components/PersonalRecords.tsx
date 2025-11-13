/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { StravaActivity } from '@/types/strava';
import {
  Trophy,
  Mountain,
  Zap,
  Calendar,
  Flame,
  Award,
  Clock,
  Target,
  TrendingUp,
  BarChart3,
} from 'lucide-react';
import { format, getWeek } from 'date-fns';

interface PersonalRecordsProps {
  activities: StravaActivity[];
}

interface RecordItem {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  color: string;
  bgColor: string;
}

export default function PersonalRecords({ activities }: PersonalRecordsProps) {
  if (activities.length === 0) return null;

  const totalDistance = activities.reduce((sum, a) => sum + a.distance, 0);
  const totalElevation = activities.reduce(
    (sum, a) => sum + a.total_elevation_gain,
    0
  );
  const totalTime = activities.reduce((sum, a) => sum + a.moving_time, 0);
  const totalActivities = activities.length;

  const calculateRecords = (): RecordItem[] => {
    // Longest Distance
    const longestActivity = activities.reduce((a, b) =>
      a.distance > b.distance ? a : b
    );
    const longestDistance = (longestActivity.distance / 1000).toFixed(2);
    const longestDate = format(new Date(longestActivity.start_date), 'MMM d, yyyy');

    // Highest Elevation
    const highestElevActivity = activities.reduce((a, b) =>
      a.total_elevation_gain > b.total_elevation_gain ? a : b
    );
    const highestElev = highestElevActivity.total_elevation_gain.toFixed(0);
    const elevDate = format(new Date(highestElevActivity.start_date), 'MMM d, yyyy');

    // Fastest Average Speed (overall)
    const fastestActivity = activities.reduce((a, b) =>
      a.average_speed > b.average_speed ? a : b
    );
    const fastestSpeed = (fastestActivity.average_speed * 3.6).toFixed(1);
    const fastestDate = format(new Date(fastestActivity.start_date), 'MMM d, yyyy');

    // Fastest Ride over 20 km
    const longRides = activities.filter((a) => a.distance > 20000);
    const fastestLongRide =
      longRides.length > 0
        ? longRides.reduce((a, b) =>
            a.average_speed > b.average_speed ? a : b
          )
        : fastestActivity;
    const fastestLongSpeed = (fastestLongRide.average_speed * 3.6).toFixed(1);

    // Longest Duration
    const longestDurationActivity = activities.reduce((a, b) =>
      a.moving_time > b.moving_time ? a : b
    );
    const longestDuration = `${Math.floor(
      longestDurationActivity.moving_time / 3600
    )}h ${Math.floor((longestDurationActivity.moving_time % 3600) / 60)}m`;

    // Most Active Month
    const monthCounts: Record<string, number> = {};
    activities.forEach((a) => {
      const key = format(new Date(a.start_date), 'MMM yyyy');
      monthCounts[key] = (monthCounts[key] || 0) + 1;
    });
    const mostActiveMonth = Object.entries(monthCounts).reduce(
      (a, b) => (b[1] > a[1] ? b : a),
      ['', 0] as [string, number]
    );

    // Current Streak
    const sortedDates = activities
      .map((a) => format(new Date(a.start_date_local), 'yyyy-MM-dd'))
      .sort()
      .reverse();
    const uniqueDates = [...new Set(sortedDates)];
    let currentStreak = 0;
    for (let i = 0; i < uniqueDates.length; i++) {
      const date = new Date(uniqueDates[i]);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = format(expectedDate, 'yyyy-MM-dd');
      if (uniqueDates[i] === expectedDateStr) currentStreak++;
      else break;
    }

    // Consistency (last 90 days)
    const past90 = Array.from({ length: 90 }, (_, i) =>
      format(new Date(Date.now() - i * 86400000), 'yyyy-MM-dd')
    );
    const activeDays = new Set(
      activities.map((a) => format(new Date(a.start_date), 'yyyy-MM-dd'))
    );
    const consistency = (
      (past90.filter((d) => activeDays.has(d)).length / 90) *
      100
    ).toFixed(0);

    return [
      {
        title: 'Longest Distance',
        value: `${longestDistance} km`,
        subtitle: `${longestActivity.name} • ${longestDate}`,
        icon: Trophy,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
      },
      {
        title: 'Longest Duration',
        value: longestDuration,
        subtitle: `${longestDurationActivity.name} . ${longestDate}`,
        icon: Clock,
        color: 'text-emerald-600',
        bgColor: 'bg-emerald-50',
      },
      {
        title: 'Fastest Ride (20km+)',
        value: `${fastestLongSpeed} km/h`,
        subtitle: `${fastestLongRide.name}`,
        icon: Zap,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        title: 'Biggest Climb',
        value: `${highestElev} m`,
        subtitle: `${highestElevActivity.name} • ${elevDate}`,
        icon: Mountain,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
      },
      {
        title: 'Most Active Month',
        value: `${mostActiveMonth[1]} rides`,
        subtitle: mostActiveMonth[0],
        icon: Calendar,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
      },
      {
        title: 'Current Streak',
        value: `${currentStreak} days`,
        subtitle: currentStreak > 0 ? 'Keep it going 🔥' : 'Start a new streak!',
        icon: Flame,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
      },
      {
        title: 'Consistency',
        value: `${consistency}%`,
        subtitle: 'Active in last 90 days',
        icon: Target,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
      },
      {
        title: 'Total Activities',
        value: totalActivities.toString(),
        subtitle: 'All-time',
        icon: Award,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
      },
    ];
  };

  const records = calculateRecords();

  // Yearly Goal
  const yearlyGoal = 2000 * 1000; // 2000 km
  const goalProgress = Math.min((totalDistance / yearlyGoal) * 100, 100);

  // Lifetime averages
  const avgDistance = (totalDistance / totalActivities / 1000).toFixed(1);
  const avgSpeed = (
    (activities.reduce((sum, a) => sum + a.average_speed, 0) / totalActivities) *
    3.6
  ).toFixed(1);
  const avgElevation = (totalElevation / totalActivities).toFixed(0);

  return (
    <div className="bg-white rounded-xl shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl">
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Performance Dashboard</h2>
            <p className="text-sm text-gray-600">
              Your personal bests, averages & consistency
            </p>
          </div>
        </div>
      </div>

      {/* Records */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {records.map((record, i) => {
          const Icon = record.icon;
          return (
            <div
              key={i}
              className="relative overflow-hidden rounded-lg border-2 border-gray-100 p-4 hover:border-gray-200 hover:shadow-md transition-all"
            >
              <div
                className={`absolute top-0 right-0 w-24 h-24 ${record.bgColor} rounded-full opacity-20 -mr-8 -mt-8`}
              />
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className={`${record.bgColor} p-2.5 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${record.color}`} />
                  </div>
                </div>
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {record.title}
                </h3>
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {record.value}
                </p>
                <p className="text-xs text-gray-500 truncate">{record.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Lifetime Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {(totalDistance / 1000).toFixed(0)}
            </p>
            <p className="text-sm text-gray-600">Total Kilometers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {Math.floor(totalTime / 3600)}
            </p>
            <p className="text-sm text-gray-600">Hours Moving</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {totalElevation.toFixed(0)}
            </p>
            <p className="text-sm text-gray-600">Meters Climbed</p>
          </div>
        </div>

        {/* Averages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mt-6">
          <div>
            <p className="text-xl font-bold text-gray-900">{avgDistance} km</p>
            <p className="text-sm text-gray-600">Avg Distance / Ride</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{avgSpeed} km/h</p>
            <p className="text-sm text-gray-600">Avg Speed</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{avgElevation} m</p>
            <p className="text-sm text-gray-600">Avg Elevation Gain</p>
          </div>
        </div>
      </div>
    </div>
  );
}
