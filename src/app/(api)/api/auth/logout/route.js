import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE() {
  const cookiesStore = cookies();

  try {
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/authentication/session`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get("tmdb.session_id").value,
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
