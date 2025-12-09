import { TMDB_SESSION_ID } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { limiter, tokenExpired } from "@/app/api/config/limiter";

export async function GET(req, ctx) {
  const { segments } = ctx.params;
  const { searchParams } = new URL(req.url);

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);

  if (!segments || segments.length === 0) {
    return NextResponse.json({ message: "Not Found" }, { status: 404 });
  }

  const urlPath = segments.join("/");
  const lastSegment = segments[segments.length - 1];

  const params = {
    api_key: process.env.API_KEY,
    ...Object.fromEntries(searchParams),
  };

  if (lastSegment === "account_states") {
    const cookiesStore = cookies();
    if (cookiesStore.has(TMDB_SESSION_ID)) {
      params.session_id = cookiesStore.get(TMDB_SESSION_ID).value;
    }
  }

  try {
    const { data, status } = await axios.get(
      `${process.env.API_URL}/${urlPath}`,
      {
        params,
      },
    );

    return NextResponse.json(data, { status });
  } catch (error) {
    return NextResponse.json(error.response?.data || { message: "Error" }, {
      status: error.response?.status || 500,
    });
  }
}

export async function POST(req, ctx) {
  const { segments } = ctx.params;
  const lastSegment = segments[segments.length - 1];

  if (lastSegment !== "rating") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 },
    );
  }

  return handleRating(req, ctx, "post");
}

export async function DELETE(req, ctx) {
  const { segments } = ctx.params;
  const lastSegment = segments[segments.length - 1];

  if (lastSegment !== "rating") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 },
    );
  }

  return handleRating(req, ctx, "delete");
}

async function handleRating(req, ctx, method) {
  const { segments } = ctx.params;
  const lastSegment = segments[segments.length - 1];

  if (lastSegment !== "rating") {
    return NextResponse.json(
      { message: "Method Not Allowed" },
      { status: 405 },
    );
  }

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);

  const cookiesStore = cookies();
  const params = {
    api_key: process.env.API_KEY,
    session_id: cookiesStore.get(TMDB_SESSION_ID)?.value,
  };

  const urlPath = segments.join("/");

  try {
    let response;
    if (method === "post") {
      const { rating } = await req.json();
      response = await axios.post(
        `${process.env.API_URL}/${urlPath}`,
        { value: rating },
        { params },
      );
      return NextResponse.json(
        { rated: { value: rating } },
        { status: response.status },
      );
    } else {
      response = await axios.delete(`${process.env.API_URL}/${urlPath}`, {
        params,
      });
      return NextResponse.json({ rated: null }, { status: response.status });
    }
  } catch (error) {
    return NextResponse.json(error.response?.data || { message: "Error" }, {
      status: error.response?.status || 500,
    });
  }
}
