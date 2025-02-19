import { TMDB_SESSION_ID } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { limiter, tokenExpired } from "../../config/limiter";

export async function DELETE() {
  const cookiesStore = cookies();

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);

  try {
    const { data, status } = await axios.delete(
      `${process.env.API_URL}/authentication/session`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get(TMDB_SESSION_ID).value,
        },
      },
    );

    cookiesStore.delete(TMDB_SESSION_ID);

    return NextResponse.json(data, { status });
  } catch (error) {
    const { data, status } = error.response;

    return NextResponse.json(data, { status });
  }
}
