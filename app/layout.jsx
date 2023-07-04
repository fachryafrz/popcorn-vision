import Head from "next/head";
import "./globals.css";

// Components

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-pt-20">
      <Head />
      <body className="bg-base-dark-gray">
        {/* Navbar */}

        {/* Main Content */}
        <main className="pb-8 text-white">{children}</main>

        {/* Footer */}
      </body>
    </html>
  );
}
