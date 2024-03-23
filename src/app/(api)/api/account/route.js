import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const session_id = url.searchParams.get("session_id");

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/account`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: session_id,
        },
      },
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.response.data, {
      status: error.response.status,
    });
  }
}
