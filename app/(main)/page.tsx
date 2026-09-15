import HomeClient from "@/components/home-client";
import { Suspense } from "react";
import {
  getHeroItems,
  getTrending,
  getStreamingOriginals,
  getByCategory,
  getUpcomingMedia,
} from "@/lib/tmdb-actions";

export const revalidate = 3600;

export const metadata = {
  title: "Popcorn Vision - Watch Movies & TV Shows Free",
  description:
    "Discover, track, and watch movies and TV shows for free on PopcornVision.",
};

export default async function Page() {
  const [hero, trending, streaming, category, upcoming] = await Promise.all([
    getHeroItems(),
    getTrending("all"),
    getStreamingOriginals("netflix"),
    getByCategory("Action"),
    getUpcomingMedia(),
  ]);

  const initialData = { hero, trending, streaming, category, upcoming };

  return (
    <Suspense>
      <HomeClient initialData={initialData} />
    </Suspense>
  );
}

