"use server";

import Axios from "axios";

export const axios = Axios.create({
  method: "GET",
  baseURL: process.env.API_URL,
  params: { api_key: process.env.API_KEY },
});
