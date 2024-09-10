"use server";

import Axios from "axios";

const axiosInstance = Axios.create({
  method: "GET",
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  params: { api_key: process.env.API_KEY },
  headers: { "Content-Type": "application/json" },
});

export const axios = async (endpoint, options = {}) => {
  options.params = { api_key: process.env.API_KEY, ...options.params };

  try {
    const { data } = await axiosInstance.request({
      url: endpoint,
      ...options,
    });
    return { data };
  } catch (error) {
    console.error("Error retrieving data:", error);
  }
};
