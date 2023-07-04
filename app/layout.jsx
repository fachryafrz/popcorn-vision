import Head from "next/head";
import "./globals.css";
import Navbar from "./Navbar";

// Components

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-pt-20">
      <Head />
      <body className="bg-base-dark-gray text-white">
        {/* Navbar */}
        <Navbar />

        {/* Main Content */}
        <main className="pb-8">{children}</main>

        {/* Footer */}
      </body>
    </html>
  );
}
