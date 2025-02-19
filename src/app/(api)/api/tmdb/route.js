import axios from "axios";
import { NextResponse } from "next/server";
import { unstable_cache } from 'next/cache';

// Fungsi untuk melakukan request API
const fetchApiData = async (url, options) => {
  const { data, status } = await axios.request({
    method: 'GET',
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    url,
    params: { api_key: process.env.API_KEY, ...options?.params },
  });
  return { data, status };
};

// Fungsi yang di-cache
const cachedFetchApiData = unstable_cache(
  fetchApiData,
  ['api-data'],
  { revalidate: false }
);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const { url, options } = Object.fromEntries(searchParams);

  const parsedOptions = options ? JSON.parse(options) : {};

  try {
    const { data, status } = await cachedFetchApiData(url, parsedOptions);
    return NextResponse.json(data, { status });
  } catch (error) {
    if (error.response) {
      const { data, status } = error.response;
      return NextResponse.json(data, { status });
    } else {
      // Handle errors without response (e.g., network errors)
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}