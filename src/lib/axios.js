import Axios from "axios";

const axios = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  params: { api_key: "84aa2a7d5e4394ded7195035a4745dbd" },
});

export default axios;
