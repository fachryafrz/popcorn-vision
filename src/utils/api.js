import axios from "axios";

export async function fetchAPI({
  endpoint,
  queryParams = {},
  method = "GET",
}) {
  const { data } = await axios.request({
    method: method,
    baseURL: process.env.NEXT_PUBLIC_APP_URL,
    url: '/api/tmdb',
    params: {
      url: endpoint,
      options: JSON.stringify({ params: queryParams }),
    },
  });

  return data;
}