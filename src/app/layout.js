import "./globals.css";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import GoogleAnalytics from "@/components/User/GoogleAnalytics";
import UserLocation from "@/components/User/UserLocation";
import StoreProvider from "@/redux/components/StoreProvider";
import { Suspense } from "react";

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#131720",
  userScalable: true,
  colorScheme: "dark",
};

export const metadata = {
  generator: process.env.NEXT_PUBLIC_APP_NAME,
  applicationName: process.env.NEXT_PUBLIC_APP_NAME,
  referrer: "origin-when-cross-origin",
  keywords: process.env.NEXT_PUBLIC_APP_KEYWORDS.split(", "),
  authors: [
    { name: "Fachry Dwi Afriza", url: "https://fachryafrz.vercel.app" },
  ],
  creator: "Fachry Dwi Afriza",
  publisher: "Fachry Dwi Afriza",
  // viewport: {
  //   width: "device-width",
  //   initialScale: 1,
  // },
  title: {
    default: process.env.NEXT_PUBLIC_APP_NAME,
    template: "%s - " + process.env.NEXT_PUBLIC_APP_NAME,
  },
  description: process.env.NEXT_PUBLIC_APP_DESC,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL),
  alternates: {
    canonical: "/",
    languages: "en-US",
  },
  openGraph: {
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: process.env.NEXT_PUBLIC_APP_NAME,
    images: "/popcorn.png",
    locale: "en_US",
    type: "website",
  },
  // themeColor: "#202735",
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    creator: "@fachryafrz",
    images: "/popcorn.png",
  },
  verification: {
    google: "google",
    yandex: "yandex",
    yahoo: "yahoo",
    other: {
      me: ["fachrydwiafriza@gmail.com", "https://fachryafrz.vercel.app"],
    },
  },
  category: "entertainment",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-pt-20">
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <Suspense>
        <GoogleAnalytics GA_MEASUREMENT_ID="G-L0V4DXC6HK" />
      </Suspense>
      <body className="bg-base-100 text-white">
        <StoreProvider>
          {/* Navbar */}
          <Suspense>
            <Navbar />
          </Suspense>

          {/* User Location */}
          <UserLocation />

          {/* Main Content */}
          <main className={`pb-8 mt-[66px]`}>{children}</main>

          {/* Footer */}
          <Footer />
        </StoreProvider>
      </body>
    </html>
  );
}
