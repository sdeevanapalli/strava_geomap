import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { storage } from '@/lib/storage';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check URL for OAuth tokens
    const { access_token, refresh_token, expires_at } = router.query;

    if (access_token && refresh_token && expires_at) {
      // Save tokens to localStorage
      storage.saveTokens({
        access_token: access_token as string,
        refresh_token: refresh_token as string,
        expires_at: parseInt(expires_at as string),
      });

      // Clean up URL
      router.replace('/', undefined, { shallow: true });
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Check if user already has valid tokens
    const tokens = storage.getTokens();
    if (tokens && !storage.isTokenExpired(tokens.expires_at)) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      // No valid tokens, redirect to login
      router.push('/login');
    }
  }, [router]);

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
    return null; // Will redirect to login
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
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              ✅ Authentication Successful!
            </h2>
            <p className="text-gray-600 mb-6">
              You're now connected to Strava. We'll build the map and dashboard next!
            </p>
            <div className="inline-block bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-green-700 font-medium">
                🎉 Your access token is stored and ready to use
              </p>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}