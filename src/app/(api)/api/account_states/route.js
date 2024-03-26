import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const { id, type } = Object.fromEntries(url.searchParams);
  const cookiesStore = cookies();

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/${type}/${id}/account_states`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get("tmdb.session_id").value,
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
