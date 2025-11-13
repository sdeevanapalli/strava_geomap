import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import dynamic from "next/dynamic";
import { storage } from "@/lib/storage";
import { stravaApi } from "@/lib/strava";
import { mockActivities } from "@/lib/mockData";
import { StravaActivity } from "@/types/strava";
import StatsPanel from "@/components/StatsPanel";
import FilterBar, { ActivityFilters } from "@/components/FilterBar";
import { Loader2, Map as MapIcon, Flame, RefreshCw } from "lucide-react";
import SettingsPanel from "@/components/SettingsPanel";
import PersonalRecords from "@/components/PersonalRecords";

const ActivityMap = dynamic(() => import("@/components/ActivityMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
      <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
    </div>
  ),
});

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allActivities, setAllActivities] = useState<StravaActivity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<StravaActivity[]>([]);
  const [viewMode, setViewMode] = useState<"route" | "heatmap">("route");
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [useMockData, setUseMockData] = useState(false);
  const [activityLimit, setActivityLimit] = useState(500);

  const loadActivities = useCallback(async (accessToken: string) => {
    setIsLoadingActivities(true);
    try {
      const data = await stravaApi.fetchActivities(accessToken, activityLimit);
      setAllActivities(data);
      setFilteredActivities(data);
      setUseMockData(false);
    } catch {
      setAllActivities(mockActivities);
      setFilteredActivities(mockActivities);
      setUseMockData(true);
    } finally {
      setIsLoadingActivities(false);
    }
  }, [activityLimit]);

  useEffect(() => {
    const { access_token, refresh_token, expires_at } = router.query;

    if (access_token && refresh_token && expires_at) {
      storage.saveTokens({
        access_token: access_token as string,
        refresh_token: refresh_token as string,
        expires_at: parseInt(expires_at as string),
      });
      router.replace("/", undefined, { shallow: true });
      setIsAuthenticated(true);
      setIsLoading(false);
      loadActivities(access_token as string);
      return;
    }

    const tokens = storage.getTokens();
    if (tokens && !storage.isTokenExpired(tokens.expires_at)) {
      setIsAuthenticated(true);
      setIsLoading(false);
      loadActivities(tokens.access_token);
    } else {
      router.push("/login");
    }
  }, [router, loadActivities]);

  const handleFilterChange = (filters: ActivityFilters) => {
    let filtered = [...allActivities];

    if (filters.activityTypes.length > 0)
      filtered = filtered.filter(a => filters.activityTypes.includes(a.type));

    if (filters.dateRange.start)
      filtered = filtered.filter(a =>
        new Date(a.start_date) >= new Date(filters.dateRange.start)
      );

    if (filters.dateRange.end) {
      const endDate = new Date(filters.dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(a => new Date(a.start_date) <= endDate);
    }

    setFilteredActivities(filtered);
  };

  const handleRefresh = () => {
    const tokens = storage.getTokens();
    if (tokens) loadActivities(tokens.access_token);
  };

  const handleLogout = () => {
    storage.clearTokens();
    router.push("/login");
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );

  if (!isAuthenticated) return null;

  return (
    <>
      <Head>
        <title>Dashboard - StravaGeoMap</title>
      </Head>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="bg-white rounded-xl shadow-md p-5 mb-6 flex flex-wrap justify-between items-center gap-4 border border-gray-100">
          <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={isLoadingActivities}
              className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 transition"
              title="Refresh"
            >
              <RefreshCw
                className={`w-5 h-5 ${isLoadingActivities ? "animate-spin text-orange-500" : "text-gray-700"}`}
              />
            </button>

            <SettingsPanel
              currentLimit={activityLimit}
              onActivityLimitChange={(limit) => {
                setActivityLimit(limit);
                const tokens = storage.getTokens();
                if (tokens) loadActivities(tokens.access_token);
              }}
            />

            <div className="flex bg-gray-100 rounded-md p-1">
              <button
                onClick={() => setViewMode("route")}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 ${
                  viewMode === "route"
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <MapIcon className="w-4 h-4" />
                Routes
              </button>
              <button
                onClick={() => setViewMode("heatmap")}
                className={`px-3 py-1.5 rounded-md text-sm flex items-center gap-2 ${
                  viewMode === "heatmap"
                    ? "bg-white shadow text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Flame className="w-4 h-4" />
                Heatmap
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Logout
            </button>
          </div>
        </header>

        {useMockData && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-800 text-sm">
            ⚠️ Using mock data. Real Strava data couldn’t be loaded.
          </div>
        )}

        <StatsPanel activities={filteredActivities} />

        <FilterBar onFilterChange={handleFilterChange} />

        <p className="mt-3 mb-4 text-sm text-gray-600">
          Showing <span className="font-semibold">{filteredActivities.length}</span> of{" "}
          <span className="font-semibold">{allActivities.length}</span> activities
        </p>

        <div className="bg-white rounded-lg shadow p-4 border border-gray-100" style={{ height: "600px" }}>
          {isLoadingActivities ? (
            <div className="flex items-center justify-center h-full flex-col text-gray-600">
              <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-3" />
              <p>Loading activities...</p>
            </div>
          ) : filteredActivities.length > 0 ? (
            <ActivityMap activities={filteredActivities} viewMode={viewMode} />
          ) : (
            <div className="flex items-center justify-center h-full flex-col text-gray-400">
              <p className="text-lg mb-2">No activities match your filters</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
