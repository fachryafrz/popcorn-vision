import Axios from "axios";

export const axios = Axios.create({
  baseURL: process.env.API_URL,
  params: { api_key: process.env.API_KEY },
  adapter: "fetch",
  fetchOptions: {
    next: { revalidate: 3600 },
  },
});
