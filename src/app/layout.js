import "./globals.css";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import GoogleAnalytics from "@/components/User/GoogleAnalytics";
import { Suspense } from "react";
import { CookiesProvider } from "next-client-cookies/server";
import GoogleAdsense from "@/components/User/GoogleAdsense";
import { headers } from "next/headers";
import UserLocation from "@/components/User/Location";

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
    template: `%s - ${process.env.NEXT_PUBLIC_APP_NAME}`,
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
    images: "/maskable_icon_x512.png",
    locale: "en_US",
    type: "website",
  },
  // themeColor: "#202735",
  manifest: "/manifest.webmanifest",
  twitter: {
    card: "summary_large_image",
    title: process.env.NEXT_PUBLIC_APP_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESC,
    creator: "@fachryafrz",
    images: "/maskable_icon_x512.png",
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
  // robots: {
  //   index: true,
  //   follow: true,
  //   nocache: false,
  //   googleBot: {
  //     index: true,
  //     follow: true,
  //     noimageindex: false,
  //     "max-video-preview": -1,
  //     "max-image-preview": "large",
  //     "max-snippet": -1,
  //   },
  // },
};

export default async function RootLayout({ children }) {
  // const jsonLd = {
  //   "@context": "https://schema.org",
  //   "@type": "WebSite",
  //   name: process.env.NEXT_PUBLIC_APP_NAME,
  //   alternateName: process.env.NEXT_PUBLIC_APP_NAME,
  //   url: process.env.NEXT_PUBLIC_APP_URL,
  //   potentialAction: {
  //     "@type": "SearchAction",
  //     target: {
  //       "@type": "EntryPoint",
  //       urlTemplate: `${process.env.NEXT_PUBLIC_APP_URL}/search?query={title}`,
  //     },
  //     "query-input": "required name=title maxlength=100",
  //   },
  // };

  const header = headers();
  const ip = (header.get("x-forwarded-for") ?? "127.0.0.1").split(",")[0];
  ***REMOVED***

  const gtagId = process.env.GA_MEASUREMENT_ID;
  const adsenseId = process.env.ADSENSE_ID;

  return (
    <html lang="en" className="scroll-pt-20">
      <Suspense>
        <GoogleAnalytics GA_MEASUREMENT_ID={gtagId} />
        <GoogleAdsense pId={adsenseId} />
      </Suspense>
      <body className="bg-base-100 text-white">
        <CookiesProvider>
          {/* Navbar */}
          <Suspense>
            <Navbar />
          </Suspense>

          {/* User Location */}
          <UserLocation ip={ip} />

          {/* Main Content */}
          <main className={`mt-[66px] pb-8`}>{children}</main>

          {/* Footer */}
          <Footer />
        </CookiesProvider>

        {/* <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        /> */}
      </body>
    </html>
  );
}
