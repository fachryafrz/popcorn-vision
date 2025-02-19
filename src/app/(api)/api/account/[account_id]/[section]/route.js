import { TMDB_SESSION_ID } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { limiter, tokenExpired } from "../../../config/limiter";

export async function POST(req, ctx) {
  const { account_id, section } = ctx.params;
  const { media_type, media_id, favorite, watchlist } = await req.json();
  const cookiesStore = cookies();

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);

  try {
    const { data, status } = await axios.post(
      `${process.env.API_URL}/account/${account_id}/${section}`,
      { media_type, media_id, favorite, watchlist },
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get(TMDB_SESSION_ID).value,
        },
      },
    );

    return NextResponse.json({ [section]: favorite || watchlist }, { status });
  } catch (error) {
    return NextResponse.json(error.response.data, { status: error.response.status });
  }
}
