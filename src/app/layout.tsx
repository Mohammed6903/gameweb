import type { Metadata } from "next";
import React from "react";
import localFont from "next/font/local";
import "./globals.css";
import { getFavIcons, getMeta } from "@/lib/controllers/meta";
import { GoogleAnalytics } from "@next/third-parties/google";
import { getAllHeadScripts, getAllScripts } from "@/lib/controllers/ads";
import DynamicScripts from "@/components/adSense/dynamic-scripts";
import { ThemeProvider } from "@/components/theme/theme-provider";

// Font definitions
const geistSans = localFont({
  src: "fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Favicon type definition
type FavIconType =
  | "favicon"
  | "favicon16"
  | "favicon32"
  | "androidChrome192"
  | "androidChrome512"
  | "appleTouchIcon";

// Fallback favicon URLs
const FALLBACK_FAVICONS: Record<FavIconType, string> = {
  favicon: "/favicon.ico",
  favicon16: "/favicon-16x16.png",
  favicon32: "/favicon-32x32.png",
  androidChrome192: "/android-chrome-192x192.png",
  androidChrome512: "/android-chrome-512x512.png",
  appleTouchIcon: "/apple-touch-icon.png",
};

// Validate favicon type
function isValidFaviconType(type: string): type is FavIconType {
  return [
    "favicon",
    "favicon16",
    "favicon32",
    "androidChrome192",
    "androidChrome512",
    "appleTouchIcon",
  ].includes(type);
}

// Generate Metadata
export async function generateMetadata(): Promise<Metadata> {
  // Fetch metadata and favicons concurrently
  const [metaResult, favIconResponse] = await Promise.all([
    getMeta(),
    getFavIcons(),
  ]);

  // Process site metadata
  const metaData = metaResult.status === 200 ? metaResult.data || {} : {};
  const siteTitle = metaData.site_name || process.env.NEXT_PUBLIC_SITE_NAME;
  const siteDescription =
    metaData.description || "A Gaming website for people of all ages";

  // Process favicon mappings
  const favIconMap =
    favIconResponse.status === 200
      ? favIconResponse.data?.reduce((acc, curr) => {
          if (isValidFaviconType(curr.type)) {
            acc[curr.type] = curr.publicUrl;
          }
          return acc;
        }, {} as Partial<Record<FavIconType, string>>)
      : {};

  // Create favicon configuration with fallbacks
  const favIcons: Record<FavIconType, string> = {
    favicon: favIconMap.favicon || FALLBACK_FAVICONS.favicon,
    favicon16: favIconMap.favicon16 || FALLBACK_FAVICONS.favicon16,
    favicon32: favIconMap.favicon32 || FALLBACK_FAVICONS.favicon32,
    androidChrome192:
      favIconMap.androidChrome192 || FALLBACK_FAVICONS.androidChrome192,
    androidChrome512:
      favIconMap.androidChrome512 || FALLBACK_FAVICONS.androidChrome512,
    appleTouchIcon:
      favIconMap.appleTouchIcon || FALLBACK_FAVICONS.appleTouchIcon,
  };

  // Return dynamic metadata
  return {
    title: siteTitle,
    description: siteDescription,
    icons: {
      icon: [
        { url: favIcons.favicon },
        { url: favIcons.favicon16, sizes: "16x16", type: "image/png" },
        { url: favIcons.favicon32, sizes: "32x32", type: "image/png" },
        { url: favIcons.androidChrome192, sizes: "192x192", type: "image/png" },
        { url: favIcons.androidChrome512, sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: favIcons.appleTouchIcon }],
    },
  };
}

// Root Layout Component
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch ad and script data concurrently
  const [adResponse, headResponse] = await Promise.all([
    getAllScripts(),
    getAllHeadScripts(),
  ]);

  // Process ad and script data
  const adsData = adResponse.status === 200 && adResponse.data ? adResponse.data : [];
  const headData =
    headResponse.error === null && headResponse.data !== null
      ? headResponse.data
      : [];

  return (
    <html lang="en">
      <head>
        {/* Metadata is dynamically injected */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Inject Ads dynamically */}
        <DynamicScripts headScripts={headData} adsData={adsData} />
        <ThemeProvider defaultTheme="system" storageKey="gameweb-theme">
          {/* Main Application Content */}
          {children}
        </ThemeProvider>
        {/* Google Analytics */}
        <GoogleAnalytics gaId="G-0TVV790ZXC" />
      </body>
    </html>
  );
}