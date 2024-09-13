import { TMDB_SESSION_ID } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookiesStore = cookies();

  try {
    if (!cookiesStore.has(TMDB_SESSION_ID)) {
      return NextResponse.json(
        { message: "You are not authenticated" },
        { status: 401 },
      );
    }

    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/account`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get(TMDB_SESSION_ID).value,
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
