export const revalidate = 3600; // revalidate this page every 1 hour

import axios from "axios";

async function getFilms(
  apiUrl,
  date_gte,
  date_lte,
  apiCompanies,
  apiGenres,
  apiSortBy = "popularity.desc"
) {
  let params = {
    api_key: process.env.API_KEY,
    sort_by: apiSortBy,
    region: "US",
    include_adult: false,
    language: "en-US",
    with_companies: apiCompanies,
    with_genres: apiGenres,
    "primary_release_date.gte": date_gte,
    "primary_release_date.lte": date_lte,
  };

  const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}${apiUrl}`, {
    params: {
      ...params,
    },
  });

  return res.data.results;
}

async function getTrending(type) {
  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/trending/${type}/day`, {
      params: {
        api_key: process.env.API_KEY,
      },
    });

    return res.data.results; // Assuming the data is in the 'results' property
  } catch (error) {
    console.error("Error fetching trending data:", error);
    return []; // Return an empty array in case of an error
  }
}

export default async function sitemap() {
  let allMovies = [];
  let allSeries = [];

  const currentDate = new Date();
  const today = currentDate.toISOString().slice(0, 10);

  const tomorrow = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + 2
  )
    .toISOString()
    .slice(0, 10);

  const firstDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    2
  )
    .toISOString()
    .slice(0, 10);
  const thirtyDaysAgo = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    2
  )
    .toISOString()
    .slice(0, 10);
  const currentYear = currentDate.getFullYear();
  const endOfYear = new Date(currentYear, 11, 32).toISOString().slice(0, 10);

  const slugify = (text) => {
    return (
      text &&
      text
        .toLowerCase()
        .replace(/&/g, "")
        .replace(/ /g, "-")
        .replace(/-+/g, "-")
        .replace(/[^\w-]+/g, "")
    );
  };

  try {
    // Movies
    const trendingMovies = await getTrending("movie");
    const nowPlayingMovies = await getFilms(
      "/discover/movie",
      thirtyDaysAgo,
      today
    );
    const upcomingMovies = await getFilms(
      "/discover/movie",
      tomorrow,
      endOfYear
    );
    const topRatedMovies = await getFilms(
      "/discover/movie",
      null,
      null,
      null,
      null,
      "vote_count.desc"
    );

    // Series
    const trendingSeries = await getTrending("tv");
    const onTheAirSeries = await getFilms("/discover/tv", thirtyDaysAgo, today);
    const upcomingSeries = await getFilms("/discover/tv", tomorrow, endOfYear);
    const topRatedSeries = await getFilms(
      "/discover/tv",
      null,
      null,
      null,
      null,
      "vote_count.desc"
    );

    // Push to All Movies Array //
    trendingMovies.forEach((item) => {
      allMovies.push({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/movies/${item.id}-${slugify(item.title)}`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      });
    });
    nowPlayingMovies.forEach((item) => {
      allMovies.push({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/movies/${item.id}-${slugify(item.title)}`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      });
    });
    upcomingMovies.forEach((item) => {
      allMovies.push({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/movies/${item.id}-${slugify(item.title)}`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      });
    });
    topRatedMovies.forEach((item) => {
      allMovies.push({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/movies/${item.id}-${slugify(item.title)}`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      });
    });

    // Push to All Series Array //
    trendingSeries.forEach((item) => {
      allSeries.push({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/tv/${item.id}-${slugify(item.name)}`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      });
    });
    onTheAirSeries.forEach((item) => {
      allSeries.push({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/tv/${item.id}-${slugify(item.name)}`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      });
    });
    upcomingSeries.forEach((item) => {
      allSeries.push({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/tv/${item.id}-${slugify(item.name)}`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      });
    });
    topRatedSeries.forEach((item) => {
      allSeries.push({
        url: `${process.env.NEXT_PUBLIC_APP_URL}/tv/${item.id}-${slugify(item.name)}`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      });
    });

    return [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      },
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/search`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      },
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/tv/search`,
        lastModified: new Date(),
        changeFrequency: "hourly",
        priority: 1,
      },
      ...allMovies,
      ...allSeries,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return []; // Return an empty array in case of an error
  }
}
