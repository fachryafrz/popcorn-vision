import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  const { session_id } = await req.json();
  const cookiesStore = cookies();

  try {
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/authentication/session`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: session_id,
        },
      },
    );

    cookiesStore.delete("tmdb.session_id");

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.response.data, {
      status: error.response.status,
    });
  }
}
