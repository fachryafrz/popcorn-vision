import axios from "axios";
import { NextResponse } from "next/server";

export async function POST(request) {
  const { username, password, request_token } = await request.json();

  try {
    const { data, status } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/authentication/token/validate_with_login`,
      {
        username,
        password,
        request_token,
      },
      { params: { api_key: process.env.API_KEY } },
    );

    return NextResponse.json(data, { status });
  } catch (error) {
    return NextResponse.json(error, { status: error.status });
  }
}
