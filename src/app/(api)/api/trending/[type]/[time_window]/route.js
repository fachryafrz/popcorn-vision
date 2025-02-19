import axios from "axios";
import { NextResponse } from "next/server";
import { limiter, tokenExpired } from "../../../config/limiter";

export async function GET(req, ctx) {
  const { type, time_window } = ctx.params;
  const { searchParams } = new URL(req.url);

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);

  try {
    const { data, status } = await axios.get(
      `${process.env.API_URL}/trending/${type}/${time_window}`,
      {
        params: {
          api_key: process.env.API_KEY,
          ...Object.fromEntries(searchParams),
        },
      },
    );

    return NextResponse.json(data, { status });
  } catch (error) {
    const { data, status } = error?.response;

    return NextResponse.json(data, { status });
  }
}