import HomeClient from "@/components/home-client";
import { getHeroItems, getTrending, getStreamingOriginals, getByCategory } from "@/lib/tmdb-actions";

export const revalidate = 3600; // Revalidate every hour

export default async function Page() {
  const [heroItems, trendingItems, streamingItems, categoryItems] = await Promise.all([
    getHeroItems(),
    getTrending("all"),
    getStreamingOriginals("netflix"),
    getByCategory("Action"),
  ]);

  return (
    <HomeClient
      initialHero={heroItems}
      initialTrending={trendingItems}
      initialStreaming={streamingItems}
      initialGenre={categoryItems}
    />
  );
}
