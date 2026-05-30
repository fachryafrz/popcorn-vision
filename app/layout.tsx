import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { siteConfig } from "@/config/site";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import UsernamePromptModal from "@/components/username-prompt-modal";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("dark h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col bg-zinc-950 text-zinc-50">
        <Providers>
          <Navbar />
          <UsernamePromptModal />
          <div className="grow">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
