/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET,
  },
}

export default nextConfig;