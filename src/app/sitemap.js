import { fetchData } from "@/lib/fetch";
import slug from "slug";

export default async function sitemap() {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  const totalPages = 5;
  const sitemap = [
    {
      url: `${appUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${appUrl}/tv`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${appUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${appUrl}/tv/search`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // const movies = [];
  // for (let i = 1; i <= totalPages; i++) {
  //   const { results } = await fetchData({
  //     endpoint: `/discover/movie`,
  //     queryParams: {
  //       page: i,
  //     },
  //   });
  //   movies.push(...results);
  // }

  // const tvShows = [];
  // for (let i = 1; i <= totalPages; i++) {
  //   const { results } = await fetchData({
  //     endpoint: `/discover/tv`,
  //     queryParams: {
  //       page: i,
  //     },
  //   });
  //   tvShows.push(...results);
  // }

  // for (let i = 1; i <= 10; i++) {
  //   sitemap.push({
  //     url: `${appUrl}/movies/sitemap/${i}.xml`,
  //     lastModified: new Date(),
  //     changeFrequency: "hourly",
  //     priority: 0.8,
  //   });
  // }

  // for (let i = 1; i <= 10; i++) {
  //   sitemap.push({
  //     url: `${appUrl}/tv/sitemap/${i}.xml`,
  //     lastModified: new Date(),
  //     changeFrequency: "hourly",
  //     priority: 0.8,
  //   });
  // }

  return sitemap;
}
