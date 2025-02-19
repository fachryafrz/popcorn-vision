import { TMDB_SESSION_ID } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { limiter, tokenExpired } from "../../../config/limiter";

export async function POST(req, ctx) {
  const { first, second } = ctx.params;
  const { rating } = await req.json();
  const cookiesStore = cookies();

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);


  try {
    const { data, status } = await axios.post(
      `${process.env.API_URL}/${first}/${second}/rating`,
      { value: rating },
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get(TMDB_SESSION_ID).value,
        },
      },
    );

    return NextResponse.json({ rated: { value: rating } }, { status });
  } catch (error) {
    return NextResponse.json(error.response.data, { status: error.response.status });
  }
}

export async function DELETE(req, ctx) {
  const { film_type, film_id } = ctx.params;
  const cookiesStore = cookies();

  try {
    const { data, status } = await axios.delete(
      `${process.env.API_URL}/${film_type}/${film_id}/rating`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get(TMDB_SESSION_ID).value,
        },
      },
    );

    return NextResponse.json({ rated: null }, { status });
  } catch (error) {
    return NextResponse.json(error.response.data, { status: error.response.status });
  }
}
