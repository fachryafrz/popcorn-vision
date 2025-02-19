import axios from "axios";
import { NextResponse } from "next/server";
import { limiter, tokenExpired } from "../../config/limiter";

export async function GET(req) {
  const url = new URL(req.url);
  const { page, query } = Object.fromEntries(url.searchParams);

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);

  const params = {
    api_key: process.env.API_KEY,
    include_adult: false,
  };

  // Applying filters
  if (page) params.page = page;
  if (query) params.query = query;

  try {
    const { data, status } = await axios.get(
      `${process.env.API_URL}/search/multi`,
      { params },
    );

    return NextResponse.json(data, { status });
  } catch (error) {
    return NextResponse.json(error.response.data, { status: error.response.status });
  }
}
