import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { Mountain, Activity, TrendingUp } from 'lucide-react';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's an error from OAuth
    if (router.query.error) {
      setError('Authentication failed. Please try again.');
    }
  }, [router.query]);

  const handleLogin = () => {
    // Redirect to our Express OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/strava`;
  };

  return (
    <>
      <Head>
        <title>Login - Strava Heatmap</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-strava-orange to-orange-600 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Logo/Title Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <Mountain className="w-12 h-12 text-strava-orange" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Strava Heatmap
            </h1>
            <p className="text-orange-100 text-lg">
              Visualize your activities on an interactive map
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Features List */}
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <div className="bg-orange-50 p-2 rounded-lg">
                  <Activity className="w-5 h-5 text-strava-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Track Activities</h3>
                  <p className="text-sm text-gray-600">View all your runs, rides, and walks</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-orange-50 p-2 rounded-lg">
                  <Mountain className="w-5 h-5 text-strava-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Interactive Map</h3>
                  <p className="text-sm text-gray-600">Explore routes on a detailed heatmap</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-orange-50 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-strava-orange" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Statistics</h3>
                  <p className="text-sm text-gray-600">Analyze distance, elevation, and speed</p>
                </div>
              </div>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full bg-strava-orange hover:bg-orange-600 text-white font-semibold py-4 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
              </svg>
              Connect with Strava
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">
              By connecting, you authorize this app to access your Strava activity data
            </p>
          </div>

          {/* Footer */}
          <p className="text-center text-orange-100 text-sm mt-6">
            Secure authentication powered by Strava OAuth
          </p>
        </div>
      </div>
    </>
  );
}