import axios from "axios";
import { NextResponse } from "next/server";
import { limiter, tokenExpired } from "../../../config/limiter";

export async function GET(req, ctx) {
  const { film_type } = ctx.params;

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);

  try {
    const { data, status } = await axios.get(
      `${process.env.API_URL}/genre/${film_type}/list`,
      {
        params: {
          api_key: process.env.API_KEY,
        },
      },
    );

    return NextResponse.json(data, { status });
  } catch (error) {
    const { data, status } = error?.response;

    return NextResponse.json(data, { status });
  }
}