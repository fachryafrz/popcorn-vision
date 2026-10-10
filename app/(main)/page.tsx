import HomeClient, { HomeInitialData } from "@/components/home-client";
import { Suspense } from "react";
import { siteConfig } from "@/config/site";
import {
  getHeroItems,
  getTrending,
  getStreamingOriginals,
  getByCategory,
  getUpcomingMedia,
} from "@/lib/tmdb-actions";

export const metadata = {
  title: `${siteConfig.name} | Movie & TV Show Discovery`,
  description: siteConfig.description,
};

export default async function Page() {
  let initialData: HomeInitialData | undefined;

  try {
    const [hero, trending, streaming, category, upcoming] = await Promise.all([
      getHeroItems(),
      getTrending("all"),
      getStreamingOriginals("netflix"),
      getByCategory("Action"),
      getUpcomingMedia(),
    ]);

    initialData = { hero, trending, streaming, category, upcoming };
  } catch (error) {
    console.error("Failed to prefetch home data on server:", error);
  }

  return (
    <Suspense fallback={null}>
      <HomeClient initialData={initialData} />
    </Suspense>
  );
}

