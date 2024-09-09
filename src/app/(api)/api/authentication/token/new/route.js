import axios from "axios";
import { NextResponse } from "next/server";

export async function GET(request) {
  const url = new URL(request.url);
  const { api_key } = Object.fromEntries(url.searchParams);
  
  try {
    const { data, status } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/authentication/token/new`,
      { params: { api_key: api_key } },
    );

    return NextResponse.json(data, { status });
  } catch (error) {
    return NextResponse.json(error.response.data, {
      status: error.response.status,
    });
  }
}
