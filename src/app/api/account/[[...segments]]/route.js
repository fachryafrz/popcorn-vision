import { limiter, tokenExpired } from "../../config/limiter";
import { TMDB_SESSION_ID } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req, ctx) {
  const { segments } = ctx.params;
  const cookiesStore = cookies();
  const url = new URL(req.url);

  // /api/account
  if (!segments || segments.length === 0) {
    const remainingToken = await limiter.removeTokens(1);
    if (remainingToken < 0) return tokenExpired(req);

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
      return NextResponse.json(error.response?.data || { message: "Error" }, {
        status: error.response?.status || 500,
      });
    }
  }

  // /api/account/[account_id]/[section]/[film_type]
  if (segments && segments.length === 3) {
    const [account_id, section, film_type] = segments;
    const { language, page, sort_by } = Object.fromEntries(url.searchParams);

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
      return NextResponse.json(error.response?.data || { message: "Error" }, {
        status: error.response?.status || 500,
      });
    }
  }

  return NextResponse.json({ message: "Not found" }, { status: 404 });
}

export async function POST(req, ctx) {
  const { segments } = ctx.params;
  const cookiesStore = cookies();

  // /api/account/[account_id]/[section]
  if (segments && segments.length === 2) {
    const [account_id, section] = segments;
    const { media_type, media_id, favorite, watchlist } = await req.json();

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

      return NextResponse.json(
        { [section]: favorite || watchlist },
        { status },
      );
    } catch (error) {
      return NextResponse.json(error.response?.data || { message: "Error" }, {
        status: error.response?.status || 500,
      });
    }
  }

  return NextResponse.json({ message: "Not found" }, { status: 404 });
}
