import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { media_type, media_id, favorite, user_id } = await req.json();
  const cookiesStore = cookies();

  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/account/${user_id}/favorite`,
      { favorite, media_type, media_id },
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get("tmdb.session_id").value,
        },
      },
    );
  } catch (error) {
    return NextResponse.json(error.response.data, {
      status: error.response.status,
    });
  } finally {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/${media_type}/${media_id}/account_states`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get("tmdb.session_id").value,
        },
      },
    );

    return NextResponse.json(data, { status: 200 });
  }
}
