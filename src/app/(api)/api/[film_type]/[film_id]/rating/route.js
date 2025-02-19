import { TMDB_SESSION_ID } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req, ctx) {
  const { film_type, film_id } = ctx.params;
  const { rating } = await req.json();
  const cookiesStore = cookies();

  try {
    const { data, status } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${film_type}/${film_id}/rating`,
      { value: rating },
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get(TMDB_SESSION_ID).value,
        },
      },
    );

    return NextResponse.json({ rated: { value: rating } }, { status });
  } catch (error) {
    const { data, status } = error.response;

    return NextResponse.json(data, { status });
  }
}

export async function DELETE(req, ctx) {
  const { film_type, film_id } = ctx.params;
  const cookiesStore = cookies();

  try {
    const { data, status } = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/${film_type}/${film_id}/rating`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get(TMDB_SESSION_ID).value,
        },
      },
    );

    return NextResponse.json({ rated: null }, { status });
  } catch (error) {
    const { data, status } = error.response;

    return NextResponse.json(data, { status });
  }
}
