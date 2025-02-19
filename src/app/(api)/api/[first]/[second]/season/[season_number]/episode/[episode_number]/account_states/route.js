import { limiter, tokenExpired } from "@/app/(api)/api/config/limiter";
import { TMDB_SESSION_ID } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req, ctx) {
  const { first, second, season_number, episode_number } = ctx.params;
  const cookiesStore = cookies();

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);

  try {
    const { data, status } = await axios.get(
      `${process.env.API_URL}/${first}/${second}/season/${season_number}/episode/${episode_number}/account_states`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get(TMDB_SESSION_ID).value,
        },
      },
    );

    return NextResponse.json(data, { status });
  } catch (error) {
    const { data, status } = error.response;

    return NextResponse.json(data, { status });
  }
}