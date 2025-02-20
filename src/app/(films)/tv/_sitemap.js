import axios from "axios";
import slug from "slug";

export async function generateSitemaps() {
  const sitemap = [];

  const { total_pages: totalPages } = await axios.get(`/discover/movie`, {
    params: {
      page: 1,
    },
  }).then(({ data }) => data);

  for (let i = 1; i <= 10; i++) {
    sitemap.push({
      id: i,
    });
  }

  return sitemap;
}

export default async function sitemap({ id }) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const page = id;
  const sitemap = [];

  const tvShows = [];
  for (let i = page; i <= page; i++) {
    const { results } = await axios.get(`/discover/tv`, {
      params: {
        page: i,
      },
    });
    tvShows.push(...results);
  }

  const tvShowsInSitemap = tvShows.map((show) => ({
    url: `${appUrl}/tv/${show.id}-${slug(show.name)}`,
    lastModified: new Date(),
    changeFrequency: "hourly",
    priority: 0.8,
  }));

  sitemap.push(...tvShowsInSitemap);

  return sitemap;
}
