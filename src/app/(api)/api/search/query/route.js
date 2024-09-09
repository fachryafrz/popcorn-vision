import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const { page, query, api_key } = Object.fromEntries(url.searchParams);

  const params = {
    api_key: api_key,
    include_adult: false,
  };

  // Applying filters
  if (page) params.page = page;
  if (query) params.query = query;

  try {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/search/multi`,
      {
        params: params,
      },
    );

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(error.response.data, {
      status: error.response.status,
    });
  }
}
