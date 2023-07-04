import Head from "next/head";
import "./globals.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Copyright from "./components/Copyright";

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
        <Footer />

        {/* Copyright */}
        <Copyright />
      </body>
    </html>
  );
}
