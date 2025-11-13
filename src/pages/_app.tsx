import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Navbar from "@/components/NavBar";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Strava GeoMap</title>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </Head>

      <div className="min-h-screen bg-gray-50 text-gray-900">
        <Navbar />
        <main className="pt-16 px-4 sm:px-6 lg:px-8">
          <Component {...pageProps} />
        </main>
      </div>
    </>
  );
}
