import { limiter, tokenExpired } from "@/app/(api)/api/config/limiter";
import { TMDB_SESSION_ID } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req, ctx) {
  const { first, second, season_number, episode_number } = ctx.params;
  const { rating } = await req.json();
  const cookiesStore = cookies();

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);

  try {
    const { data, status } = await axios.post(
      `${process.env.API_URL}/${first}/${second}/season/${season_number}/episode/${episode_number}/rating`,
      { value: rating },
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get(TMDB_SESSION_ID).value,
        },
      },
    );

    return NextResponse.json({ rated: { value: rating } }, { status });
  } catch ({ response }) {
    const { data, status } = response;

    return NextResponse.json(data, { status });
  }
}

export async function DELETE(req, ctx) {
  const { film_type, film_id, season_number, episode_number } = ctx.params;
  const cookiesStore = cookies();

  try {
    const { data, status } = await axios.delete(
      `${process.env.API_URL}/${film_type}/${film_id}/season/${season_number}/episode/${episode_number}/rating`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get(TMDB_SESSION_ID).value,
        },
      },
    );

    return NextResponse.json({ rated: false }, { status });
  } catch ({ response }) {
    const { data, status } = response;

    return NextResponse.json(data, { status });
  }
}
