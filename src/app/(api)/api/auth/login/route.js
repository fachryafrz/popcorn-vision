import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { request_token } = await req.json();
  const cookiesStore = cookies();

  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/authentication/session/new`,
      {
        request_token: request_token,
      },
      {
        params: {
          api_key: process.env.API_KEY,
        },
      },
    );

    cookiesStore.set("tmdb.session_id", data.session_id, {
      // expires: new Date(Date.now() + 60 * 60 * 24 * 7 * 1000),
      maxAge: 60 * 60 * 24 * 365,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.response.data, {
      status: error.response.status,
    });
  }
}
