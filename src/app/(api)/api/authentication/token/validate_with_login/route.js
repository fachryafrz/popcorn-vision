import axios from "axios";
import { NextResponse } from "next/server";
import { limiter, tokenExpired } from "../../../config/limiter";

export async function POST(req) {
  const { username, password, request_token } = await req.json();

  const remainingToken = await limiter.removeTokens(1);
  if (remainingToken < 0) return tokenExpired(req);

  try {
    const { data, status } = await axios.post(
      `${process.env.API_URL}/authentication/token/validate_with_login`,
      {
        username,
        password,
        request_token,
      },
      { params: { api_key: process.env.API_KEY } },
    );

    return NextResponse.json(data, { status });
  } catch (error) {
    return NextResponse.json(error.response.data, { status: error.response.status });
  }
}
