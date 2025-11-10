import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import { storage } from '@/lib/storage';
import { stravaApi } from '@/lib/strava';
import { mockActivities } from '@/lib/mockData';
import { StravaActivity } from '@/types/strava';
import StatsPanel from '@/components/StatsPanel';
import { Loader2, Map as MapIcon, Flame } from 'lucide-react';

// Dynamically import map to avoid SSR issues
const ActivityMap = dynamic(() => import('@/components/ActivityMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <Loader2 className="w-8 h-8 text-strava-orange animate-spin" />
    </div>
  ),
});

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [viewMode, setViewMode] = useState<'route' | 'heatmap'>('route');
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    // Check URL for OAuth tokens
    const { access_token, refresh_token, expires_at } = router.query;

    if (access_token && refresh_token && expires_at) {
      storage.saveTokens({
        access_token: access_token as string,
        refresh_token: refresh_token as string,
        expires_at: parseInt(expires_at as string),
      });

      router.replace('/', undefined, { shallow: true });
      setIsAuthenticated(true);
      setIsLoading(false);
      loadActivities(access_token as string);
      return;
    }

    // Check if user already has valid tokens
    const tokens = storage.getTokens();
    if (tokens && !storage.isTokenExpired(tokens.expires_at)) {
      setIsAuthenticated(true);
      setIsLoading(false);
      loadActivities(tokens.access_token);
    } else {
      router.push('/login');
    }
  }, [router]);

  const loadActivities = async (accessToken: string) => {
    setIsLoadingActivities(true);
    try {
      const data = await stravaApi.fetchActivities(accessToken);
      setActivities(data);
      setUseMockData(false);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      // Fallback to mock data
      setActivities(mockActivities);
      setUseMockData(true);
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const handleLogout = () => {
    storage.clearTokens();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-strava-orange animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Dashboard - Strava Heatmap</title>
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                Strava Heatmap Dashboard
              </h1>
              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('route')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                      viewMode === 'route'
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <MapIcon className="w-4 h-4" />
                    Routes
                  </button>
                  <button
                    onClick={() => setViewMode('heatmap')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2 ${
                      viewMode === 'heatmap'
                        ? 'bg-white text-gray-900 shadow'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Flame className="w-4 h-4" />
                    Heatmap
                  </button>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          {/* Mock Data Warning */}
          {useMockData && (
            <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ Using mock data for demonstration. Real Strava data couldn't be loaded.
              </p>
            </div>
          )}

          {/* Stats Panel */}
          <div className="mb-6">
            <StatsPanel activities={activities} />
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg shadow-lg p-4" style={{ height: '600px' }}>
            {isLoadingActivities ? (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-strava-orange animate-spin" />
              </div>
            ) : activities.length > 0 ? (
              <ActivityMap activities={activities} viewMode={viewMode} />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                No activities found
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}