import { tmdb_session_id } from "@/lib/constants";
import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request, context) {
  const { id, section, type } = context.params;
  const url = new URL(request.url);
  const { language, page, sort_by } = Object.fromEntries(url.searchParams);

  const cookiesStore = cookies();

  try {
    const { data, status } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/account/${id}/${section}/${type}`,
      {
        params: {
          api_key: process.env.API_KEY,
          session_id: cookiesStore.get(tmdb_session_id).value,
          language,
          page,
          sort_by,
        },
      },
    );

    return NextResponse.json(data, { status });
  } catch (error) {
    return NextResponse.json(error.response.data, {
      status: error.response.status,
    });
  }
}
