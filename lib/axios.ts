import Axios from "axios";

export const axios = Axios.create({
  baseURL: process.env.API_URL || "https://api.themoviedb.org/3",
  params: { api_key: process.env.API_KEY || process.env.TMDB_API_KEY },
  adapter: "fetch",
  fetchOptions: {
    next: { revalidate: 3600 },
  },
});

