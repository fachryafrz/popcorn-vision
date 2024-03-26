import axios from "axios";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { id, type, rating: value } = await req.json();
  const cookiesStore = cookies();

  try {
    const { data } = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/${type}/${id}/rating`,
      {
        value,
      },
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

export async function DELETE(req) {
  const url = new URL(req.url);
  const { id, type } = Object.fromEntries(url.searchParams);
  const cookiesStore = cookies();

  try {
    const { data } = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_URL}/${type}/${id}/rating`,
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
