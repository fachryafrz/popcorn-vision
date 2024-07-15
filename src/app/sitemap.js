import { fetchData } from "@/lib/fetch";
import { slugify } from "@/lib/slugify";

export const revalidate = 0;

export default async function sitemap() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const totalPages = 5;
  const sitemap = [
    {
      url: `${appUrl}`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 1,
    },
    {
      url: `${appUrl}/tv`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${appUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
    {
      url: `${appUrl}/tv/search`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.9,
    },
  ];

  const movies = [];
  for (let i = 1; i <= totalPages; i++) {
    const { results } = await fetchData({
      endpoint: `/discover/movie`,
      queryParams: {
        page: i,
      },
    });
    movies.push(...results);
  }

  const tvShows = [];
  for (let i = 1; i <= totalPages; i++) {
    const { results } = await fetchData({
      endpoint: `/discover/tv`,
      queryParams: {
        page: i,
      },
    });
    tvShows.push(...results);
  }

  // const moviesInSitemap = movies.map((movie) => ({
  //   url: `${appUrl}/movies/${movie.id}-${slugify(movie.title)}`,
  //   lastModified: new Date(),
  //   changeFrequency: "hourly",
  //   priority: 0.8,
  // }));

  // const tvShowsInSitemap = tvShows.map((show) => ({
  //   url: `${appUrl}/tv/${show.id}-${slugify(show.name)}`,
  //   lastModified: new Date(),
  //   changeFrequency: "hourly",
  //   priority: 0.8,
  // }));

  // sitemap.push(...moviesInSitemap);
  // sitemap.push(...tvShowsInSitemap);

  for (let i = 1; i <= 10; i++) {
    sitemap.push({
      url: `${appUrl}/movies/sitemap/${i}.xml`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.7,
    });
  }

  for (let i = 1; i <= 10; i++) {
    sitemap.push({
      url: `${appUrl}/tv/sitemap/${i}.xml`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.7,
    });
  }

  return sitemap;
}
