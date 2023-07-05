import "./globals.css";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Copyright from "./components/Copyright";

const keywords =
  "movies, TV shows, film reviews, movie database, TV series, film news, cinema releases, movie trailers, film recommendations, popular movies, top TV shows, movie ratings, celebrity news, upcoming releases, film analysis, binge-watching, movie genres, movie quotes, TV show episodes, box office hits, award-winning films";

export const metadata = {
  generator: "Popcorn Vision",
  applicationName: "Popcorn Vision",
  referrer: "origin-when-cross-origin",
  keywords: keywords.split(", "),
  authors: [
    { name: "Fachry Dwi Afriza", url: "https://fachryafrz.vercel.app" },
  ],
  colorScheme: "dark",
  creator: "Fachry Dwi Afriza",
  publisher: "Fachry Dwi Afriza",

  viewport: {
    width: "device-width",
    initialScale: 1,
  },
  title: {
    default: "Popcorn Vision",
    template: "%s - Popcorn Vision",
  },
  description:
    "Your go-to website for movies and TV shows info. Explore a wide range of titles, with detailed synopses, reviews, cast and crew info. Convenient search functionality makes finding your favorites a breeze. Dive into the world of movies and television with Popcorn Vision.",
  metadataBase: new URL("https://www.popcorn.vision"),
  alternates: {
    canonical: "/",
    languages: "en-US",
  },
  openGraph: {
    title: "Popcorn Vision",
    description:
      "Your go-to website for movies and TV shows info. Explore a wide range of titles, with detailed synopses, reviews, cast and crew info. Convenient search functionality makes finding your favorites a breeze. Dive into the world of movies and television with Popcorn Vision.",
    url: "https://www.popcorn.vision",
    siteName: "Popcorn Vision",
    images: "/popcorn.png",
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/popcorn.png",
    shortcut: "/popcorn.png",
    apple: "/apple-touch-icon.png",
  },
  themeColor: "#202735",
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: "Popcorn Vision",
    description:
      "Your go-to website for movies and TV shows info. Explore a wide range of titles, with detailed synopses, reviews, cast and crew info. Convenient search functionality makes finding your favorites a breeze. Dive into the world of movies and television with Popcorn Vision.",
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-pt-20">
      <head>
        <link rel="icon" href="/popcorn.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <title>Popcorn Vision</title>
        <meta
          name="description"
          content="Your go-to website for movies and TV shows info. Explore a wide range of titles, with detailed synopses, reviews, cast and crew info. Convenient search functionality makes finding your favorites a breeze. Dive into the world of movies and television with Popcorn Vision."
        />
      </head>
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
