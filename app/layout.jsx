import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Copyright from "./components/Copyright";
import GoogleAnalytics from "./components/GoogleAnalytics";

export function generateViewport() {
  return {
    colorScheme: "dark",
    themeColor: "#202735",
    width: "device-width",
    initialScale: 1,
  }
}

export function generateMetadata() {
  return {
    generator: process.env.APP_NAME,
    applicationName: process.env.APP_NAME,
    referrer: "origin-when-cross-origin",
    keywords: process.env.APP_KEYWORDS.split(", "),
    authors: [
      { name: "Fachry Dwi Afriza", url: "https://fachryafrz.vercel.app" },
    ],
    creator: "Fachry Dwi Afriza",
    publisher: "Fachry Dwi Afriza",
    title: {
      default: process.env.APP_NAME,
      template: "%s - Popcorn Vision",
    },
    description: process.env.APP_DESC,
    metadataBase: new URL(process.env.APP_URL),
    alternates: {
      canonical: "/",
      languages: "en-US",
    },
    openGraph: {
      title: process.env.APP_NAME,
      description: process.env.APP_DESC,
      url: process.env.APP_URL,
      siteName: process.env.APP_NAME,
      images: "/popcorn.png",
      locale: "en_US",
      type: "website",
    },
    manifest: "/manifest.json",
    twitter: {
      card: "summary_large_image",
      title: process.env.APP_NAME,
      description: process.env.APP_DESC,
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
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-pt-20">
      <GoogleAnalytics GA_MEASUREMENT_ID="G-L0V4DXC6HK" />
      <body className="bg-base-dark-gray text-white">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="pb-8">{children}</main>

        {/* Footer */}
        <Footer />

        {/* Copyright */}
        <Copyright />
      </body>
    </html>
  );
}
