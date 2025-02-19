import { TMDB_SESSION_ID } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req, ctx) {
  const { film_type, film_id } = ctx.params;
  const cookiesStore = cookies();

  try {
    const { data, status } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/${film_type}/${film_id}/account_states`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get(TMDB_SESSION_ID).value,
        },
      },
    );

    return NextResponse.json(data, { status });
  } catch (error) {
    const { data, status } = error.response;

    return NextResponse.json(data, { status });
  }
}