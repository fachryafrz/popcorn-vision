import HomeClient from "@/components/home-client";
import { Suspense } from "react";
import {
  getHeroItems,
  getTrending,
  getStreamingOriginals,
  getByCategory,
  getUpcomingMedia,
} from "@/lib/tmdb-actions";

import { siteConfig } from "@/config/site";

export const revalidate = 3600;

export const metadata = {
  title: `${siteConfig.name} | Movie & TV Show Discovery`,
  description: siteConfig.description,
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

