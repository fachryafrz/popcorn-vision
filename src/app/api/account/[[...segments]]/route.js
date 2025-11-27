import { limiter, tokenExpired } from "../../config/limiter";
import { TMDB_SESSION_ID } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { slug } = context.params;
  const cookiesStore = cookies();
  const url = new URL(request.url);

  // /api/account
  if (!slug || slug.length === 0) {
    const remainingToken = await limiter.removeTokens(1);
    if (remainingToken < 0) return tokenExpired(request);

    try {
      if (!cookiesStore.has(TMDB_SESSION_ID)) {
        return NextResponse.json(
          { message: "You are not authenticated" },
          { status: 401 },
        );
      }

      const { data, status } = await axios.get(
        `${process.env.API_URL}/account`,
        {
          params: {
            api_key: process.env.API_KEY,
            session_id: cookiesStore.get(TMDB_SESSION_ID).value,
          },
        },
      );

      return NextResponse.json(data, { status });
    } catch (error) {
      return NextResponse.json(error.response?.data || { message: "Error" }, { status: error.response?.status || 500 });
    }
  }

  // /api/account/[account_id]/[section]/[film_type]
  if (slug && slug.length === 3) {
    const [account_id, section, film_type] = slug;
    const { language, page, sort_by } = Object.fromEntries(url.searchParams);

    const remainingToken = await limiter.removeTokens(1);
    if (remainingToken < 0) return tokenExpired(request);

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
        return NextResponse.json(error.response?.data || { message: "Error" }, { status: error.response?.status || 500 });
    }
  }

  return NextResponse.json({ message: "Not found" }, { status: 404 });
}

export async function POST(request, context) {
  const { slug } = context.params;
  const cookiesStore = cookies();

  // /api/account/[account_id]/[section]
  if (slug && slug.length === 2) {
    const [account_id, section] = slug;
    const { media_type, media_id, favorite, watchlist } = await request.json();

    const remainingToken = await limiter.removeTokens(1);
    if (remainingToken < 0) return tokenExpired(request);

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
        return NextResponse.json(error.response?.data || { message: "Error" }, { status: error.response?.status || 500 });
    }
  }

  return NextResponse.json({ message: "Not found" }, { status: 404 });
}
