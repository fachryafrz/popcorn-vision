import { limiter, tokenExpired } from "@/app/(api)/api/config/limiter";
import { TMDB_SESSION_ID } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { account_id, section, film_type } = context.params;
  const url = new URL(request.url);
  const { language, page, sort_by } = Object.fromEntries(url.searchParams);
  const cookiesStore = cookies();

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);

  try {
    const { data, status } = await axios.get(
      `${process.env.API_URL}/account/${account_id}/${section}/${film_type}`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get(TMDB_SESSION_ID).value,
          language,
          page,
          sort_by,
        },
      },
    );

    return NextResponse.json(data, { status });
  } catch (error) {
    const { data, status } = error?.response;

    return NextResponse.json(data, { status });
  }
}
