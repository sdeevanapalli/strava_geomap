import { StravaActivity } from '@/types/strava';
import { Trophy, Mountain, Zap, Calendar, Flame, Award } from 'lucide-react';
import { format } from 'date-fns';

interface PersonalRecordsProps {
  activities: StravaActivity[];
}

interface Record {
  title: string;
  value: string;
  subtitle: string;
  icon: any;
  color: string;
  bgColor: string;
}

export default function PersonalRecords({ activities }: PersonalRecordsProps) {
  if (activities.length === 0) {
    return null;
  }

  // Calculate Personal Records
  const calculateRecords = (): Record[] => {
    // 1. Longest Distance
    const longestActivity = activities.reduce((prev, current) => 
      current.distance > prev.distance ? current : prev
    );
    const longestDistance = (longestActivity.distance / 1000).toFixed(2);
    const longestDate = format(new Date(longestActivity.start_date), 'MMM d, yyyy');

    // 2. Highest Elevation
    const highestElevActivity = activities.reduce((prev, current) => 
      current.total_elevation_gain > prev.total_elevation_gain ? current : prev
    );
    const highestElev = highestElevActivity.total_elevation_gain.toFixed(0);
    const elevDate = format(new Date(highestElevActivity.start_date), 'MMM d, yyyy');

    // 3. Fastest Average Speed
    const fastestActivity = activities.reduce((prev, current) => 
      current.average_speed > prev.average_speed ? current : prev
    );
    const fastestSpeed = (fastestActivity.average_speed * 3.6).toFixed(1);
    const fastestDate = format(new Date(fastestActivity.start_date), 'MMM d, yyyy');

    // 4. Most Active Month
    const monthCounts: { [key: string]: number } = {};
    activities.forEach(activity => {
      const monthKey = format(new Date(activity.start_date), 'MMM yyyy');
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });
    const mostActiveMonth = Object.entries(monthCounts).reduce((prev, current) => 
      current[1] > prev[1] ? current : prev
    );

    // 5. Current Streak (consecutive days with activities)
    const sortedDates = activities
      .map(a => format(new Date(a.start_date_local), 'yyyy-MM-dd'))
      .sort()
      .reverse();
    
    const uniqueDates = [...new Set(sortedDates)];
    let currentStreak = 0;
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const date = new Date(uniqueDates[i]);
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateStr = format(expectedDate, 'yyyy-MM-dd');
      
      if (uniqueDates[i] === expectedDateStr) {
        currentStreak++;
      } else {
        break;
      }
    }

    // 6. Total Activities
    const totalActivities = activities.length;

    return [
      {
        title: 'Longest Activity',
        value: `${longestDistance} km`,
        subtitle: `${longestActivity.name} • ${longestDate}`,
        icon: Trophy,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
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
        title: 'Fastest Pace',
        value: `${fastestSpeed} km/h`,
        subtitle: `${fastestActivity.name} • ${fastestDate}`,
        icon: Zap,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
      },
      {
        title: 'Most Active Month',
        value: `${mostActiveMonth[1]} activities`,
        subtitle: mostActiveMonth[0],
        icon: Calendar,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
      },
      {
        title: 'Current Streak',
        value: `${currentStreak} days`,
        subtitle: currentStreak > 0 ? 'Keep it going! 🔥' : 'Start a new streak today!',
        icon: Flame,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
      },
      {
        title: 'Total Activities',
        value: totalActivities.toString(),
        subtitle: 'All time',
        icon: Award,
        color: 'text-pink-600',
        bgColor: 'bg-pink-50',
      },
    ];
  };

  const records = calculateRecords();

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-3 rounded-xl">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Personal Records</h2>
            <p className="text-sm text-gray-600">Your best achievements</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {records.map((record, index) => {
          const Icon = record.icon;
          return (
            <div
              key={index}
              className="relative overflow-hidden rounded-lg border-2 border-gray-100 p-4 hover:border-gray-200 hover:shadow-md transition-all"
            >
              {/* Background decoration */}
              <div className={`absolute top-0 right-0 w-24 h-24 ${record.bgColor} rounded-full opacity-20 -mr-8 -mt-8`} />
              
              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className={`${record.bgColor} p-2.5 rounded-lg`}>
                    <Icon className={`w-5 h-5 ${record.color}`} />
                  </div>
                  {index === 0 && (
                    <span className="text-2xl">🥇</span>
                  )}
                  {index === 1 && (
                    <span className="text-2xl">🥈</span>
                  )}
                  {index === 2 && (
                    <span className="text-2xl">🥉</span>
                  )}
                </div>
                
                <h3 className="text-sm font-medium text-gray-600 mb-1">
                  {record.title}
                </h3>
                
                <p className="text-2xl font-bold text-gray-900 mb-1">
                  {record.value}
                </p>
                
                <p className="text-xs text-gray-500 truncate">
                  {record.subtitle}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fun Facts Section */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {(activities.reduce((sum, a) => sum + a.distance, 0) / 1000).toFixed(0)}
            </p>
            <p className="text-sm text-gray-600">Total Kilometers</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {Math.floor(activities.reduce((sum, a) => sum + a.moving_time, 0) / 3600)}
            </p>
            <p className="text-sm text-gray-600">Hours Moving</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-900">
              {activities.reduce((sum, a) => sum + a.total_elevation_gain, 0).toFixed(0)}
            </p>
            <p className="text-sm text-gray-600">Meters Climbed</p>
          </div>
        </div>
      </div>
    </div>
  );
}