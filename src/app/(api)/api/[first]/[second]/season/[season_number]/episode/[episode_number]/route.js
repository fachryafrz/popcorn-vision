import { limiter, tokenExpired } from "@/app/(api)/api/config/limiter";
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req, ctx) {
  const { first, second, season_number, episode_number } = ctx.params;
  const { searchParams } = new URL(req.url);

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);

  try {
    const { data, status } = await axios.get(
      `${process.env.API_URL}/${first}/${second}/season/${season_number}/episode/${episode_number}`,
      {
        params: {
          api_key: process.env.API_KEY,
          ...Object.fromEntries(searchParams),
        },
      },
    );

    return NextResponse.json(data, { status });
  } catch ({ response }) {
    const { data, status } = response;

    return NextResponse.json(data, { status });
  }
}