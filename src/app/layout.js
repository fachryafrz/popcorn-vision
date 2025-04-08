import "./globals.css";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import { GoogleAnalytics } from "@next/third-parties/google";
import { headers } from "next/headers";
import UserLocation from "@/components/User/Location";
import Modal from "@/components/Modals";
import { Roboto } from "next/font/google";
import Confetti from "@/components/Layout/Confetti";
import { siteConfig } from "@/config/site";
import Providers from "@/components/Providers";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["100", "300", "400", "500", "700", "900"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#131720",
  userScalable: true,
  colorScheme: "dark",
};

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    template: `%s - ${siteConfig.name}`,
    default: siteConfig.name,
  },
  description: siteConfig.description,
  openGraph: {
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    images: {
      url: "/maskable/maskable_icon_x512.png",
      width: 512,
      height: 512,
    },
  },
  robots: {
    index: false,
    follow: false,
    noimageindex: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default async function RootLayout({ children }) {
  const gtagId = process.env.GA_MEASUREMENT_ID;

  return (
    <html lang="en" className="scroll-pt-20">
      <body className={`bg-base-100 text-white ${roboto.className}`}>
        <Providers>
          {/* Navbar */}
          <Navbar />

          {/* User Location */}
          <UserLocation />

          {/* Main Content */}
          <main className={`mt-[66px]`}>{children}</main>

          {/* Modal */}
          <Modal />

          {/* Footer */}
          <Footer />

          {/* Confetti */}
          <Confetti />

          <GoogleAnalytics gaId={gtagId} />
        </Providers>
      </body>
    </html>
  );
}
