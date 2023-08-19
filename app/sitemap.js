import axios from "axios";

async function getTrending(type) {
  try {
    const res = await axios.get(
      `${process.env.API_URL}/trending/${type}/week`,
      {
        params: {
          api_key: process.env.API_KEY,
        },
      }
    );

    return res.data.results; // Assuming the data is in the 'results' property
  } catch (error) {
    console.error("Error fetching trending data:", error);
    return []; // Return an empty array in case of an error
  }
}

export default async function sitemap() {
  try {
    const allMovies = await getTrending("movie");
    const allSeries = await getTrending("tv");

    const movies = allMovies.map((item) => ({
      url: `${process.env.APP_URL}/movies/${item.id}`,
      lastModified: item.release_date,
    }));

    const series = allSeries.map((item) => ({
      url: `${process.env.APP_URL}/tv/${item.id}`,
      lastModified: item.first_air_date,
    }));

    return [
      {
        url: `${process.env.APP_URL}`,
        lastModified: new Date(),
      },
      {
        url: `${process.env.APP_URL}/search`,
        lastModified: new Date(),
      },
      {
        url: `${process.env.APP_URL}/tv/search`,
        lastModified: new Date(),
      },
      ...movies,
      ...series,
    ];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return []; // Return an empty array in case of an error
  }
}
