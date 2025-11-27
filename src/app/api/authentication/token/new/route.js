import axios from "axios";
import { NextResponse } from "next/server";
import { limiter, tokenExpired } from "../../../config/limiter";
import { cookies } from "next/headers";
import { TMDB_AUTH_TOKEN } from "@/lib/constants";

export async function GET(req) {
  const cookiesStore = cookies();

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);

  try {
    if (cookiesStore.has(TMDB_AUTH_TOKEN)) {
      return NextResponse.json(
        { request_token: cookiesStore.get(TMDB_AUTH_TOKEN).value },
        { status: 200 },
      );
    }

    const { data, status } = await axios.get(
      `${process.env.API_URL}/authentication/token/new`,
      { params: { api_key: process.env.API_KEY } },
    );

    cookiesStore.set(TMDB_AUTH_TOKEN, data.request_token, {
      maxAge: 3600,
    });

    return NextResponse.json(data, { status });
  } catch (error) {
    return NextResponse.json(error.response.data, {
      status: error.response.status,
    });
  }
}
