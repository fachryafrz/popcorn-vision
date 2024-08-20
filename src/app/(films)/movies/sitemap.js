// import { fetchData } from "@/lib/fetch";
// import { slugify } from "@/lib/slugify";

// export async function generateSitemaps() {
//   const sitemap = [];

//   const { total_pages: totalPages } = await fetchData({
//     endpoint: `/discover/movie`,
//     queryParams: {
//       page: 1,
//     },
//   });

//   for (let i = 1; i <= 10; i++) {
//     sitemap.push({
//       id: i,
//     });
//   }

//   return sitemap;
// }

// export default async function sitemap({ id }) {
//   const appUrl = process.env.NEXT_PUBLIC_APP_URL;
//   const page = id;
//   const sitemap = [];

//   const movies = [];
//   for (let i = page; i <= page; i++) {
//     const { results } = await fetchData({
//       endpoint: `/discover/movie`,
//       queryParams: {
//         page: i,
//       },
//     });
//     movies.push(...results);
//   }

//   const moviesInSitemap = movies.map((movie) => ({
//     url: `${appUrl}/movies/${movie.id}-${slugify(movie.title)}`,
//     lastModified: new Date(),
//     changeFrequency: "hourly",
//     priority: 0.8,
//   }));

//   sitemap.push(...moviesInSitemap);

//   return sitemap;
// }
