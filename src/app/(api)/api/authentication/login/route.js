import { TMDB_SESSION_ID } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { limiter, tokenExpired } from "../../config/limiter";

export async function POST(req) {
  const { request_token } = await req.json();
  const cookiesStore = cookies();

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);

  try {
    const { data, status } = await axios.post(
      `${process.env.API_URL}/authentication/session/new`,
      {
        request_token: request_token,
      },
      {
        params: {
          api_key: process.env.API_KEY,
        },
      },
    );

    cookiesStore.set(TMDB_SESSION_ID, data.session_id, {
      // expires: Date.now() + 1000 * 60 * 60 * 24 * 365,
      maxAge: 60 * 60 * 24 * 365,
    });

    return NextResponse.json(data, { status });
  } catch (error) {
    const { data, status } = error.response;

    return NextResponse.json(data, { status });
  }
}
